import { Project } from 'ts-morph';
import { camelize } from 'inflection';
import t from 'tap';

import { getGeneratorOptions } from './fixtures/util';
import { generateRouteFiles } from '../lib/routes';

void t.test('generates routes', async (t) => {
  const options = await getGeneratorOptions(t);

  const project = new Project(options.projectSettings);
  generateRouteFiles(project, options);
  await project.save();

  for (const model of options.models) {
    for (const file of ['create', 'delete', 'get', 'index', 'list', 'update']) {
      const filePath = `/lib/routes/${camelize(model.name, true)}/${file}.ts`;
      const routeFile = project.getSourceFileOrThrow(filePath);
      t.matchSnapshot(routeFile.getFullText(), filePath);
    }
  }

  const routeIndexFile = project.getSourceFileOrThrow('/lib/routes/index.ts');
  t.matchSnapshot(routeIndexFile.getFullText(), '/lib/routes/index.ts');

  t.end();
});
