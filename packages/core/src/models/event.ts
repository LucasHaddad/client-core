import { IDictionary } from '../utils/interfaces';
import { Loader } from '../utils/loader';

/**
 * Zeedhi Event
 */
export class ZdEvent {

  public static async callEventCycle(
    events: IDictionary<Function>, before: string, after: string, eventArgs: IDictionary<any>,
    callback: ((args: any) => Promise<void>), callbackArgs?: any,
  ) {
    let prevent: boolean = false;
    if (events[before]) {
      prevent = events[before](eventArgs) === true;
    }
    if (!prevent) {
      await callback(callbackArgs);
      if (events[after]) {
        events[after](eventArgs);
      }
    }
  }
}

/**
 * Event Factory
 */
export class EventFactory {

  public static factoryEvents(events: IDictionary<string|Function>): IDictionary<Function> {
    let controller: any;
    let method: string|Function;
    let eventObj: { controller: string; method: string };
    const factoredEvents: IDictionary<Function> = {};
    for (const event in events) {
      method = events[event];
      if (typeof method === 'string') {
        eventObj = this.getEventObject(method);
        controller = Loader.getController(eventObj.controller);
        factoredEvents[event] = this.getEventMethod(controller, eventObj.method);
      } else {
        factoredEvents[event] = (events[event] as Function);
      }
    }
    return factoredEvents;
  }

  private static getEventObject(event: string): { controller: string; method: string } {
    const [controller, method] = event.split('.');
    return { controller, method };
  }

  private static getEventMethod(controller: any, method: string) {
    if (controller[method]) {
      return controller[method].bind(controller);
    }
    return () => { throw new Error(`Method ${method} not found`); };
  }
}
