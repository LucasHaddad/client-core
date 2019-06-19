import { VueConstructor } from 'vue';
import { ComponentFactory } from '@zeedhi/core';
import { IComponentRef } from './interfaces';

export function registerComponents(components: IComponentRef, vue: VueConstructor): void {
  Object.keys(components).forEach((type) => {
    if (!ComponentFactory.getComponentByType(type)) {
      vue.component(type, components[type].component);
      ComponentFactory.setComponentByType(type, {
        component: components[type].component,
        class: components[type].class ,
      });
    }
  });
}
