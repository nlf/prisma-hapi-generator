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

export function generateCreateRouteFile (project: Project, model: DMMF.Model, options: GenerateOptions) {
  const createFilePath = join(options.cwd, 'create.ts');
  const createFile = project.addSourceFileAtPathIfExists(createFilePath) ?? project.createSourceFile(createFilePath);

  ensureNamedImports(createFile, '@hapi/hapi', {
    types: ['Lifecycle', 'Request', 'ResponseToolkit', 'RouteOptions', 'RouteOptionsValidate'],
  });

  const relPath = project.createDirectory(options.cwd)
    .getRelativePathAsModuleSpecifierTo(options.config.output);

  ensureNamedImports(createFile, relPath, {
    named: ['Schemas'],
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
      const camelName = getCamelName(model.name);
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
        initializer: `Schemas.Create${model.name}`,
      },
    },
  });

  ensureObjectDeclaration(createFile, `Create${model.name}`, {
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
