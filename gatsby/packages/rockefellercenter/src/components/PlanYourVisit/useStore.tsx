import {createStore} from '../../../../components/src/createStore';
import type {State, StateCreator} from '@tishman/components';

interface PlanYourVisitState extends State {
  readonly selectedDate: string;
  readonly setSelectedDate: (date: string) => void;
  readonly selectedCategories: string[];
  readonly addCategory: (name: string) => void;
  readonly addCategories: (newCats: string[]) => void;
  readonly removeCategory: (name: string) => void;
  readonly isDateListOpen: boolean;
  readonly setDateListOpen: (isOpen: boolean) => void;
  readonly isCategoryListOpen: boolean;
  readonly setCategoryListOpen: (isOpen: boolean) => void;
  readonly clearCategories: () => void;
  readonly isFilterStuck: boolean;
  readonly setIsFilterStuck: (isStuck: boolean) => void;
}

const createPlanYourVisitStore = (
  set: Parameters<StateCreator<PlanYourVisitState>>[0],
): PlanYourVisitState => ({
  selectedDate: '',
  setSelectedDate: (date: string | null) => {
    set((state) => {
      return {
        ...state,
        selectedDate: date,
      };
    });
  },
  selectedCategories: [],
  addCategory: (name: string) => {
    set((state) => {
      return {
        ...state,
        selectedCategories: [...new Set([...state.selectedCategories, name])],
      };
    });
  },
  removeCategory: (name: string) => {
    set((state) => {
      return {
        ...state,
        selectedCategories: state.selectedCategories.filter((c) => c !== name),
      };
    });
  },
  addCategories: (newCats: string[] = []) => {
    set((state) => {
      return {
        ...state,
        selectedCategories: [
          ...new Set([...state.selectedCategories, ...newCats]),
        ],
      };
    });
  },
  clearCategories: () => {
    set((state) => {
      return {
        ...state,
        selectedCategories: [],
      };
    });
  },
  isDateListOpen: false,
  setDateListOpen: (isOpen: boolean) => {
    set((state) => {
      return {
        ...state,
        isCategoryListOpen: false,
        isDateListOpen: isOpen,
      };
    });
  },
  isCategoryListOpen: false,
  setCategoryListOpen: (isOpen: boolean) => {
    set((state) => {
      return {
        ...state,
        isCategoryListOpen: isOpen,
        isDateListOpen: false,
      };
    });
  },
  isFilterStuck: false,
  setIsFilterStuck: (isStuck: boolean) => {
    set((state) => {
      return {
        ...state,
        isFilterStuck: isStuck,
      };
    });
  },
});

const store = createStore<PlanYourVisitState>(createPlanYourVisitStore);

export default store;
