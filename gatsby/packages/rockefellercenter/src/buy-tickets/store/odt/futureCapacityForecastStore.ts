import {BehaviorSubject} from 'rxjs';
import {TInitialState, TStore} from '~buy-tickets/models/types';

/* eslint-disable @typescript-eslint/no-explicit-any*/

const initialState: TInitialState = {
  FutureCapacityForecast: [],
  error: '',
};
export const subject = new BehaviorSubject(initialState);

let state = initialState;

const futureCapacityForecastStore: TStore = {
  subscribe: (setState: any) => subject.subscribe(setState),
  sendData: (message: any) => {
    try {
      state = {
        ...state,
        FutureCapacityForecast: [...message],
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

export default futureCapacityForecastStore;
