/** @jsx jsx */
import {
  useMemo,
  useRef,
  useState,
  useEffect,
  forwardRef,
  useLayoutEffect,
} from 'react';
import {navigate, withPrefix} from 'gatsby';
import {useLocation} from '@reach/router';
import {isDOMInstance, getNearestScrollNode, getWindow} from '@hzdg/dom-utils';
import {
  jsx,
  useScrollTo,
  Section,
  useMergedRef,
  useMaxIntersection,
} from '@tishman/components';

import type {ComponentPropsWithRef} from 'react';
import type {NavigateOptions} from '@reach/router';

export interface UseAnchorConfig<TState>
  extends IntersectionObserverInit,
    NavigateOptions<TState> {}

/**
 * A map of scrollport elements to scroll listeners.
 *
 * This is used by `useTopSentinel` to avoid subscribing
 * to the same scrollport more than once.
 */
const topSentinels = new WeakMap<Element | Window, EventListener>();

/**
 * A hook to strip the hash when top of the page is reached.
 *
 * Every `AnchorSection` uses this, but it will only subscribe
 * to a scrollport element once, so there is no danger of thrashing
 * the location state if a lot of `AnchorSection` elements are on the page.
 */
function useNoHashAtTop(target: Element | null): void {
  const locationState = useLocation();
  /** A ref to the current location. */
  const location = useRef(locationState);
  location.current = locationState;

  /** The scrollport element to observe. */
  const scrollport = useMemo(
    () => getNearestScrollNode(target) ?? getWindow(),
    [target],
  );

  /** Whether or not this scrollport is already being observed. */
  const subscribed = scrollport && topSentinels.has(scrollport);

  useLayoutEffect(() => {
    if (scrollport && !topSentinels.has(scrollport)) {
      const options: AddEventListenerOptions = {passive: true};
      const handler = ({currentTarget}: Event) => {
        if (!currentTarget) return;
        const target = currentTarget as Window | HTMLElement;
        const top = 'scrollY' in target ? target.scrollY : target.scrollTop;
        if (top <= 0 && location.current.hash) {
          void navigate(location.current.pathname, {
            replace: true,
            state: location.current.state ?? undefined,
          });
        }
      };
      scrollport.addEventListener('scroll', handler, options);
      topSentinels.set(scrollport, handler);
      return () => {
        if (topSentinels.get(scrollport) === handler) {
          scrollport.removeEventListener('scroll', handler, options);
          topSentinels.delete(scrollport);
        }
      };
    }
  }, [scrollport, subscribed]);
}

/**
 * A hook that will update the router hash location to match the id
 * of the referenced element whenever the element is intersecting
 * the root element, and scroll to reveal the matching element
 * whenever the location hash changes.
 */
export function useAnchor<T extends HTMLElement, TState>({
  replace = true,
  state,
  root,
  rootMargin,
  threshold,
}: UseAnchorConfig<TState> = {}): (node: T | null) => void {
  /** A ref to be passed to the anchor element. */
  const ref = useRef<T>(null);
  /** The scrollable node to target for scroll effects. */
  const [domTarget, setDomTarget] = useState<HTMLElement | null>(null);
  /**
   * Whether or not the next location change should be ignored.
   *
   * This is used to allow upating the location on intersection
   * without triggering scroll animation.
   */
  const ignoreNextLocationChange = useRef(false);
  /** Whether or not scroll position is animating. */
  const animating = useRef(false);
  const {pathname, hash, state: locationState} = useLocation();
  /**
   * The initial location pathname. We use this to disable
   * the anchor section when the 'host' path (page) has changed.
   */
  const initialPathname = useRef(pathname);
  /**
   * Whether or not the anchor section behavior is enabled.
   * It should only be enabled if the location pathname
   * matches the initital pathname, but the hash does not.
   */
  const enabled = useRef(false);
  enabled.current =
    pathname === initialPathname.current && hash.slice(1) !== ref.current?.id;

  const scrollTo = useScrollTo({
    domTarget,
    behavior: 'smooth',
    forceAnimation: true,
    onStart: () => void (animating.current = true),
    onRest: () => void (animating.current = false),
  });

  /**
   * Config for detecting the intersection of the `AnchorSection`
   * with the scrollport.
   *
   * Memoized to avoid calculating the root element too often.
   */
  const intersectionConfig = useMemo(
    () => ({threshold, rootMargin, root: root ?? domTarget}),
    [domTarget, root, rootMargin, threshold],
  );

  // When this element intersects the root element with the
  // __highest intersection ratio__ compared to other elements
  // interescting the same root element, navigate to the location hash
  // for the element id, unless scroll position is animating.
  const intersectionRef = useMaxIntersection(() => {
    // HACK: Wait a frame before navigating.
    // This is a crude workaround for an edge case:
    // When navigtaing to a new page, Gatsby jumps scroll position
    // to the top, which can trigger intersection observer updates
    // on the exiting page _before_ the new location state has been upated.
    setTimeout(() => {
      if (enabled.current && !animating.current && ref.current?.id) {
        const href = withPrefix(`${pathname}#${ref.current.id}`);
        ignoreNextLocationChange.current = true;
        void navigate(href, {replace, state});
      }
    }, 0);
  }, intersectionConfig);

  useNoHashAtTop(root ?? domTarget);

  // Set the `domTarget` to the nearest scrollable node.
  useLayoutEffect(() => {
    const domTarget = getNearestScrollNode(ref.current);
    setDomTarget(
      // Special case: if the `domTarget` is the <html> element,
      // don't set the root because at the top level, we want
      // interesction detection with the viewport, not the element.
      isDOMInstance<HTMLHtmlElement>(domTarget, HTMLHtmlElement)
        ? null
        : domTarget,
    );
  }, []);

  // Scroll to the current element whenever the location hash changes
  // to match the element id (unless it was changed by the intersection effect).
  useEffect(() => {
    if (
      !ignoreNextLocationChange.current &&
      ref.current?.id &&
      hash.slice(1) === ref.current.id
    ) {
      scrollTo(hash);
    }
    ignoreNextLocationChange.current = false;
  }, [hash, locationState, ref, scrollTo]);

  return useMergedRef(intersectionRef, ref);
}

export interface AnchorSectionProps<TState>
  extends ComponentPropsWithRef<typeof Section>,
    IntersectionObserverInit,
    NavigateOptions<TState> {
  id: string;
}

const DEFAULT_THRESHOLD = Array.from(Array(11).keys(), (v) => v * 0.1);

/**
 * A `Section` that binds its `id` to the location hash.
 */
export const AnchorSection = forwardRef(function AnchorSection(
  {
    replace = true,
    state,
    root,
    rootMargin,
    threshold = DEFAULT_THRESHOLD,
    ...props
  },
  forwardedRef,
): JSX.Element {
  const internalRef = useAnchor({replace, state, threshold, root, rootMargin});
  const mergedRef = useMergedRef(forwardedRef, internalRef);
  return <Section ref={mergedRef} {...props} />;
}) as <TState>(props: AnchorSectionProps<TState>) => JSX.Element;
// NOTE: We assert the above component as a function type (instead of
// defining it in the `forwardRef` call or function declaration)
// because the `forwardRef` type does not support generics
// (like `<TState>`) in prop types.
// See https://stackoverflow.com/questions/58469229/react-with-typescript-generics-while-using-react-forwardref/58473012
