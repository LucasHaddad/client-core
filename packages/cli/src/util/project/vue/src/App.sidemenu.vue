<template>
  <zd-main id="app" :componentObj="zdMain"/>
</template>

<script lang="ts">
import Vue from 'vue';
import { Component } from 'vue-property-decorator';
import { IMain } from '@zeedhi-components/vuetify';

/**
 * App.vue
 */
@Component
export default class App extends Vue {

  public zdMain: IMain = {
    name: <NAME>,
    type: 'ZdMain',
    header: {
      name: 'header',
      type: 'ZdHeader',
      leftSlot: [
        {
          name: 'menuButton',
          type: 'ZdMenuButton',
        },
        {
          name: 'headerImage',
          type: 'ZdImage',
          src: '/img/logo.svg',
        },
      ],
    },
    menu: {
      name: 'menu',
      type: 'ZdMenu',
      mini: false,
      isLocal: true,
      itemsUrl: 'menu',
    },
  };
}
</script>
