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

export function generateGetRouteFile (project: Project, model: DMMF.Model, options: GenerateOptions) {
  const getFilePath = join(options.cwd ?? options.config.output, 'get.ts');
  const getFile = project.addSourceFileAtPathIfExists(getFilePath) ?? project.createSourceFile(getFilePath);

  ensureNamedImports(getFile, '@hapi/hapi', {
    types: ['Request', 'ResponseToolkit', 'RouteOptions', 'Lifecycle'],
  });

  const relPath = project.createDirectory(options.cwd ?? options.config.output)
    .getRelativePathAsModuleSpecifierTo(options.config.output);

  ensureNamedImports(getFile, relPath, {
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
      const camelName = getCamelName(model.name);
      return writer
        .write(`const result = await h.prisma.${camelName}.findUnique(`)
        .inlineBlock(() => {
          return writer
            .write('where:')
            .block(() => {
              return writer
                .write(`id: request.params.${camelName}Id,`);
            });
        })
        .write(')')
        .newLine()
        .newLine()
        .write('if (!result)')
        .block(() => {
          return writer
            .write('h.response().code(404)');
        })
        .newLine()
        .newLine()
        .write(`return result`);
    },
  });

  // TODO: route parameter validation?

  ensureObjectDeclaration(getFile, `Get${model.name}`, {
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
