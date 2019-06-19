import { Widget, Container, Input, IInput } from '../../../src/models';

jest.mock('./../../../src/utils/url');

describe('Input', () => {
  let instance: Input;
  let input: IInput;

  beforeEach(() => {
    input = {
      name: 'field',
      type: 'AnyType',
      storePath: 'store',
      value: 'value',
      validations: {
        required: {},
      },
    };
    instance = new Input(input);
  });

  describe('constructor()', () => {
    it('should override all properties', () => {
      expect(instance.storePath).toBe('store');
      expect(instance.rules.length).toBe(1);
      expect(instance.value).toBe('value');
    });

    it('should assign all default values', () => {
      input = { name: 'input', type: 'anyInput' };
      instance = new Input(input);
      expect(instance.storePath).toBe('');
      expect(instance.rules.length).toBe(0);
      expect(instance.value).toBeUndefined();
    });

    it('should create with parent and append to parent', () => {
      input = { name: 'input', type: 'anyInput' };
      const container = new Container({ name: 'container' });
      const parent = new Widget({ name: 'parent', type: 'any' }, container);
      instance = new Input(input, parent, true);
      expect(instance.parent).toEqual(parent);
      expect(instance.parent.fields.length).toBe(1);
    });

    it('should create with parent and should not append to parent', () => {
      input = { name: 'input', type: 'anyInput' };
      const container = new Container({ name: 'container' });
      const parent = new Widget({ name: 'parent', type: 'any' }, container);
      instance = new Input(input, parent);
      expect(instance.parent).toEqual(parent);
      expect(instance.parent.fields.length).toBe(0);
    });
  });

  describe('get/set value', () => {
    it('should get value from parent currentRow', () => {
      input = { name: 'input', type: 'anyInput', value: 'test' };
      const container = new Container({ name: 'container' });
      const parent = new Widget({ name: 'parent', type: 'any' }, container);
      instance = new Input(input, parent, true);
      expect(instance.value).toBe('test');
    });

    it('should set value on parent currentRow', () => {
      input = { name: 'input', type: 'anyInput', value: 'test' };
      const container = new Container({ name: 'container' });
      const parent = new Widget({ name: 'parent', type: 'any' }, container);
      instance = new Input(input, parent, true);
      expect(parent.currentRow.input).toBe('test');
    });

    it('should be equal to currentRow value', () => {
      input = { name: 'input', type: 'anyInput' };
      const container = new Container({ name: 'container' });
      const parent = new Widget({ name: 'parent', type: 'any' }, container);
      instance = new Input(input, parent, true);
      instance.parent.currentRow.input = 'teste';
      expect(instance.value).toBe(instance.parent.currentRow.input);
    });
  });

  describe('get/set displayValue', () => {
    it('should get displayValue', () => {
      instance.value = 'test';
      expect(instance.displayValue).toBe('test');
    });

    it('should set displayValue', () => {
      instance.displayValue = 'test';
      expect(instance.value).toBe('test');
    });
  });

  describe('addValidation()', () => {
    it('should add a registered validation', () => {
      instance.addValidation('max', { limit: 10 });
      expect(instance.rules.length).toBe(2);
    });
  });

  describe('removeValidation()', () => {
    it('should remove a registered validation', () => {
      instance.removeValidation('required');
      expect(instance.rules.length).toBe(0);
    });
  });

});
