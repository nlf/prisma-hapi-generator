import { join } from 'path';
import type { Project } from 'ts-morph';

import { generateCreateRouteFile } from './create';
import { generateDeleteRouteFile } from './delete';
import { generateGetRouteFile } from './get';
import { generateListRouteFile } from './list';
import { generateUpdateRouteFile } from './update';
import { ensureArrayDeclaration, ensureNamedExports, ensureNamedImports, getCamelName, type GenerateOptions } from '../util';

export function generateRouteFiles (project: Project, options: GenerateOptions) {
  const routesPath = join(options.config.output, 'routes');
  project.createDirectory(routesPath);

  const indexFilePath = join(routesPath, 'index.ts');
  const indexFile = project.addSourceFileAtPathIfExists(indexFilePath) ?? project.createSourceFile(indexFilePath);
  ensureNamedImports(indexFile, '@hapi/hapi', {
    types: ['ServerRoute'],
  });

  const rootRouteTable = [];

  for (const model of options.models) {
    const routeTable = [];
    const camelName = getCamelName(model.name);
    const indexSpecifier = `./${camelName}`;

    const modelDirPath = join(routesPath, camelName);
    project.createDirectory(modelDirPath);

    const modelIndexFilePath = join(modelDirPath, 'index.ts');
    const modelIndexFile = project.addSourceFileAtPathIfExists(modelIndexFilePath) ?? project.createSourceFile(modelIndexFilePath);

    const modelOptions = { ...options, cwd: modelDirPath };

    generateCreateRouteFile(project, model, modelOptions);
    const createImportName = `Create${model.name}`;
    ensureNamedImports(indexFile, indexSpecifier, { named: [createImportName] });
    ensureNamedExports(modelIndexFile, './create', { named: [createImportName] });
    routeTable.push(`{ method: 'POST', path: '/${camelName}', options: ${createImportName} }`);

    generateDeleteRouteFile(project, model, modelOptions);
    const deleteImportName = `Delete${model.name}`;
    ensureNamedImports(indexFile, indexSpecifier, { named: [deleteImportName] });
    ensureNamedExports(modelIndexFile, './delete', { named: [deleteImportName] });
    routeTable.push(`{ method: 'DELETE', path: '/${camelName}/{${camelName}Id}', options: ${deleteImportName} }`);

    generateGetRouteFile(project, model, modelOptions);
    const getImportName = `Get${model.name}`;
    ensureNamedImports(indexFile, indexSpecifier, { named: [getImportName] });
    ensureNamedExports(modelIndexFile, './get', { named: [getImportName] });
    routeTable.push(`{ method: 'GET', path: '/${camelName}/{${camelName}Id}', options: ${getImportName} }`);

    generateListRouteFile(project, model, modelOptions);
    const listImportName = `List${model.name}`;
    ensureNamedImports(indexFile, indexSpecifier, { named: [listImportName] });
    ensureNamedExports(modelIndexFile, './list', { named: [listImportName] });
    routeTable.push(`{ method: 'GET', path: '/${camelName}', options: ${listImportName} }`);

    generateUpdateRouteFile(project, model, modelOptions);
    const updateImportName = `Update${model.name}`;
    ensureNamedImports(indexFile, indexSpecifier, { named: [updateImportName] });
    ensureNamedExports(modelIndexFile, './update', { named: [updateImportName] });
    routeTable.push(`{ method: 'PUT', path: '/${camelName}/{${camelName}Id}', options: ${updateImportName} }`);

    ensureArrayDeclaration(indexFile, `${camelName}Routes`, {
      leadingTrivia: (writer) => {
        return writer
          .blankLineIfLastNot()
          .write('// DO NOT CHANGE THIS ARRAY. It is automatically generated and changes WILL be overwritten')
          .newLine();
      },
      elements: routeTable,
      type: 'ServerRoute[]',
    });

    modelIndexFile.formatText(modelOptions.formatSettings);

    rootRouteTable.push(`...${camelName}Routes`);
  }

  ensureArrayDeclaration(indexFile, 'routes', {
    isExported: true,
    elements: rootRouteTable,
    leadingTrivia: (writer) => {
      return writer
        .blankLineIfLastNot();
    },
    type: 'ServerRoute[]',
  });

  indexFile.formatText(options.formatSettings);
}
