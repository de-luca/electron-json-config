import Storable from './Storable';
import * as util from './utils';


function sync(
    target: Config,
    propertyKey: string,
    descriptor: PropertyDescriptor,
): PropertyDescriptor {
    const originalMethod = descriptor.value;

    descriptor.value = function (this: any, ...args: Array<any>): any {
        const res = originalMethod.apply(this, args);
        util.sync(this._file, this._data);

        return res;
    };

    return descriptor;
}

/**
 * A Key can be:
 * - a simple string: 'foo'
 * - a dotted path: 'foo.bar'
 * - an array representing a path: ['foo', 'bar']
 */
export type Key = string | Array<string>;

export default class Config {
    private _file: string;
    private _data: Storable;

    public constructor(file: string, data: Storable) {
        this._file = file;
        this._data = data;
    }

    public get file(): string {
        return this._file;
    }

    public has(key: Key) {
        return util.search(this._data, key) !== undefined;
    }

    @sync
    public set(key: Key, value: Storable | any): void {
        util.set(this._data, key, value);
    }

    @sync
    public setBulk(items: { [key: string]: Storable | any }) {
        for (const key in items) {
            util.set(this._data, key, items[key]);
        }
    }

    public get<T>(key: Key, defaultValue?: T | any): T | undefined {
        const value = util.search(this._data, key);

        return value === undefined ? defaultValue : value;
    };

    public keys(key?: Key): Array<string> {
        return Object.keys(
            key ? util.search(this._data, key) || {} : this._data,
        );
    }

    public all() {
        return this._data;
    }

    @sync
    public delete(key: Key) {
        util.remove(this._data, key);
    }

    @sync
    public deleteBulk(keys: Array<Key>) {
        for (const key of keys) {
            util.remove(this._data, key);
        }
    }

    @sync
    public purge() {
        this._data = {};
    }
}