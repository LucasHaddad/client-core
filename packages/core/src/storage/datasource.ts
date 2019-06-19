import { Http } from '../http';
import { IZdDatasource, IDatasourceQueryString, IDatasource, DatasourceType } from './interfaces';
import { IDictionary } from '../utils/interfaces';
import { URL } from '../utils/url';
import { Config } from '../config';
import qs from 'qs';

/**
 * Performs CRUD actions for a specific route
 */
export class Datasource implements IZdDatasource {

  /**
   * Defines the datasource route
   */
  public route: string = '';

  /**
   * Determines if datasource is rest or local
   */
  public rest: boolean = true;

  /**
   * Defines the moment that datasource should be loaded
   */
  public lazyLoad: boolean = true;

  /**
   * Defines if the datasource should watch URL changes for updates
   */
  public watchUrl: boolean = false;

  /**
   * Datasource collection
   */
  public data: IDictionary<any>[] = [];

  /**
   * Datasource current row
   */
  public currentRow: IDictionary<any> = {};

  /**
   * Defines if the HTTP request is pending
   */
  public loading: boolean = false;

  /**
   * Defines datasource type
   */
  public type: DatasourceType = DatasourceType.collection;

  /**
   * Datasource last page
   */
  public lastPage: number = 1;

  /**
   * Defines datasource pagination with defaults
   */
  public pagination = {
    total: 0,
    limit: Config.datasourceLimit || 10,
    page: 1,
  };

  /**
   * Preserves configured limit
   */
  public defaultLimit!: number;

  /**
   * Defines the columns that datasource should search
   */
  public searchIn: string[] = [];

  /**
   * Defines CRUD first page
   * @private
   */
  private firstPage: number = 1;

  /**
   * Defines search property
   * @private
   */
  private datasourceSearch: string = '';

  /**
   * Defines datasource order for each request
   * @private
   */
  private datasourceOrder: string[] = [];

  /**
   * Defines datasource filter for each request
   * @private
   */
  private datasourceFilter: IDictionary<string|number|any[]> = {};

  /**
   * Url keys
   * @private
   */
  private reservedKeys: IDictionary<boolean> = {
    page: true,
    limit: true,
    order: true,
    in: true,
    search: true,
    search_in: true,
    filter: true,
  };

  /**
   * Filter applied flag
   */
  private filterApplied: boolean = true;

  /**
   * Create a Datasource
   * @param datasource Datasource structure
   * @param currentRow Current row
   */
  constructor(datasource: IDatasource, currentRow?: IDictionary<any>) {
    this.route = datasource.route || this.route;
    this.rest = datasource.rest !== false;
    this.lazyLoad = datasource.lazyLoad !== false;
    this.watchUrl = datasource.watchUrl === true;
    this.data = datasource.data || this.data;
    this.currentRow = currentRow || this.currentRow;
    this.type = datasource.type || this.type;
    this.searchIn = datasource.searchIn || this.searchIn;
    this.defaultLimit = this.pagination.limit = datasource.limit || this.pagination.limit;
    this.pagination.total = this.data.length;
    this.updateRequestProperties(datasource);
    this.run();
  }

  /**
   * Current datasource filter
   */
  get filter(): IDictionary<string|number|any[]> {
    return this.datasourceFilter;
  }

  /**
   * Current datasource order
   */
  get order(): string[] {
    return this.datasourceOrder;
  }

  /**
   * Current datasource search
   */
  get search(): string {
    return this.datasourceSearch;
  }

  /**
   * Updates all properties affected by URL
   * @param datasource Datasource structure
   * @private
   */
  private updateRequestProperties(datasource: IDatasource) {
    const query = URL.getParsedQueryStringFromUrl();
    this.datasourceOrder = this.getOrderFromUrl(query.order, datasource.order);
    this.filterApplied = this.watchUrl && !!query.filter;
    this.datasourceFilter = this.getFilterDefaultFilter(datasource, query);
    this.datasourceSearch = this.watchUrl && query.search || datasource.search || '';
    this.pagination.page = this.watchUrl && +query.page || datasource.page || this.firstPage;
    this.pagination.limit = this.watchUrl && +query.limit || datasource.limit || this.defaultLimit;
  }

  /**
   * Retrieves order from url or user order
   * @param order Query string order value
   * @param localOrder User datasource order value
   */
  private getOrderFromUrl(order: string|string[], localOrder?: string[]) {
    return this.watchUrl && order && (Array.isArray(order) ? order : [order])
      || localOrder
      || [];
  }

  /**
   * Retrieves default filter
   * @param datasource Datasource structure
   * @param queryString Query string values
   * @returns Default filter
   */
  private getFilterDefaultFilter(datasource: IDatasource, queryString: IDictionary<any>): IDictionary<any> {
    const urlFilter = this.watchUrl ? this.getFilterFromUrl(queryString) : {};
    if (queryString.filter) {
      return urlFilter;
    }
    return { ...(datasource.filter || {}), ...urlFilter };
  }

