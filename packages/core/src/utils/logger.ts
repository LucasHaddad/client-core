const DEVELOPMENT_MODE = 'development';

/**
 * Class to log messages
 */
export class Logger {

  public static warn(mode: string, message: string) {
    if (mode === DEVELOPMENT_MODE) {
      // tslint:disable-next-line:no-console
      console.warn(message);
    }
  }
}
