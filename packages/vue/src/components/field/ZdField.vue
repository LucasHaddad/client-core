<template>
  <component
    v-if="field.isVisible"
    :name="field.name"
    :class="field.cssClass"
    :is="field.type"
    :component="field"
  ></component>
</template>

<script lang="ts">
import ZdFieldBase from './ZdFieldBase';
import { Component } from 'vue-property-decorator';

@Component
export default class ZdField extends ZdFieldBase {}
</script>
