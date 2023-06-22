import { ensureFunctionDeclaration } from '../../lib/util/function';

import { Project } from 'ts-morph';
import t from 'tap';

void t.test('ensureFunctionDeclaration', (t) => {
  void t.test('adds a function when none exists', (t) => {
    const project = new Project();
    const testFile = project.createSourceFile('test.ts', '');

    ensureFunctionDeclaration(testFile, 'foo', {});
    t.equal(testFile.print(), 'function foo() {\n}\n');

    t.end();
  });

  void t.test('adds an async function when none exists', (t) => {
    const project = new Project();
    const testFile = project.createSourceFile('test.ts', '');

    ensureFunctionDeclaration(testFile, 'foo', { isAsync: true });
    t.equal(testFile.print(), 'async function foo() {\n}\n');

    t.end();
  });

  void t.test('adds a function with parameters', (t) => {
    const project = new Project();
    const testFile = project.createSourceFile('test.ts', '');

    ensureFunctionDeclaration(testFile, 'foo', {
      parameters: [{ name: 'first' }, { name: 'second', type: 'string' }],
    });
    t.equal(testFile.print(), 'function foo(first, second: string) {\n}\n');

    t.end();
  });

  void t.test('adds a function with return type', (t) => {
    const project = new Project();
    const testFile = project.createSourceFile('test.ts', '');
    ensureFunctionDeclaration(testFile, 'foo', {
      type: 'string | null',
    });
    t.equal(testFile.print(), 'function foo(): string | null {\n}\n');

    t.end();
  });

  void t.test('replaces parameters when needed', (t) => {
    const project = new Project();
    const testFile = project.createSourceFile('test.ts', 'function foo(banana) {\n}\n');

    ensureFunctionDeclaration(testFile, 'foo', {
      parameters: [{ name: 'first' }, { name: 'second', type: 'string' }],
    });
    t.equal(testFile.print(), 'function foo(first, second: string) {\n}\n');

    t.end();
  });

  void t.test('replaces return type when needed', (t) => {
    const project = new Project();
    const testFile = project.createSourceFile('test.ts', 'function foo() {\n}\n');

    ensureFunctionDeclaration(testFile, 'foo', {
      type: 'string | null',
    });
    t.equal(testFile.print(), 'function foo(): string | null {\n}\n');

    t.end();
  });

  void t.test('replaces async keyword when needed', (t) => {
    const project = new Project();
    const testFile = project.createSourceFile('test.ts', 'function foo() {\n}\n');

    ensureFunctionDeclaration(testFile, 'foo', {
      isAsync: true,
    });
    t.equal(testFile.print(), 'async function foo() {\n}\n');

    t.end();
  });

  void t.test('leaves async flag alone when it needs no change', (t) => {
    const project = new Project();
    const testFile = project.createSourceFile('test.ts', 'function foo() {\n}\n');

    ensureFunctionDeclaration(testFile, 'foo', {
      isAsync: false,
    });
    t.equal(testFile.print(), 'function foo() {\n}\n');

    t.end();
  });

  t.end();
});
