/** @jsx jsx */
import invariant from 'invariant';
import {useContext, useRef, useImperativeHandle, useLayoutEffect} from 'react';
import {useSprings} from '@react-spring/web';
import {PageTransitionRegistry, PageTransitionContext} from './PageTransition';
import {MOUNT, ENTER, LEAVE} from './PageTransitionState';

import type {
  Controller,
  SpringConfig,
  SpringValues,
  SpringValue,
  PickAnimated,
} from '@react-spring/web';
import type {
  PageTransitionRecord,
  PageTransitionPhase,
  TransitionHandle,
} from './PageTransitionState';

type Lookup<T = unknown> = Record<string, T>;

interface PropsConfig {
  config?: SpringConfig;
  delay?: number;
  immediate?: boolean;
}

/** Props for 'enter' or 'leave' transitions. */
type ToProps<Props extends Lookup> = Props & PropsConfig;

/** A function that returns transition props. */
interface PropsFn<Props> {
  (record: PageTransitionRecord | null): Props;
}

/**
 * Extract a value from a prop function using the given record,
 * or return the prop if not a function.
 */
function callProp<T, Props = T extends PropsFn<infer U> ? U : T>(
  value: T,
  record?: PageTransitionRecord | null,
): Props {
  return (typeof value === 'function' ? value(record) : value) as Props;
}

/**
 * Get spring update or initialization props
 * for the given transition phase and record.
 */
function getPropsForPhase<Props extends Lookup>(
  props: UsePageTransitionProps<Props>,
  phase: typeof ENTER | typeof LEAVE,
  record?: PageTransitionRecord | null,
): ToProps<Props>;
function getPropsForPhase<Props extends Lookup>(
  props: UsePageTransitionProps<Props>,
  phase: typeof MOUNT,
  record?: PageTransitionRecord | null,
): Props;
/** @internal */
function getPropsForPhase<Props extends Lookup>(
  props: UsePageTransitionProps<Props>,
  phase: PageTransitionPhase,
  record?: PageTransitionRecord | null,
) {
  const {config, immediate, enter, leave, initial} = props;
  switch (phase) {
    case MOUNT: {
      let from = callProp(initial, record);
      if (!from) from = callProp(leave, record);
      return {
        from,
        config: callProp(config, record),
        immediate: callProp(immediate, record),
      };
    }
    case ENTER: {
      return callProp(enter, record);
    }
    case LEAVE: {
      return callProp(leave, record);
    }
  }
}

export type UsePageTransitionProps<
  Props extends Lookup = Lookup
> = PickAnimated<Props> extends infer State
  ? {
      /**
       * Props for a react-spring animation to perform upon entering.
       *
       * This may be a function that returns props. The function will
       * receive a record of the previous page this this page is replacing,
       * or `null` if there was no previous page.
       */
      enter: ToProps<Props> | PropsFn<Props>;
      /**
       * Props for a react-spring animation to perform upon leaving.
       *
       * This may be a function that returns props. The function will
       * receive a record of the next page that is replacing this page,
       * or `null` if there is no next page.
       */
      leave: ToProps<Props> | PropsFn<Props>;
      /**
       * Optional base props for the animation. These props are only
       * used to initialize the animation when the page is mounting.
       *
       * This may be a function that returns props. The function will
       * receive a record of the previous page this this page is replacing,
       * or `null` if there was no previous page.
       */
      initial?: State | PropsFn<State>;
      /**
       * A default spring config to use if none is provided
       * on `enter` or `leave` props.
       *
       * This may be a function that returns config. The function will
       * receive a record of the page that is either replacing this page,
       * if this page is leaving, or being replaced by this page,
       * if this page is mounting or entering, or `null` if there is no page.
       */
      config?: SpringConfig | PropsFn<SpringConfig>;
      /**
       * Run transitions immediately by default. May be be overriden on `enter`
       * and `leave` props.
       *
       * This may be a function that returns a boolean. The function will
       * receive a record of the page that is either replacing this page,
       * if this page is leaving, or being replaced by this page,
       * if this page is mounting or entering, or `null` if there is no page.
       */
      immediate?: boolean | PropsFn<boolean>;
    }
  : never;

