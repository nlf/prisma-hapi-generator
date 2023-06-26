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

export function generateDeleteRouteFile (project: Project, model: DMMF.Model, options: HapiGeneratorOptions) {
  const camelName = camelize(model.name, true);
  const deleteFilePath = join(options.paths.routes, camelName, 'delete.ts');
  const deleteFile = project.addSourceFileAtPathIfExists(deleteFilePath) ?? project.createSourceFile(deleteFilePath);

  ensureNamedImports(deleteFile, '@hapi/hapi', {
    types: ['Lifecycle', 'Request', 'ResponseToolkit', 'RouteOptions'],
  });

  ensureNamedImports(deleteFile, getRelativeImport(deleteFilePath, options.paths.types), {
    types: [`${model.name}Params`],
  });

  ensureFunctionDeclaration(deleteFile, 'handler', {
    isAsync: true,
    type: 'Promise<Lifecycle.ReturnValue>',
    parameters: [{
      name: 'request',
      type: `Request<${model.name}Params>`,
    }, {
      name: 'h',
      type: 'ResponseToolkit',
    }],
    statements: (writer: CodeBlockWriter) => {
      return writer
        .write(`await h.prisma.${camelName}.delete(`)
        .inlineBlock(() => {
          return writer
            .write('where:')
            .inlineBlock(() => {
              return writer
                .write(`id: request.params.${camelName}Id,`);
            })
            .write(',');
        })
        .write(')')
        .newLine()
        .newLine()
        .write('return h.response().code(200)');
    },
  });

  // TODO validate route parameters?

  ensureObjectDeclaration(deleteFile, `Delete${model.name}Route`, {
    type: 'RouteOptions',
    declarationKind: VariableDeclarationKind.Const,
    isExported: true,
    leadingTrivia: (writer) => writer.blankLineIfLastNot(),
    properties: {
      handler: { kind: StructureKind.ShorthandPropertyAssignment },
    },
  });

  deleteFile.formatText(options.formatSettings);
}