  /**
   * Retrives filter from url, ignoring reserved keys
   * @param queryString Query string values
   * @returns Filter from url
   */
  private getFilterFromUrl(queryString: IDictionary<any>) {
    const filter: IDictionary<any> = {};
    Object.keys(queryString).forEach((key: string) => {
      if (!this.reservedKeys[key]) {
        filter[key] = queryString[key];
      }
    });
    return filter;
  }

  /**
   * Starts datasource
   * @private
   */
  private async run() {
    if (this.watchUrl && this.queryStringHasChanged()) {
      URL.replaceQueryString(this.queryStringFromDatasource());
    }
    // @todo create local data on localStorage
    if (this.rest && this.route && !this.lazyLoad) {
      return this.get();
    }
  }

  /**
   * Checks if the query string has changed
   */
  public queryStringHasChanged(): boolean {
    return this.watchUrl &&
      this.getCurrentQueryWithDefaults() !== this.getDatasourceAsQueryString();
  }

  /**
   * Retrieve a query string from datasource values
   * @private
   */
  private getDatasourceAsQueryString() {
    return URL.getFormattedQueryString(this.queryStringFromDatasource());
  }

  /**
   * Retrieves an object with all properties that affect the url
   * @private
   */
  private queryStringFromDatasource(): IDictionary<any> {
    return {
      ...{
        page: this.pagination.page.toString(),
        limit: this.pagination.limit.toString(),
        order: this.order,
        search: this.search ? this.search : undefined,
        filter: this.filterApplied ? 'applied' : undefined,
      },
      ...this.filter,
    };
  }

  /**
   * Retrieves current query string with datasource defaults
   * @private
   */
  private getCurrentQueryWithDefaults() {
    const currentQuery = URL.getParsedQueryStringFromUrl();
    return URL.getFormattedQueryString({
      ...{
        page: currentQuery.page || this.firstPage.toString(),
        limit: currentQuery.limit || this.defaultLimit.toString(),
        order: currentQuery.order || [],
        search: currentQuery.search || undefined,
        filter: currentQuery.filter || undefined,
      },
      ...this.getFilterFromUrl(currentQuery),
    });
  }

  /**
   * Calls http get request based on datasource type with datasource params
   * @return http response
   * @throws Will throws if request fail
   */
  public async get(): Promise<any> {
    this.loading = true;
    const isRow = this.type === DatasourceType.row;
    const params = isRow ? {} : this.getRequestParams();
    try {
      return await this.getResponse(isRow, params);
    } catch (error) {
      this.requestFail(error);
    }
  }

  /**
   * Retrieves request params
   * @private
   */
  private getRequestParams(): IDatasourceQueryString {
    if (this.watchUrl) {
      this.updateRequestProperties({});
    }
    return {
      ...{
        page: this.pagination.page,
        limit: this.pagination.limit,
        order: this.order,
        search: this.search || undefined,
        search_in: this.search ? this.searchIn : [],
      },
      ...this.filter,
      ...{ in: Object.keys(this.filter) },
    };
  }

  /**
   * Retrieves http response based on datasorce type
   * @param isRow Datasource type
   * @param params Datasource params
   * @private
   */
  private async getResponse(isRow: boolean, params: IDictionary<any>) {
    const response = (await this.find(params)).data;
    this.loading = false;
    if (isRow) {
      return await this.updateAndRetrieveRow(response);
    }
    return await this.updateAndRetrieveCollection(response);
  }

  /**
   * Calls http request and retrieves http response
   * @param params Datasource params
   * @private
   */
  private find(params?: IDictionary<string>) {
    return Http.get(this.route, {
      params,
      paramsSerializer: (params: any) => {
        return qs.stringify(params, { arrayFormat: 'repeat' });
      },
    });
  }

  /**
   * Updates and retrieves datasource current row
   * @param response Http response
   * @private
   */
  private updateAndRetrieveRow(response: { data: IDictionary<any> }) {
    this.currentRow = response.data;
    return this.currentRow;
  }

  /**
   * Updates and retrieves datasource data collection
   * @param response Http response
   * @private
   */
  private async updateAndRetrieveCollection(response: { data: IDictionary<any>[], pagination: IDictionary<any>}) {
    this.data = response.data;
    if (response.pagination) {
      this.pagination = { ...this.pagination, ...response.pagination };
    } else {
      this.pagination.total = response.data.length;
    }
    this.lastPage = Math.ceil(this.pagination.total / this.pagination.limit);
    if (this.lastPage && this.lastPage < this.pagination.page) {
      this.setPage(this.lastPage, true);
      return await this.reload();
    }
    return response;
  }

  /**
   * Throws http request error
   * @param error Http error
   * @private
   */
  private requestFail(error: any) {
    this.loading = false;
    throw new Error(error);
  }

  /**
   * Calls http post request to an specific route
   * @param rows Rows to save
   * @param route Route to request
   */
  public post(rows: IDictionary<any>, route?: string): Promise<any> {
    return Http.post(route || this.route, rows);
  }

