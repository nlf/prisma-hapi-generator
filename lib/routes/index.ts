import { join } from 'path';
import { camelize, pluralize } from 'inflection';
import type { Project } from 'ts-morph';

import { generateCreateRouteFile } from './create';
import { generateDeleteRouteFile } from './delete';
import { generateGetRouteFile } from './get';
import { generateListRouteFile } from './list';
import { generateUpdateRouteFile } from './update';
import {
  ensureArrayDeclaration,
  ensureDefaultExport,
  ensureNamedExports,
  ensureNamedImports,
  type HapiGeneratorOptions,
} from '../util';

export function generateRouteFiles (project: Project, options: HapiGeneratorOptions) {
  project.createDirectory(options.paths.routes);

  const indexFilePath = join(options.paths.routes, 'index.ts');
  const indexFile = project.addSourceFileAtPathIfExists(indexFilePath) ?? project.createSourceFile(indexFilePath);
  ensureNamedImports(indexFile, '@hapi/hapi', {
    types: ['ServerRoute'],
  });

  const rootRouteTable = [];

  for (const model of options.models) {
    const routeTable = [];
    const camelName = camelize(model.name, true);
    const pathName = pluralize(camelName);
    const indexSpecifier = `./${camelName}`;

    const modelDirPath = join(options.paths.routes, camelName);
    project.createDirectory(modelDirPath);

    const modelIndexFilePath = join(modelDirPath, 'index.ts');
    const modelIndexFile = project.addSourceFileAtPathIfExists(modelIndexFilePath) ?? project.createSourceFile(modelIndexFilePath);

    generateCreateRouteFile(project, model, options);
    const createImportName = `Create${model.name}Route`;
    ensureNamedImports(indexFile, indexSpecifier, { named: [createImportName] });
    ensureNamedExports(modelIndexFile, './create', { named: [createImportName] });
    routeTable.push(`{ method: 'POST', path: '/${pathName}', options: ${createImportName} }`);

    generateDeleteRouteFile(project, model, options);
    const deleteImportName = `Delete${model.name}Route`;
    ensureNamedImports(indexFile, indexSpecifier, { named: [deleteImportName] });
    ensureNamedExports(modelIndexFile, './delete', { named: [deleteImportName] });
    routeTable.push(`{ method: 'DELETE', path: '/${pathName}/{${camelName}Id}', options: ${deleteImportName} }`);

    generateGetRouteFile(project, model, options);
    const getImportName = `Get${model.name}Route`;
    ensureNamedImports(indexFile, indexSpecifier, { named: [getImportName] });
    ensureNamedExports(modelIndexFile, './get', { named: [getImportName] });
    routeTable.push(`{ method: 'GET', path: '/${pathName}/{${camelName}Id}', options: ${getImportName} }`);

    generateListRouteFile(project, model, options);
    const listImportName = `List${model.name}Route`;
    ensureNamedImports(indexFile, indexSpecifier, { named: [listImportName] });
    ensureNamedExports(modelIndexFile, './list', { named: [listImportName] });
    routeTable.push(`{ method: 'GET', path: '/${pathName}', options: ${listImportName} }`);

    generateUpdateRouteFile(project, model, options);
    const updateImportName = `Update${model.name}Route`;
    ensureNamedImports(indexFile, indexSpecifier, { named: [updateImportName] });
    ensureNamedExports(modelIndexFile, './update', { named: [updateImportName] });
    routeTable.push(`{ method: 'PUT', path: '/${pathName}/{${camelName}Id}', options: ${updateImportName} }`);

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

    modelIndexFile.formatText(options.formatSettings);

    rootRouteTable.push(`...${camelName}Routes`);
  }

  ensureArrayDeclaration(indexFile, 'routes', {
    elements: rootRouteTable,
    leadingTrivia: (writer) => {
      return writer
        .blankLineIfLastNot();
    },
    type: 'ServerRoute[]',
  });

  ensureDefaultExport(indexFile, 'routes');

  indexFile.formatText(options.formatSettings);
}
