import axios, { AxiosResponse, AxiosRequestConfig, AxiosError } from 'axios';

/**
 * Class used to create interceptors in http requests
 */
export class Interceptor {

  static addRequestSuccess(callback: (config: AxiosRequestConfig) => AxiosRequestConfig) {
    axios.interceptors.request.use(callback);
  }

  static addRequestFail(callback: (error: any) => any) {
    axios.interceptors.request.use(undefined, callback);
  }

  static addResponseSuccess(callback: (response: AxiosResponse<any>) => AxiosResponse<any>) {
    axios.interceptors.response.use(callback);
  }

  static addResponseFail(callback: (error: AxiosError) => Promise<AxiosError | AxiosResponse<any>>) {
    axios.interceptors.response.use(undefined, callback);
  }

}
