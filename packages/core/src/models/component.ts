import { IDictionary } from '../utils/interfaces';
import { IComponent, IZdComponent, IRegisteredComponent } from './interfaces';

/**
 * Base class for Field, Widget and Container.
 */
export class Component implements IZdComponent {

  /**
   * Sets a name
   */
  public name: string;

  /**
   * CSS classes
   */
  public cssClass: string = '';

  /**
   * Controls component size based on viewport breakpoints
   */
  public gridSize: string = '';

  /**
   * Creates a new component
   * @param component Component structure
   */
  constructor(component: IComponent) {
    this.name = component.name;
    this.cssClass = component.cssClass || this.cssClass;
    this.gridSize = component.gridSize || this.gridSize;
  }

  /**
   * Adds new classes in component
   * @param cssClass CSS classes
   */
  public addCssClass(cssClass: string) {
    const cssClasses = this.cssClass.split(' ');
    cssClasses.push(cssClass);
    this.cssClass = cssClasses.join(' ');
  }

  /**
   * Assign custom properties
   * @param component Component structure
   */
  public assignOtherProperties(component: IComponent) {
    Object.keys(component).forEach((key: string) => {
      if (!this.hasOwnProperty(key)) {
        (this as any)[key] = component[key];
      }
    });
  }
}

/**
 * Component Factory
 */
export class ComponentFactory {

  /**
   * Regitered components object
   */
  private static registeredComponents: IDictionary<IRegisteredComponent> = {};

  /**
   * Retrieves a registered component if it exists
   * @param type Component type
   * @returns Registered component or undefined
   */
  public static getComponentByType(type: string): IRegisteredComponent | undefined {
    return this.registeredComponents[type];
  }

  /**
   * Register a component
   * @param type Component type
   * @param component Component to register
   */
  public static setComponentByType(type: string, component: IRegisteredComponent) {
    this.registeredComponents[type] = component;
  }
}
