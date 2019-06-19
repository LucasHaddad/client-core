import { Config } from '../config';
import { IContainer } from '../models/interfaces';
import { Http } from '../http/http';
import { Hook } from '../utils/hooks';
import { Loader } from '../utils/loader';
import { PlannedContainer } from './planned_container';
import { EventBus } from '../event/event_bus';

/**
 * Class that parse metadata
 */
export class Metadata {

  /**
   * Parses a metadata
   * @param name Metadata name
   * @param isLocal Define if should get container from endpoint
   */
  public static async parse(name: string, isLocal: boolean) {
    PlannedContainer.reset();
    let metadata: IContainer;
    try {
      const response = await Http.get(this.getUrl(name, isLocal), { baseURL: '' });
      metadata = response.data;
    } catch (error) {
      if (error.response && error.response.status === 404) {
        metadata = { name: 'notFound', widgets: [{ name: 'notFound', type: 'NotFound' }] };
      }
      throw error;
    }
    this.load(metadata);
    return metadata;
  }

  /**
   * Retrieves metadata url
   * @param metadataId Metadata name
   * @param forceLocal Force get metadata from local
   */
  public static getUrl(metadataId: string, forceLocal: boolean = false): string {
    return forceLocal
      ? `${location.origin}/metadata/${metadataId}.json`
      : `${Config.metadataEndPoint}${metadataId}`;
  }

  /**
   * Loads metadata attributes and hooks
   * @param metadata Container metadata
   * @private
   */
  private static load(metadata: IContainer) {
    this.loadTitle(metadata.title);
    this.mapHooks(metadata.controller);
  }

  /**
   * Updates html title tag
   * @param title Page title
   * @private
   */
  private static loadTitle(title?: string) {
    document.title = title || Config.title;
  }

  /**
   * Register controller hooks
   * @param controllerName Controller name
   * @private
   */
  private static mapHooks(controllerName?: string) {
    if (controllerName) {
      const controller = Loader.getController(controllerName);
      Hook.hooks.forEach((hook) => {
        if (controller[hook] && typeof controller[hook] === 'function') {
          EventBus.on(Hook.getContainerHookName(hook), controller[hook].bind(controller));
        }
      });
    }
  }
}
