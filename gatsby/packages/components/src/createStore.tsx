import produce, {enableMapSet} from 'immer';
import create from 'zustand';

enableMapSet();

import type {
  State as ZustandState,
  StateCreator as ZustandStateCreator,
  UseStore as UseZustandStore,
} from 'zustand';
import type {Draft as ImmerDraft} from 'immer';

export type {State, UseStore} from 'zustand';
export type {Draft} from 'immer';
export type StateCreator<T extends ZustandState> = ZustandStateCreator<
  T,
  (fn: (state: ImmerDraft<T>) => void) => void
>;

const immer = <T extends ZustandState>(
  config: StateCreator<T>,
): ZustandStateCreator<T> => (set, get, api) =>
  config((fn) => set(produce(fn) as (state: T) => T), get, api);

/**
 * Creates a zustand store with immer middleware.
 * Use it just like zustand's `create`.
 *
 * The immer middleware wraps 'set' in an immer 'produce'.
 *
 * @see https://github.com/pmndrs/zustand#first-create-a-store
 * @see https://immerjs.github.io/immer/docs/produce
 */
export const createStore = <T extends ZustandState>(
  stateCreator: StateCreator<T>,
): UseZustandStore<T> => create<T>(immer(stateCreator));
