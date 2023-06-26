import { resolve } from 'node:path';
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

  const generator = generatorConfig.generators.find((g) => g.provider.value === 'prisma-hapi-generator');
  generator!.output!.value = resolve('/', generator!.output!.value!);
  const otherGenerators = generatorConfig.generators.filter((g) => g.provider.value !== 'prisma-hapi-generator');
  for (const otherGenerator of otherGenerators) {
    otherGenerator.output!.value = resolve('/', otherGenerator.output!.value!);
  }

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
