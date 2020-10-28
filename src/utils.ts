import { statSync, readFileSync, writeFileSync } from 'fs';
import { Buffer } from 'buffer';
import Storable from "./Storable";
import { Key } from './Config';


export function exists(file: string): boolean {
  try {
    statSync(file);
  } catch (err) {
    if (err.code === 'ENOENT') {
      return false;
    }
  }

  return true;
}

export function sync(file: string, data: object): void {
  writeFileSync(file, JSON.stringify(data));
}

export function read(file: string): Storable {
  if (!exists(file)) {
    writeFileSync(file, '{}');
    
    return {};
  } else {
    const data: Buffer | string = readFileSync(file);
    return JSON.parse(Buffer.isBuffer(data) ? data.toString() : data);
  }
}

export function pathiffy(key: Key): Array<string> {
  if (Array.isArray(key)) {
    return key;
  }

  return key.split('.');
}

export function search<T>(data: Storable, key: Key): T | undefined {
  const path = pathiffy(key)

  for (let i = 0; i < path.length; i++) {
    if (data[path[i]] === undefined) {
      return undefined;
    }
    data = data[path[i]];
  }

  return data as T;
}

export function set(
  data: Storable, 
  key: Key, 
  value: Storable | any,
): void {
  const path = pathiffy(key);
  let i;

  for (i = 0; i < path.length - 1; ++i) {
    if (!data[path[i]]) {
      data[path[i]] = {};
    }
    data = data[path[i]];
  }

  
  data[path[i]] = value;
}

export function remove(data: Storable, key: Key): void {
  const path = pathiffy(key);
  let i;

  for (i = 0; i < path.length - 1; ++i) {
    if (!data[path[i]]) {
      data[path[i]] = {};
    }
    data = data[path[i]];
  }
  
  delete data[path[i]];
}
