import Vue from 'vue';
import Router from 'vue-router';
import { ZdContainer } from '@zeedhi-components/vuetify';

Vue.use(Router);

const router: Router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      name: 'home',
      path: '/',
      component: ZdContainer,
      props: {
        containerName: 'home',
        isLocal: true,
      },
    },
    {
      name: 'lazyView',
      path: '/zeedhi',
      component: () => import('./views/zeedhi.vue'),
    },
    {
      name: 'zeedhi',
      path: '/:name',
      component: ZdContainer,
      props: (route: any) => ({
        containerName: route.params.name,
        isLocal: true,
      }),
    },
  ],
});

export default router;
