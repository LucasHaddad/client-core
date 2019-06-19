import { IDictionary } from '../utils/interfaces';

export interface IStore {
  getValue(path: string): any;
  setValue(path: string, value: any): void;
}

export enum DatasourceType {
  collection = 'collection',
  row = 'row',
}

/**
 * JSON interface from datasource object
 */
export interface IDatasource {
  route?: string;
  rest?: boolean;
  lazyLoad?: boolean;
  watchUrl?: boolean;
  data?: IDictionary<any>[];
  currentRow?: IDictionary<any>;
  type?: DatasourceType;
  limit?: number;
  order?: string[];
  search?: string;
  searchIn?: string[];
  filter?: IDictionary<any>;
  [key: string]: any;
}

/**
 * Interface for Datasource Class
 * @private
 */
export interface IZdDatasource {
  route: string;
  rest: boolean;
  lazyLoad: boolean;
  watchUrl: boolean;
  readonly filter: IDictionary<any>;
  data: IDictionary<any>[];
  currentRow: IDictionary<any>;
  loading: boolean;
  type: DatasourceType;
  readonly order: string[];
  lastPage: number;
  readonly search: string;
  searchIn: string[];
  pagination: {
    limit: number;
    page: number;
    total: number;
  };
  defaultLimit: number;
}

/**
 * Interface for Datasource query string
 * @private
 */
export interface IDatasourceQueryString {
  page: number;
  limit: number;
  in?: string[];
  order?: string[];
  search?: string;
  search_in?: string[];
  filter?: string;
  [key: string]: any;
}
