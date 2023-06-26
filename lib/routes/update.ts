import { join } from 'node:path';

import { camelize } from 'inflection';
import type { DMMF } from '@prisma/generator-helper';
import {
  StructureKind,
  VariableDeclarationKind,
  type CodeBlockWriter,
  type Project,
} from 'ts-morph';

import {
  ensureFunctionDeclaration,
  ensureNamedImports,
  ensureObjectDeclaration,
  getRelativeImport,
  type HapiGeneratorOptions,
} from '../util';

export function generateUpdateRouteFile (project: Project, model: DMMF.Model, options: HapiGeneratorOptions) {
  const camelName = camelize(model.name, true);
  const updateFilePath = join(options.paths.routes, camelName, 'update.ts');
  const updateFile = project.addSourceFileAtPathIfExists(updateFilePath) ?? project.createSourceFile(updateFilePath);

  ensureNamedImports(updateFile, '@hapi/hapi', {
    types: ['Lifecycle', 'Request', 'ResponseToolkit', 'RouteOptions', 'RouteOptionsValidate'],
  });

  ensureNamedImports(updateFile, getRelativeImport(updateFilePath, options.paths.schemas), {
    named: [`Update${model.name}Schema`],
  });

  ensureNamedImports(updateFile, getRelativeImport(updateFilePath, options.paths.types), {
    types: ['ErrorWithCode', `Update${model.name}Payload`, `${model.name}Params`],
  });

  ensureFunctionDeclaration(updateFile, 'handler', {
    isAsync: true,
    type: 'Promise<Lifecycle.ReturnValue>',
    parameters: [{
      name: 'request',
      type: `Request<Update${model.name}Payload & ${model.name}Params>`,
    }, {
      name: 'h',
      type: 'ResponseToolkit',
    }],
    statements: (writer: CodeBlockWriter) => {
      return writer
        .write('try')
        .block(() => {
          return writer
            .write(`const result = await h.prisma.${camelName}.update(`)
            .inlineBlock(() => {
              return writer
                .write('where:')
                .inlineBlock(() => {
                  return writer
                    .write(`id: request.params.${camelName}Id,`);
                })
                .write(',')
                .newLine()
                .write('data: request.payload,');
            })
            .write(')')
            .newLine()
            .newLine()
            .write('return result');
        })
        .write('catch (err)')
        .block(() => {
          return writer
            .write('// istanbul ignore next - no need to test random errors')
            .newLine()
            .write('if ((err as ErrorWithCode).code !== \'P2025\')')
            .block(() => {
              return writer
                .write('throw err');
            })
            .newLine()
            .newLine()
            .write('return h.response().code(404)');
        });
    },
  });

  ensureObjectDeclaration(updateFile, 'validate', {
    declarationKind: VariableDeclarationKind.Const,
    type: 'RouteOptionsValidate',
    leadingTrivia: (writer) => writer.blankLineIfLastNot(),
    properties: {
      payload: {
        kind: StructureKind.PropertyAssignment,
        initializer: `Update${model.name}Schema`,
      },
    },
  });

  ensureObjectDeclaration(updateFile, `Update${model.name}Route`, {
    type: 'RouteOptions',
    declarationKind: VariableDeclarationKind.Const,
    isExported: true,
    leadingTrivia: (writer) => writer.blankLineIfLastNot(),
    properties: {
      handler: { kind: StructureKind.ShorthandPropertyAssignment },
      validate: { kind: StructureKind.ShorthandPropertyAssignment },
    },
  });

  updateFile.formatText(options.formatSettings);
}
