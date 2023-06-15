import { type Dictionary, generatorHandler } from '@prisma/generator-helper';
import { type FormatCodeSettings, SemicolonPreference } from 'typescript';
import { IndentationText, Project, QuoteKind } from 'ts-morph';

import { generateSchemaFile } from './joi';
import { generateTypesFile } from './types';

export interface GenerateOptions {
  config: Dictionary<string>;
  formatSettings: FormatCodeSettings;
}

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
  async onGenerate (options) {
    const project = new Project({
      manipulationSettings: {
        quoteKind: QuoteKind.Single,
        useTrailingCommas: true,
        indentationText: IndentationText.TwoSpaces,
      },
    });

    const models = options.dmmf.datamodel.models;
    const clientGenerator = options.otherGenerators.find((gen) => gen.name === 'client');
    if (!clientGenerator) {
      throw new Error('The prisma-client-js generator is required');
    }

    const generateSettings = {
      config: {
        output: options.generator.output?.value ?? './hapi',
        clientPath: clientGenerator.output?.value ?? '', 
      },
      formatSettings: {
        indentSize: 2,
        semicolons: SemicolonPreference.Insert,
      },
    };

    generateSchemaFile(project, models, generateSettings);
    generateTypesFile(project, models, generateSettings);

    const indexFile = project.createSourceFile(`${generateSettings.config.output}/index.ts`, {}, { overwrite: true });

    indexFile.addExportDeclaration({
      namedExports: ['Prisma', 'PrismaClient', ...models.map((model) => model.name)],
      moduleSpecifier: './client',
    });

    indexFile.addExportDeclaration({
      namespaceExport: 'Schemas',
      moduleSpecifier: './schemas',
    });

    indexFile.addExportDeclaration({
      isTypeOnly: true,
      moduleSpecifier: './types',
    });

    return await project.emit();
  },
});
