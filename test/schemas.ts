import { Project } from 'ts-morph';
import t from 'tap';

import { getGeneratorOptions } from './fixtures/util';
import { generateSchemasFile } from '../lib/schemas';

void t.test('generates schemas', async (t) => {
  const options = await getGeneratorOptions(t);

  const project = new Project(options.projectSettings);
  generateSchemasFile(project, options);
  await project.save();

  const typesFile = project.getSourceFileOrThrow('/lib/schemas.ts');
  t.matchSnapshot(typesFile.getFullText(), '/lib/schemas.ts');

  t.end();
});