/**
 * `usePageTransition` to configure an `enter` react-spring animation
 * to be run when an ancestor React element is added as a child of
 * a `PageTransition`, and a `leave` animation to be run
 * when the ancestor is removed.
 *
 * If no `PageTransition` ancestor is present, the `enter` animation
 * will be run on mount.
 */
export function usePageTransition<Props extends Lookup>(
  /** Props for the transition. */
  props: UsePageTransitionProps<Props>,
): SpringValues<PickAnimated<Props>>;

/**
 * `usePageTransition` with a count to configure a trail of `enter`
 * react-spring animations, where each animation follows the previous,
 * to be run when an ancestor React element is added as a child
 * of a `PageTransition`, and a trail of the same number of `leave`
 * animations to be run _in reverse order_ when the ancestor is removed.
 *
 * If no `PageTransition` ancestor is present, the trail of `enter`
 * animations will be run on mount.
 */
export function usePageTransition<Props extends Lookup>(
  /** The number of trailing springs to create from the props. */
  count: number,
  /**
   * Props for the transition. Each subsequent spring in the trail
   * will use the previous spring as its 'to' input.
   */
  props: UsePageTransitionProps<Props>,
): SpringValues<PickAnimated<Props>>[];

/** @internal */
export function usePageTransition<Props extends Lookup>(
  countOrProps: unknown,
  trailProps?: UsePageTransitionProps<Props>,
): SpringValues<PickAnimated<Props>> | SpringValues<PickAnimated<Props>>[] {
  /** Whether or not this transition should behave as a trail. */
  let isTrail = false;
  let count = 0;
  let props: UsePageTransitionProps<Props>;

  // Normalize arguments.
  if (trailProps) {
    invariant(
      typeof countOrProps === 'number',
      'Trail props must be preceded by a count number',
    );
    isTrail = true;
    props = trailProps;
    count = countOrProps;
  } else {
    invariant(
      typeof countOrProps !== 'number',
      'A count argument must be followed by a trail props object',
    );
    props = countOrProps as UsePageTransitionProps<Props>;
    count = 1;
  }

  const registry = useContext(PageTransitionRegistry);
  const record = useContext(PageTransitionContext);
  const key = record?.key;
  const relatedRecord = record?.relatedRecord;
  const ctrls = useRef<Controller[]>([]);

  // Create springs with the initial props.
  const [springs, update, pause] = useSprings(
    count,
    (i, ctrl) => {
      ctrls.current[i] = ctrl;
      return getPropsForPhase(props, MOUNT, relatedRecord);
    },
    [count],
  );

  // Create a transition handle to update springs based on transition phase.
  const transitionHandle = useRef<TransitionHandle>(null);
  useImperativeHandle(transitionHandle, () => ({
    pause() {
      pause();
    },
    update(phase, fromPhase) {
      const leaving = phase === LEAVE;
      if (phase !== fromPhase) pause();
      const to = getPropsForPhase(props, phase, relatedRecord);
      // HACK: Due to bugs in the current react-spring RC,
      // `immediate` props don't work consistently, so here
      // we manually set every spring to its final value
      // whenever `immediate` is true.
      if (to.immediate) {
        ctrls.current.forEach(
          (ctrl: {springs: Record<string, SpringValue>}) => {
            Object.entries(ctrl.springs).forEach(([key, spring]) => {
              spring.set(to[key]);
            });
          },
        );
      } else if (isTrail) {
        return update((i) => {
          const parent = ctrls.current[i + (leaving ? 1 : -1)];
          return parent ? {...to, to: parent.springs} : to;
        });
      }
      return update(() => to);
    },
  }));

  // Register the transition handle with the transition context,
  // or just run the ENTER animation, if context is undefined.
  useLayoutEffect(() => {
    if (key && registry) {
      registry.addTransition(key, transitionHandle);
      return () => {
        registry.removeTransition(key, transitionHandle);
      };
    } else {
      void transitionHandle.current?.update(ENTER, MOUNT);
    }
  }, [key, registry]);

  if (isTrail) {
    return springs as SpringValues<PickAnimated<Props>>[];
  } else {
    return springs[0] as SpringValues<PickAnimated<Props>>;
  }
}
