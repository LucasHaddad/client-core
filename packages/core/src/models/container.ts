import { IWidget, IContainer, IZdContainer } from './interfaces';
import { PlannedContainer } from '../metadata/planned_container';
import { Widget, WidgetFactory } from './widget';
import { Component, ComponentFactory } from './component';
import { Hook } from '../utils';
import { EventBus } from '../event';
import { Metadata } from '../metadata';

/**
 * Class that defines the container, extending the definitions and behaviors
 * of the component and implements its interface
 */
export class Container extends Component implements IZdContainer {

  /**
   * Widgets collection
   */
  public widgets: Widget[] = [];

  /**
   * Controller name
   */
  public controller: string = '';

  /**
   * Controls header visibility
   */
  public showHeader: boolean = true;

  /**
   * Controls menu visibility
   */
  public showMenu: boolean = true;

  /**
   * Controls footer visibility
   */
  public showFooter: boolean = true;

  /**
   * Sets a title
   */
  public title: string = '';

  /**
   * Container opened instance
   */
  private static instance: Container;

  /**
   * Hooks counter
   */
  private static hookCounter: { [hook: string]: number } = {
    onBeforeCreate: 0,
    onCreated: 0,
    onBeforeMount: 0,
    onMounted: 0,
    onBeforeDestroy: 0,
    onDestroyed: 0,
  };

  /**
   * Creates a new container
   * @param container Container structure
   */
  constructor(container: IContainer) {
    super(container);
    this.widgets = container.widgets ? WidgetFactory.factoryWidgets(container.widgets, this) : this.widgets;
    this.controller = container.controller || this.controller;
    this.showHeader = container.showHeader !== false;
    this.showMenu = container.showMenu !== false;
    this.showFooter = container.showFooter !== false;
    this.title = container.title || this.title;
    this.assignOtherProperties(container);
  }

  /**
   * Creates a container instance based on metadata
   * @param name Container name
   * @param isLocal Define if should get container from endpoint
   */
  public static async createInstance(name: string, isLocal: boolean, type: string) {
    this.clearHookCounter();
    const component = ComponentFactory.getComponentByType(type);
    const containerClass = component && component.class || Container;
    Hook.hooks.forEach(hook => EventBus.on(Hook.getWidgetHookName(hook), (hookArg: string) => this.handleHook(hookArg)));
    container = this.instance = new (containerClass)(await Metadata.parse(name, isLocal));
    return this.instance;
  }

  /**
   * Handle container lifecycle hooks
   * @param hook Hook name
   */
  private static handleHook(hook: string) {
    this.hookCounter[hook] += 1;
    if (this.hookCounter[hook] === this.instance.widgets.length) {
      Hook.containerHooks[hook].emit();
      Hook.widgetHooks[hook].clearCallbacks();
      Hook.containerHooks[hook].clearCallbacks();
      if (hook === 'onCreated') {
        Hook.containerHooks.onChange.emit([this.instance]);
      }
    }
  }

  /**
   * Clears all hooks counter
   */
  private static clearHookCounter() {
    Object.keys(this.hookCounter).forEach((hook: string) => {
      this.hookCounter[hook] = 0;
    });
  }

  /**
   * Updates widgets property
   * @param widgets Widgets structure os instance collection
   */
  public setWidgets(widgets: (Widget|IWidget)[]) {
    this.widgets = [];
    widgets.forEach((widget: Widget|IWidget) => this.addWidget(widget));
  }

  /**
   * Adds widget in widgets property
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
   * Retrieves a widget if it exists
   * @param name Widget name
   * @returns Widget instance
   * @throws Will throws if widget not exists
   */
  public getWidget<T>(name: string): T {
    if (PlannedContainer.container.widgets[name]) {
      return PlannedContainer.container.widgets[name].widget;
    }
    throw `Widget ${name} not found`;
  }
}

/**
 * Current opened container
 */
export let container: Container;
