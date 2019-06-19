import { Widget } from './widget';
import { IField, IZdField, IRegisteredComponent } from './interfaces';
import { Component, ComponentFactory } from './component';
import { IDictionary } from '../utils/interfaces';
import { EventFactory } from './event';
import { PlannedContainer } from '../metadata/planned_container';

/**
 * Defines field behavior and is used as base for all field components.
 */
export class Field extends Component implements IZdField {

  /**
   * Registered component type
   */
  public type!: string;

  /**
   * Sets a label
   */
  public label: string = '';

  /**
   * Controls visibility
   */
  public isVisible: boolean = true;

  /**
   * Controls accessibilty
   */
  public readonly: boolean = false;

  /**
   * Defines field is disabled
   */
  public disabled: boolean = false;

  /**
   * Defines if the field should controls the data sort
   * @todo should be here or in list interface?
   */
  public sortable: boolean = true;

  /**
   * Displays component on each row based on field type
   * @todo should be here or in list interface?
   */
  public editable: boolean = false;

  /**
   * Field parent
   */
  public parent!: Widget;

  /**
   * Sets field alignment
   * @todo should be here or in list interface?
   */
  public align: string = 'left';

  /**
   * Controls column max size
   * @todo should be here or in list interface?
   */
  public maxWidth: string = '';

  /**
   * Controls column min size
   * @todo should be here or in list interface?
   */
  public minWidth: string = '';

  /**
   * All events that was registered to the field
   */
  public events: IDictionary<Function> = {};

  /**
   * Creates a new field instance
   * @param field Field structure
   * @param widget Parent widget
   * @param appendToWidget Add field to parent widget
   * @returns Factored field
   */
  constructor(field: IField, widget?: Widget, appendToWidget: boolean = false) {
    super(field);
    this.type = field.type;
    this.label = field.label || this.label;
    this.isVisible = field.isVisible !== false;
    this.readonly = field.readonly === true;
    this.disabled = field.disabled === true;
    this.sortable = field.sortable !== false;
    this.editable = field.editable === true;
    this.align = field.align || this.align;
    this.minWidth = field.minWidth || this.minWidth;
    this.maxWidth = field.maxWidth || this.maxWidth;
    this.events = EventFactory.factoryEvents(field.events || {});
    this.updateParentProperty(widget, appendToWidget);
    this.assignOtherProperties(field);
  }

  /**
   * Updates parent property and try to adds field to parent
   * @private
   * @param widget Parent widget
   * @param appendToWidget Add field to parent widget
   */
  public updateParentProperty(widget?: Widget, appendToWidget: boolean = false) {
    if (widget) {
      this.parent = widget;
      PlannedContainer.addField(widget.name, this);
      if (appendToWidget) {
        widget.addField(this);
      }
    }
  }

  /**
   * Triggered when the component loses focus
   * @param event component event
   */
  public blur(event: Event) {
    if (this.events.blur) {
      this.events.blur({ event, field: this });
    }
  }

  /**
   * Triggered when the component is clicked
   * @param event component event
   */
  public click(event: Event) {
    if (this.events.click) {
      this.events.click({ event, field: this });
    }
  }

  /**
   * Triggered when the component is focused
   * @param event component event
   */
  public focus(event: Event) {
    if (this.events.focus) {
      this.events.focus({ event, field: this });
    }
  }
}

/**
 * Field Factory
 */
export class FieldFactory {

  /**
   * Retrives a factored Fields collection
   * @param fields Fields structure
   * @param widget Parent widget
   * @param appendToWidget Add fields to parent widget
   * @returns Fields collection
   */
  public static factoryFields(fields: IField[], widget?: Widget, appendToWidget: boolean = false): Field[] {
    return fields.map((field: IField) => this.factoryField(field, widget, appendToWidget));
  }

  /**
   * Retrieves a factored Field instance
   * @param field Field structure
   * @param widget Parent widget
   * @param appendToWidget Add fields to parent widget
   * @returns Factored Field instance
   */
  public static factoryField(field: IField, widget?: Widget, appendToWidget: boolean = false): Field {
    const component: IRegisteredComponent|undefined = ComponentFactory.getComponentByType(field.type);
    return this.getFieldInstance(field, widget, component, appendToWidget);
  }

  /**
   * Retrieve a field instance based on registered components
   * @private
   * @param field Field structure
   * @param widget Parent widget
   * @param component Registered component
   * @param appendToWidget Add field to parent widget
   * @returns Field Instance
   */
  private static getFieldInstance(
    field: IField, widget?: Widget,
    component?: IRegisteredComponent, appendToWidget?: boolean,
  ): Field {
    return component && component.class ?
      new (component.class)(field, widget, appendToWidget) :
      new Field(field, widget, appendToWidget);
  }
}
