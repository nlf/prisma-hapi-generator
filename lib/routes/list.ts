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
  type HapiGeneratorOptions,
} from '../util';

export function generateListRouteFile (project: Project, model: DMMF.Model, options: HapiGeneratorOptions) {
  const listFilePath = join(options.paths.routes, getCamelName(model.name), 'list.ts');
  const listFile = project.addSourceFileAtPathIfExists(listFilePath) ?? project.createSourceFile(listFilePath);

  ensureNamedImports(listFile, '@hapi/hapi', {
    types: ['Lifecycle', 'Request', 'ResponseToolkit', 'RouteOptions'],
  });

  ensureFunctionDeclaration(listFile, 'handler', {
    isAsync: true,
    type: 'Promise<Lifecycle.ReturnValue>',
    parameters: [{
      name: 'request',
      type: 'Request',
    }, {
      name: 'h',
      type: 'ResponseToolkit',
    }],
    statements: (writer: CodeBlockWriter) => {
      const camelName = getCamelName(model.name);
      return writer
        .write(`const result = await h.prisma.${camelName}.findMany()`)
        .newLine()
        .newLine()
        .write(`return result`);
    },
  });

  ensureObjectDeclaration(listFile, `List${model.name}Route`, {
    type: 'RouteOptions',
    declarationKind: VariableDeclarationKind.Const,
    isExported: true,
    leadingTrivia: (writer) => writer.blankLineIfLastNot(),
    properties: {
      handler: { kind: StructureKind.ShorthandPropertyAssignment },
    },
  });

  listFile.formatText(options.formatSettings);
}
