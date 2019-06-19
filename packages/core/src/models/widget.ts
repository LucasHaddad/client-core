import { IDictionary } from '../utils/interfaces';
import { Container } from './container';
import { PlannedContainer } from '../metadata/planned_container';
import { IWidget, IZdWidget, IField, IRegisteredComponent } from './interfaces';
import { Component, ComponentFactory } from './component';
import { Field, FieldFactory } from './field';
import { Datasource } from '../storage/datasource';
import { EventFactory } from './event';
import { EventBus } from '../event';
import { Hook } from '../utils';

/**
 * Defines widget behavior and is used as base for all widget components.
 */
export class Widget extends Component implements IZdWidget {

  /**
   * Registered component type
   */
  public type!: string;

  /**
   * Controls visibility
   */
  public isVisible: boolean = true;

  /**
   * Display widget as card
   */
  public showAsCard: boolean = true;

  /**
   * All events that was registered to the field
   */
  public events: IDictionary<Function> = {};

  /**
   * Child fields components
   */
  public fields: Field[];

  /**
   * Child widget components
   */
  public widgets: Widget[];

  /**
   * Datasource that performs CRUD operations
   */
  public datasource: Datasource;

  /**
   * Widget parent
   */
  public parent?: Container|Widget;

  /**
   * Creates a new widget
   * @param widget Widget structure
   * @param parent Parent component
   */
  constructor(widget: IWidget, parent?: Container|Widget) {
    super(widget);
    this.parent = parent;
    this.isVisible = widget.isVisible === undefined ? this.isVisible : widget.isVisible;
    this.showAsCard = widget.showAsCard === undefined ? this.showAsCard : widget.showAsCard;
    this.datasource = new Datasource(widget.datasource || {}, widget.currentRow || {});
    this.currentRow = this.datasource.currentRow;
    this.events = EventFactory.factoryEvents(widget.events || {});
    PlannedContainer.addWidget(this);
    this.fields = FieldFactory.factoryFields(widget.fields || [], this);
    this.widgets = WidgetFactory.factoryWidgets(widget.widgets || [], this);
    this.assignOtherProperties(widget);
  }

  /**
   * Row with the current field values
   */
  get currentRow() {
    return this.datasource.currentRow;
  }

  set currentRow(currentRow: any) {
    this.datasource.currentRow = currentRow;
  }

  /**
   * Updates child widgets collection
   * @param widgets Widgets structure os instance collection
   */
  public setWidgets(widgets: (Widget|IWidget)[]) {
    this.widgets = [];
    widgets.forEach((widget: Widget|IWidget) => this.addWidget(widget));
  }

  /**
   * Adds widget on child widgets collection
   * @param widget Widget structure or instance
   */
  public addWidget(widget: Widget|IWidget): void {
    if (widget instanceof Widget) {
      widget.parent = this;
      this.widgets.push(widget);
    } else {
      this.widgets.push(new Widget(widget, this));
    }
  }

  /**
   * Updates child fields collection
   * @param fields Fields structure or instance collection
   */
  public setFields(fields: (Field|IField)[]) {
    this.fields = [];
    fields.forEach((field: Field|IField) => this.addField(field));
  }

  /**
   * Adds field on child fields collection
   * @param field Field structure or instance
   */
  public addField(field: Field|IField) {
    if (field instanceof Field) {
      field.updateParentProperty(this);
      this.fields.push(field);
    } else {
      this.fields.push(new Field(field, this));
    }
  }

  /**
   * Retrieves a child field
   * @param name Field name
   * @returns Field instance
   * @throws Will throws if field not exists
   */
  public getField<T>(name: string): T {
    if (PlannedContainer.container.widgets[this.name].fields[name]) {
      return PlannedContainer.container.widgets[this.name].fields[name];
    }
    throw `Field ${name} not found`;
  }

  /**
   * Event triggered when url changes
   */
  public onRouterChange(current: any, old: any) {
    if (current.fullPath !== old.fullPath) {
      let prevent = false;
      if (this.events.urlChanged) {
        prevent = this.events.urlChanged({ widget: this, value: current }) === true;
      }
      if (!prevent && this.datasource.watchUrl && this.datasource.queryStringHasChanged()) {
        this.datasource.get();
      }
    }
  }

  /**
   * Event triggered when widget is created
   */
  public onCreated() {
    this.callLifecycleEvent('onCreated', ['onCreated']);
  }

  /**
   * Event triggered before widget be mounted
   */
  public onBeforeMount() {
    this.callLifecycleEvent('onBeforeMount', ['onBeforeMount']);
  }

  /**
   * Event triggered when widget is mounted
   */
  public onMounted() {
    this.callLifecycleEvent('onMounted', ['onMounted']);
  }

  /**
   * Event triggered before widget be destroyed
   */
  public onBeforeDestroy() {
    this.callLifecycleEvent('onBeforeDestroy', ['onBeforeDestroy']);
  }

  /**
   * Event triggered when widget is destroyed
   */
  public onDestroyed() {
    this.callLifecycleEvent('onDestroyed', ['onDestroyed']);
  }

  /**
   * Call widget events from lifecycle
   * @param hook Lifecycle method name
   * @private
   */
  private callLifecycleEvent(hook: string, args: string[]) {
    if (this.events[hook]) {
      this.events[hook]({ widget: this });
    }
    if (this.parent && !(this.parent instanceof Widget)) {
      EventBus.emit(Hook.getWidgetHookName(hook), args);
    }
  }
}

/**
 * Widget Factory
 */
export class WidgetFactory {

  /**
   * Creates a widgets collection
   * @param widgets Widgets structure
   * @param parent Parent component
   * @returns Widgets collection
   */
  public static factoryWidgets(widgets: IWidget[], parent?: Container|Widget): Widget[] {
    return widgets.map((widgetStructure: IWidget) => this.factoryWidget(widgetStructure, parent));
  }

  /**
   * Creates a widget object
   * @param widget Widgets structure
   * @param parent Parent component
   * @returns Widget object
   */
  public static factoryWidget<T>(widget: IWidget, parent?: Container|Widget): T {
    const component: IRegisteredComponent|undefined = ComponentFactory.getComponentByType(widget.type);
    return this.getWidgetInstance<T>(widget, component, parent);
  }

  /**
   * Retrieves a widget instance
   * @private
   * @param widget Widget structure
   * @param component Registered component
   * @param parent Parent component
   * @returns Widget instance
   */
  private static getWidgetInstance<T>(
    widget: IWidget, component: IRegisteredComponent|undefined,
    parent?: Container|Widget,
  ): T {
    return component && component.class ?
      new (component.class)(widget, parent) :
      new Widget(widget, parent);
  }
}
