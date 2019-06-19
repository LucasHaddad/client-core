import { IDictionary } from '../utils/interfaces';
import { IZdRouteProps } from './interfaces';

export type ZdRoute = {
  path: string;
  component: any;
  name?: string;
  redirect?: string;
  meta?: IDictionary<any>;
  props?: IZdRouteProps|((route: any) => IZdRouteProps);
};

export type ZdRoutes = ZdRoute[];
