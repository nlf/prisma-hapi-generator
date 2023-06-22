import { join } from 'node:path';
import { Project } from 'ts-morph';

import type { GenerateOptions } from './util';

export const generateExportFile = (project: Project, options: GenerateOptions) => {
  const exportFilePath = join(options.config.output, 'index.ts');
  const exportFile = project.createSourceFile(exportFilePath, {}, { overwrite: true });

  exportFile.addExportDeclaration({
    leadingTrivia: (writer) => {
      return writer
        .write(options.fileHeader)
        .newLine()
        .newLine();
    },
    namedExports: [
      'Prisma',
      'PrismaClient',
      ...options.models.map((model) => model.name),
    ],
    moduleSpecifier: './client',
  });

  exportFile.addExportDeclaration({
    namespaceExport: 'Schemas',
    moduleSpecifier: './schemas',
  });

  exportFile.addExportDeclaration({
    isTypeOnly: true,
    moduleSpecifier: './types',
  });

  exportFile.formatText();
};
