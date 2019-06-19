import { IRoute } from './interfaces';
import { Logger } from '../utils/logger';
import { Config } from '../config';
import { IDictionary } from '../utils/interfaces';

/**
 * Class that encapsulate a router defined by user
 */
export class Router {

  private static instance: any;

  public static setInstance(instance: any) {
    this.instance = instance;
  }

  private static callInstanceMethod(method: string, args: any) {
    return (this.instance ? this.instance[method](...args) : Logger.warn(Config.mode, 'Router instance not defined'));
  }

  public static push(path: any, onComplete?: Function, onAbort?: any) {
    this.callInstanceMethod('push', [path, onComplete, onAbort]);
  }

  public static replace(path: any, onComplete?: Function, onAbort?: any): void {
    this.callInstanceMethod('replace', [path, onComplete, onAbort]);
  }

  public static back(): void {
    this.callInstanceMethod('back', []);
  }

  public static getCurrentRoute(): IRoute {
    return this.callInstanceMethod('getCurrentRoute', []);
  }

  public static getPath(): string {
    return this.callInstanceMethod('getPath', []);
  }

  public static getHash(): string {
    return this.callInstanceMethod('getHash', []);
  }

  public static getQuery(): IDictionary<string | (string | null)[]> {
    return this.callInstanceMethod('getQuery', []);
  }

  public static getParams(): IDictionary<string> {
    return this.callInstanceMethod('getParams', []);
  }

  public static getFullPath(): string {
    return this.callInstanceMethod('getFullPath', []);
  }

}
