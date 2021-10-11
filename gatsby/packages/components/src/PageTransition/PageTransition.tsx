/** @jsx jsx */
import {jsx, Box, createStore} from '@tishman/components';
import {
  createContext,
  useState,
  useMemo,
  useEffect,
  useRef,
  memo,
  useContext,
} from 'react';
import {
  createPageTransitionState,
  PageTransitionRecord,
} from './PageTransitionState';

import type {
  ComponentPropsWithoutRef,
  ElementType,
  ReactChild,
  ReactNode,
  ReactPortal,
} from 'react';
import type {BoxProps} from '@tishman/components';
import type {
  PageTransitionPhase,
  PageTransitionState,
  PageTransitionToken,
} from './PageTransitionState';

/**
 * Creates and stores (using `createStore`) a `PageTransitionState`.
 */
function usePageTransitionState(
  /** The element to initialize the `PageTransitionState` with. */
  initialElement?: ReactChild | ReactPortal | boolean | null,
): PageTransitionState {
  // Wrap our `createStore` in a `useState` initializer
  // so we only call it once for the lifetime of the using component.
  const [store] = useState(() => {
    const store = createStore<PageTransitionState>(createPageTransitionState);
    if (initialElement) store.getState().push(initialElement);
    return store;
  });
  return store();
}

/** A React context providing a registry for pages to add/remove transitions. */
export const PageTransitionRegistry = createContext<
  | {
      addTransition: PageTransitionState['addTransition'];
      removeTransition: PageTransitionState['removeTransition'];
    }
  | undefined
>(undefined);

interface PageTransitionContextValue extends PageTransitionRecord {
  relatedRecord: PageTransitionRecord | null;
}

/** A React context providing the record for a page in a `PageTransition`. */
export const PageTransitionContext = createContext<
  PageTransitionContextValue | undefined
>(undefined);

/**
 * A hook for using the current phase of the page transition.
 */
export function usePageTransitionPhase(): PageTransitionPhase;
/**
 * A hook for using the current phase of the page transition.
 *
 * If given a callback, calls the callback with the current phase
 * instead of returning it.
 */
export function usePageTransitionPhase(
  cb: (phase: PageTransitionPhase) => void,
): void;
/** @internal */
export function usePageTransitionPhase(
  cb?: (phase: PageTransitionPhase) => void,
): PageTransitionPhase | void {
  const phase = useContext(PageTransitionContext)?.phase ?? 'mount';
  const callback = useRef(cb);
  callback.current = cb;
  return useMemo(() => {
    if (typeof callback.current === 'function') {
      callback.current.call(null, phase);
    } else {
      return phase;
    }
  }, [phase]);
}

/**
 * A global weak map of page transition records to their context values.
 *
 * This is used to memoize page transition context values.
 * Note that this memoization works under the assumption
 * that the record changes whenever the relevant state changes.
 */
const pageTransitionContextMap = new WeakMap<
  PageTransitionRecord,
  WeakMap<PageTransitionState, PageTransitionContextValue>
>();

/** Get the page transition context value for the given record and state. */
function getPageTransitionContext(
  record: PageTransitionRecord,
  state: PageTransitionState,
): PageTransitionContextValue {
  const map = pageTransitionContextMap.get(record) ?? new WeakMap();
  pageTransitionContextMap.set(record, map);
  const ctx = map?.get(state) ?? {
    ...record,
    relatedRecord: record === state.head ? state.previous : state.head,
  };
  map.set(state, ctx);
  return ctx;
}

/** Default container for pages under transition. */
const PageTransitionContainer = memo(({sx, ...props}: BoxProps) => (
  <Box {...props} sx={{position: 'relative', ...sx}} />
));

/** Default page wrapper. */
const defaultPageWrapper = (page: ReactNode) => (
  <Box sx={{position: 'absolute', top: 0, right: 0, bottom: 0, left: 0}}>
    {page}
  </Box>
);

export type PageTransitionProps<
  T extends ElementType = typeof PageTransitionContainer
