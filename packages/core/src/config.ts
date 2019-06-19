import { IDictionary } from './utils/interfaces';

export interface IConfig {
  readonly endPoint: string;
  readonly metadataEndPoint: string;
  readonly staticAppMetadata?: boolean;
  readonly componentUrl?: string;
  readonly env?: IDictionary<any>;
  readonly homeUrl: string;
  readonly mode: string;
  readonly language?: string;
  defaultLanguage?: string;
  title: string;
  dateFormat?: string;
  displayFormat?: string;
  datasourceLimit?: number;
}

/**
 * Class that exposes the app configuration
 */
export class Config {

  static componentUrl: string;

  static datasourceLimit: number = 10;

  static dateFormat: string;

  static defaultLanguage: string = 'en-US';

  static displayFormat: string;

  static endPoint: string;

  static env: IDictionary<any>;

  static homeUrl: string;

  static language: string;

  static metadataEndPoint: string;

  static mode: string;

  static staticAppMetadata: boolean;

  static title: string;

  static set(config: IConfig) {
    Object.assign(this, config);
  }

}
