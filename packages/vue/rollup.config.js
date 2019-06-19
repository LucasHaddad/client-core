import { getDefaultConfig } from "../../rollup.config.js";
import pkg from './package.json'

let defaultConfig = getDefaultConfig(pkg);

defaultConfig.external.push('@/config');
defaultConfig.external.push('@/registerServiceWorker');
defaultConfig.external.push('@/plugins');

export default defaultConfig;
