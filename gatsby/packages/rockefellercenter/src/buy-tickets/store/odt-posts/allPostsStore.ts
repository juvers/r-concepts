import {BehaviorSubject} from 'rxjs';
import {TInitialState, TStore} from '~buy-tickets/models/types';

/* eslint-disable @typescript-eslint/no-explicit-any*/

const initialState: TInitialState = {
  error: '',
};

export const subject = new BehaviorSubject(initialState);

let state = initialState;

const allPostsStore: TStore = {
  subscribe: (setState: any) => subject.subscribe(setState),
  sendData: (message: any, title: string) => {
    try {
      state = {
        ...state,
        [title]: message,
        error: '',
      };
      subject.next(state);
    } catch (e) {
      state = {
        ...state,
        error: e.message,
      };
      subject.next(state);
    }
  },
  clearData: () => {
    state = {...initialState};
    subject.next(state);
  },
  initialState,
};

export default allPostsStore;
