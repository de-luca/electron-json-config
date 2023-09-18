import { readFileSync, writeFileSync } from 'fs';
import { Buffer } from 'buffer';
import Storable from "./Storable";
import { Key } from './Config';

export function sync(file: string, data: Record<string, unknown>): void {
  writeFileSync(file, JSON.stringify(data, null, 2));
}

export function read(file: string): Storable {
  try {
    // If no encoding is specified, then the raw buffer is returned.
    // See: https://nodejs.org/api/fs.html#fs_fs_readfile_path_options_callback
    const data = readFileSync(file) as Buffer;
    return JSON.parse(data.toString());
  } catch(err) {
    if (
      err instanceof Error &&
      (err as NodeJS.ErrnoException).code === 'ENOENT'
    ) {
      writeFileSync(file, '{}');
      return {};
    }
    throw err;
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

export function set<T>(
  data: Storable,
  key: Key,
  value: Storable | T,
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
      return;
    }
    data = data[path[i]];
  }

  delete data[path[i]];
}
