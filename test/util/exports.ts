import { ensureDefaultExport, ensureNamedExports } from '../../lib/util/exports';

import { Project } from 'ts-morph';
import t from 'tap';

void t.test('ensureDefaultExport', (t) => {
  void t.test('adds default export if none exists', (t) => {
    const project = new Project();
    const testFile = project.createSourceFile('test.ts', '');

    ensureDefaultExport(testFile, 'foo');
    t.equal(testFile.print(), 'export default foo;\n');

    t.end();
  });

  void t.test('modifies existing default export if found', (t) => {
    const project = new Project();
    const testFile = project.createSourceFile('test.ts', 'export default bar;');

    ensureDefaultExport(testFile, 'foo');
    t.equal(testFile.print(), 'export default foo;\n');

    t.end();
  });

  t.end();
});

void t.test('ensureNamedExports', (t) => {
  void t.test('adds named export if none exist', (t) => {
    const project = new Project();
    const testFile = project.createSourceFile('test.ts', '');

    ensureNamedExports(testFile, 'foo', { named: ['bar'] });
    t.equal(testFile.print(), 'export { bar } from "foo";\n');

    t.end();
  });

  void t.test('adds named type only export if none exists', (t) => {
    const project = new Project();
    const testFile = project.createSourceFile('test.ts', '');

    ensureNamedExports(testFile, 'foo', { types: ['bar'] });
    t.equal(testFile.print(), 'export type { bar } from "foo";\n');

    t.end();
  });

  void t.test('appends a named export where one exists', (t) => {
    const project = new Project();
    const testFile = project.createSourceFile('test.ts', 'export { foo } from "bar";\n');

    ensureNamedExports(testFile, 'bar', { named: ['baz'] });
    t.equal(testFile.print(), 'export { foo, baz } from "bar";\n');

    t.end();
  });

  void t.test('appends a type only export where one exists, and moves type only annotation', (t) => {
    const project = new Project();
    const testFile = project.createSourceFile('test.ts', 'export { type foo } from "bar";\n');

    ensureNamedExports(testFile, 'bar', { types: ['baz'] });
    t.equal(testFile.print(), 'export type { foo, baz } from "bar";\n');

    t.end();
  });

  void t.test('appends a type only export where a normal one exists', (t) => {
    const project = new Project();
    const testFile = project.createSourceFile('test.ts', 'export { foo } from "bar";\n');

    ensureNamedExports(testFile, 'bar', { types: ['baz'] });
    t.equal(testFile.print(), 'export { foo, type baz } from "bar";\n');

    t.end();
  });

  void t.test('appends a normal export where a type only one exists', (t) => {
    const project = new Project();
    const testFile = project.createSourceFile('test.ts', 'export { type foo } from "bar";\n');

    ensureNamedExports(testFile, 'bar', { named: ['baz'] });
    t.equal(testFile.print(), 'export { type foo, baz } from "bar";\n');

    t.end();
  });

  void t.test('removes type only annotation from statement when adding a normal export', (t) => {
    const project = new Project();
    const testFile = project.createSourceFile('test.ts', 'export type { foo } from "bar";\n');

    ensureNamedExports(testFile, 'bar', { named: ['baz'] });
    t.equal(testFile.print(), 'export { type foo, baz } from "bar";\n');

    t.end();
  });

  void t.test('moves a type only export to a regular export', (t) => {
    const project = new Project();
    const testFile = project.createSourceFile('test.ts', 'export type { foo } from "bar";\n');

    ensureNamedExports(testFile, 'bar', { named: ['foo'] });
    t.equal(testFile.print(), 'export { foo } from "bar";\n');

    t.end();
  });

  void t.test('moves a normal export to a type only export', (t) => {
    const project = new Project();
    const testFile = project.createSourceFile('test.ts', 'export { foo } from "bar";\n');

    ensureNamedExports(testFile, 'bar', { types: ['foo'] });
    t.equal(testFile.print(), 'export type { foo } from "bar";\n');

    t.end();
  });

  t.end();
});
