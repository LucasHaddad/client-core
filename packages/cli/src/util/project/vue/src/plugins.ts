import Vue from 'vue';
import Vuetify from 'vuetify';
import ZeedhiComponents, { MDI_ICONS } from '@zeedhi-components/vuetify';
import Zeedhi from '@zeedhi/vue';
import router from './router';
import { components, config } from './zeedhi';
import 'vuetify/dist/vuetify.min.css';
import '@mdi/font/css/materialdesignicons.min.css';
import '@zeedhi-components/vuetify/dist/default.css';

Vue.use(Vuetify, {
  iconfont: 'mdi',
  icons: MDI_ICONS,
  options: {
    customProperties: true,
  },
});

Vue.use(ZeedhiComponents);

Vue.use(Zeedhi, {
  config,
  router,
  components,
});
