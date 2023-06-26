import { type Project, VariableDeclarationKind } from 'ts-morph';

import type { HapiGeneratorOptions } from './util';

export function generateSchemasFile (project: Project, options: HapiGeneratorOptions) {
  const schemasFile = project.createSourceFile(options.paths.schemas, {}, { overwrite: true });

  schemasFile.addImportDeclaration({
    moduleSpecifier: 'joi',
    defaultImport: 'Joi',
    leadingTrivia: (writer) => {
      return writer
        .write(options.headers.file)
        .newLine()
        .newLine();
    },
  });

  schemasFile.addVariableStatement({
    declarationKind: VariableDeclarationKind.Const,
    isExported: false,
    leadingTrivia: (writer) => writer.blankLineIfLastNot(),
    declarations: [{
      name: 'Root',
      initializer: (writer) => {
        return writer
          .write('Joi.object().keys(')
          .inlineBlock(() => {
            for (const model of options.models) {
              writer
                .write(`${model.name}: Joi.object().keys(`)
                .inlineBlock(() => {
                  for (const field of model.fields) {
                    // istanbul ignore if - we don't support other fields
                    if (field.kind !== 'scalar' && field.kind !== 'object') {
                      continue;
                    }

                    writer.write(`${field.name}: `);

                    if (field.kind === 'scalar') {
                      // istanbul ignore else - we don't support other fields
                      if (field.type === 'String') {
                        writer.write('Joi.string()');
                      } else if (['Int', 'Float', 'Decimal'].includes(field.type)) {
                        writer.write('Joi.number()');
                        if (field.type === 'Int') {
                          writer.write('.integer()');
                        }
                      } else if (field.type === 'DateTime') {
                        writer.write('Joi.date()');
                      } else if (field.type === 'Boolean') {
                        writer.write('Joi.boolean()');
                      }

                      if (field.isId) {
                        const modelName = model.name[0].toLowerCase() + model.name.slice(1);
                        writer
                          .write('.alter(')
                          .inlineBlock(() => {
                            return writer
                              .write('create: (schema) => schema.forbidden(),')
                              .newLine()
                              .write(`update: (schema) => schema.valid(Joi.ref('$params.${modelName}Id')).strip(),`);
                          })
                          .write(')');
                      } else if (field.name === 'createdAt' || field.name === 'updatedAt' || field.name === 'deletedAt') {
                        writer
                          .write('.alter(')
                          .inlineBlock(() => {
                            return writer
                              .write('create: (schema) => schema.strip(),')
                              .newLine()
                              .write('update: (schema) => schema.strip(),');
                          })
                          .write(')');
                      } else if (field.isRequired) {
                        writer
                          .write('.alter(')
                          .inlineBlock(() => {
                            return writer
                              .write('create: (schema) => schema.required(),');
                          })
                          .write(')');
                      }

                      if (field.documentation) {
                        const joiMods = field.documentation
                          .split('\n')
                          .filter((line) => line.startsWith('@joi'))
                          .map((line) => line.slice(4).trim());

                        for (const mod of joiMods) {
                          writer.newLine().indent().write(mod);
                        }
                      }
                    } else {
                      if (field.isList) {
                        writer.write(`Joi.array().items(Joi.link('/${field.type}'))`);
                      } else {
                        writer.write(`Joi.link('/${field.type}')`);
                      }
                    }
                    writer.write(',').newLine();
                  }
                })
                .write('),')
                .newLine();
            }
          })
          .write(')');
      },
    }],
  });

  for (const model of options.models) {
    schemasFile.addVariableStatement({
      declarationKind: VariableDeclarationKind.Const,
      isExported: true,
      leadingTrivia: (writer) => writer.blankLineIfLastNot(),
      declarations: [{
        name: `${model.name}Schema`,
        initializer: (writer) => {
          return writer
            .write(`Root.extract('${model.name}')`);
        },
      }],
    });

    schemasFile.addVariableStatement({
      declarationKind: VariableDeclarationKind.Const,
      isExported: true,
      declarations: [{
        name: `Create${model.name}Schema`,
        initializer: (writer) => {
          return writer
            .write(`${model.name}Schema.tailor('create')`);
        },
      }],
    });

    schemasFile.addVariableStatement({
      declarationKind: VariableDeclarationKind.Const,
      isExported: true,
      declarations: [{
        name: `Update${model.name}Schema`,
        initializer: (writer) => {
          return writer
            .write(`${model.name}Schema.tailor('update')`);
        },
      }],
    });
  }

  schemasFile.formatText(options.formatSettings);
}
