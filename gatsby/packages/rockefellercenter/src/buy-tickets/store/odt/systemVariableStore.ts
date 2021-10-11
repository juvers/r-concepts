import {BehaviorSubject} from 'rxjs';

import {TInitialState, TStore} from '~buy-tickets/models/types';

const initialState: TInitialState = {
  systemVariables: [],
  error: '',
};
/* eslint-disable @typescript-eslint/no-explicit-any*/

export const subject = new BehaviorSubject(initialState);

let state = initialState;

const systemVariableStore: TStore = {
  subscribe: (setState: any) => subject.subscribe(setState),
  sendData: (message: any) => {
    try {
      state = {
        ...state,
        systemVariables: [...message],
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
  initialState,
};

export default systemVariableStore;
