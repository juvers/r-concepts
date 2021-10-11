import {AxiosRequestConfig} from 'axios';
export const axiosRequestConfiguration: AxiosRequestConfig = {
  baseURL: process.env.GATSBY_BUY_TICKETS_API_URL,
  responseType: 'json',
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
  },
  proxy: {
    host: 'localhost',
    port: 5000,
  },
};
