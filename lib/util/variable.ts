import {
  type ArrayLiteralExpression,
  type ObjectLiteralExpression,
  type PropertyAssignment,
  type SourceFile,
  type WriterFunction,
  StructureKind,
  VariableDeclarationKind,
  VariableStatement,
} from 'ts-morph';

interface EnsureVariableOptions {
  type?: string;
  declarationKind?: VariableDeclarationKind;
  leadingTrivia?: WriterFunction;
  isExported?: boolean;
}

interface PropertyAssignmentInitializer {
  kind: StructureKind.PropertyAssignment;
  initializer: string;
}

interface ShorthandPropertyAssignmentInitializer {
  kind: StructureKind.ShorthandPropertyAssignment;
}

type PropertyInitializer = PropertyAssignmentInitializer | ShorthandPropertyAssignmentInitializer;

interface EnsureObjectDeclarationOptions extends EnsureVariableOptions {
  properties?: Record<string, PropertyInitializer>;
}

export const ensureObjectDeclaration = (sourceFile: SourceFile, variableName: string, options: EnsureObjectDeclarationOptions) => {
  const objectStatement = ensureStatement(sourceFile, variableName, options);
  const objectDeclaration = declarationFromStatement(objectStatement, variableName);

  let objectInitializer = objectDeclaration.getInitializer() as ObjectLiteralExpression;
  // eslint insists this value is always falsey but it most definitely is not
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (!objectInitializer) {
    objectDeclaration.setInitializer('{}');
    objectInitializer = objectDeclaration.getInitializer() as ObjectLiteralExpression;
  }

  const objectProperties = objectInitializer.getProperties();

  for (const [propName, propSpec] of Object.entries(options.properties ?? {})) {
    const existingProperty = objectProperties.find((prop) => {
      const propObject = prop as PropertyAssignment;
      if (propObject.getName() === propName) {
        return true;
      }

      return false;
    });

    if (!existingProperty) {
      // istanbul ignore else - these are the only two supported assignment kinds
      if (propSpec.kind as StructureKind === StructureKind.PropertyAssignment) {
        const typedPropSpec = propSpec as PropertyAssignmentInitializer;
        objectInitializer.addPropertyAssignment({ name: propName, initializer: typedPropSpec.initializer });
      } else if (propSpec.kind as StructureKind === StructureKind.ShorthandPropertyAssignment) {
        objectInitializer.addShorthandPropertyAssignment({ name: propName });
      }

      return;
    }

    const existingStructure = existingProperty.getStructure();
    if (existingStructure.kind === propSpec.kind) {
      // istanbul ignore else - we don't need to change a shorthand property, it only as a name
      // so there is no valid else branch here. the condition stays to facilitate adding property types
      if (existingStructure.kind === StructureKind.PropertyAssignment) {
        const typedPropSpec = propSpec as PropertyAssignmentInitializer;
        (existingProperty as PropertyAssignment).setInitializer(typedPropSpec.initializer);
      }
    } else {
      existingProperty.remove();
      // istanbul ignore else - again, we do not support other property types
      if (propSpec.kind as StructureKind === StructureKind.PropertyAssignment) {
        const typedPropSpec = propSpec as PropertyAssignmentInitializer;
        objectInitializer.addPropertyAssignment({ name: propName, initializer: typedPropSpec.initializer });
      } else if (propSpec.kind as StructureKind === StructureKind.ShorthandPropertyAssignment) {
        objectInitializer.addShorthandPropertyAssignment({ name: propName });
      }
    }
  }
};

interface EnsureArrayDeclarationOptions extends EnsureVariableOptions {
  elements?: string[];
}

export const ensureArrayDeclaration = (sourceFile: SourceFile, variableName: string, options: EnsureArrayDeclarationOptions) => {
  const arrayStatement = ensureStatement(sourceFile, variableName, options);
  const arrayDeclaration = declarationFromStatement(arrayStatement, variableName);

  let arrayInitializer = arrayDeclaration.getInitializer() as ArrayLiteralExpression;
  // eslint insists this value is always falsey but it most definitely is not
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (!arrayInitializer) {
    arrayDeclaration.setInitializer('[]');
    arrayInitializer = arrayDeclaration.getInitializer() as ArrayLiteralExpression;
  }

  const arrayElements = arrayInitializer.getElements();
  for (const arrayElement of options.elements ?? []) {
    if (!arrayElements.find((element) => element.getText() === arrayElement)) {
      arrayInitializer.addElement(`\n${arrayElement}`);
    }
  }

  return;
};

const ensureStatement = (sourceFile: SourceFile, variableName: string, options: EnsureVariableOptions) => {
  const leadingTrivia = options.leadingTrivia ?? '';
  const variableStatement = sourceFile.getVariableStatement(variableName)
    ?? sourceFile.addVariableStatement({ leadingTrivia, declarations: [{ name: variableName, type: options.type }] });

  const declarationKind = options.declarationKind ?? VariableDeclarationKind.Const;
  const isExported = options.isExported ?? false;

  if (variableStatement.getDeclarationKind() !== declarationKind) {
    variableStatement.setDeclarationKind(declarationKind);
  }

  if (variableStatement.isExported() !== isExported) {
    variableStatement.setIsExported(isExported);
  }

  return variableStatement;
};

const declarationFromStatement = (statement: VariableStatement, variableName: string) => {
  const variableDeclaration = statement.getDeclarations().find((declaration) => {
    return declaration.getName() === variableName;
  });

  // istanbul ignore next -- this should be unreachable and is only here to satisfy typescript
  if (!variableDeclaration) {
    throw new Error(`Could not find expected variable declaration for "${variableName}"`);
  }

  return variableDeclaration;
};
