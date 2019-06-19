import VueRouter from 'vue-router';
import { Router, IRouter } from '@zeedhi/core';
import { ErrorHandler, RawLocation } from 'vue-router/types/router';

const vueRouterAttrs = ['push', 'replace', 'back', 'currentRoute'];

export function setRouterInstance(instance: IRouter|VueRouter) {
  Router.setInstance(isVueRouter(instance) ? getZdRouter(instance) : instance);
}

function isVueRouter(instance: IRouter|VueRouter): instance is VueRouter {
  return vueRouterAttrs.some((attr) => {
    return attr in instance;
  });
}

function getZdRouter(instance: VueRouter): IRouter {
  return {
    push: (location: RawLocation, onComplete?: Function, onAbort?: ErrorHandler) => {
      instance.push(location, onComplete, onAbort);
    },
    replace: (location: RawLocation, onComplete?: Function, onAbort?: ErrorHandler) => {
      instance.replace(location, onComplete, onAbort);
    },
    back: () => instance.back(),
    getCurrentRoute: () => instance.currentRoute,
    getPath: () => instance.currentRoute.path,
    getHash: () => instance.currentRoute.hash,
    getQuery: () => instance.currentRoute.query,
    getParams: () => instance.currentRoute.params,
    getFullPath: () => instance.currentRoute.fullPath,
  };
}
