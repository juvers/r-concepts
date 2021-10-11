/* eslint-disable @typescript-eslint/no-explicit-any */
import {Observable} from 'rxjs';
import {take} from 'rxjs/operators';
import api from '~buy-tickets/api/api';

export const getItem$ = <T>(url: string): Observable<T[]> => {
  return api.get<T[]>(url).pipe(take(2)) as Observable<T[]>;
};

export const postItem$ = <T>(url: string, item?: T): any => {
  return api.post<T[]>(url, item).pipe(take(1)) as Observable<any>;
};

export const putItem$ = <T>(url: string, item: T): void => {
  api
    .put(url, item)
    .pipe(take(1))
    .subscribe(
      (response) => console.log(response),
      (error) => console.log(error),
    );
};

export const deleteItem$ = (url: string, item: number): void => {
  api.delete(url, item).subscribe(
    (response) => console.log(response),
    (error) => console.log(error),
  );
};
