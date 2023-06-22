import { Project } from 'ts-morph';
import t from 'tap';

import { getGeneratorOptions } from './fixtures/util';
import { generateTypesFile } from '../lib/types';

void t.test('generates types', async (t) => {
  const options = await getGeneratorOptions(t);

  const project = new Project(options.projectSettings);
  generateTypesFile(project, options);
  await project.save();

  t.end();
});
