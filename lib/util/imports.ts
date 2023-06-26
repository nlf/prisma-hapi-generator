import { dirname, extname, relative } from 'node:path';
import type { SourceFile } from 'ts-morph';

export function getRelativeImport (from: string, to: string) {
  // from is always a file, so we want the directory name
  let relPath = relative(dirname(from), to);
  if (!relPath.startsWith('.')) {
    relPath = './' + relPath;
  }

  if (extname(relPath) !== '') {
    relPath = relPath.slice(0, -extname(relPath).length);
  }

  return relPath;
}

export function ensureDefaultImport (sourceFile: SourceFile, defaultImport: string, moduleSpecifier: string) {
  const importNode = sourceFile.getImportDeclaration(moduleSpecifier)
    ?? sourceFile.addImportDeclaration({ moduleSpecifier });

  const existingImport = importNode.getDefaultImport();
  if (!existingImport) {
    importNode.setDefaultImport(defaultImport);
  } else {
    importNode.renameDefaultImport(defaultImport);
  }
}

interface EnsureNamedImportsOptions {
  named?: string[];
  types?: string[];
}

export function ensureNamedImports (sourceFile: SourceFile, moduleSpecifier: string, options: EnsureNamedImportsOptions) {
  const importNode = sourceFile.getImportDeclaration(moduleSpecifier)
    ?? sourceFile.addImportDeclaration({ moduleSpecifier });

  // if the node is already type only, set that on each of the named imports so we can
  // clean up and simplify later
  if (importNode.isTypeOnly()) {
    for (const existingImport of importNode.getNamedImports()) {
      existingImport.setIsTypeOnly(true);
    }
  }

  for (const namedImport of options.named ?? []) {
    const existingImport = importNode.getNamedImports().find((existingImport) => {
      return existingImport.getName() === namedImport;
    });

    if (existingImport) {
      existingImport.setIsTypeOnly(false);
    } else {
      importNode.addNamedImport(namedImport);
    }
  }

  for (const typeImport of options.types ?? []) {
    const existingImport = importNode.getNamedImports().find((existingImport) => {
      return existingImport.getName() === typeImport;
    });

    if (existingImport) {
      existingImport.setIsTypeOnly(true);
    } else {
      importNode.addNamedImport({
        name: typeImport,
        isTypeOnly: true,
      });
    }
  }

  // now that all of our named imports are in place, fix up our importNode and
  // the existing declarations if we can
  const typesOnly = importNode.getNamedImports().every((i) => i.isTypeOnly());
  importNode.setIsTypeOnly(typesOnly);
  if (typesOnly) {
    for (const existingImport of importNode.getNamedImports()) {
      existingImport.setIsTypeOnly(false);
    }
  }
}
