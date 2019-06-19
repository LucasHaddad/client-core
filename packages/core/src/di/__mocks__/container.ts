/* tslint:disable */
import { interfaces } from 'inversify';
import { zdInterface } from '../types';

export function zdInject(serviceId: zdInterface) {
  return () => {};
}

export function zdLazyInject(serviceId: zdInterface) {
  return () => {};
}

export function zdInjectable(serviceId: zdInterface, force?: boolean) {
  return () => {};
}

export function zdSingleton(serviceId: zdInterface) {
  return () => { return {} as any };
}

export function bindInstance(serviceId: zdInterface): void {}

export function resolveInstance(serviceId: interfaces.Newable<any>): zdInterface {
  return {} as zdInterface;
}

export function instanceExists(serviceId: zdInterface): boolean {
  return true;
}
