import { expect } from 'chai';
import { join } from 'path';
import { app, remote } from 'electron';
import { unlinkSync, readFileSync } from 'fs';
import Config from './Config';


const tmpFile = join((app || remote.app).getPath("temp"), 'test.json');

afterEach(() => {
    try {
        unlinkSync(tmpFile);
    } catch (e) { }
})


describe('Config.has', () => {
    const config = new Config(
        tmpFile,
        { exists: 'yes' },
    );

    it('returns true if config has key', () => {
        expect(config.has('exists')).to.be.true;
    });

    it('returns false if config does not have key', () => {
        expect(config.has('notExisting')).to.be.false;
    });
});

describe('Config.set', () => {
    const config = new Config(tmpFile, {});

    it('adds a value under a top level key', () => {
        config.set('foo', 'bar');
        expect((config as any)._data?.foo).to.equals('bar');
    });

    it('adds a value under a nested key', () => {
        config.set('the.answer', 42);
        expect((config as any)._data?.the?.answer).to.equals(42);
    });

    it('syncs the file on call', () => {
        config.set('isSynced', 'sure');
        const content = readFileSync(tmpFile).toString();
        expect(content).to.equals(JSON.stringify((config as any)._data));
    });
});

describe('Config.setBulk', () => {
    const config = new Config(tmpFile, {});

    it('adds multiple values in a single call', () => {
        config.setBulk({
            'foo': 'bar',
            'the.answer': 42,
        });
        expect((config as any)._data?.foo).to.equals('bar');
        expect((config as any)._data?.the?.answer).to.equals(42);
    });

    it('syncs the file on call', () => {
        config.set('isSynced', 'sure');
        const content = readFileSync(tmpFile).toString();
        expect(content).to.equals(JSON.stringify((config as any)._data));
    });
});

describe('Config.get', () => {
    const config = new Config(
        tmpFile,
        {
            first: 'level',
            answer: 42,
            deep: { nested: 'value' },
        },
    );

    it('returns an existing top level value', () => {
        expect(config.get<number>('answer')).to.equals(42);
    });

    it('returns an existing nested value', () => {
        expect(config.get<string>('deep.nested')).to.equals('value');
    });

    it('returns undefined when key does not exists', () => {
        expect(config.get<string>('notExistingString')).to.be.undefined;
    });

    it('returns default value when key does not exists', () => {
        expect(config.get<string>('notExistingString', 'bar')).to.equals('bar');
    });
});

describe('Config.keys', () => {
    const config = new Config(
        tmpFile,
        {
            first: 'level',
            answer: 42,
            deep: { nested: 'value' },
        },
    );

    it('returns top level keys', () => {
        expect(config.keys()).to.deep.equals(['first', 'answer', 'deep']);
    });

    it('returns nested level keys', () => {
        expect(config.keys('deep')).to.deep.equals(['nested']);
    });
});

describe('Config.all', () => {
    const data = {
        first: 'level',
        answer: 42,
        deep: { nested: 'value' },
    };
    const config = new Config(tmpFile, data);

    it('returns the whole configuration', () => {
        expect(config.all()).to.deep.equals(data);
    });
});

describe('Config.delete', () => {
    const config = new Config(
        tmpFile,
        {
            first: 'level',
            answer: 42,
            deep: { nested: 'value' },
        },
    );

    it('removes a top level value', () => {
        config.delete('first');
        expect((config as any)._data?.first).to.be.undefined;
    });

    it('removes a nested value', () => {
        config.delete('deep.nested');
        expect((config as any)._data?.deep?.nested).to.be.undefined;
    });
});

describe('Config.deleteBulk', () => {
    const config = new Config(
        tmpFile,
        {
            first: 'level',
            answer: 42,
            deep: { nested: 'value' },
        },
    );

    it('removes multiple keys in a single call', () => {
        config.deleteBulk(['first', 'deep.nested']);
        expect((config as any)._data?.first).to.be.undefined;
        expect((config as any)._data?.deep?.nested).to.be.undefined;
    });
});

describe('Config.purge', () => {
    const config = new Config(
        tmpFile,
        {
            first: 'level',
            answer: 42,
            deep: { nested: 'value' },
        },
    );

    it('removes all the configuration', () => {
        config.purge();
        expect((config as any)._data).to.deep.equals({});
    });
});