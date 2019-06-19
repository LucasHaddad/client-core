import { IField, Field, Widget, Container, FieldFactory, ComponentFactory } from '../../../src/models';
import { PlannedContainer } from '../../../src/metadata/planned_container';

jest.mock('./../../../src/utils/url');

describe('Field', () => {
  let instance: Field;
  let field: IField = {
    name: 'field',
    type: 'AnyType',
    label: 'Field',
    isVisible: false,
    readonly: true,
    disabled: true,
    sortable: false,
    editable: true,
    align: 'center',
    minWidth: '100px',
    maxWidth: '150px',
    events: {
      click: jest.fn,
      blur: jest.fn,
      focus: jest.fn,
    },
  };

  beforeEach(() => {
    instance = new Field(field);
  });

  describe('constructor()', () => {
    it('should override all properties', () => {
      expect(instance.type).toBe('AnyType');
      expect(instance.label).toBe('Field');
      expect(instance.isVisible).toBeFalsy();
      expect(instance.readonly).toBeTruthy();
      expect(instance.disabled).toBeTruthy();
      expect(instance.sortable).toBeFalsy();
      expect(instance.editable).toBeTruthy();
      expect(instance.align).toBe('center');
      expect(instance.minWidth).toBe('100px');
      expect(instance.maxWidth).toBe('150px');
      expect(instance.events.click).toBeDefined();
      expect(instance.events.blur).toBeDefined();
      expect(instance.events.focus).toBeDefined();
    });

    it('should assign all default values', () => {
      field = { name: 'field', type: 'anyField' };
      instance = new Field(field);
      expect(instance.type).toBe('anyField');
      expect(instance.label).toBe('');
      expect(instance.isVisible).toBeTruthy();
      expect(instance.readonly).toBeFalsy();
      expect(instance.disabled).toBeFalsy();
      expect(instance.sortable).toBeTruthy();
      expect(instance.editable).toBeFalsy();
      expect(instance.align).toBe('left');
      expect(instance.minWidth).toBe('');
      expect(instance.maxWidth).toBe('');
      expect(instance.events.click).toBeUndefined();
      expect(instance.events.blur).toBeUndefined();
      expect(instance.events.focus).toBeUndefined();
    });

    it('should append to parent', () => {
      field = { name: 'field', type: 'anyField' };
      const container = new Container({ name: 'container' });
      const parent = new Widget({ name: 'parent', type: 'any' }, container);
      instance = new Field(field, parent, true);
      expect(instance.parent).toEqual(parent);
      expect(instance.parent.fields.length).toBe(1);
    });
  });

  describe('updateParentProperty()', () => {
    it('should not update parent property', () => {
      const spy = jest.spyOn(PlannedContainer, 'addField');
      instance.updateParentProperty();
      expect(spy).not.toHaveBeenCalled();
      spy.mockClear();
    });

    it('should update parent property without append to parent', () => {
      const spy = jest.spyOn(PlannedContainer, 'addField');
      const container = new Container({ name: 'container' });
      const parent = new Widget({ name: 'parent', type: 'any' }, container);
      const spyWidget = jest.spyOn(parent, 'addField');
      instance.updateParentProperty(parent);
      expect(instance.parent).toEqual(parent);
      expect(spy).toHaveBeenCalled();
      expect(spyWidget).not.toHaveBeenCalled();
      spy.mockClear();
      spyWidget.mockClear();
    });

    it('should update parent property', () => {
      const spy = jest.spyOn(PlannedContainer, 'addField');
      const container = new Container({ name: 'container' });
      const parent = new Widget({ name: 'parent', type: 'any' }, container);
      const spyWidget = jest.spyOn(parent, 'addField');
      instance.updateParentProperty(parent, true);
      expect(spy).toHaveBeenCalled();
      expect(spyWidget).toHaveBeenCalled();
      spy.mockClear();
      spyWidget.mockClear();
    });
  });

  describe('blur()', () => {
    it('should call blur event', () => {
      instance.events.blur = jest.fn;
      const spy = jest.spyOn(instance.events as any, 'blur');
      instance.blur({} as Event);
      expect(spy).toHaveBeenCalledWith({ field: instance, event: {} });
    });
  });

  describe('click()', () => {
    it('should call click event', () => {
      instance.events.click = jest.fn;
      const spy = jest.spyOn(instance.events as any, 'click');
      instance.click({} as Event);
      expect(spy).toHaveBeenCalledWith({ field: instance, event: {} });
    });
  });

  describe('focus()', () => {
    it('should call focus event', () => {
      instance.events.focus = jest.fn;
      const spy = jest.spyOn(instance.events as any, 'focus');
      instance.focus({} as Event);
      expect(spy).toHaveBeenCalledWith({ field: instance, event: {} });
    });
  });
});

describe('FieldFactory', () => {
  describe('factoryFields()', () => {
    it('should create and append to parent', () => {
      const container = new Container({ name: 'container' });
      const parent = new Widget({ name: 'parent', type: 'any' }, container);
      const fields = FieldFactory.factoryFields([{ name: 'field', type: 'any' }], parent, true);
      expect(parent.fields.length).toBe(1);
      expect(fields[0].parent).toEqual(parent);
    });

    it('should create and should not append to parent', () => {
      const container = new Container({ name: 'container' });
      const parent = new Widget({ name: 'parent', type: 'any' }, container);
      const fields = FieldFactory.factoryFields([{ name: 'field', type: 'any' }], parent);
      expect(parent.fields.length).toBe(0);
      expect(fields[0].parent).toEqual(parent);
    });

    it('should create without parent', () => {
      const fields = FieldFactory.factoryFields([{ name: 'field', type: 'any' }]);
      expect(fields[0].parent).toBeUndefined();
    });
  });

  describe('factoryField()', () => {
    it('should create and append to parent', () => {
      const container = new Container({ name: 'container' });
      const parent = new Widget({ name: 'parent', type: 'any' }, container);
      const field = FieldFactory.factoryField({ name: 'field', type: 'any' }, parent, true);
      expect(parent.fields.length).toBe(1);
      expect(field.parent).toEqual(parent);
    });

    it('should create and should not append to parent', () => {
      const container = new Container({ name: 'container' });
      const parent = new Widget({ name: 'parent', type: 'any' }, container);
      const field = FieldFactory.factoryField({ name: 'field', type: 'any' }, parent);
      expect(parent.fields.length).toBe(0);
      expect(field.parent).toEqual(parent);
    });

    it('should create without parent', () => {
      const field = FieldFactory.factoryField({ name: 'field', type: 'any' });
      expect(field.parent).toBeUndefined();
    });

    it('should create with registered component', () => {
      ComponentFactory.setComponentByType('any', { class: Field, component: '' });
      const field = FieldFactory.factoryField({ name: 'field', type: 'any' });
      expect(field).toBeDefined();
    });
  });
});
