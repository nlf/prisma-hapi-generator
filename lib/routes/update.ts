import { join } from 'node:path';

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
  getCamelName,
  type GenerateOptions,
} from '../util';

export function generateUpdateRouteFile (project: Project, model: DMMF.Model, options: GenerateOptions) {
  const updateFilePath = join(options.cwd, 'update.ts');
  const updateFile = project.addSourceFileAtPathIfExists(updateFilePath) ?? project.createSourceFile(updateFilePath);

  ensureNamedImports(updateFile, '@hapi/hapi', {
    types: ['Request', 'ResponseToolkit', 'RouteOptions', 'RouteOptionsValidate', 'Lifecycle'],
  });

  const relPath = project.createDirectory(options.cwd)
    .getRelativePathAsModuleSpecifierTo(options.config.output);

  ensureNamedImports(updateFile, relPath, {
    named: ['Schemas'],
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
      const camelName = getCamelName(model.name);
      return writer
        .write('try')
        .block(() => {
          return writer
            .write(`const result = await h.prisma.${camelName}.update(`)
            .inlineBlock(() => {
              return writer
                .write('where:')
                .block(() => {
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
        initializer: `Schemas.Update${model.name}`,
      },
    },
  });

  ensureObjectDeclaration(updateFile, `Update${model.name}`, {
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
