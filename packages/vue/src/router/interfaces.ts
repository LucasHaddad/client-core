import { IRouter } from '@zeedhi/core';
import { RawLocation } from 'vue-router';
import { ErrorHandler, Route } from 'vue-router/types/router';

export interface IVueRouter extends IRouter {
  push(path: RawLocation, onComplete?: Function, onAbort?: ErrorHandler): void;
  replace(path: RawLocation, onComplete?: Function, onAbort?: ErrorHandler): void;
  getCurrentRoute(): Route;
}
