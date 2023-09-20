# electron-json-config

[![npm](https://img.shields.io/npm/v/electron-json-config)](https://www.npmjs.com/package/electron-json-config)
[![codecov](https://codecov.io/gh/de-luca/electron-json-config/branch/master/graph/badge.svg)](https://codecov.io/gh/de-luca/electron-json-config)
[![](https://github.com/de-luca/electron-json-config/workflows/CI/badge.svg)](https://github.com/de-luca/electron-json-config/actions)

> Simply set and get configuration from a json file for your Electron app

**This is the 2.x.x tree.**  
**For 1.x.x code and documentation please refer to [the 1.x.x tree](https://github.com/de-luca/electron-json-config/tree/1.x.x).**  
**See [UPGRADE.md](./UPGRADE.md) for an upgrade guide.**

This package can only be used from the **[main process](https://www.electronjs.org/docs/tutorial/quick-start#main-and-renderer-processes)**.


## Installation

### NPM
```
npm install --save electron-json-config@beta
```

### yarn
```
yarn add electron-json-config@beta
```


## Usage

#### CommonJS
```js
const config = require('electron-json-config').factory();

config.set('foo', 'bar');
console.log(config.get('foo')); // bar
```

#### ES Modules
```ts
import { factory } from 'electron-json-config';

const config = factory();

config.set('foo', 'bar');
console.log(config.get('foo')); // bar
```


## Documentation

### Key

```ts
type Key = string | Array<string>;
```
A `key` can be :
- a classic string key  
  eg: `'foo'`
- a dotted string multi level key  
  eg: `'foo.bar'`
- an array of string representing a multi level key  
  eg: `['foo', 'bar']`

### ConfigOptions

```ts
type ConfigOptions = {
  prettyJson?: {
    enabled: boolean;
    indentSize?: number;
  };
};
```

Options for creating and storing Config contents.
Currently supports formatting the JSON file contents in a pretty, indented 
format for easy readability or editability.

`prettyJson.identSize` defaults to `2` if this option is `enabled`.


### Storable

```ts
interface Storable {
  [key: string]: Storable | any;
}
```


### `factory(file?: string, key?: string, options?: ConfigOptions): Conf`

**Description:**  
Create an instance of [Config] and returns it.  
If an instance with the same key exist, returns this instance instead.  

If file is specified, the configuration will be saved to that file instead of the default `app.getPath('userData') + '/config.json'`.

If key is specified, the requested instance will be saved under une given key instead of the default `userData`.

**Examples:**
```ts
// file: app.getPath('userData') + '/config.json'
// key: 'userData'
factory();

// file: '/data/test.json'
// key: '/data/test.json'
factory('/data/test.json');

// file: '/data/test.json'
// key: 'test'
factory('/data/test.json', 'test');

// file: app.getPath('userData') + '/config.json'
// key: 'test'
factory(undefined, 'test');

// file: app.getPath('userData') + '/config.json'
// key: 'test'
// JSON stored in readable, indented format (with default 2 space tab)
factory(undefined, 'test', { prettyJson: { enabled: true }});
```

**Parameters:**
| Name       | Type            | Default                                    |
| ---------- | --------------- | ------------------------------------------ |
| `file?`    | [string]        | `app.getPath('userData') + '/config.json'` |
| `key?`     | [string]        | `key || file || 'userData'`                |
| `options?` | [ConfigOptions] | `{ prettyJson: { enabled: false }}`        |

**Returns:** void


### Config

The config class is a set of wrappers and helpers providing access to configuration and file synchronization.

#### `new Config(file: string, data: Storable, options?: ConfigOptions): Config`
**Parameters:**
| Name       | Type            |
| ---------- | --------------- |
| `file`     | [string]        |
| `data`     | [Storable]      |
| `options?` | [ConfigOptions] |

**Returns:** [Config]

#### `get file(): string`
**Description:** Returns the name of the file the config is stored in.

**Returns:** [string]

#### `all(): Storable`
**Description:** Returns all the data currently saved.

**Returns:** [Storable]

#### `delete(key: Key): void`
**Description:** Removes the key and its value from the config file.

**Parameters:**
| Name  | Type  |
| ----- | ----- |
| `key` | [Key] |

**Returns:** void

#### `deleteBulk(keys: Array<Key>): void`
**Description:** Removes all the keys specified and theirs value from the config file.

**Parameters:**
| Name   | Type            |
| ------ | --------------- |
| `keys` | [Array]\<[Key]> |

**Returns:** void

#### `get<T>(key: Key, defaultValue?: T): T | undefined`
**Description:** Returns the value associated with the key, undefined otherwise.
You can specify a default value returned in case the key does not exists.

**Parameters:**
| Name            | Type  |
| --------------- | ----- |
| `key`           | [Key] |
| `defaultValue?` | T     |

**Returns:** T \| undefined

#### `has(key: Key): boolean`
**Description:** Checks if a key exists.

**Parameters:**
| Name  | Type  |
| ----- | ----- |
| `key` | [Key] |

**Returns:** [boolean]

#### `keys(key?: Key): Array<string>`
**Description:** If `key` is omitted, returns an array containing all keys in the config file.  
If `key` is provided, returns an array containing all sub keys in the key object.

**Parameters:**
| Name   | Type  |
| ------ | ----- |
| `key?` | [Key] |

**Returns:** [Array]\<[string]>

#### `purge(): void`
**Description:** Removes all data from the config file.

**Returns:** void

#### `set<T>(key: Key, `value`: Storable | T): void`
**Description:** Sets a key with the specified value. Overwrites the value, if the key already exists.

**Parameters:**
| Name    | Type            |
| ------- | --------------- |
| `key`   | [Key]           |
| `value` | [Storable] \| T |

**Returns:** void

#### `setBulk<T>(items: { [key:string]: Storable | T }): void`
**Description:** Like .set() but sets multiple keys in a single call.

**Parameters:**
| Name    | Type                                 |
| ------- | ------------------------------------ |
| `items` | { [key: [string]]: [Storable] \| T } |

**Returns:** void


[Key]: #key
[ConfigOptions]: #configOptions
[Storable]: #storable
[Config]: #config
[string]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String
[boolean]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean
[Array]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array
