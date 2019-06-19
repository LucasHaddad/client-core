import i18next from 'i18next';
import merge from 'lodash.merge';
import { Messages } from './messages';
import { Config } from '../config';

/**
 * Class to manipulate the i18next library
 */
export class I18n {

  /**
   * i18next instance
   */
  public static instance = i18next;

  /**
   * Initiates i18next
   */
  public static init(options?: i18next.InitOptions) {
    const defaultOptions: i18next.InitOptions = {
      lng: this.getLanguage(),
      resources: Messages.get(),
      keySeparator: '::',
      nsSeparator: ':::',
    };
    const i18nOptions = merge(defaultOptions, options);
    i18next.init(i18nOptions);
  }

  /**
   * Change the i18next language
   */
  public static changeLanguage(lang: string) {
    i18next.changeLanguage(lang);
  }

  /**
   * Get i18next language
   */
  public static getLanguage(): string {
    return i18next.language || window.navigator.language || Config.defaultLanguage || 'en-US';
  }

}
