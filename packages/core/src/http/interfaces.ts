import { AxiosRequestConfig, AxiosError } from 'axios';

export interface IRequestConfig extends AxiosRequestConfig {}

export interface IHttpError extends AxiosError {}
