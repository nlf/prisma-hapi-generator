import { Project } from 'ts-morph';
import t from 'tap';

import { getGeneratorOptions } from './fixtures/util';

void t.test('generator generates', async (t) => {
  const { root, options } = await getGeneratorOptions(t);
  const project = new Project(options.projectSettings);
  t.end();
});
