import { IDictionary } from './interfaces';

/**
 * Validates field not empty
 * @param config Configuration options (message)
 * @returns Rule method
 */
const required = (config: IDictionary<string> = {}) => {
  const message = config.message || 'Required';
  return (value: any) => {
    const isDefined = !!value || typeof value === 'number';
    return !!(isDefined && (!Array.isArray(value) || value.length > 0)) || message;
  };
};

/**
 * Validates email format
 * @param config Configuration options (message)
 * @returns Rule method
 */
const email = (config: IDictionary<string> = {}) => {
  const message = config.message || 'Invalid email';
  return (value: string) => {
    const pattern = new RegExp('^[_a-z0-9-]+(\\.[_a-z0-9-]+)*@[a-z0-9-]+(\\.[a-z0-9-]+)*(\\.[a-z]{2,4})$');
    return !(value) || pattern.test(value) || message;
  };
};

/**
 * Validates field min value
 * @param config Configuration options (limit, message)
 * @returns Rule method
 */
const min = (config: IDictionary<any> = {}) => {
  const limit = parseFloat(config.limit);
  return (value: any) => {
    return limit <= parseFloat(value) || (config.message || `Minimum value: ${limit}`);
  };
};

/**
 * Validates field max value
 * @param config Configuration options (limit, message)
 * @returns Rule method
 */
const max = (config: IDictionary<any> = {}) => {
  const limit = parseFloat(config.limit);
  return (value: any) => {
    return limit >= parseFloat(value) || (config.message || `Maximum value: ${limit}`);
  };
};

/**
 * All registered validations
 */
const validations: IDictionary<(config?: IDictionary<any>) => (value: any) => boolean|string> = {
  email,
  max,
  min,
  required,
};

/**
 * Used to create validations for fields in JSON
 */
export class Validation {

  /**
   * Registers a new validation or overwrites if it exists.
   * All validation methods have an optional configuration parameter and return a method.
   * @param name Validation name
   * @param method Validation method
   */
  public static register(name: string, method: (config?: IDictionary<string|number>) => (value: any) => boolean|string) {
    validations[name] = method;
  }

  /**
   * Unregisters a validation
   * @param name Validation name
   */
  public static unregister(name: string) {
    delete validations[name];
  }

  /**
   * Retrieves a validation
   * @param name Validation name
   * @returns Registered validation
   * @throws Will throw if validation not exists
   */
  public static get(name: string) {
    if (validations[name]) {
      return validations[name];
    }
    throw `Validation ${name} not found`;
  }

  /**
   * Retrieves all registered validations
   * @returns All registered validations
   */
  public static getAll() {
    return validations;
  }
}
