import {createContext} from 'react';

export const padTime = (time: number | string): string =>
  time.toString().padStart(2, '0');
export const TimeContext = createContext(0);

export const singleExecution = (function () {
  let executed = false;
  return function () {
    if (!executed) {
      executed = true;
      const error = new Error(
        'If you still want to purchase tickets, please start again. You have 10 minutes to complete your billing information.',
      );
      error.name = 'Sorry, your session has timed out.';
      throw error;
    }
  };
})();

export const timeoutError = (): void => {
  const error = new Error(
    'If you still want to purchase tickets, please start again. You have 10 minutes to complete your billing information.',
  );
  error.name = 'Sorry, your session has timed out.';
  throw error;
};
