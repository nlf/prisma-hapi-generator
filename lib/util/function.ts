import type { OptionalKind, ParameterDeclarationStructure, SourceFile, WriterFunction } from 'ts-morph';

interface EnsureFunctionDeclarationOptions {
  isAsync?: boolean;
  type?: string;
  parameters?: OptionalKind<ParameterDeclarationStructure>[];
  statements?: WriterFunction;
}

export function ensureFunctionDeclaration (sourceFile: SourceFile, functionName: string, options: EnsureFunctionDeclarationOptions) {
  const existingFunction = sourceFile.getFunction(functionName);
  if (!existingFunction) {
    sourceFile.addFunction({
      name: functionName,
      isAsync: options.isAsync,
      returnType: options.type,
      parameters: options.parameters,
      statements: options.statements,
    });

    return;
  }

  if (options.type && existingFunction.getReturnType().getText(existingFunction) !== options.type) {
    existingFunction.setReturnType(options.type);
  }

  if (existingFunction.isAsync() !== options.isAsync) {
    existingFunction.setIsAsync(options.isAsync ?? false);
  }

  if (options.parameters) {
    for (const parameter of existingFunction.getParameters()) {
      parameter.remove();
    }
    existingFunction.addParameters(options.parameters);
  }
}

