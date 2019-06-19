import { Field } from './field';
import { Widget } from './widget';
import { IInput, IZdInput } from './interfaces';
import { Validation, IDictionary } from '../utils';

/**
 * Base class for all input components.
 */
export class Input extends Field implements IZdInput {

  /**
   * Used to watch a value from store
   */
  public storePath: string = '';

  /**
   * Rules that will validate the input value
   */
  public rules: ((value: any) => string | boolean)[] = [];

  /**
   * Parsed field rules
   * @private
   */
  private parsedValidations: IDictionary<((value: any) => string | boolean)> = {};

  /**
   * Input value
   * @private
   */
  private fieldValue: any = undefined;

  /**
   * Creates a new input field
   * @param input Input structure
   * @param widget Parent widget
   * @param appendToWidget Add field to parent widget
   * @returns Factored field
   */
  constructor(input: IInput, widget?: Widget, appendToWidget: boolean = false) {
    super(input, widget, appendToWidget);
    this.fieldValue = typeof input.value !== 'undefined' ? input.value : this.fieldValue;
    this.storePath = input.storePath || this.storePath;
    this.parseValidations(input.validations || {});
    this.defineCurrentRowProperty();
  }

  /**
   * Adds parsed validations based on field validations
   * @param validatons Field validations
   * @private
   */
  private parseValidations(validations: IDictionary<any>) {
    Object.keys(validations).forEach((name: string) => this.addValidation(name, validations[name]));
  }

  /**
   * Defines the field property on parent row
   * @private
   */
  private defineCurrentRowProperty() {
    if (this.parent) {
      const rowValue = this.parent.currentRow[this.name];
      this.fieldValue = typeof rowValue !== 'undefined' ? rowValue : this.fieldValue;
      Object.defineProperty(this.parent.currentRow, this.name, {
        get: () => {
          return this.fieldValue;
        },
        set: (value: any) => {
          this.fieldValue = value;
        },
        enumerable: true,
        configurable: true,
      });
    }
  }

  /**
   * Input value
   */
  get value(): any {
    if (this.parent) {
      return this.parent.currentRow[this.name];
    }
    return this.fieldValue;
  }

  set value(value: any) {
    if (this.parent) {
      this.parent.currentRow[this.name] = value;
    }
    this.fieldValue = value;
  }

  /**
   * Input formatted value
   */
  get displayValue(): any {
    return this.formatter(this.value);
  }

  set displayValue(value: any) {
    this.value = this.parser(value);
  }

  /**
   * Retrives a formatted value
   * @param value Any value
   * @returns A Formatted value
   */
  public formatter(value: any) { return value; }

  /**
   * Retrives a parsed value
   * @param value Any value
   * @returns A parsed value
   */
  public parser(value: any) { return value; }

  /**
   * Adds input validation
   * @param name Validation name
   * @param config Validation config
   */
  public addValidation(name: string, config?: IDictionary<any>) {
    const validation = Validation.get(name)(config);
    this.parsedValidations[name] = validation;
    this.updateRules();
  }

  /**
   * Removes input validation
   * @param name Validation name
   */
  public removeValidation(name: string) {
    delete this.parsedValidations[name];
    this.updateRules();
  }

  /**
   * Updates input rules
   * @private
   */
  private updateRules() {
    this.rules = Object.values(this.parsedValidations)
      .map((validation: ((value: any) => string | boolean)) => validation);
  }
}
