import { zdInterface } from './types';
import { Container, inject, interfaces } from 'inversify';
import { buildProviderModule, fluentProvide, provide } from 'inversify-binding-decorators';
import getDecorators from 'inversify-inject-decorators';

const container = new Container();
const decorators = getDecorators(container, true);
const loadModule = (serviceId: zdInterface) => {
  if (!instanceExists(serviceId)) {
    container.load(buildProviderModule());
    /**
     * @todo watch issue (https://github.com/inversify/InversifyJS/issues/992)
     * to remove those string
     */
    Reflect.deleteMetadata('inversify-binding-decorators:provide', Reflect);
  }
};

export function zdInject(serviceId: zdInterface) {
  return inject(serviceId);
}

export function zdLazyInject(serviceId: zdInterface) {
  const lazyInject = decorators.lazyInject(serviceId);
  loadModule(serviceId);
  return lazyInject;
}

export function zdInjectable(serviceId: zdInterface, force?: boolean) {
  return provide(serviceId, force);
}

export function zdSingleton(serviceId: zdInterface) {
  return fluentProvide(serviceId).inSingletonScope().done();
}

export function bindInstance(serviceId: zdInterface): void {
  if (!instanceExists(serviceId)) {
    container.bind(serviceId).toSelf();
  }
}

export function resolveInstance(serviceId: interfaces.Newable<any>): zdInterface {
  return container.resolve(serviceId);
}

export function instanceExists(serviceId: zdInterface): boolean {
  return container.isBound(serviceId);
}
