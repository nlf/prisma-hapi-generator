"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const imports_1 = require("../../lib/util/imports");
const ts_morph_1 = require("ts-morph");
const tap_1 = __importDefault(require("tap"));
void tap_1.default.test('ensureNamedImports', (t) => {
    void t.test('adds named import if none exist', (t) => {
        const project = new ts_morph_1.Project();
        const testFile = project.createSourceFile('test.ts', '');
        (0, imports_1.ensureNamedImports)(testFile, 'foo', { named: ['bar'] });
        t.equal(testFile.print(), 'import { bar } from "foo";\n');
        t.end();
    });
    void t.test('adds named type only import if none exists', (t) => {
        const project = new ts_morph_1.Project();
        const testFile = project.createSourceFile('test.ts', '');
        (0, imports_1.ensureNamedImports)(testFile, 'foo', { types: ['bar'] });
        t.equal(testFile.print(), 'import type { bar } from "foo";\n');
        t.end();
    });
    void t.test('appends a named import where one exists', (t) => {
        const project = new ts_morph_1.Project();
        const testFile = project.createSourceFile('test.ts', 'import { foo } from "bar";\n');
        (0, imports_1.ensureNamedImports)(testFile, 'bar', { named: ['baz'] });
        t.equal(testFile.print(), 'import { foo, baz } from "bar";\n');
        t.end();
    });
    void t.test('appends a type only import where one exists, and moves type only annotation', (t) => {
        const project = new ts_morph_1.Project();
        const testFile = project.createSourceFile('test.ts', 'import { type foo } from "bar";\n');
        (0, imports_1.ensureNamedImports)(testFile, 'bar', { types: ['baz'] });
        t.equal(testFile.print(), 'import type { foo, baz } from "bar";\n');
        t.end();
    });
    void t.test('appends a type only import where a normal one exists', (t) => {
        const project = new ts_morph_1.Project();
        const testFile = project.createSourceFile('test.ts', 'import { foo } from "bar";\n');
        (0, imports_1.ensureNamedImports)(testFile, 'bar', { types: ['baz'] });
        t.equal(testFile.print(), 'import { foo, type baz } from "bar";\n');
        t.end();
    });
    void t.test('appends a normal import where a type only one exists', (t) => {
        const project = new ts_morph_1.Project();
        const testFile = project.createSourceFile('test.ts', 'import { type foo } from "bar";\n');
        (0, imports_1.ensureNamedImports)(testFile, 'bar', { named: ['baz'] });
        t.equal(testFile.print(), 'import { type foo, baz } from "bar";\n');
        t.end();
    });
    void t.test('removes type only annotation from statement when adding a normal import', (t) => {
        const project = new ts_morph_1.Project();
        const testFile = project.createSourceFile('test.ts', 'import type { foo } from "bar";\n');
        (0, imports_1.ensureNamedImports)(testFile, 'bar', { named: ['baz'] });
        t.equal(testFile.print(), 'import { type foo, baz } from "bar";\n');
        t.end();
    });
    void t.test('moves a type only import to a regular import', (t) => {
        const project = new ts_morph_1.Project();
        const testFile = project.createSourceFile('test.ts', 'import type { foo } from "bar";\n');
        (0, imports_1.ensureNamedImports)(testFile, 'bar', { named: ['foo'] });
        t.equal(testFile.print(), 'import { foo } from "bar";\n');
        t.end();
    });
    void t.test('moves a normal import to a type only import', (t) => {
        const project = new ts_morph_1.Project();
        const testFile = project.createSourceFile('test.ts', 'import { foo } from "bar";\n');
        (0, imports_1.ensureNamedImports)(testFile, 'bar', { types: ['foo'] });
        t.equal(testFile.print(), 'import type { foo } from "bar";\n');
        t.end();
    });
    t.end();
});
