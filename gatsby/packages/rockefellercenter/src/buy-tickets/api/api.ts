import {defer, Observable} from 'rxjs';
import initializeAxios from './axiosSetup';
import {axiosRequestConfiguration} from './config';
import {map} from 'rxjs/operators';
import {TUniversalType} from '~buy-tickets/models/types';

const axiosInstance = initializeAxios(axiosRequestConfiguration);
const get = <T>(url: string, queryParams?: TUniversalType): Observable<T> => {
  return defer(() => axiosInstance.get<T>(url, {params: queryParams})).pipe(
    map((result) => result.data),
  );
};

const post = <T>(
  url: string,
  body?: TUniversalType,
  queryParams?: TUniversalType,
): Observable<T | void> => {
  return defer(() =>
    axiosInstance.post<T>(url, body, {params: queryParams}),
  ).pipe(map((result) => result.data));
};

const put = <T>(
  url: string,
  body: TUniversalType,
  queryParams?: TUniversalType,
): Observable<T | void> => {
  return defer(() =>
    axiosInstance.put<T>(url, body, {params: queryParams}),
  ).pipe(map((result) => result.data));
};

const patch = <T>(
  url: string,
  body: TUniversalType,
  queryParams?: TUniversalType,
): Observable<T | void> => {
  return defer(() =>
    axiosInstance.patch<T>(url, body, {params: queryParams}),
  ).pipe(map((result) => result.data));
};

const remove = <T>(url: string, id: number): Observable<T | void> => {
  return defer(() => axiosInstance.delete(`${url}/${id}`)).pipe(
    map((result) => result.data),
  );
};
const api = {get, post, put, patch, delete: remove};
export default api;
