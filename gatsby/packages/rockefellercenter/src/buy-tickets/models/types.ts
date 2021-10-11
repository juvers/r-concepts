/* eslint-disable @typescript-eslint/no-explicit-any*/
import React from 'react';
import {Subscription} from 'rxjs';
export type TStringBool = Record<string, boolean>;
export type TStringNumber = Record<string, number>;
export type TStringString = Record<string, string>;
export type TZeroToThree = 0 | 1 | 2 | 3;
export type TMouseButtonEvent = React.MouseEvent<HTMLButtonElement>;
export type TChangeEvent = React.ChangeEventHandler<HTMLSelectElement> | any;
export type TSyntheticEvent = React.SyntheticEvent<HTMLInputElement>;
export type TLabelAttribute = React.LabelHTMLAttributes<HTMLLabelElement>;

export type TUniversalType = Record<
  string,
  | string
  | number
  | boolean
  | number[]
  | string[]
  | boolean[]
  | Promise<any>
  | Promise<Response>
  | Response
  | null
  | any
>;

export type TVoid = () => void;
export type TParameterVoid = (x: any) => void;
export type TInitialState = Record<string, boolean | string | number | any[]>;
export type TInner = Record<string, TInitialState>;
// type TOperator = <T, S>(obs: Observable<T>) => Observable<S>;
// type TObservable = <T, S>(value: T) => Observable<S>;
// type TO = <T>(value: T) => Observable<T | void>;

export type TStore = Record<
  string,
  | TVoid
  | TInitialState
  | Subscription
  | TParameterVoid
  | TInner
  | Array<TInitialState>
  | any
>;
