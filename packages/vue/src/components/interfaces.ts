import { IComponent } from '@zeedhi/core';
import { VueConstructor } from 'vue';

export interface IComponentRef {
  [type: string]: {
    component: VueConstructor<any>;
    class?: IComponent;
  };
}
