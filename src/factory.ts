import { app, remote } from 'electron';
import { join } from 'path';
import { read } from './utils';
import Conf from './Config';

const defaultKey = 'userData';
const defaultFile = join((app || remote.app).getPath('userData'), 'config.json');

const instances: Map<string, Conf> = new Map();


export function factory(file?: string, key?: string): Conf {
    const actualKey = key || file || defaultKey;

    if (!instances.has(actualKey)) {
        const actualFile = file || defaultFile;

        instances.set(
            actualKey,
            new Conf(actualFile, read(actualFile))
        );
    }
    
    return instances.get(actualKey) as Conf;
}