import set from 'lodash.set';

interface IZdPayload {
  path: string;
  value: any;
}

export function save(state: any, { path, value }: IZdPayload) {
  set(state, path, value);
}
