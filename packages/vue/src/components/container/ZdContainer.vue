<template>
  <div class="zd-container">
    <zd-widget v-for="(widget, index) in container.widgets"
      :key="index"
      :widget="widget">
    </zd-widget>
  </div>
</template>

<script lang="ts">
import { Component} from 'vue-property-decorator';
import ZdContainerBase from './ZdContainerBase';

@Component
export default class ZdContainer extends ZdContainerBase {}
</script>

<style lang="scss">
.zd-container {

  > div {
    margin-bottom: 24px;
  }

  > div:last-child {
    margin-bottom: 0px;
  }
}
</style>
