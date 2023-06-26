import type { SourceFile } from 'ts-morph';

export function ensureDefaultExport (sourceFile: SourceFile, variableName: string) {
  const currentDefault = sourceFile.getExportAssignment((x) => !x.isExportEquals());
  if (!currentDefault) {
    sourceFile.addExportAssignment({
      isExportEquals: false,
      expression: variableName,
    });

    return;
  }

  currentDefault.setExpression(variableName);
}

interface EnsureNamedExportsOptions {
  named?: string[];
  types?: string[];
}

export function ensureNamedExports (sourceFile: SourceFile, moduleSpecifier: string, options: EnsureNamedExportsOptions) {
  const exportNode = sourceFile.getExportDeclaration(moduleSpecifier)
    ?? sourceFile.addExportDeclaration({ moduleSpecifier });

  if (exportNode.isTypeOnly()) {
    for (const existingExport of exportNode.getNamedExports()) {
      existingExport.setIsTypeOnly(true);
    }
  }

  for (const namedExport of options.named ?? []) {
    const existingExport = exportNode.getNamedExports().find((existingExport) => {
      return existingExport.getName() === namedExport;
    });

    if (existingExport) {
      existingExport.setIsTypeOnly(false);
    } else {
      exportNode.addNamedExport(namedExport);
    }
  }

  for (const typeExport of options.types ?? []) {
    const existingExport = exportNode.getNamedExports().find((existingExport) => {
      return existingExport.getName() === typeExport;
    });

    if (existingExport) {
      existingExport.setIsTypeOnly(true);
    } else {
      exportNode.addNamedExport({
        name: typeExport,
        isTypeOnly: true,
      });
    }
  }

  const typesOnly = exportNode.getNamedExports().every((e) => e.isTypeOnly());
  exportNode.setIsTypeOnly(typesOnly);
  if (typesOnly) {
    for (const existingExport of exportNode.getNamedExports()) {
      existingExport.setIsTypeOnly(false);
    }
  }
}
