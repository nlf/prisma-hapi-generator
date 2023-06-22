import { generatorHandler } from '@prisma/generator-helper';
import { Project } from 'ts-morph';

import { generateExportFile } from './export';
import { generateRouteFiles } from './routes';
import { generateSchemasFile } from './schemas';
import { generateTypesFile } from './types';
import { getOptions } from './util';

// @ts-expect-error - typescript doesn't like importing json, tell it to be quiet
import { version } from '../package.json';

generatorHandler({
  onManifest () {
    return {
      prettyName: 'Joi Schemas',
      defaultOutput: 'joi',
      version: version as string,
    };
  },
  async onGenerate (generatorOptions) {
    const options = getOptions(generatorOptions);
    const project = new Project(options.projectSettings);

    generateSchemasFile(project, options);
    generateTypesFile(project, options);
    generateExportFile(project, options);
    generateRouteFiles(project, options);

    return await project.save();
  },
});
