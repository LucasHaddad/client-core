import { Router } from '../../../src/router/router';
import { Logger } from '../../../src/utils/logger';
import { Config, IConfig } from '../../../src/config';

describe('Router', () => {
  beforeEach(() => {
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
  })

  describe('Instance not defined', () => {
    const warning = 'Router instance not defined';

    beforeEach(() => {
      Router.setInstance(null);
    });

    describe('push', () => {
      it('Should log a warning', () => {
        const spy = jest.spyOn(Logger, 'warn');
        Router.push('location');
        expect(spy).toBeCalledWith(Config.mode, warning);
      });
    });

    describe('replace', () => {
      it('Should log a warning', () => {
        const spy = jest.spyOn(Logger, 'warn');
        Router.replace('location');
        expect(spy).toBeCalledWith(Config.mode, warning);
      });
    });

    describe('back', () => {
      it('Should log a warning', () => {
        const spy = jest.spyOn(Logger, 'warn');
        Router.back();
        expect(spy).toBeCalledWith(Config.mode, warning);
      });
    });

    describe('getCurrentRoute', () => {
      it('Should log a warning', () => {
        const spy = jest.spyOn(Logger, 'warn');
        Router.getCurrentRoute();
        expect(spy).toBeCalledWith(Config.mode, warning);
      });
    });

    describe('getPath', () => {
      it('Should log a warning', () => {
        const spy = jest.spyOn(Logger, 'warn');
        Router.getPath();
        expect(spy).toBeCalledWith(Config.mode, warning);
      });
    });

    describe('getHash', () => {
      it('Should log a warning', () => {
        const spy = jest.spyOn(Logger, 'warn');
        Router.getHash();
        expect(spy).toBeCalledWith(Config.mode, warning);
      });
    });

    describe('getQuery', () => {
      it('Should log a warning', () => {
        const spy = jest.spyOn(Logger, 'warn');
        Router.getQuery();
        expect(spy).toBeCalledWith(Config.mode, warning);
      });
    });

    describe('getParams', () => {
      it('Should log a warning', () => {
        const spy = jest.spyOn(Logger, 'warn');
        Router.getParams();
        expect(spy).toBeCalledWith(Config.mode, warning);
      });
    });

    describe('getFullPath', () => {
      it('Should log a warning', () => {
        const spy = jest.spyOn(Logger, 'warn');
        Router.getFullPath();
        expect(spy).toBeCalledWith(Config.mode, warning);
      });
    });
  });

  describe('Instance defined', () => {
    const instance = {
      push: (location: any, onComplete?: any, onAbort?: any) => {},
      replace: (location: any, onComplete?: any, onAbort?: any) => {},
      back: () => {},
      getCurrentRoute: () => 'currentRoute',
      getPath: () => 'path',
      getHash: () => 'hash',
      getQuery: () => 'query',
      getParams: () => 'params',
      getFullPath: () => 'fullPath',
    }
    beforeEach(() => {
      Router.setInstance(instance);
    });

    describe('push', () => {
      it('Should call instance push', () => {
        const spy = jest.spyOn(instance, 'push');
        Router.push('location');
        expect(spy).toBeCalledWith('location', undefined, undefined);
      });
    });

    describe('replace', () => {
      it('Should call instance replace', () => {
        const spy = jest.spyOn(instance, 'replace');
        Router.replace('location');
        expect(spy).toBeCalledWith('location', undefined, undefined);
      });
    });

    describe('back', () => {
      it('Should call instance back', () => {
        const spy = jest.spyOn(instance, 'back');
        Router.back();
        expect(spy).toBeCalled();
      });
    });

    describe('getCurrentRoute', () => {
      it('Should call instance getCurrentRoute', () => {
        expect(Router.getCurrentRoute()).toBe('currentRoute');
      });
    });

    describe('getPath', () => {
      it('Should call instance getPath', () => {
        expect(Router.getPath()).toBe('path');
      });
    });

    describe('getHash', () => {
      it('Should call instance getHash', () => {
        expect(Router.getHash()).toBe('hash');
      });
    });

    describe('getQuery', () => {
      it('Should call instance getQuery', () => {
        expect(Router.getQuery()).toBe('query');
      });
    });

    describe('getParams', () => {
      it('Should call instance getParams', () => {
        expect(Router.getParams()).toBe('params');
      });
    });

    describe('getFullPath', () => {
      it('Should call instance getFullPath', () => {
        expect(Router.getFullPath()).toBe('fullPath');
      });
    });
  });
});