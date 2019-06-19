import axios, { AxiosRequestConfig } from 'axios';

/**
 * Class responsible for expose axios http operations
 */
export class Http {

  static get(url: string, config?: AxiosRequestConfig): Promise<any> {
    return axios.get(url, config);
  }

  static post(url: string, data?: any, config?: AxiosRequestConfig): Promise<any> {
    return axios.post(url, data, config);
  }

  static put(url: string, data?: any, config?: AxiosRequestConfig): Promise<any> {
    return axios.put(url, data, config);
  }

  static delete(url: string, config?: AxiosRequestConfig): Promise<any> {
    return axios.delete(url, config);
  }

  static setBaseURL(baseURL: string) {
    axios.defaults.baseURL = baseURL;
  }
}
