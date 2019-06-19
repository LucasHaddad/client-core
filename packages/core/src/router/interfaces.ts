import { IDictionary } from '../utils/interfaces';

export interface IRoute {
  path: string;
  hash: string;
  query: IDictionary<string | (string | null)[]>;
  params: IDictionary<string>;
  fullPath: string;
}

export interface IRouter {
  push(path: any, onComplete?: Function, onAbort?: any): void;
  replace(path: any, onComplete?: Function, onAbort?: any): void;
  back(): void;
  getCurrentRoute(): IRoute;
  getPath(): string;
  getHash(): string;
  getQuery(): IDictionary<string | (string | null)[]>;
  getParams(): IDictionary<string>;
  getFullPath(): string;
}

export interface IZdRouteProps {
  containerName?: string;
  isLocal?: boolean;
  [key: string]: any;
}
