import Home from '@/components/Home.vue';
import { IConfig } from '@zeedhi/core';
import { IComponentRef } from '@zeedhi/vue';

export const config: IConfig = {
  endPoint: <END_POINT>,
  homeUrl: <HOME_URL>,
  metadataEndPoint: <METADATA_END_POINT>,
  mode: 'development',
  staticAppMetadata: <STATIC_APP_METADATA>,
  title: <TITLE>,
};

export const components: IComponentRef = {
  Home: { component: Home },
};
