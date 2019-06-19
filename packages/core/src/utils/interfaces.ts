export type IDictionary<T> = { [key: string]: T };
export type IMessagesDictionary = { [key: string]: string|IMessagesDictionary };
export type IEvent = IDictionary<string|Function>;
