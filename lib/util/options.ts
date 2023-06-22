import type { DMMF, GeneratorOptions } from '@prisma/generator-helper';
import { type ProjectOptions, IndentationText, QuoteKind } from 'ts-morph';
import { type FormatCodeSettings, SemicolonPreference } from 'typescript';

interface Config {
  output: string;
  clientPath: string;
}

export interface GenerateOptions {
  config: Config;
  formatSettings: FormatCodeSettings;
  projectSettings: ProjectOptions;
  models: DMMF.Model[];
  cwd?: string;
}

export const getOptions = (options: GeneratorOptions): GenerateOptions => {
  const clientGenerator = options.otherGenerators.find((g) => g.name === 'client');
  if (!clientGenerator) {
    throw new Error('The prisma-client-js generator is required');
  }

  const result: GenerateOptions = {
    config: {
      output: options.generator.output?.value ?? './hapi',
      clientPath: clientGenerator.output?.value ?? './client',
    },
    formatSettings: {
      indentSize: 2,
      tabSize: 2,
      semicolons: SemicolonPreference.Insert,
    },
    projectSettings: {
      manipulationSettings: {
        quoteKind: QuoteKind.Single,
        useTrailingCommas: true,
        indentationText: IndentationText.TwoSpaces,
      },
    },
    models: options.dmmf.datamodel.models,
  };

  if (process.env.NODE_ENV === 'test') {
    result.projectSettings.useInMemoryFileSystem = true;
  }

  return result;
};

