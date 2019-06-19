/**
 * Class that defines the eventbus, responsible for recording events that will be emitted
 */
export class EventBus {

  public static eventCallbacksPairs: { [key: string]: EventCallbacksPair } = {};

  public static on(eventType: string, callback: Function): void {
    const event: EventCallbacksPair = EventBus.findEventCallbacksPair(eventType);
    if (event) {
      event.addCallback(callback);
    }
  }

  public static off(eventType: string, callback: Function): void {
    const event: EventCallbacksPair = EventBus.findEventCallbacksPair(eventType);
    if (event) {
      event.removeCallback(callback);
    }
  }

  public static emit(eventType: string, args: any[] = []): void {
    const event: EventCallbacksPair = EventBus.findEventCallbacksPair(eventType);
    if (event) {
      event.dispatchCallbacks(args);
    }
  }

  public static findEventCallbacksPair(eventType: string): EventCallbacksPair {
    return EventBus.eventCallbacksPairs[eventType];
  }
}

/**
 * Class responsible to emitt events recorded on eventbus
 */
export class EventEmitter {

  private event: EventCallbacksPair;

  constructor(eventType: string) {
    this.event = new EventCallbacksPair(eventType);
    this.registerEvent();
  }

  public emit(args: any[] = []): void {
    EventBus.emit(this.event.eventType, args);
  }

  public off() {
    delete EventBus.eventCallbacksPairs[this.event.eventType];
  }

  public clearCallbacks() {
    EventBus.eventCallbacksPairs[this.event.eventType].clearCallbacks();
  }

  private registerEvent(): void {
    EventBus.eventCallbacksPairs[this.event.eventType] = this.event;
  }
}

/**
 * Class responsible to record, remove and load callbacks recorded on eventbus
 */
export class EventCallbacksPair {

  public eventType: string;
  private callbacks: Function[] = [];

  constructor(eventType: string) {
    this.eventType = eventType;
  }

  public addCallback(callback: Function): void {
    this.callbacks.push(callback);
  }

  public removeCallback(callback: Function): void {
    const index: number = this.callbacks.findIndex((method: Function) => method === callback);
    if (index !== -1) {
      this.callbacks.splice(index, 1);
    }
  }

  public clearCallbacks(): void {
    this.callbacks = [];
  }

  public dispatchCallbacks(args: any[] = []): void {
    this.callbacks.forEach((callback: Function) => callback.call(null, ...args));
  }
}
