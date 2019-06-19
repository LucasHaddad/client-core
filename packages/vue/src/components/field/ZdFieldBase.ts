import Vue from 'vue';
import get from 'lodash.get';
import { Input } from '@zeedhi/core';
import { Prop, Watch, Component } from 'vue-property-decorator';

/**
 * Default Field component
 */
@Component
export default class ZdFieldBase extends Vue {

  @Prop({ default: () => ({}) }) public field!: Input;

  @Watch('$store.state', { immediate: true, deep: true })
  onStateChange(state: any) {
    if (this.field.storePath) {
      this.field.value = get(state, this.field.storePath);
    }
  }

  @Watch('field.value', { immediate: true, deep: true })
  onFieldValueChange(value: any) {
    if (this.field.storePath && (this as any).$store) {
      (this as any).$store.commit('save', { value, path: this.field.storePath });
    }
  }
}
