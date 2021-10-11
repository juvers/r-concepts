import {useCallback, useRef, useEffect} from 'react';
import {useSpring} from 'react-spring';
import {getDocument, getWindow} from '@hzdg/dom-utils';
import useSize from '@hzdg/use-size';

import type {SpringConfig} from 'react-spring';
import type {RefObject, MutableRefObject} from 'react';

export function getScrollOffsetForElement(
  element?: HTMLElement | null,
  scrollElement?: HTMLElement | null,
): {left: number; top: number} | null {
  if (!element || !scrollElement) return null;
  if (!scrollElement.contains(element)) return null;
  if (scrollElement === element.ownerDocument.documentElement) {
    const rect = element.getBoundingClientRect();
    const window = getWindow(scrollElement);
    return {
      top: rect.top + (window?.scrollY ?? 0),
      left: rect.left + (window?.scrollX ?? 0),
    };
  }
  const positioned = getComputedStyle(scrollElement).position !== 'static';
  const result = {
    left: positioned
      ? element.offsetLeft - scrollElement.offsetLeft
      : element.offsetLeft,
    top: positioned
      ? element.offsetTop - scrollElement.offsetTop
      : element.offsetTop,
  };
  let offsetParent: HTMLElement | null = element.offsetParent as HTMLElement;
  while (offsetParent && scrollElement.contains(offsetParent)) {
    result.left -= offsetParent.offsetLeft;
    result.top -= offsetParent.offsetTop;
    offsetParent = offsetParent.offsetParent as HTMLElement;
  }
  return result;
}

function subscribeToInterruptingInputs(
  ref: RefObject<Element>,
  onInterrupt: (event: WheelEvent) => void,
) {
  const options: AddEventListenerOptions = {passive: true};
  const window = getWindow(ref.current);
  window?.addEventListener('wheel', onInterrupt, options);
  return {
    unsubscribe() {
      window?.removeEventListener('wheel', onInterrupt, options);
    },
  };
}

export interface UseScrollToConfig {
  /**
   * The DOM Element (or ref to a DOM Element) within which to scroll.
   * If this is not defined, the document element will be used.
   */
  domTarget?: HTMLElement | RefObject<HTMLElement> | null;
  /**
   * The scroll behavior to use when scrolling to a position.
   *
   * Defaults to 'auto'.
   */
  behavior?: 'smooth' | 'auto';
  /**
   * If `true`, then native smooth scrolling is disabled
   * and a spring animation is used instead.
   */
  forceAnimation?: boolean;
  /**
   * Optional configuration for the polyfill spring animation.
   * @see https://www.react-spring.io/docs/hooks/api
   */
  config?: SpringConfig;
  /**
   * Optional callback to be called whenever a `scrollTo`
   * animation has started.
   *
   * Note that this is _global_ in nature; all `useScrollTo`
   * hooks for the same `domTarget` will be notified.
   */
  onStart?: () => void;
  /**
   * Optional callback to be called whenever a `scrollTo`
   * animation has finished or has been interrupted.
   *
   * Note that this is _global_ in nature; all `useScrollTo`
   * hooks for the same `domTarget` will be notified.
   */
  onRest?: () => void;
}

export interface ScrollTo {
  (options?: ScrollToOptions): void;
  (xCoord?: number, yCoord?: number): void;
  (ref?: RefObject<HTMLElement>, options?: ScrollOptions): void;
  (element?: HTMLElement, options?: ScrollOptions): void;
  (id?: string, options?: ScrollOptions): void;
}

/**
 * Global map of DOM targets to callbacks that should be called
 * whenever that target starts animating.
 */
const startCallbacks = new WeakMap<
  HTMLElement,
  Set<MutableRefObject<(() => void) | undefined>>
>();

/**
 * Global map of DOM targets to callbacks that should be called
 * whenever that target stops animating.
 */
const restCallbacks = new WeakMap<
  HTMLElement,
  Set<MutableRefObject<(() => void) | undefined>>
>();

/**
 * `useScrollTo` will return a function that resembles the DOM Element's
 * `scrollTo` method, but with a few differences:
 *
 *   - in addition to the native `scrollTo` options, also accepts
 *     an id string, a DOM Element, or a React ref object to a DOM Element.
 *   - polyfilled 'smooth' scroll behavior animation
 *     in browsers that don't support it, or when `forceAnimation` is true.
 *   - accepts react-spring config for configuring the polyfill animation.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/CSS/scroll-behavior
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollTo
 * @see https://developer.mozilla.org/en-US/docs/Web/API/ScrollToOptions
 * @see https://www.react-spring.io/docs/hooks/api
 */
