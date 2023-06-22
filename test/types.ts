import { Project } from 'ts-morph';
import t from 'tap';

import { getGeneratorOptions } from './fixtures/util';
import { generateTypesFile } from '../lib/types';

void t.test('generates types', async (t) => {
  const { root, options } = await getGeneratorOptions(t);

  const project = new Project(options.projectSettings);
  generateTypesFile(project, options);
  await project.save();

  console.error(project.getSourceFiles());

  t.end();
});
