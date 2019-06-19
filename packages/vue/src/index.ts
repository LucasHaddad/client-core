import Vue, { VueConstructor } from 'vue';
import { init, IConfig, IRouter } from '@zeedhi/core';
import { setRouterInstance } from './router/router';
import { registerComponents, ZdField, ZdWidget, IComponentRef } from './components';
import { VueRouter } from 'vue-router/types/router';

export * from './components';
export * from './router';
export * from './store';

export interface ZeedhiPlugin {
  install: (vue: VueConstructor, options: ZeedhiOptions) => void;
}

export interface ZeedhiOptions {
  config: IConfig;
  router?: VueRouter;
  components?: IComponentRef;
}

const defaultComponents: IComponentRef = {
  ZdField: { component: ZdField },
  ZdWidget: { component: ZdWidget },
};

function setComponents(components: IComponentRef = {}, vue: VueConstructor) {
  registerComponents({ ...defaultComponents, ...components }, vue);
}

function setRouter(router?: VueRouter|IRouter) {
  if (router) {
    setRouterInstance(router);
  }
}

//tslint:disable
const Zeedhi: ZeedhiPlugin = {
  install (vue: VueConstructor<Vue>, options: ZeedhiOptions): void {
    setComponents(options.components, vue);
    setRouter(options.router);
    init(options.config);
  },
};

export default Zeedhi;
