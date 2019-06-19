import Vue from 'vue';
import { Prop, Watch, Component } from 'vue-property-decorator';
import { Widget, EventBus } from '@zeedhi/core';

/**
 * Default Widget component
 */
@Component
export default class ZdWidgetBase extends Vue {

  @Prop({ default: () => ({}) }) public widget!: Widget;

  @Watch('$route', { immediate: false, deep: true })
  onRouterChange(current: any, old: any) {
    this.widget.onRouterChange(current, old);
  }

  beforeCreate() {
    EventBus.emit('WidgetOnBeforeCreate', ['onBeforeCreate']);
  }

  created() {
    this.widget.onCreated();
  }

  beforeMount() {
    this.widget.onBeforeMount();
  }

  mounted() {
    this.widget.onMounted();
  }

  beforeDestroy() {
    this.widget.onBeforeDestroy();
  }

  destroyed() {
    this.widget.onDestroyed();
  }
}
