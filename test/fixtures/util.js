"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getGeneratorOptions = void 0;
const node_fs_1 = require("node:fs");
const internals_1 = require("@prisma/internals");
const util_1 = require("../../lib/util");
const schemaFixture = (0, node_fs_1.readFileSync)(`${__dirname}/schema.prisma`, { encoding: 'utf8' });
const getGeneratorOptions = async (test) => {
    const root = test.testdir({
        'schema.prisma': schemaFixture,
    });
    const generatorConfig = await (0, internals_1.getConfig)({
        datamodel: schemaFixture,
        datamodelPath: `${root}/schema.prisma`,
    });
    const dmmf = await (0, internals_1.getDMMF)({
        datamodel: schemaFixture,
        datamodelPath: `${root}/schema.prisma`,
    });
    const generator = generatorConfig.generators.find((g) => g.provider.value === 'prisma-joi');
    const otherGenerators = generatorConfig.generators.filter((g) => g.provider.value !== 'prisma-joi');
    const generatorOptions = {
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
    return { root, options: (0, util_1.getOptions)(generatorOptions) };
};
exports.getGeneratorOptions = getGeneratorOptions;
