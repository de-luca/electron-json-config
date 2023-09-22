import { app } from 'electron';
import { expect } from 'chai';
import { join } from 'path';
import { factory } from './factory';

describe('factory', () => {
  it('returns a default userData without any params', () => {
    const conf = factory();
    expect(conf.file).to.equals(join(app.getPath('userData'), 'config.json'));
  });

  it('returns a custom config from params', () => {
    const tmpFile = join(app.getPath('temp'), 'testConf.json');
    const conf = factory(tmpFile, 'my-super-config');
    expect(conf.file).to.equals(tmpFile);
  });

  it('returns the same instance when calling twice the same', () => {
    const tmpFile = join(app.getPath('temp'), 'myConf.json');
    const conf = factory(tmpFile);
    conf.set('foo', 'bar');

    const reConf = factory(tmpFile);
    expect(reConf.get('foo')).to.equals('bar');
  });
});
