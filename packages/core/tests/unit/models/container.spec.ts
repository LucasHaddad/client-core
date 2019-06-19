import { IContainer, Container, WidgetFactory, Widget, ComponentFactory } from "../../../src/models";
import { Hook } from "../../../src/utils";

jest.mock('./../../../src/utils/url');
jest.mock('./../../../src/metadata/metadata');

describe('Container', () => {
  let instance: Container;
  const container: IContainer = {
    name: 'container',
    controller: 'controller',
    showHeader: false,
    showMenu: false,
    showFooter: false,
    title: 'title',
    widgets: [{ name: 'child', type: 'any' }],
  };

  beforeEach(() => {
    instance = new Container(container);
  });

  describe('constructor()', () => {
    it('should override all properties', () => {
      expect(instance.name).toBe('container');
      expect(instance.controller).toBe('controller');
      expect(instance.showHeader).toBeFalsy();
      expect(instance.showMenu).toBeFalsy();
      expect(instance.showFooter).toBeFalsy();
      expect(instance.title).toBe('title');
      expect(instance.widgets.length).toBe(1);
    });

    it('should assign all default values', () => {
      const newContainer = { name: 'newContainer' };
      const newInstance = new Container(newContainer);
      expect(newInstance.name).toBe('newContainer');
      expect(newInstance.controller).toBe('');
      expect(newInstance.showHeader).toBeTruthy();
      expect(newInstance.showMenu).toBeTruthy();
      expect(newInstance.showFooter).toBeTruthy();
      expect(newInstance.title).toBe('');
      expect(newInstance.widgets.length).toBe(0);
    });
  });

  describe('createInstance()', () => {
    it('should create container instance', async () => {
      const container = await Container.createInstance('container', false, 'ZdContainer');
      expect(container.name).toBe('container');
    });

    it('should create container instance from a registered container', async () => {
      ComponentFactory.setComponentByType('ZdContainer', { component: '', class: Container });
      const container = await Container.createInstance('container', false, 'ZdContainer');
      expect(container.name).toBe('container');
    });
  });

  describe('handleHook()', () => {
    let container: Container;
    let spyContainerHookEmit: jest.SpyInstance<void, any[]>;
    let spyWidgetHookClear: jest.SpyInstance<void, any[]>;
    let spyContainerHookClear: jest.SpyInstance<void, any[]>;
    let spyContainerHookChange: jest.SpyInstance<void, any[]>;

    beforeEach(async () => {
      Hook.createWidgetHookEvents();
      Hook.createContainerHookEvents();
      container = await Container.createInstance('container', false, 'ZdContainer');
      container.widgets = WidgetFactory.factoryWidgets([{ name: 'widget', type: 'type' }], container);
      spyContainerHookChange = jest.spyOn(Hook.containerHooks.onChange, 'emit');
    });

    it('should call onCreated hook methods', async () => {
      spyContainerHookEmit = jest.spyOn(Hook.containerHooks.onCreated, 'emit');
      spyWidgetHookClear = jest.spyOn(Hook.widgetHooks.onCreated, 'clearCallbacks');
      spyContainerHookClear = jest.spyOn(Hook.containerHooks.onCreated, 'clearCallbacks');
      container.widgets[0].onCreated();
      expect(spyContainerHookEmit).toHaveBeenCalled();
      expect(spyWidgetHookClear).toHaveBeenCalled();
      expect(spyContainerHookClear).toHaveBeenCalled();
      expect(spyContainerHookChange).toHaveBeenCalledWith([container]);
    });

    it('should call onBeforeMount hook methods', async () => {
      spyContainerHookEmit = jest.spyOn(Hook.containerHooks.onBeforeMount, 'emit');
      spyWidgetHookClear = jest.spyOn(Hook.widgetHooks.onBeforeMount, 'clearCallbacks');
      spyContainerHookClear = jest.spyOn(Hook.containerHooks.onBeforeMount, 'clearCallbacks');
      container.widgets[0].onBeforeMount();
      expect(spyContainerHookEmit).toHaveBeenCalled();
      expect(spyWidgetHookClear).toHaveBeenCalled();
      expect(spyContainerHookClear).toHaveBeenCalled();
      expect(spyContainerHookChange).not.toHaveBeenCalled();
    });

    it('should call onMounted hook methods', async () => {
      spyContainerHookEmit = jest.spyOn(Hook.containerHooks.onMounted, 'emit');
      spyWidgetHookClear = jest.spyOn(Hook.widgetHooks.onMounted, 'clearCallbacks');
      spyContainerHookClear = jest.spyOn(Hook.containerHooks.onMounted, 'clearCallbacks');
      container.widgets[0].onMounted();
      expect(spyContainerHookEmit).toHaveBeenCalled();
      expect(spyWidgetHookClear).toHaveBeenCalled();
      expect(spyContainerHookClear).toHaveBeenCalled();
      expect(spyContainerHookChange).not.toHaveBeenCalled();
    });

    it('should call onBeforeDestroy hook methods', async () => {
      spyContainerHookEmit = jest.spyOn(Hook.containerHooks.onBeforeDestroy, 'emit');
      spyWidgetHookClear = jest.spyOn(Hook.widgetHooks.onBeforeDestroy, 'clearCallbacks');
      spyContainerHookClear = jest.spyOn(Hook.containerHooks.onBeforeDestroy, 'clearCallbacks');
      container.widgets[0].onBeforeDestroy();
      expect(spyContainerHookEmit).toHaveBeenCalled();
      expect(spyWidgetHookClear).toHaveBeenCalled();
      expect(spyContainerHookClear).toHaveBeenCalled();
      expect(spyContainerHookChange).not.toHaveBeenCalled();
    });

    it('should call onDestroyed hook methods', async () => {
      spyContainerHookEmit = jest.spyOn(Hook.containerHooks.onDestroyed, 'emit');
      spyWidgetHookClear = jest.spyOn(Hook.widgetHooks.onDestroyed, 'clearCallbacks');
      spyContainerHookClear = jest.spyOn(Hook.containerHooks.onDestroyed, 'clearCallbacks');
      container.widgets[0].onDestroyed();
      expect(spyContainerHookEmit).toHaveBeenCalled();
      expect(spyWidgetHookClear).toHaveBeenCalled();
      expect(spyContainerHookClear).toHaveBeenCalled();
      expect(spyContainerHookChange).not.toHaveBeenCalled();
    });

    afterEach(() => {
      spyContainerHookEmit.mockClear();
      spyWidgetHookClear.mockClear();
      spyContainerHookClear.mockClear();
      spyContainerHookChange.mockClear();
    });
  });

  describe('setWidgets()', () => {
    it('should replace widgets property', () => {
      expect(instance.widgets.length).toBe(1);
      instance.setWidgets([{ name: 'widget1', type: '' }, { name: 'widget2', type: '' }]);
      expect(instance.widgets.length).toBe(2);
    });

    it('should clear widgets property', () => {
      expect(instance.widgets.length).toBe(1);
      instance.setWidgets([]);
      expect(instance.widgets.length).toBe(0);
    });
  });

  describe('addWidget()', () => {
    it('should create widget instance and add to widgets property', () => {
      instance.addWidget({ name: 'widget', type: 'widget' });
      expect(instance.widgets.length).toBe(2);
    });

    it('should add previous created widget to widgets property', () => {
      const newWidget = new Widget({ name: 'newWidget', type: 'widget' });
      instance.addWidget(newWidget);
      expect(instance.widgets.length).toBe(2);
    });
  });

  describe('getWidget<T>()', () => {
    it('should return field instance', () => {
      const widget = instance.getWidget<Widget>('child');
      expect(widget.name).toBe('child');
    });

    it('should throw', () => {
      expect(() => {
        instance.getWidget<Widget>('otherWidget');
      }).toThrow();
    });
  });
});
