<template>
  <component
    v-if="widget.isVisible"
    :name="widget.name"
    :class="widget.cssClass"
    :is="widget.type"
    :component="widget"
  >
  </component>
</template>

<script lang="ts">
import ZdWidgetBase from './ZdWidgetBase';
import { Component } from 'vue-property-decorator';

@Component
export default class ZdWidget extends ZdWidgetBase {}
</script>
