import Vue, { VNode, CreateElement } from 'vue';

Vue.component('ZdRender', {
  data() {
    return {
      renderFn: null,
    };
  },
  props: ['template', 'props'],
  created() {
    const compiledTemplate = Vue.compile((this as any).template || '');
    (this as any).renderFn = compiledTemplate.render;
    (this as any).$options.staticRenderFns = compiledTemplate.staticRenderFns;
  },
  render(createElement: CreateElement): VNode {
    return (this as any).renderFn(createElement);
  },
});
