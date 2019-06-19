import { IDictionary } from './interfaces';
import { EventEmitter } from '../event';

/**
 * Hook
 * @private
 */
export class Hook {

  /**
   * Zeedhi hook types
   */
  public static hooks: string[] = [
    'onBeforeCreate',
    'onCreated',
    'onBeforeMount',
    'onMounted',
    'onBeforeDestroy',
    'onDestroyed',
  ];

  public static containerHooks: IDictionary<EventEmitter> = {};

  public static widgetHooks: IDictionary<EventEmitter> = {};

  public static createContainerHookEvents() {
    this.createHookEvents(this.containerHooks, (hook: string) => this.getContainerHookName(hook));
    this.containerHooks.onChange = new EventEmitter('ContainerOnChange');
  }

  public static createWidgetHookEvents() {
    this.createHookEvents(this.widgetHooks, (hook: string) => this.getWidgetHookName(hook));
  }

  /**
   * Creates hook event and save at hooks collection
   * @param hooks hooks collection
   * @param getNameMethod method to return method name
   */
  private static createHookEvents(hooks: IDictionary<EventEmitter>, getNameMethod: (hook: string) => string) {
    this.hooks.forEach((hook: string) => {
      hooks[hook] = new EventEmitter(getNameMethod(hook));
    });
  }

  /**
   * Retrieves container hook name
   * @param hook Hook type
   * @returns Hooke name
   */
  public static getContainerHookName(hook: string): string {
    return `Container${this.getName(hook)}`;
  }

  /**
   * Retrieves widget hook name
   * @param hook Hook type
   * @returns Hook name
   */
  public static getWidgetHookName(hook: string): string {
    return `Widget${this.getName(hook)}`;
  }

  /**
   * Retrieves hook name
   * @param hook Hook type
   */
  private static getName(hook: string) {
    return `${hook.charAt(0).toUpperCase()}${hook.slice(1)}`;
  }
}
