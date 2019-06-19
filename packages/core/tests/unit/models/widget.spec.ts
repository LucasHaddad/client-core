import { Container, Widget, IWidget, Field, WidgetFactory, ComponentFactory } from '../../../src/models';
import { EventBus } from '../../../src/event';

jest.mock('./../../../src/utils/url');

describe('Widget', () => {
  let instance: Widget;
  const parent = new Container({ name: 'parent' });
  const widget: IWidget = {
    name: 'widget',
    type: 'anyType',
    isVisible: false,
    showAsCard: false,
    fields: [{ name: 'field', type: 'field' }],
    widgets: [{ name: 'child', type: 'any' }],
    datasource: { route: 'route' },
  };

  beforeEach(() => {
    instance = new Widget(widget, parent);
  });

  describe('constructor()', () => {
    it('should override all properties', () => {
      expect(instance.type).toBe('anyType');
      expect(instance.isVisible).toBeFalsy();
      expect(instance.showAsCard).toBeFalsy();
      expect(instance.fields.length).toBe(1);
      expect(instance.widgets.length).toBe(1);
      expect(instance.parent).toEqual(parent);
    });

    it('should assign all default values', () => {
      const newWidget = { name: 'widget', type: 'anyType' };
      const newInstance = new Widget(newWidget, parent);
      expect(newInstance.type).toBe('anyType');
      expect(newInstance.isVisible).toBeTruthy();
      expect(newInstance.showAsCard).toBeTruthy();
      expect(newInstance.fields.length).toBe(0);
      expect(newInstance.widgets.length).toBe(0);
      expect(newInstance.parent).toEqual(parent);
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

  describe('setFields()', () => {
    it('should replace fields property', () => {
      expect(instance.fields.length).toBe(1);
      instance.setFields([{ name: 'field1', type: '' }, { name: 'field2', type: '' }]);
      expect(instance.fields.length).toBe(2);
    });

    it('should clear fields property', () => {
      expect(instance.fields.length).toBe(1);
      instance.setFields([]);
      expect(instance.fields.length).toBe(0);
    });
  });

  describe('addField()', () => {
    it('should create field instance and add to fields property', () => {
      instance.addField({ name: 'newField', type: 'field' });
      expect(instance.fields.length).toBe(2);
    });

    it('should add previous created field to fields property', () => {
      const newField = new Field({ name: 'newField', type: 'field' });
      instance.addField(newField);
      expect(instance.fields.length).toBe(2);
      expect(newField.parent.name).toBe(instance.name);
    });
  });

  describe('getField<T>()', () => {
    it('should return field instance', () => {
      const field = instance.getField<Field>('field');
      expect(field.name).toBe('field');
    });

    it('should throw', () => {
      expect(() => {
        instance.getField<Field>('otherField');
      }).toThrow();
    });
  });

  describe('onRouterChange()', () => {
    it('should not call url changed event', () => {
      const spy = jest.spyOn(instance.datasource, 'get');
      instance.onRouterChange({}, {});
      expect(spy).not.toHaveBeenCalled();
      spy.mockClear();
    });

    it('should call url changed event without call datasource get', () => {
      instance.events.urlChanged = jest.fn;
      const spy = jest.spyOn(instance.datasource, 'get');
      const spyEvent = jest.spyOn(instance.events as any, 'urlChanged');
      instance.onRouterChange({ fullPath: '1' }, { fullPath: '2' });
      expect(spyEvent).toHaveBeenCalled();
      expect(spy).not.toHaveBeenCalled();
      spy.mockClear();
      spyEvent.mockClear();
    });

    it('should call url changed event and call datasource get', () => {
      instance.events.urlChanged = jest.fn;
      instance.datasource.watchUrl = true;
      instance.datasource.queryStringHasChanged = () => true;
      const spy = jest.spyOn(instance.datasource, 'get');
      const spyEvent = jest.spyOn(instance.events as any, 'urlChanged');
      instance.onRouterChange({ fullPath: '1' }, { fullPath: '2' });
      expect(spyEvent).toHaveBeenCalled();
      expect(spy).toHaveBeenCalled();
      spy.mockClear();
      spyEvent.mockClear();
    });
  });

  describe('onCreated()', () => {
    it('should not call onCreated event and EventBus emit', () => {
      const spy = jest.spyOn(EventBus, 'emit');
      instance.parent = new Widget({ name: 'parent', type: '' }, parent);
      instance.onCreated();
      expect(instance.events.onCreated).toBeUndefined();
      expect(spy).not.toHaveBeenCalled();
      spy.mockClear();
    });

    it('should not call onCreated event and call EventBus emit', () => {
      const spy = jest.spyOn(EventBus, 'emit');
      instance.onCreated();
      expect(instance.events.onCreated).toBeUndefined();
      expect(spy).toHaveBeenCalledWith('WidgetOnCreated', ['onCreated']);
      spy.mockClear();
    });

    it('should call onCreated event and call EventBus emit', () => {
      instance.events.onCreated = jest.fn;
      const spy = jest.spyOn(EventBus, 'emit');
      const spyEvent = jest.spyOn(instance.events as any, 'onCreated');
      instance.onCreated();
      expect(spy).toHaveBeenCalledWith('WidgetOnCreated', ['onCreated']);
      expect(spyEvent).toHaveBeenCalled();
      spy.mockClear();
      spyEvent.mockClear();
    });

    it('should call onCreated event and not call EventBus emit', () => {
      instance.events.onCreated = jest.fn;
      instance.parent = new Widget({ name: 'parent', type: '' }, parent);
      const spy = jest.spyOn(EventBus, 'emit');
      const spyEvent = jest.spyOn(instance.events as any, 'onCreated');
      instance.onCreated();
      expect(spy).not.toHaveBeenCalled();
      expect(spyEvent).toHaveBeenCalled();
      spy.mockClear();
      spyEvent.mockClear();
    });
  });

  describe('onBeforeMount()', () => {
    it('should not call onBeforeMount event and EventBus emit', () => {
      const spy = jest.spyOn(EventBus, 'emit');
      instance.parent = new Widget({ name: 'parent', type: '' }, parent);
      instance.onBeforeMount();
      expect(instance.events.onBeforeMount).toBeUndefined();
      expect(spy).not.toHaveBeenCalled();
      spy.mockClear();
    });

    it('should not call onBeforeMount event and call EventBus emit', () => {
      const spy = jest.spyOn(EventBus, 'emit');
      instance.onBeforeMount();
      expect(instance.events.onBeforeMount).toBeUndefined();
      expect(spy).toHaveBeenCalledWith('WidgetOnBeforeMount', ['onBeforeMount']);
      spy.mockClear();
    });

    it('should call onBeforeMount event and call EventBus emit', () => {
      instance.events.onBeforeMount = jest.fn;
      const spy = jest.spyOn(EventBus, 'emit');
      const spyEvent = jest.spyOn(instance.events as any, 'onBeforeMount');
      instance.onBeforeMount();
      expect(spy).toHaveBeenCalledWith('WidgetOnBeforeMount', ['onBeforeMount']);
      expect(spyEvent).toHaveBeenCalled();
      spy.mockClear();
      spyEvent.mockClear();
    });

    it('should call onBeforeMount event and not call EventBus emit', () => {
      instance.events.onBeforeMount = jest.fn;
      instance.parent = new Widget({ name: 'parent', type: '' }, parent);
      const spy = jest.spyOn(EventBus, 'emit');
      const spyEvent = jest.spyOn(instance.events as any, 'onBeforeMount');
      instance.onBeforeMount();
      expect(spy).not.toHaveBeenCalled();
      expect(spyEvent).toHaveBeenCalled();
      spy.mockClear();
      spyEvent.mockClear();
    });
  });

  describe('onMounted()', () => {
    it('should not call onMounted event and EventBus emit', () => {
      const spy = jest.spyOn(EventBus, 'emit');
      instance.parent = new Widget({ name: 'parent', type: '' }, parent);
      instance.onMounted();
      expect(instance.events.onMounted).toBeUndefined();
      expect(spy).not.toHaveBeenCalled();
      spy.mockClear();
    });

    it('should not call onMounted event and call EventBus emit', () => {
      const spy = jest.spyOn(EventBus, 'emit');
      instance.onMounted();
      expect(instance.events.onMounted).toBeUndefined();
      expect(spy).toHaveBeenCalledWith('WidgetOnMounted', ['onMounted']);
      spy.mockClear();
    });

    it('should call onMounted event and call EventBus emit', () => {
      instance.events.onMounted = jest.fn;
      const spy = jest.spyOn(EventBus, 'emit');
      const spyEvent = jest.spyOn(instance.events as any, 'onMounted');
      instance.onMounted();
      expect(spy).toHaveBeenCalledWith('WidgetOnMounted', ['onMounted']);
      expect(spyEvent).toHaveBeenCalled();
      spy.mockClear();
      spyEvent.mockClear();
    });

    it('should call onMounted event and not call EventBus emit', () => {
      instance.events.onMounted = jest.fn;
      instance.parent = new Widget({ name: 'parent', type: '' }, parent);
      const spy = jest.spyOn(EventBus, 'emit');
      const spyEvent = jest.spyOn(instance.events as any, 'onMounted');
      instance.onMounted();
      expect(spy).not.toHaveBeenCalled();
      expect(spyEvent).toHaveBeenCalled();
      spy.mockClear();
      spyEvent.mockClear();
    });
  });

  describe('onBeforeDestroy()', () => {
    it('should not call onBeforeDestroy event and EventBus emit', () => {
      const spy = jest.spyOn(EventBus, 'emit');
      instance.parent = new Widget({ name: 'parent', type: '' }, parent);
      instance.onBeforeDestroy();
      expect(instance.events.onBeforeDestroy).toBeUndefined();
      expect(spy).not.toHaveBeenCalled();
      spy.mockClear();
    });

    it('should not call onBeforeDestroy event and call EventBus emit', () => {
      const spy = jest.spyOn(EventBus, 'emit');
      instance.onBeforeDestroy();
      expect(instance.events.onBeforeDestroy).toBeUndefined();
      expect(spy).toHaveBeenCalledWith('WidgetOnBeforeDestroy', ['onBeforeDestroy']);
      spy.mockClear();
    });

    it('should call onBeforeDestroy event and call EventBus emit', () => {
      instance.events.onBeforeDestroy = jest.fn;
      const spy = jest.spyOn(EventBus, 'emit');
      const spyEvent = jest.spyOn(instance.events as any, 'onBeforeDestroy');
      instance.onBeforeDestroy();
      expect(spy).toHaveBeenCalledWith('WidgetOnBeforeDestroy', ['onBeforeDestroy']);
      expect(spyEvent).toHaveBeenCalled();
      spy.mockClear();
      spyEvent.mockClear();
    });

    it('should call onBeforeDestroy event and not call EventBus emit', () => {
      instance.events.onBeforeDestroy = jest.fn;
      instance.parent = new Widget({ name: 'parent', type: '' }, parent);
      const spy = jest.spyOn(EventBus, 'emit');
      const spyEvent = jest.spyOn(instance.events as any, 'onBeforeDestroy');
      instance.onBeforeDestroy();
      expect(spy).not.toHaveBeenCalled();
      expect(spyEvent).toHaveBeenCalled();
      spy.mockClear();
      spyEvent.mockClear();
    });
  });

  describe('onDestroyed()', () => {
    it('should not call onDestroyed event and EventBus emit', () => {
      const spy = jest.spyOn(EventBus, 'emit');
      instance.parent = new Widget({ name: 'parent', type: '' }, parent);
      instance.onDestroyed();
      expect(instance.events.onDestroyed).toBeUndefined();
      expect(spy).not.toHaveBeenCalled();
      spy.mockClear();
    });

    it('should not call onDestroyed event and call EventBus emit', () => {
      const spy = jest.spyOn(EventBus, 'emit');
      instance.onDestroyed();
      expect(instance.events.onDestroyed).toBeUndefined();
      expect(spy).toHaveBeenCalledWith('WidgetOnDestroyed', ['onDestroyed']);
      spy.mockClear();
    });

    it('should call onDestroyed event and call EventBus emit', () => {
      instance.events.onDestroyed = jest.fn;
      const spy = jest.spyOn(EventBus, 'emit');
      const spyEvent = jest.spyOn(instance.events as any, 'onDestroyed');
      instance.onDestroyed();
      expect(spy).toHaveBeenCalledWith('WidgetOnDestroyed', ['onDestroyed']);
      expect(spyEvent).toHaveBeenCalled();
      spy.mockClear();
      spyEvent.mockClear();
    });

    it('should call onDestroyed event and not call EventBus emit', () => {
      instance.events.onDestroyed = jest.fn;
      instance.parent = new Widget({ name: 'parent', type: '' }, parent);
      const spy = jest.spyOn(EventBus, 'emit');
      const spyEvent = jest.spyOn(instance.events as any, 'onDestroyed');
      instance.onDestroyed();
      expect(spy).not.toHaveBeenCalled();
      expect(spyEvent).toHaveBeenCalled();
      spy.mockClear();
      spyEvent.mockClear();
    });
  });
});

describe('WidgetFactory', () => {
  describe('factoryWidgets()', () => {
    it('should retrieve widget instance collection', () => {
      const container = new Container({ name: 'container' });
      const widgets = WidgetFactory.factoryWidgets([{ name: 'widget', type: 'any' }], container);
      expect(widgets[0].parent).toEqual(container);
      expect(widgets[0]).toBeInstanceOf(Widget);
    });
  });

  describe('factoryWidget()', () => {
    it('should retrieve widget instance', () => {
      const container = new Container({ name: 'container' });
      const widget = WidgetFactory.factoryWidget<Widget>({ name: 'widget', type: 'any' }, container);
      expect(widget.parent).toEqual(container);
      expect(widget).toBeInstanceOf(Widget);
    });

    it('should retrieve with registered component', () => {
      const container = new Container({ name: 'container' });
      ComponentFactory.setComponentByType('any', { class: Widget, component: '' });
      const widget = WidgetFactory.factoryWidget<Widget>({ name: 'widget', type: 'any' }, container);
      expect(widget.parent).toEqual(container);
      expect(widget).toBeInstanceOf(Widget);
    });
  });
});
