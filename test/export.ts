import { readdirSync } from 'node:fs';
import { Project } from 'ts-morph';
import t from 'tap';

import { getGeneratorOptions } from './fixtures/util';
import { generateExportFile } from '../lib/export';

void t.test('generates exports', async (t) => {
  const { root, options } = await getGeneratorOptions(t);

  const project = new Project(options.projectSettings);
  generateExportFile(project, options);
  await project.save();

  t.end();
});
