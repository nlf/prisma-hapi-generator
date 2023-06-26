import t from 'tap';
import { Project, StructureKind, VariableDeclarationKind } from 'ts-morph';

import { ensureArrayDeclaration, ensureObjectDeclaration } from '../../lib/util/variable';

void t.test('ensureArrayDeclaration', (t) => {
  void t.test('adds an array if one does not exist', (t) => {
    const project = new Project();
    const testFile = project.createSourceFile('test.ts', '');

    ensureArrayDeclaration(testFile, 'foo', {
      elements: ['bar', 'baz'],
    });
    t.equal(testFile.print(), 'const foo = [\n    bar,\n    baz\n];\n');

    t.end();
  });

  void t.test('creates an empty array when no elements are given', (t) => {
    const project = new Project();
    const testFile = project.createSourceFile('test.ts', '');

    ensureArrayDeclaration(testFile, 'foo', {});
    t.equal(testFile.print(), 'const foo = [];\n');

    t.end();
  });

  void t.test('adds an element to an existing array', (t) => {
    const project = new Project();
    const testFile = project.createSourceFile('test.ts', 'const foo = []');

    ensureArrayDeclaration(testFile, 'foo', {
      elements: ['bar'],
    });
    t.equal(testFile.print(), 'const foo = [\n    bar\n];\n');

    t.end();
  });

  void t.test('does not insert a duplicate element', (t) => {
    const project = new Project();
    const testFile = project.createSourceFile('test.ts', 'const foo = [bar]');

    ensureArrayDeclaration(testFile, 'foo', {
      elements: ['bar'],
    });
    t.equal(testFile.print(), 'const foo = [bar];\n');

    t.end();
  });

  t.end();
});

void t.test('ensureObjectDeclaration', (t) => {
  void t.test('adds an object if one does not exist', (t) => {
    const project = new Project();
    const testFile = project.createSourceFile('test.ts', '');

    ensureObjectDeclaration(testFile, 'foo', {
      properties: {
        bar: {
          kind: StructureKind.PropertyAssignment,
          initializer: 'baz',
        },
      },
    });
    t.equal(testFile.print(), 'const foo = {\n    bar: baz\n};\n');

    t.end();
  });

  void t.test('adds an object with shorthand properties', (t) => {
    const project = new Project();
    const testFile = project.createSourceFile('test.ts', '');

    ensureObjectDeclaration(testFile, 'foo', {
      properties: {
        bar: {
          kind: StructureKind.ShorthandPropertyAssignment,
        },
        baz: {
          kind: StructureKind.ShorthandPropertyAssignment,
        },
      },
    });
    t.equal(testFile.print(), 'const foo = {\n    bar,\n    baz\n};\n');

    t.end();
  });

  void t.test('adds an object with no properties', (t) => {
    const project = new Project();
    const testFile = project.createSourceFile('test.ts', '');

    ensureObjectDeclaration(testFile, 'foo', {});
    t.equal(testFile.print(), 'const foo = {};\n');

    t.end();
  });

  void t.test('adds a let scoped variable', (t) => {
    const project = new Project();
    const testFile = project.createSourceFile('test.ts', '');

    ensureObjectDeclaration(testFile, 'foo', {
      declarationKind: VariableDeclarationKind.Let,
      properties: {
        bar: {
          kind: StructureKind.PropertyAssignment,
          initializer: 'baz',
        },
      },
    });
    t.equal(testFile.print(), 'let foo = {\n    bar: baz\n};\n');

    t.end();
  });

  void t.test('can set exportable', (t) => {
    const project = new Project();
    const testFile = project.createSourceFile('test.ts', '');

    ensureObjectDeclaration(testFile, 'foo', {
      isExported: true,
      properties: {
        bar: {
          kind: StructureKind.PropertyAssignment,
          initializer: 'baz',
        },
      },
    });
    t.equal(testFile.print(), 'export const foo = {\n    bar: baz\n};\n');

    t.end();
  });

  void t.test('can change const to let', (t) => {
    const project = new Project();
    const testFile = project.createSourceFile('test.ts', 'const foo = {\n    bar: baz\n};\n');

    ensureObjectDeclaration(testFile, 'foo', {
      declarationKind: VariableDeclarationKind.Let,
      properties: {
        bar: {
          kind: StructureKind.PropertyAssignment,
          initializer: 'baz',
        },
      },
    });
    t.equal(testFile.print(), 'let foo = {\n    bar: baz\n};\n');

    t.end();
  });

  void t.test('can change non exported to exported', (t) => {
    const project = new Project();
    const testFile = project.createSourceFile('test.ts', 'const foo = {\n    bar: baz\n};\n');

    ensureObjectDeclaration(testFile, 'foo', {
      isExported: true,
      properties: {
        bar: {
          kind: StructureKind.PropertyAssignment,
          initializer: 'baz',
        },
      },
    });
    t.equal(testFile.print(), 'export const foo = {\n    bar: baz\n};\n');

    t.end();
  });

  void t.test('can add a property to an existing object', (t) => {
    const project = new Project();
    const testFile = project.createSourceFile('test.ts', 'const foo = {\n    bar: baz\n};\n');

    ensureObjectDeclaration(testFile, 'foo', {
      properties: {
        bar: {
          kind: StructureKind.PropertyAssignment,
          initializer: 'baz',
        },
        baz: {
          kind: StructureKind.PropertyAssignment,
          initializer: 'bop',
        },
      },
    });
    t.equal(testFile.print(), 'const foo = {\n    bar: baz,\n    baz: bop\n};\n');

    t.end();
  });

  void t.test('can change a property from normal to shorthand', (t) => {
    const project = new Project();
    const testFile = project.createSourceFile('test.ts', 'const foo = {\n    bar: baz\n};\n');

    ensureObjectDeclaration(testFile, 'foo', {
      properties: {
        bar: {
          kind: StructureKind.ShorthandPropertyAssignment,
        },
      },
    });
    t.equal(testFile.print(), 'const foo = {\n    bar\n};\n');

    t.end();
  });

  void t.test('can change a property from shorthand to normal', (t) => {
    const project = new Project();
    const testFile = project.createSourceFile('test.ts', 'const foo = {\n    bar\n};\n');

    ensureObjectDeclaration(testFile, 'foo', {
      properties: {
        bar: {
          kind: StructureKind.PropertyAssignment,
          initializer: 'baz',
        },
      },
    });
    t.equal(testFile.print(), 'const foo = {\n    bar: baz\n};\n');

    t.end();
  });

  t.end();
});
