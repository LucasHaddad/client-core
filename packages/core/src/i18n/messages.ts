import merge from 'lodash.merge';
import { IMessagesDictionary } from '../utils/interfaces';

/**
 * Class to manipulate messages to translation
 */
export class Messages {
  /**
   * Messages to translation
   */
  private static content = {};

  /**
   * Returns the messages to translation
   */
  public static get() {
    return this.content;
  }

  /**
   * Adds messages to the content object
   */
  public static add(newMessages: IMessagesDictionary) {
    this.content = merge(this.content, newMessages);
  }
}
