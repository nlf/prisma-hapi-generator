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

export function generateDeleteRouteFile (project: Project, model: DMMF.Model, options: GenerateOptions) {
  const deleteFilePath = join(options.cwd, 'delete.ts');
  const deleteFile = project.addSourceFileAtPathIfExists(deleteFilePath) ?? project.createSourceFile(deleteFilePath);

  ensureNamedImports(deleteFile, '@hapi/hapi', {
    types: ['Lifecycle', 'Request', 'ResponseToolkit', 'RouteOptions'],
  });

  const relPath = project.createDirectory(options.cwd)
    .getRelativePathAsModuleSpecifierTo(options.config.output);

  ensureNamedImports(deleteFile, relPath, {
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
      const camelName = getCamelName(model.name);
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

  ensureObjectDeclaration(deleteFile, `Delete${model.name}`, {
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
