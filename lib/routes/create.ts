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

export function generateCreateRouteFile (project: Project, model: DMMF.Model, options: HapiGeneratorOptions) {
  const camelName = camelize(model.name, true);
  const createFilePath = join(options.paths.routes, camelName, 'create.ts');
  const createFile = project.addSourceFileAtPathIfExists(createFilePath) ?? project.createSourceFile(createFilePath);

  ensureNamedImports(createFile, '@hapi/hapi', {
    types: ['Lifecycle', 'Request', 'ResponseToolkit', 'RouteOptions', 'RouteOptionsValidate'],
  });

  ensureNamedImports(createFile, getRelativeImport(createFilePath, options.paths.schemas), {
    named: [`Create${model.name}Schema`],
  });
  
  ensureNamedImports(createFile, getRelativeImport(createFilePath, options.paths.types), {
    types: [`Create${model.name}Payload`],
  });

  ensureFunctionDeclaration(createFile, 'handler', {
    isAsync: true,
    type: 'Promise<Lifecycle.ReturnValue>',
    parameters: [{
      name: 'request',
      type: `Request<Create${model.name}Payload>`,
    }, {
      name: 'h',
      type: 'ResponseToolkit',
    }],
    statements: (writer: CodeBlockWriter) => {
      return writer
        .write(`const result = await h.prisma.${camelName}.create({ data: request.payload })`)
        .newLine()
        .newLine()
        .write('return h.response(result)')
        .newLine()
        .indent()
        .write('.code(201)');
    },
  });

  ensureObjectDeclaration(createFile, 'validate', {
    declarationKind: VariableDeclarationKind.Const,
    type: 'RouteOptionsValidate',
    leadingTrivia: (writer) => writer.blankLineIfLastNot(),
    properties: {
      payload: {
        kind: StructureKind.PropertyAssignment,
        initializer: `Create${model.name}Schema`,
      },
    },
  });

  ensureObjectDeclaration(createFile, `Create${model.name}Route`, {
    type: 'RouteOptions',
    declarationKind: VariableDeclarationKind.Const,
    isExported: true,
    leadingTrivia: (writer) => writer.blankLineIfLastNot(),
    properties: {
      handler: { kind: StructureKind.ShorthandPropertyAssignment },
      validate: { kind: StructureKind.ShorthandPropertyAssignment },
    },
  });

  createFile.formatText(options.formatSettings);
}
