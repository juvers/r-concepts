import {useState} from 'react';
import {createStore} from '@tishman/components';

import type {State, StateCreator} from '@tishman/components';

/**
 * `Pagination` stores an active `page` and total `pages` count,
 * and also provides a number of callbacks for modifying the page state.
 */
export interface Pagination extends State {
  /** The currently active page. */
  readonly page: number;
  /** The total number of pages. */
  readonly pages: number;
  /** Whether there are more pages after the currently active page. */
  readonly hasNext: boolean;
  /** Whether there are more pages before the currently active page. */
  readonly hasPrevious: boolean;
  /**
   * Go to the given page.
   *
   * Also has convenience methods:
   * - `goto.first` - goto the first page.
   * - `goto.previous` - goto the page before the current page.
   * - `goto.next` - goto the page after the current page.
   * - `goto.last` - goto the last page.
   */
  readonly goto: {
    (page: number): void;
    /** Goto the page after the currently active page. */
    readonly next: () => void;
    /** Goto the page before the currently active page. */
    readonly previous: () => void;
    /** Goto the first page. */
    readonly first: () => void;
    /** Goto the last page. */
    readonly last: () => void;
  };
  /** Set the total number of pages. */
  readonly setPages: (pages: number) => void;
  /**
   * Set the current of page, bypassing `goto`.
   *
   * This is normally not used directly, but is provided for cases
   * where `goto` has been replaced. See `setGoto` for more.
   */
  readonly setPage: (page: number) => void;
  /**
   * Replace the goto implementation. This is mostly for internal use,
   * but is exposed to facilitate use cases where immediate updates
   * via `goto` are not desired (i.e., synchronizing page state
   * with scrolling).
   *
   * Returns a 'cleanup' callback that will restore
   * the previous goto implementation when called.
   *
   * @example
   *
   * useEffect(() => setGoto(page => { ... }), []);
   */
  readonly setGoto: (goto: (page: number) => void) => () => void;
}

const clamp = (value: number, min: number, max: number): number =>
  Math.max(min, Math.min(max, value));

const createGoto = (
  /** The `set` function for the pagination store, provided by `createStore`. */
  setPagination: Parameters<StateCreator<Pagination>>[0],
  /** The `get` function for the pagination store, provided by `createStore`. */
  getPagination: Parameters<StateCreator<Pagination>>[1],
  /** Optional implementation for the underlying `goto` updater. */
  gotoImpl = (page: number) => {
    setPagination((nextState) => {
      nextState.page = clamp(page, 0, nextState.pages - 1);
      nextState.hasPrevious = nextState.page !== 0;
      nextState.hasNext = nextState.page !== nextState.pages - 1;
    });
  },
) => {
  function goto(pageOrUpdater: number | ((pageState: Pagination) => number)) {
    if (typeof pageOrUpdater === 'function') {
      gotoImpl(pageOrUpdater(getPagination()));
    } else {
      gotoImpl(pageOrUpdater);
    }
  }
  return Object.assign((page: number) => goto(page), {
    next: () => goto(({page}) => page + 1),
    previous: () => goto(({page}) => page - 1),
    first: () => goto(0),
    last: () => goto(({pages}) => pages - 1),
    __impl: gotoImpl,
  });
};

/**
 * Creates a new `Pagination` state.
 */
const createPaginationState = (
  /** The `set` function for the associated store, provided by `createStore`. */
  set: Parameters<StateCreator<Pagination>>[0],
  /** The `get` function for the associated store, provided by `createStore`. */
  get: Parameters<StateCreator<Pagination>>[1],
): Pagination => ({
  page: 0,
  pages: 0,
  hasNext: false,
  hasPrevious: false,
  goto: createGoto(set, get),
  setPages: (pages) => {
    set((state) => {
      state.pages = pages;
      state.hasNext = state.page !== pages - 1;
    });
  },
  setPage: (page) => {
    set((state) => {
      state.page = clamp(page, 0, state.pages - 1);
      state.hasPrevious = state.page !== 0;
      state.hasNext = state.page !== state.pages - 1;
    });
  },
  setGoto: (gotoImpl) => {
    const previousGoto = get().goto;
    const goto = createGoto(set, get, gotoImpl);
    set((state) => void (state.goto = goto));
    return () => {
      if (get().goto === goto) {
        set((state) => void (state.goto = previousGoto));
      }
    };
  },
});

export interface UsePaginationProps {
  pages?: number;
  page?: number;
}

/**
 * `usePagination` will return a `Pagination` state that represents
 * a total number of pages and an active page, as well as a number of
 * callbacks for modifying the page state.
 */
export function usePagination(initialState?: UsePaginationProps): Pagination {
  // Wrap our `createStore` in a `useState` initializer
  // so we only call it once for the lifetime of the using component.
  const [store] = useState(() => {
    const store = createStore<Pagination>(createPaginationState);
    if (initialState) {
      const {page, pages} = initialState;
      const state = store.getState();
      if (pages != null) state.setPages(pages);
      if (page != null) state.goto(page);
    }
    return store;
  });
  return store();
}
