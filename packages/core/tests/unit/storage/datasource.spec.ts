import 'reflect-metadata';
import { IDictionary } from '../../../src/utils';
import { IDatasource, Datasource, DatasourceType } from '../../../src/storage';
import { IConfig, Config } from '../../../src/config';
import { Http } from '../../../src/http/http';
import { URL } from '../../../src/utils/url';
import { Router } from '../../../src/router/router';

jest.mock('./../../../src/http/http');

/**
 * URL tests, HTTP tests
 */
describe('Datasource', () => {
  let instance: Datasource;
  let datasource: IDatasource;
  let router: any;

  beforeEach(() => {
    router = {
      push: () => jest.fn,
      replace: (route: any) => { history.replaceState(null, '', location.pathname + '?' + URL.getFormattedQueryString(route.query)); },
      back: () => jest.fn,
      getCurrentRoute: () => ({ path: '', hash: '', query: {}, params: {}, fullPath: '' }),
      getPath: () => '',
      getHash: () => '',
      getQuery: () => ({}),
      getParams: () => ({}),
      getFullPath: () => '',
     };
    datasource = {
      route: '/datasource',
      rest: false,
      lazyLoad: false,
      watchUrl: true,
      filter: { name: '1' },
      data: [{ id: 1, name: '1' }],
      currentRow: { id: 1, name: '1' },
      type: DatasourceType.collection,
      order: ['id.desc'],
      search: 'zeedhi',
      searchIn: ['name', 'id'],
      limit: 15,
    };
    const config: IConfig = {
      endPoint: 'http://localhost:9000/',
      metadataEndPoint: 'http://localhost:9000/metadata/',
      staticAppMetadata: true,
      title: 'Samples',
      dateFormat: 'MM-DD-YYYY',
      displayFormat: 'MM/DD/YYYY',
      homeUrl: '/home',
      mode: 'test',
    };
    Config.set(config);
    Router.setInstance(router);
    instance = new Datasource(datasource, datasource.currentRow);
    Http.get = jest.fn(() => {
      return Promise.resolve({ data: { data: [
        { name: '1', id: 1 }, { name: '2', id: 2 }, { name: '3', id: 3 },
        { name: '4', id: 4 }, { name: '5', id: 5 }, { name: '6', id: 6 },
      ], pagination: {} }});
    });
  });

  describe('constuctor()', () => {
    it('should set default values', () => {
      const instance = new Datasource({});
      expect(instance.route).toBe('');
      expect(instance.rest).toBeTruthy()
      expect(instance.lazyLoad).toBeTruthy();
      expect(instance.watchUrl).toBeFalsy();
      expect(instance.filter).toEqual({});
      expect(instance.data).toEqual([]);
      expect(instance.currentRow).toEqual({});
      expect(instance.type).toBe(DatasourceType.collection);
      expect(instance.order).toEqual([]);
      expect(instance.search).toBe('');
      expect(instance.searchIn).toEqual([]);
      expect(instance.pagination.limit).toBe(10);
      expect(instance.pagination.page).toBe(1);
      expect(instance.pagination.total).toBe(0);
      expect(instance.lastPage).toBe(1);
      expect(instance.defaultLimit).toBe(10);
    });

    it('should assign all parameters from datasource JSON', () => {
      expect(instance.route).toBe('/datasource');
      expect(instance.rest).toBeFalsy()
      expect(instance.lazyLoad).toBeFalsy();
      expect(instance.watchUrl).toBeTruthy();
      expect(instance.filter).toEqual({ name: '1' });
      expect(instance.data.length).toBe(1);
      expect(instance.currentRow).toEqual({ id: 1, name: '1' });
      expect(instance.type).toBe(DatasourceType.collection);
      expect(instance.order).toEqual(['id.desc']);
      expect(instance.search).toBe('zeedhi');
      expect(instance.searchIn).toEqual(['name', 'id']);
      expect(instance.loading).toBeFalsy();
      expect(instance.pagination.limit).toBe(15);
      expect(instance.pagination.page).toBe(1);
      expect(instance.pagination.total).toBe(1);
      expect(instance.lastPage).toBe(1);
      expect(instance.defaultLimit).toBe(15);
    });

    it('should set values from URL', () => {
      datasource.watchUrl = true;
      router.getFullPath = () => 'localhost/?page=2&limit=50&order=name.asc&search=search&name=zeedhi';
      const instance = new Datasource(datasource, datasource.currentRow);
      expect(instance.filter).toEqual({ name: 'zeedhi' });
      expect(instance.order).toEqual(['name.asc']);
      expect(instance.search).toBe('search');
      expect(instance.loading).toBeFalsy();
      expect(instance.pagination.limit).toBe(50);
      expect(instance.pagination.page).toBe(2);
    });

    it('should assign filter from URL', () => {
      datasource.watchUrl = true;
      router.getFullPath = () => 'localhost/?id=zeedhi';
      const instance = new Datasource(datasource, datasource.currentRow);
      expect(instance.filter).toEqual({ name: '1', id: 'zeedhi' });
    });

    it('should preserve filter from url', () => {
      datasource.watchUrl = true;
      router.getFullPath = () => 'localhost/?id=zeedhi&filter=applied';
      const instance = new Datasource(datasource, datasource.currentRow);
      expect(instance.filter).toEqual({ id: 'zeedhi' });
    });

    it('should call get request without throw', () => {
      datasource.route = '/datasource';
      datasource.rest = true;
      datasource.search = '';
      expect(() => new Datasource(datasource, datasource.currentRow)).not.toThrow();
    });

    it('should call get request using reload', async (done) => {
      datasource.route = '/datasource';
      datasource.lazyLoad = true;
      datasource.rest = true;
      const instance = new Datasource(datasource, datasource.currentRow);
      await instance.reload();
      expect(instance.data.length).toEqual(6);
      done();
    });
  });

  describe('setSearch()', () => {
    it('should update search value', () => {
      instance.setSearch('new search');
      expect(instance.search).toBe('new search');
    });

    it('should clear search value', () => {
      instance.setSearch('');
      expect(instance.search).toBe('');
    });
  });

  describe('addFilter()', () => {
    it('should update filter position when is a valid value', () => {
      instance.addFilter('id', '123');
      expect(instance.filter).toEqual({ name: '1', id: '123' });
      expect(instance.pagination.page).toEqual(1);
    });

    it('should replace filter position when is a valid value', () => {
      instance.addFilter('name', '123');
      expect(instance.filter).toEqual({ name: '123' });
      expect(instance.pagination.page).toEqual(1);
    });

    it('should remove filter position when is a invalid value', () => {
      instance.addFilter('name', '');
      expect(instance.filter).toEqual({});
      expect(instance.pagination.page).toEqual(1);
    });

    it('should preserve reserved keys', () => {
      router.getFullPath = () => 'localhost/?id=zeedhi&filter=applied&order=name.desc';
      datasource.watchUrl = true;
      const instance = new Datasource(datasource, datasource.currentRow);
      instance.addFilter('name', 'zeedhi');
      expect(instance.filter).toEqual({ id: 'zeedhi', name: 'zeedhi' });
      expect(instance.order).toEqual(['name.desc']);
      expect(instance.pagination.page).toEqual(1);
    });
  });

  describe('removeFilter()', () => {
    it('should remove an existent filter', () => {
      instance.removeFilter('name');
      expect(instance.filter).toEqual({});
      expect(instance.pagination.page).toEqual(1);
    });

    it('should not remove a nonexistent filter', () => {
      instance.removeFilter('id');
      expect(instance.filter).toEqual({ name: '1' });
      expect(instance.pagination.page).toEqual(1);
    });
  });

  describe('setFilter()', () => {
    it('should replace filter when all filter options are valid', () => {
      const filter = { id: 1, name: '123' };
      instance.setFilter(filter);
      expect(instance.filter).toEqual(filter);
      expect(instance.pagination.page).toEqual(1);
    });

    it('should replace filter when at least one filter option is valid', () => {
      instance.setFilter({ id: 1, name: undefined });
      expect(instance.filter).toEqual({ id: 1 });
      expect(instance.pagination.page).toEqual(1);
    });

    it('should clear filter when all filter options are invalid', () => {
      instance.setFilter({ id: null, name: undefined });
      expect(instance.filter).toEqual({});
      expect(instance.pagination.page).toEqual(1);
    });
  });

  describe('clearFilter()', () => {
    it('should clear filter', () => {
      instance.clearFilter();
      expect(instance.filter).toEqual({});
      expect(instance.pagination.page).toEqual(1);
    });
  });

  describe('setLimit()', () => {
    it('should update limit value without replace url', () => {
      instance.setLimit(100);
      expect(instance.pagination.limit).toBe(100);
    });

    it('should update limit value with replace url', () => {
      instance.setLimit(100, true);
      expect(instance.pagination.limit).toBe(100);
    });
  });

  describe('setPage()', () => {
    it('should update page value without replace url', () => {
      instance.setPage(5);
      expect(instance.pagination.page).toBe(5);
    });

    it('should update page value with replace url', () => {
      instance.setPage(5, true);
      expect(instance.pagination.page).toBe(5);
    });
  });

  describe('addOrder()', () => {
    it('should update an existent order value to asc', () => {
      instance.addOrder('id', 'asc');
      expect(instance.order).toEqual(['id.asc']);
    });

    it('should update an nonexistent order value to asc', () => {
      instance.addOrder('name', 'asc');
      expect(instance.order).toEqual(['id.desc', 'name.asc']);
    });

    it('should update an existent order value to desc', () => {
      instance.addOrder('id', 'desc');
      expect(instance.order).toEqual(['id.desc']);
    });

    it('should update an nonexistent order value to asc', () => {
      instance.addOrder('name', 'desc');
      expect(instance.order).toEqual(['id.desc', 'name.desc']);
    });
  });

  describe('removeOrder()', () => {
    it('should remove an existent order', () => {
      instance.removeOrder('id');
      expect(instance.order).toEqual([]);
    });

    it('should not remove a nonexistent order', () => {
      instance.removeOrder('name');
      expect(instance.order).toEqual(['id.desc']);
    });
  });

  describe('setOrder()', () => {
    it('should replace order value', () => {
      const order: string[] = ['id.asc', 'name.desc'];
      instance.setOrder(order);
      expect(instance.order).toEqual(order);
    });
  });

  describe('clearOrder()', () => {
    it('should clear order', () => {
      instance.clearOrder();
      expect(instance.order).toEqual([]);
    });
  });

  describe('getOrderByColumn()', () => {
    it('should retrieve order as asc', () => {
      instance.addOrder('id', 'asc');
      expect(instance.getOrderByColumn('id')).toBe('asc');
    });

    it('should retrieve order as desc', () => {
      instance.addOrder('id', 'desc');
      expect(instance.getOrderByColumn('id')).toBe('desc');
    });

    it('should retrieve order as null', () => {
      instance.removeOrder('id');
      expect(instance.getOrderByColumn('id')).toBe(null);
    });
  });

  describe('post()', () => {
    it('should call http post method', () => {
      const spy = jest.spyOn(Http, 'post');
      instance.post([]);
      expect(spy).toHaveBeenCalled();
    });
  });

  describe('put()', () => {
    it('should call http put method', () => {
      const spy = jest.spyOn(Http, 'put');
      instance.put({});
      expect(spy).toHaveBeenCalled();
    });
  });

  describe('delete()', () => {
    it('should call http delete method', () => {
      const spy = jest.spyOn(Http, 'delete');
      instance.delete();
      expect(spy).toHaveBeenCalled();
    });
  });

  describe('reload()', () => {
    it('should call get method', async (done) => {
      const spy = jest.spyOn(instance, 'get');
      instance.rest = true;
      await instance.reload();
      expect(spy).toHaveBeenCalled();
      done();
    });
  });

  describe('get()', () => {
    it('should call get with search', async (done) => {
      instance.watchUrl = false;
      instance.setSearch('zeedhi');
      instance.searchIn = ['name'];
      instance.rest = true;
      await instance.get();
      expect(instance.search).toBe('zeedhi');
      expect(instance.data.length).toBe(6);
      done();
    });

    it('should call get with response with pagination', async (done) => {
      Http.get = jest.fn(() => {
        return Promise.resolve({ data: { data: [
          { name: '1', id: 1 }, { name: '5', id: 5 }, { name: '6', id: 6 },
        ], pagination: { total: 3, page: 1, limit: 10 } }});
      });
      instance.rest = true;
      await instance.get();
      expect(instance.data.length).toBe(3);
      expect(instance.pagination.total).toBe(3);
      expect(instance.pagination.limit).toBe(10);
      expect(instance.pagination.page).toBe(1);
      done();
    });

    it('should call get with response without pagination', async (done) => {
      Http.get = jest.fn(() => {
        return Promise.resolve({ data: { data: [
          { name: '1', id: 1 }, { name: '5', id: 5 }, { name: '6', id: 6 },
        ]}});
      });
      instance.rest = true;
      await instance.get();
      expect(instance.data.length).toBe(3);
      expect(instance.pagination.total).toBe(3);
      done();
    });

    it('should call get with response with empty page', async (done) => {
      Http.get = jest.fn(() => {
        return Promise.resolve({ data: { data: [], pagination: { page: 5, limit: 1, total: 4 } }});
      });
      instance.rest = true;
      instance.reload = () => Promise.resolve();
      await instance.get();
      expect(instance.data.length).toBe(0);
      expect(instance.pagination.total).toBe(4);
      done();
    });

    it('should throw', async (done) => {
      instance.rest = true;
      Http.get = () => { return Promise.reject('err') };
      try {
        await instance.get()
      } catch (e) {
        expect(e).toBeInstanceOf(Error);
        done();
      }
    });

    it('should call get for one row', async (done) => {
      instance.rest = true;
      instance.type = DatasourceType.row;
      Http.get = jest.fn(() => {
        return Promise.resolve({ data: { data: { id: 5, name: '5' }}});
      });
      await instance.get();
      expect(instance.currentRow).toEqual({ id: 5, name: '5' });
      done();
    });
  });
});
