import { Config, IConfig } from './config';
import { Http } from './http/http';
import { Interceptor } from './http/interceptor';
import { Loader } from './utils/loader';
import { EventEmitter } from './event/event_bus';
import { AxiosRequestConfig } from 'axios';
import { I18n } from './i18n/i18n';
import { Logger } from './utils/logger';
import { Hook } from './utils/hooks';

export function init(config: IConfig) {
  Config.set(config);
  Http.setBaseURL(config.endPoint);
  setLanguageInterceptor();
  createHookEvents();
  const appInitEmitter = new EventEmitter('appInit');
  loadAppController(config.mode);
  appInitEmitter.emit();
  appInitEmitter.off();
}

function setLanguageInterceptor() {
  Interceptor.addRequestSuccess((config: AxiosRequestConfig) => {
    config.headers = { ...config.headers, language: I18n.getLanguage() };
    return config;
  });
}

function loadAppController(mode: string) {
  try {
    Loader.loadController('AppController');
  } catch (error) {
    if (error.code && error.code === 'MODULE_NOT_FOUND') {
      Logger.warn(mode, 'AppController not found');
    } else {
      throw error;
    }
  }
}

function createHookEvents() {
  Hook.createWidgetHookEvents();
  Hook.createContainerHookEvents();
}
