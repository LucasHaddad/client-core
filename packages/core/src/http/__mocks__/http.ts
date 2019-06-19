/* tslint:disable */
export class Http {

  static get(): Promise<any> {
    return Promise.resolve({ data: { data: [], pagination: {} } });
  }

  static post(): Promise<any> {
    return Promise.resolve();
  }

  static put(): Promise<any> {
    return Promise.resolve();
  }

  static delete(): Promise<any> {
    return Promise.resolve();
  }

  static setBaseURL() { return; }
}
