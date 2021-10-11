import {BehaviorSubject} from 'rxjs';
import {TInitialState, TStore} from '~buy-tickets/models/types';

/* eslint-disable @typescript-eslint/no-explicit-any*/
const initialState: TInitialState = {
  TicketTypes: [],
  PackageTypes: [],
  error: '',
};
export const subject = new BehaviorSubject(initialState);

let state = initialState;

const ticketTypesStore: TStore = {
  subscribe: (setState: any) => subject.subscribe(setState),
  sendData: (message: any) => {
    if (message) {
      state = {
        ...state,
        ...message,
      };
      subject.next(state);
    } else {
      state = {
        ...state,
        error: 'No data returned',
      };
      subject.next(state);
    }
  },
  initialState,
};

export default ticketTypesStore;
