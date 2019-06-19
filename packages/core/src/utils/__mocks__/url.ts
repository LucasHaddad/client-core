/* tslint:disable */
import qs from 'qs';
import { IDictionary } from '../../utils';

export class URL {

  public static updateQueryString(value: IDictionary<any>, replace: boolean = false) {}

  private static getParsedQueryString(value: string, options?: qs.IParseOptions): IDictionary<any> {
    return {};
  }

  public static getFormattedQueryString(obj: IDictionary<any>, options?: qs.IStringifyOptions): string {
    return '';
  }

  public static getParsedQueryStringFromUrl(): IDictionary<any> {
    return {}
  }

  public static getFormattedQueryStringFromUrl(): string {
    return '';
  }

  public static getPropertyAsArray(prop: string|string[]): string[] {
    return Array.isArray(prop) ? Array.from(prop) : (prop ? [prop] : []);
  }

  public static setQueryString(query: IDictionary<any>) {}

  public static replaceQueryString(query: IDictionary<any>) {}
}
