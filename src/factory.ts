import { app } from 'electron';
import { join } from 'path';
import { read } from './utils';
import Conf, { ConfigOptions, DEFAULT_CONFIG } from './Config';

const defaultFile = join(app.getPath('userData'), 'config.json');
const defaultKey = 'userData';

const instances: Map<string, Conf> = new Map();


export function factory(
    file?: string,
    key?: string,
    options: ConfigOptions = DEFAULT_CONFIG,
): Conf {
    const actualKey = key || file || defaultKey;

    if (!instances.has(actualKey)) {
        const actualFile = file || defaultFile;

        instances.set(
            actualKey,
            new Conf(actualFile, read(actualFile), options),
        );
    }

    return instances.get(actualKey) as Conf;
}
