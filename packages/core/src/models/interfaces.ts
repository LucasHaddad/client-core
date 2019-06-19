import { IDictionary } from '../utils/interfaces';
import { Field } from './field';
import { Widget } from './widget';
import { Container } from './container';
import { Datasource } from '../storage/datasource';
import { IDatasource } from '../storage/interfaces';

/**
 * JSON interface for component object
 */
export interface IComponent {
  name: string;
  cssClass?: string;
  gridSize?: string;
  [key: string]: any;
}

/**
 * Interface for any Component Class
 * @private
 */
export interface IZdComponent {
  name: string;
  cssClass: string;
  gridSize: string;
}
/**
 * JSON interface for container object
 */
export interface IContainer extends IComponent {
  controller?: string;
  showHeader?: boolean;
  showMenu?: boolean;
  showFooter?: boolean;
  title?: string;
  widgets?: IWidget[];
}

/**
 * Interface for Container class
 * @private
 */
export interface IZdContainer extends IZdComponent {
  controller: string;
  showHeader: boolean;
  showMenu: boolean;
  showFooter: boolean;
  title: string;
  widgets: Widget[];
}

/**
 * JSON interface for widget object
 */
export interface IWidget extends IComponent {
  type: string;
  isVisible?: boolean;
  showAsCard?: boolean;
  currentRow?: IDictionary<any>;
  events?: IDictionary<string|Function>;
  datasource?: IDatasource;
  fields?: IField[];
  widgets?: IWidget[];
}

/**
 * Interface for Widget Class
 * @private
 */
export interface IZdWidget extends IZdComponent {
  type: string;
  isVisible: boolean;
  showAsCard: boolean;
  currentRow: IDictionary<any>;
  events: IDictionary<Function>;
  datasource: Datasource;
  parent?: Container|Widget;
  fields: Field[];
  widgets: Widget[];
}

/**
 * JSON interface for field object
 */
export interface IField extends IComponent {
  type: string;
  label?: string;
  events?: IDictionary<string|Function>;
  isVisible?: boolean;
  readonly?: boolean;
  sortable?: boolean;
  editable?: boolean;
  disabled?: boolean;
  align?: string;
  minWidth?: string;
  maxWidth?: string;
}

/**
 * Interface for Field Class
 * @private
 */
export interface IZdField extends IZdComponent {
  type: string;
  label: string;
  events: IDictionary<Function>;
  isVisible: boolean;
  readonly: boolean;
  sortable: boolean;
  editable: boolean;
  disabled: boolean;
  align: string;
  minWidth: string;
  maxWidth: string;
  parent: Widget;
}

/**
 * JSON interface for input object
 */
export interface IInput extends IField {
  value?: any;
  storePath?: string;
  validations?: IDictionary<IDictionary<string|number>>;
}

/**
 * Interface for Input Class
 * @private
 */
export interface IZdInput extends IZdField {
  value: any;
  displayValue: any;
  storePath: string;
  rules: ((value: any) => string | boolean)[];
}

/**
 * @private
 */
export interface IRegisteredComponent {
  class: any;
  component: any;
}