export function useScrollTo({
  domTarget,
  behavior,
  forceAnimation,
  config,
  onStart,
  onRest,
}: UseScrollToConfig = {}): ScrollTo {
  /**
   * Keep a ref to the DOM target we are scrolling,
   * which is configurable via the `domTarget` config option.
   * If this is not defined, we will default to the document element.
   */
  const ref = useRef<HTMLElement | null>(null);
  /**
   * Whether or not this browser supports scroll-behavior. If it does,
   * we will use native smooth scrolling. Otherwise, we will use
   * a spring animation.
   */
  const supportsScrollBehavior = useRef(false);
  /** A subscription to interrupting input events, like 'wheel'. */
  const interruptingInputs = useRef<{unsubscribe(): void} | null>(null);
  /** The callback to call when scroll animation starts. */
  const startCallback = useRef(onStart);
  startCallback.current = onStart;
  /** The callback to call when scroll animation stops for any reason. */
  const restCallback = useRef(onRest);
  restCallback.current = onRest;
  /**
   * The most recent args passed to the `scrollTo` callback.
   *
   * We keep track of these so that we can call the `scrollTo`
   * callback again (to recompute the scroll offsets) if
   * the container size changes while a scroll animation is happening.
   *
   * These will be `null` when scroll rests or cancels.
   */
  const lastScrollToArgs = useRef<Parameters<ScrollTo> | null>(null);

  /**
   * Update our ref and re-detect scroll-behavior support
   * whenever `domTarget` changes, and clean up interrupting input
   * subscriptions when it changes (and on unmount).
   */
  useEffect(() => {
    if (domTarget) {
      ref.current = 'current' in domTarget ? domTarget.current : domTarget;
    } else {
      ref.current = getDocument()?.documentElement ?? null;
    }
    if (ref.current) {
      const startCallbackSet = startCallbacks.get(ref.current) ?? new Set();
      startCallbackSet.add(startCallback);
      startCallbacks.set(ref.current, startCallbackSet);
      const restCallbackSet = restCallbacks.get(ref.current) ?? new Set();
      restCallbackSet.add(restCallback);
      restCallbacks.set(ref.current, restCallbackSet);
    }

    supportsScrollBehavior.current =
      'scrollBehavior' in ((ref.current as HTMLElement)?.style ?? {});
    return () => {
      interruptingInputs.current?.unsubscribe();
      interruptingInputs.current = null;
      if (ref.current) {
        startCallbacks.get(ref.current)?.delete(startCallback);
        restCallbacks.get(ref.current)?.delete(restCallback);
      }
    };
  }, [domTarget]);

  /**
   * Polyfill scroll behvaior (smooth scroll)
   * in browsers that don't support it (Safari).
   */
  const [, setScroll, stopScroll] = useSpring(() => ({
    left: ref.current?.scrollLeft ?? 0,
    top: ref.current?.scrollTop ?? 0,
    behavior,
    default: true,
    immediate: behavior === 'smooth' && supportsScrollBehavior.current,
    onStart: () => {
      if (ref.current) {
        startCallbacks.get(ref.current)?.forEach(({current}) => current?.());
      }
    },
    onChange: ({
      left,
      top,
      behavior,
    }: {
      left: number;
      top: number;
      behavior?: 'smooth' | 'auto';
    }) => {
      if (supportsScrollBehavior.current) {
        ref.current?.scrollTo({left, top, behavior});
      } else {
        ref.current?.scrollTo(left, top);
      }
    },
  }));

  const scrollTo = useCallback<ScrollTo>(
    (
      maybeLeft?:
        | number
        | string
        | ScrollToOptions
        | HTMLElement
        | RefObject<HTMLElement>,
      maybeTop?: number | ScrollOptions,
    ) => {
      let left: number | undefined;
      let top: number | undefined;
      let options: ScrollOptions | undefined;
      switch (typeof maybeLeft) {
        case 'number': {
          left = maybeLeft;
          if (typeof maybeTop === 'number') top = maybeTop;
          break;
        }
        case 'string': {
          // Allow the id to be just the id value, or the url hash.
          const id = maybeLeft.replace(/^#/, '');
          ({left, top} =
            getScrollOffsetForElement(
              getDocument(ref.current)?.getElementById(id),
              ref.current,
            ) ?? {});
          if (typeof maybeTop === 'object') options = maybeTop;
          break;
        }
        case 'object': {
          if (
            'left' in maybeLeft ||
            'top' in maybeLeft ||
            'behavior' in maybeLeft
          ) {
            ({left, top, ...options} = maybeLeft);
          } else {
            ({left, top} =
              getScrollOffsetForElement(
                'current' in maybeLeft
                  ? maybeLeft.current
                  : (maybeLeft as HTMLElement),
                ref.current,
              ) ?? {});
            if (typeof maybeTop === 'object') options = maybeTop;
          }
          break;
        }
      }

      if (!interruptingInputs.current) {
        interruptingInputs.current = subscribeToInterruptingInputs(ref, () => {
          interruptingInputs.current?.unsubscribe();
          interruptingInputs.current = null;
          stopScroll();
        });
      }

      const immediate =
        (!forceAnimation && supportsScrollBehavior.current) ||
        (options?.behavior ?? behavior) === 'auto';

      const scrollToArgs = [maybeLeft, maybeTop] as Parameters<ScrollTo>;
      lastScrollToArgs.current = scrollToArgs;

      void setScroll({
        left,
        top,
        behavior: immediate
          ? options?.behavior ?? behavior ?? 'smooth'
          : 'auto',
        from: {
          left: ref.current?.scrollLeft,
          top: ref.current?.scrollTop,
        },
        config,
        immediate,
        onRest: () => {
          if (lastScrollToArgs.current === scrollToArgs) {
            interruptingInputs.current?.unsubscribe();
            interruptingInputs.current = null;
            lastScrollToArgs.current = null;
          }
          if (ref.current) {
            restCallbacks.get(ref.current)?.forEach(({current}) => current?.());
          }
        },
      });
    },
    [setScroll, stopScroll, behavior, forceAnimation, config],
  );

  // Recompute `scrollTo` offsets if the container size changes during scroll.
  useSize(ref, () => {
    if (lastScrollToArgs.current) {
      scrollTo(...lastScrollToArgs.current);
    }
  });

  return scrollTo;
}
