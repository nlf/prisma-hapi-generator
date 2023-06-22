import { join } from 'node:path';
import { type Project, ModuleDeclarationKind } from 'ts-morph';

import type { GenerateOptions } from './util';

const getIdType = (fieldType: string): string => {
  if (fieldType === 'String') {
    return 'string';
  }

  // istanbul ignore else - we only support string and number id types
  if (fieldType === 'Int' || fieldType === 'Float' || fieldType === 'Decimal') {
    return 'number';
  }

  // istanbul ignore next - should be unreachable, only here to maintain a consistent return type
  return 'unknown';
};

export function generateTypesFile (project: Project, options: GenerateOptions) {
  const typesFilePath = join(options.config.output, 'types.ts');
  const typesFile = project.createSourceFile(typesFilePath, {}, { overwrite: true });

  const clientPath = project.createDirectory(options.config.output)
    .getRelativePathAsModuleSpecifierTo(options.config.clientPath);

  typesFile.addImportDeclaration({
    moduleSpecifier: clientPath,
    isTypeOnly: true,
    namedImports: ['Prisma', 'PrismaClient'],
    leadingTrivia: (writer) => {
      return writer
        .write(options.fileHeader)
        .newLine()
        .newLine();
    },
  });

  typesFile.addImportDeclaration({
    moduleSpecifier: '@hapi/hapi',
    isTypeOnly: true,
    namespaceImport: 'Hapi',
  });

  typesFile.addInterface({
    name: 'ErrorWithCode',
    isExported: true,
    extends: ['Error'],
    leadingTrivia: (writer) => writer.blankLineIfLastNot(),
    properties: [{
      name: 'code',
      type: 'string',
    }],
  });

  for (const model of options.models) {
    // create model payload
    typesFile.addInterface({
      name: `Create${model.name}Payload`,
      isExported: true,
      extends: ['Hapi.ReqRefDefaults'],
      leadingTrivia: (writer) => writer.blankLineIfLastNot(),
      properties: [{
        name: 'Payload',
        type: `Prisma.${model.name}CreateInput`,
      }],
    });

    // update model payload
    typesFile.addInterface({
      name: `Update${model.name}Payload`,
      isExported: true,
      extends: ['Hapi.ReqRefDefaults'],
      properties: [{
        name: 'Payload',
        type: `Prisma.${model.name}UpdateInput`,
      }],
    });

    // and the params
    const idFieldName = model.name[0].toLowerCase() + model.name.slice(1) + 'Id';
    const idField = model.fields.find((field) => field.isId);
    typesFile.addInterface({
      name: `${model.name}IdParam`,
      properties: [{
        name: idFieldName,
        // coverage disabled on the null coalescing because it shouldn't be possible
        type: getIdType(idField?.type ?? /* istanbul ignore next */ 'unknown'),
      }],
    });

    typesFile.addInterface({
      name: `${model.name}Params`,
      isExported: true,
      extends: ['Hapi.ReqRefDefaults'],
      properties: [{
        name: 'Params',
        type: `${model.name}IdParam`,
      }],
    });
  }

  const hapiModule = typesFile.addModule({
    name: `'@hapi/hapi'`,
    hasDeclareKeyword: true,
    declarationKind: ModuleDeclarationKind.Module,
  });

  hapiModule.addInterface({
    name: 'ServerApplicationState',
    extends: ['Hapi.ServerApplicationState'],
    properties: [{
      name: 'prisma',
      type: 'PrismaClient',
    }],
  });

  hapiModule.addInterface({
    name: 'ResponseToolkit',
    extends: ['Hapi.ResponseToolkit'],
    properties: [{
      name: 'prisma',
      type: 'PrismaClient',
    }],
  });

  typesFile.formatText(options.formatSettings);
}
