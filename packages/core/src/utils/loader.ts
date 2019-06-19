import { resolveInstance } from '../di';

/**
 * Loader
 */
export class Loader {

  /**
   * Loaded controllers
   */
  private static controllers: any = {};

  /**
   * Retrieves a controller
   * @param controllerName Controller name
   * @returns Loaded controller
   */
  public static getController(controllerName: string): any {
    if (!this.controllers.hasOwnProperty(controllerName)) {
      this.loadController(controllerName);
    }
    return this.controllers[controllerName];
  }

  /**
   * Loads a controller
   * @param controllerName Controller name
   */
  public static loadController(controllerName: string) {
    const module = require(`@/controllers/${controllerName}`);
    this.controllers[controllerName] = resolveInstance(module[controllerName]);
  }
}
