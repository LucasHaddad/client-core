import Vue from 'vue';
import { IContainer, Container } from '@zeedhi/core';
import { Component, Prop } from 'vue-property-decorator';

/**
 * Default Container component
 */
@Component
export default class ZdContainerBase extends Vue {

  @Prop() containerName!: string;
  @Prop({ default: false }) isLocal!: boolean;
  @Prop({ default: () => ({}) }) componentObj!: IContainer;
  @Prop({ default: 'ZdContainer' }) type!: string;

  public container: Container = new Container({ name: 'zdContainer' });

  public async mounted() {
    this.container = await Container.createInstance(this.containerName, this.isLocal, this.type);
  }
}
