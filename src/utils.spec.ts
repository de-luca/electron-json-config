import { expect } from 'chai';
import { join } from 'path';
import { app, remote } from 'electron';
import {
    mkdirSync,
    rmdirSync,
    unlinkSync,
    readFileSync,
    writeFileSync,
} from 'fs';
import * as utils from './utils';
import Storable from './Storable';


const tmpDir = (app || remote.app).getPath("temp");

function unlinkTmpFiles() {
    try {
        unlinkSync(join(tmpDir, 'iexist'));
    } catch(e) {}
    
    try {
        unlinkSync(join(tmpDir, 'iDONTexist'));
    } catch (e) {}

    try {
        rmdirSync(join(tmpDir, 'IamAdir'));
    } catch (e) {}
}


describe('utils.sync', () => {
    it('updates the file with given object', () => {
        const path = join(tmpDir, 'iexist');
        const data: Storable = {
            first: 'level',
            deep: { nested: 'value' },
        };

        utils.sync(path, data);
        
        const content = readFileSync(path).toString();
        expect(content).to.equals(JSON.stringify(data));
    });
});

describe('utils.read', () => {
    afterEach(unlinkTmpFiles);

    it('returns an empty object if file does not exists', () => {
        const path = join(tmpDir, 'iDONTexist');
        expect(utils.read(path)).to.deep.equals({});
    });

    it('returns an the stored object if file exists', () => {
        const path = join(tmpDir, 'iexist');
        const data: Storable = { someData: "hey!" };

        writeFileSync(path, JSON.stringify(data));

        expect(utils.read(path)).to.deep.equals(data);
    });

    it('throws if another error happen', () => {
        const path = join(tmpDir, 'IamAdir');
        mkdirSync(path);
        expect(() => { utils.read(path) }).to.throw(Error);
    });
});

describe('utils.search', () => {
    const data: Storable = {
        first: 'level',
        answer: 42,
        deep: { nested: 'value' },
    };

    it('returns a top level item', () => {
        expect(utils.search<number>(data, 'answer')).to.equals(42);
    });

    it('returns a deep nested item', () => {
        expect(utils.search<string>(data, 'deep.nested')).to.equals('value');
    });

    it('returns undefined for a non existing item', () => {
        expect(utils.search(data, 'unexistant')).to.be.undefined;
    });
});

describe('utils.set', () => {
    it('sets a top level value', () => {
        const data: Storable = {
            first: 'level',
            deep: { nested: 'value' },
        };

        utils.set(data, 'foo', 'bar');
        expect(data?.foo).to.equal('bar');
    });

    it('sets a nested value', () => {
        const data: Storable = {
            first: 'level',
            deep: { nested: 'value' },
        };

        utils.set(data, 'deep.super.nested', 'bar');
        expect(data.deep?.super?.nested).to.equal('bar');
    });
});

describe('utils.remove', () => {
    it('removes a top level value', () => {
        const data: Storable = {
            first: 'level',
            deep: { nested: 'value' },
        };

        utils.remove(data, 'first');
        expect(data.first).to.be.undefined;
    });

    it('removes a nested value', () => {
        const data: Storable = {
            first: 'level',
            deep: { nested: 'value' },
        };

        utils.remove(data, 'deep.nested');
        expect(data.deep.nested).to.be.undefined;
    });

    it('does nothing on an absent value', () => {
        const data: Storable = {
            first: 'level',
            deep: { nested: 'value' },
        };

        utils.remove(data, 'not.Existing');
        expect(data).to.deep.equal(data);
    });
});

describe('utils.pathiffy', () => {
    it('returns the same array if key is already an array', () => {
        const key = ['foo', 'bar'];
        expect(utils.pathiffy(key)).to.deep.equal(key);
    });

    it('returns an array if key is a dotted string', () => {
        const key = 'foo.bar';
        expect(utils.pathiffy(key)).to.deep.equal(['foo', 'bar']);
    });

    it('returns an array with a single entry if key is a simple string', () => {
        const key = 'foo';
        expect(utils.pathiffy(key)).to.deep.equal(['foo']);
    });
});