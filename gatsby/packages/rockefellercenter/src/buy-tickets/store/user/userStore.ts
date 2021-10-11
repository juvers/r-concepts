import {BehaviorSubject} from 'rxjs';
import {TInitialState, TStore} from '~buy-tickets/models/types';

/* eslint-disable @typescript-eslint/no-explicit-any*/

const initialState: TInitialState = {
  name: '',
  attraction: '',
  isSunset: false,
  date: '',
  error: '',
  ticketSelectionList: [],
  packageSelectionList: [],
  totalPrice: 0,
  totalTax: 0,
  currentStep: 1,
  canContinue: false,
  loading: true,
  totalNumberOfTickets: 0,
  redemptionCodes: [{CityPassBarcode: ''}],
};
const subject = new BehaviorSubject(initialState);

let state = initialState;

const userStore: TStore = {
  subscribe: (setState: any) => subject.subscribe(setState),
  sendData: (message: any) => {
    try {
      state = {
        ...state,
        ...message,
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

export default userStore;
