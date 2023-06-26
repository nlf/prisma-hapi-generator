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

export function generateGetRouteFile (project: Project, model: DMMF.Model, options: HapiGeneratorOptions) {
  const getFilePath = join(options.paths.routes, camelize(model.name, true), 'get.ts');
  const getFile = project.addSourceFileAtPathIfExists(getFilePath) ?? project.createSourceFile(getFilePath);

  ensureNamedImports(getFile, '@hapi/hapi', {
    types: ['Lifecycle', 'Request', 'ResponseToolkit', 'RouteOptions'],
  });

  ensureNamedImports(getFile, getRelativeImport(getFilePath, options.paths.types), {
    types: [`${model.name}Params`],
  });

  ensureFunctionDeclaration(getFile, 'handler', {
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
      const camelName = camelize(model.name, true);
      return writer
        .write(`const result = await h.prisma.${camelName}.findUnique(`)
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
        .write('if (!result)')
        .block(() => {
          return writer
            .write('return h.response().code(404)');
        })
        .newLine()
        .newLine()
        .write(`return result`);
    },
  });

  // TODO: route parameter validation?

  ensureObjectDeclaration(getFile, `Get${model.name}Route`, {
    type: 'RouteOptions',
    declarationKind: VariableDeclarationKind.Const,
    isExported: true,
    leadingTrivia: (writer) => writer.blankLineIfLastNot(),
    properties: {
      handler: { kind: StructureKind.ShorthandPropertyAssignment },
    },
  });

  getFile.formatText(options.formatSettings);
}
