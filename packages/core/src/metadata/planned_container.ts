import { Widget } from '../models/widget';
import { Field } from '../models/field';

/**
 * @private
 */
export interface IPlannedContainer {
  widgets: { [key: string]: IPlannedWidget };
}

/**
 * @private
 */
export interface IPlannedWidget {
  widget: any;
  fields: { [key: string]: any };
}

/**
 * Planned Container
 * @private
 */
export class PlannedContainer {

  /**
   * Planned container
   */
  public static container: IPlannedContainer = { widgets: {} };

  /**
   * Adds widget on current planned container
   * @param widget Widget instance
   */
  public static addWidget(widget: Widget) {
    this.container.widgets[widget.name] = { widget, fields: {} };
  }

  /**
   * Adds field in widget in planned container
   * @param widgetName Widget name
   * @param field Field instance
   */
  public static addField(widgetName: string, field: Field) {
    this.container.widgets[widgetName].fields[field.name] = field;
  }

  /**
   * Clear planned container
   */
  public static reset() {
    this.container = { widgets: {} };
  }
}
