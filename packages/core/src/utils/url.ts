import qs from 'qs';
import { Router } from '../router/router';
import { IDictionary } from './interfaces';

/**
 * URL util
 */
export class URL {

  private static parseOptions: qs.IParseOptions = { allowDots: true, depth: 20 };
  private static stringifyOptions: qs.IStringifyOptions = { encode: false, allowDots: true, arrayFormat: 'repeat' };

  public static updateQueryString(value: IDictionary<any>, replace: boolean = false) {
    const currentQuery = this.getParsedQueryString(this.getFormattedQueryStringFromUrl());
    const query = { ...currentQuery, ...value };
    if (replace) {
      Router.replace({ query, path: Router.getPath() });
    } else {
      Router.push({ query, path: Router.getPath() });
    }
  }

  private static getParsedQueryString(value: string, options?: qs.IParseOptions): IDictionary<any> {
    const config: qs.IParseOptions = { ...this.parseOptions, ...options };
    return qs.parse(value, config);
  }

  public static getFormattedQueryString(obj: IDictionary<any>, options?: qs.IStringifyOptions): string {
    const config: qs.IStringifyOptions = { ...this.stringifyOptions, ...options };
    return qs.stringify(obj, config);
  }

  public static getParsedQueryStringFromUrl(): IDictionary<any> {
    const qsValue = this.getFormattedQueryStringFromUrl();
    return qs.parse(qsValue, this.parseOptions);
  }

  public static getFormattedQueryStringFromUrl(): string {
    const queryString = Router.getFullPath().split('?');
    if (queryString.length > 1) {
      return queryString[1];
    }
    return '';
  }

  public static getPropertyAsArray(prop: string|string[]): string[] {
    return Array.isArray(prop) ? Array.from(prop) : (prop ? [prop] : []);
  }

  public static setQueryString(query: IDictionary<any>) {
    Router.push({ query, path: Router.getPath() });
  }

  public static replaceQueryString(query: IDictionary<any>) {
    Router.replace({ query, path: Router.getPath() });
  }
}