> = Omit<ComponentPropsWithoutRef<T>, 'children'> & {
  children?: ReactChild | ReactPortal | boolean | null;
  /**
   * An optional component to use as the container for the page.
   * The purpose of the container is to provide a positioning context
   * for those times when more than one page are mounted (during animation).
   *
   * The default container is simply a relatively positioned div.
   *
   * **Note:** Any additional props passed to `PageTransition`
   * will be forwarded to this `Container`.
   */
  Container?: T;
  /**
   * An optional render prop that should return the page element
   * with any wrapping elements.
   *
   * The callback will receive the `page` element that should be
   * wrapped and a `transitioning` boolean that indicates if a page
   * transition animation is occurring.
   *
   * The default callback wraps the page in an absolutely positioned div
   * that fills the containing element, with the purpose of positioning
   * the page in the container so that it and other pages may occupy
   * the same area of the container while transitioning.
   */
  wrapPageElement?: (
    /** The page element. */
    page: ReactNode,
    /** Whether or not the page is transitioning. */
    transitioning: boolean,
    /** The transition record for this page. */
    record: PageTransitionRecord,
  ) => JSX.Element;
  /**
   * An optional callback that will be called
   * whenever the transition rests (i.e., is finished).
   */
  onRest?: () => void;
};

/**
 * `PageTransition` provides the context in which page transitions
 * are managed. Descendants may participate in the transition
 * via `usePageTransition`.
 *
 * Multiple transitions may co-exist; transitions will have distinct
 * states within each. If they are nested, the innermost transition
 * will completely mask any outer transition states.
 */
export function PageTransition(props: PageTransitionProps): JSX.Element;
export function PageTransition<T extends ElementType>(
  props: PageTransitionProps<T> & {Container: T},
): JSX.Element;
/** @internal */
export function PageTransition({
  children: element,
  Container = PageTransitionContainer,
  wrapPageElement = defaultPageWrapper,
  onRest,
  ...props
}: PageTransitionProps): JSX.Element {
  const onRestCallback = useRef(onRest);
  onRestCallback.current = onRest;
  const transition = useRef<PageTransitionToken | null | undefined>(undefined);
  const state = usePageTransitionState(element);
  const atRest = useRef<boolean>(state.atRest);
  const stack = useMemo(() => Array.from(state.stack.values()), [state.stack]);
  const registry = useMemo(
    () => ({
      addTransition: state.addTransition,
      removeTransition: state.removeTransition,
    }),
    [state.addTransition, state.removeTransition],
  );

  // If we already have a record for this element, update the element state.
  if (state.get(element)) state.push(element);

  useEffect(() => {
    const record = state.get(element);
    if ((element && !record) || record !== state.head) {
      state.push(element);
    } else {
      transition.current = state.runTransition(transition.current);
      if (state.atRest !== atRest.current) {
        atRest.current = state.atRest;
        if (atRest.current) onRestCallback.current?.();
      }
    }
  }, [element, state]);

  // Useful debugging tool; uncomment to see some tabular data in the console!
  // console.table({
  //   head: {...state.head, element: state.getElement(state.head?.key ?? '')},
  //   previous: {
  //     ...state.previous,
  //     element: state.getElement(state.previous?.key ?? ''),
  //   },
  //   ...stack.reduce(
  //     (v, a, i) => ({
  //       ...v,
  //       [`stack(${i})`]: {...a, element: state.getElement(a.key)},
  //     }),
  //     {},
  //   ),
  // });

  return (
    <PageTransitionRegistry.Provider value={registry}>
      <Container {...props}>
        {stack.map((record) => (
          <PageTransitionContext.Provider
            key={record.key}
            value={getPageTransitionContext(record, state)}
          >
            {wrapPageElement(
              state.getElement(record.key),
              !state.atRest,
              record,
            )}
          </PageTransitionContext.Provider>
        ))}
      </Container>
    </PageTransitionRegistry.Provider>
  );
}
