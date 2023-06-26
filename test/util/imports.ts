import { ensureDefaultImport, ensureNamedImports } from '../../lib/util/imports';

import { Project } from 'ts-morph';
import t from 'tap';

void t.test('ensureDefaultImport', (t) => {
  void t.test('adds default import if none exists', (t) => {
    const project = new Project();
    const testFile = project.createSourceFile('test.ts', '');

    ensureDefaultImport(testFile, 'foo', 'bar');
    t.equal(testFile.print(), 'import foo from "bar";\n');

    t.end();
  });

  void t.test('renames existing default import', (t) => {
    const project = new Project();
    const testFile = project.createSourceFile('test.ts', 'import baz from "bar";');

    ensureDefaultImport(testFile, 'foo', 'bar');
    t.equal(testFile.print(), 'import foo from "bar";\n');

    t.end();
  });

  void t.test('adds default import to existing named imports', (t) => {
    const project = new Project();
    const testFile = project.createSourceFile('test.ts', 'import { baz } from "bar";');

    ensureDefaultImport(testFile, 'foo', 'bar');
    t.equal(testFile.print(), 'import foo, { baz } from "bar";\n');

    t.end();
  });

  t.end();
});

void t.test('ensureNamedImports', (t) => {
  void t.test('adds named import if none exist', (t) => {
    const project = new Project();
    const testFile = project.createSourceFile('test.ts', '');

    ensureNamedImports(testFile, 'foo', { named: ['bar'] });
    t.equal(testFile.print(), 'import { bar } from "foo";\n');

    t.end();
  });

  void t.test('adds named type only import if none exists', (t) => {
    const project = new Project();
    const testFile = project.createSourceFile('test.ts', '');

    ensureNamedImports(testFile, 'foo', { types: ['bar'] });
    t.equal(testFile.print(), 'import type { bar } from "foo";\n');

    t.end();
  });

  void t.test('appends a named import where one exists', (t) => {
    const project = new Project();
    const testFile = project.createSourceFile('test.ts', 'import { foo } from "bar";\n');

    ensureNamedImports(testFile, 'bar', { named: ['baz'] });
    t.equal(testFile.print(), 'import { foo, baz } from "bar";\n');

    t.end();
  });

  void t.test('appends a type only import where one exists, and moves type only annotation', (t) => {
    const project = new Project();
    const testFile = project.createSourceFile('test.ts', 'import { type foo } from "bar";\n');

    ensureNamedImports(testFile, 'bar', { types: ['baz'] });
    t.equal(testFile.print(), 'import type { foo, baz } from "bar";\n');

    t.end();
  });

  void t.test('appends a type only import where a normal one exists', (t) => {
    const project = new Project();
    const testFile = project.createSourceFile('test.ts', 'import { foo } from "bar";\n');

    ensureNamedImports(testFile, 'bar', { types: ['baz'] });
    t.equal(testFile.print(), 'import { foo, type baz } from "bar";\n');

    t.end();
  });

  void t.test('appends a normal import where a type only one exists', (t) => {
    const project = new Project();
    const testFile = project.createSourceFile('test.ts', 'import { type foo } from "bar";\n');

    ensureNamedImports(testFile, 'bar', { named: ['baz'] });
    t.equal(testFile.print(), 'import { type foo, baz } from "bar";\n');

    t.end();
  });

  void t.test('removes type only annotation from statement when adding a normal import', (t) => {
    const project = new Project();
    const testFile = project.createSourceFile('test.ts', 'import type { foo } from "bar";\n');

    ensureNamedImports(testFile, 'bar', { named: ['baz'] });
    t.equal(testFile.print(), 'import { type foo, baz } from "bar";\n');

    t.end();
  });

  void t.test('moves a type only import to a regular import', (t) => {
    const project = new Project();
    const testFile = project.createSourceFile('test.ts', 'import type { foo } from "bar";\n');

    ensureNamedImports(testFile, 'bar', { named: ['foo'] });
    t.equal(testFile.print(), 'import { foo } from "bar";\n');

    t.end();
  });

  void t.test('moves a normal import to a type only import', (t) => {
    const project = new Project();
    const testFile = project.createSourceFile('test.ts', 'import { foo } from "bar";\n');

    ensureNamedImports(testFile, 'bar', { types: ['foo'] });
    t.equal(testFile.print(), 'import type { foo } from "bar";\n');

    t.end();
  });

  t.end();
});
