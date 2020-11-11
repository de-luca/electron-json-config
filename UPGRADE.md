# Upgrade from `1.x.x` to `2.x.x`

## New export/structure

**`1.x.x`**:

```js
const config = require('electron-json-config');
```

**`2.x.x`**:

`factory()` is now responsible of the instanciation.

`require` syntax
```js
const config = require('electron-json-config').factory();
```
`import` ES6/TS syntax
```ts
import { factory } from 'electron-json-config';

const config = factory();
```


## Default file usage

The library keeps its default file functionality but will not check if the electron app is read.

**`1.x.x`**:

Returned the default configuration from the default file.

```js
const config = require('electron-json-config');
```

**`2.x.x`**:

Returns the default configuration from the default file

`require` syntax
```js
const config = require('electron-json-config').factory();
```
`import` ES6/TS syntax
```ts
import { factory } from 'electron-json-config';

const config = factory();
```

## Multifile

*See [factory section of README](./README.md#factoryfile-string-key-string-conf).*

2.x.x introduce the ability to have multiple configurations (and associated files) at the same time.

**`2.x.x`**:

`require` syntax
```js
const factory = require('electron-json-config').factory;

const defaultConf = factory();
const testConf = factory('/data/test.json');
```

`import` ES6/TS syntax
```ts
import { factory } from 'electron-json-config';

const config = factory();

const defaultConf = factory();
const testConf = factory('/data/test.json');
```

## Key versality

*See [Key section of README](./README.md#key).*

Keys can now be:
- a classic string key  
  eg: `'foo'`
- a dotted string multi level key  
  eg: `'foo.bar'`
- an array of string representing a multi level key  
  eg: `['foo', 'bar']`

**2.x.x**:
`require` syntax
```js
// A simple key => ['foo']
config.get('foo');

// These are equivalent => ['foo', 'bar']
config.get('foo.bar');
config.get(['foo', 'bar']);
```