  /**
   * Calls http put request to an specific route
   * @param row Row to save
   * @param route Route to request
   */
  public put(row: IDictionary<any>, route?: string): Promise<any> {
    return Http.put(route || this.route, row);
  }

  /**
   * Calls http delete request to and specific route
   * @param route Route to request
   */
  public delete(route?: string): Promise<any> {
    return Http.delete(route || this.route);
  }

  /**
   * Reloads datasource data
   */
  public async reload() {
    return await this.get();
  }

  /**
   * Updates search value
   * @param search Search value
   */
  public setSearch(search: string) {
    this.datasourceSearch = search;
    if (this.watchUrl) {
      if (search) {
        URL.updateQueryString({ search });
      } else {
        const query = URL.getParsedQueryStringFromUrl();
        delete query.search;
        URL.setQueryString(query);
      }
    }
  }

  /**
   * Adds a new filter position or replace if exists
   * @param column Filter column name
   * @param value Filter value
   */
  public addFilter(column: string, value: any) {
    if (this.isValidFilterValue(value)) {
      this.filter[column] = value;
      this.updateFilter();
    } else {
      this.removeFilter(column);
    }
  }

  /**
   * Removes a filter position
   * @param column Filter column name
   */
  public removeFilter(column: string) {
    delete this.datasourceFilter[column];
    this.updateFilter();
  }

  /**
   * Sets new filter value
   * @param filter Filter value
   */
  public setFilter(filter: IDictionary<any>) {
    this.datasourceFilter = {};
    Object.keys(filter).forEach((column: string) => {
      if (this.isValidFilterValue(filter[column])) {
        this.datasourceFilter[column] = filter[column];
      } else {
        delete this.datasourceFilter[column];
      }
    });
    this.updateFilter();
  }

  /**
   * Clears filter value
   */
  public clearFilter() {
    this.datasourceFilter = {};
    this.updateFilter();
  }

  /**
   * Resets page value and updates url
   * @private
   */
  private updateFilter() {
    this.pagination.page = this.firstPage;
    if (this.watchUrl) {
      this.filterApplied = true;
      const query = URL.getParsedQueryStringFromUrl();
      const resevedValues: IDictionary<any> = {};
      for (const key in query) {
        if (this.reservedKeys[key]) {
          resevedValues[key] = query[key];
          delete query[key];
        }
      }
      resevedValues.page = this.firstPage;
      URL.setQueryString({ ...resevedValues, ...this.filter, ...{ filter: 'applied' } });
    }
  }

  /**
   * Retrieves filter value is valid
   * @param value Filter value
   * @private
   */
  private isValidFilterValue(value: string|number|any[]) {
    return value !== '' && typeof value !== 'undefined' && value !== null;
  }

  /**
   * Updates datasource limit
   * @param limit Limit value
   * @param replaceUrl Should replace or push url
   */
  public setLimit(limit: number, replaceUrl: boolean = false) {
    this.pagination.limit = limit;
    if (this.watchUrl) {
      URL.updateQueryString({ limit }, replaceUrl);
    }
  }

  /**
   * Updates datasource page
   * @param page Page value
   * @param replaceUrl Should replace or push url
   */
  public setPage(page: number, replaceUrl: boolean = false) {
    this.pagination.page = page;
    if (this.watchUrl) {
      URL.updateQueryString({ page }, replaceUrl);
    }
  }

  /**
   * Adds or updates an order for specific column
   * @param column Order column name
   * @param value Order value
   */
  public addOrder(column: string, value: string) {
    const parsedValue = `${column}.${value}`;
    const index: number = this.findOrderIndex(column);
    if (index !== -1) {
      this.order[index] = parsedValue;
    } else {
      this.order.push(parsedValue);
    }
    this.updateOrderQueryString();
  }

  /**
   * Removes an order for specific column
   * @param column Order column name
   */
  public removeOrder(column: string) {
    const index: number = this.findOrderIndex(column);
    if (index !== -1) {
      this.order.splice(index, 1);
      this.updateOrderQueryString();
    }
  }

  /**
   * Sets new order value
   * @param order Order values
   */
  public setOrder(order: string[]) {
    this.datasourceOrder = order;
    this.updateOrderQueryString();
  }

  /**
   * Clears order value
   */
  public clearOrder() {
    this.datasourceOrder = [];
    this.updateOrderQueryString();
  }

  /**
   * Retrieve the current sort for a column
   * @param column Column name
   */
  public getOrderByColumn(column: string) {
    const index: number = this.findOrderIndex(column);
    if (index !== -1) {
      return this.order[index].split('.')[1];
    }
    return null;
  }

  /**
   * Retrieves column index of order collection
   * @param column Columns name
   * @private
   */
  private findOrderIndex(column: string): number {
    return this.order.findIndex((order: string) => {
      return order.split('.')[0] === column;
    });
  }

  /**
   * Updates order on query string
   * @private
   */
  private updateOrderQueryString() {
    if (this.watchUrl) {
      URL.updateQueryString({ order: this.order });
    }
  }
}
