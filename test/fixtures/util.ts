import { readFileSync } from 'node:fs';
import type { GeneratorOptions } from '@prisma/generator-helper';
import { getConfig, getDMMF } from '@prisma/internals';

import { getOptions } from '../../lib/util';

const schemaFixture = readFileSync(`${__dirname}/schema.prisma`, { encoding: 'utf8' });

export const getGeneratorOptions = async (test: Tap.Test) => {
  const root = test.testdir({
    'schema.prisma': schemaFixture,
  });

  const generatorConfig = await getConfig({
    datamodel: schemaFixture,
    datamodelPath: `${root}/schema.prisma`,
  });

  const dmmf = await getDMMF({
    datamodel: schemaFixture,
    datamodelPath: `${root}/schema.prisma`,
  });

  const generator = generatorConfig.generators.find((g) => g.provider.value === 'prisma-joi');
  const otherGenerators = generatorConfig.generators.filter((g) => g.provider.value !== 'prisma-joi');

  const generatorOptions: GeneratorOptions = {
    datamodel: schemaFixture,
    datasources: generatorConfig.datasources,
    dmmf,
    schemaPath: `${root}/schema.prisma`,
    dataProxy: false,
    version: 'thiscanbenonsense',
    // @ts-expect-error - typescript believes this may be undefined
    generator,
    otherGenerators,
  };

  return getOptions(generatorOptions);
};
