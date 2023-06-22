"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const exports_1 = require("../../lib/util/exports");
const ts_morph_1 = require("ts-morph");
const tap_1 = __importDefault(require("tap"));
void tap_1.default.test('ensureNamedExports', (t) => {
    void t.test('adds named export if none exist', (t) => {
        const project = new ts_morph_1.Project();
        const testFile = project.createSourceFile('test.ts', '');
        (0, exports_1.ensureNamedExports)(testFile, 'foo', { named: ['bar'] });
        t.equal(testFile.print(), 'export { bar } from "foo";\n');
        t.end();
    });
    void t.test('adds named type only export if none exists', (t) => {
        const project = new ts_morph_1.Project();
        const testFile = project.createSourceFile('test.ts', '');
        (0, exports_1.ensureNamedExports)(testFile, 'foo', { types: ['bar'] });
        t.equal(testFile.print(), 'export type { bar } from "foo";\n');
        t.end();
    });
    void t.test('appends a named export where one exists', (t) => {
        const project = new ts_morph_1.Project();
        const testFile = project.createSourceFile('test.ts', 'export { foo } from "bar";\n');
        (0, exports_1.ensureNamedExports)(testFile, 'bar', { named: ['baz'] });
        t.equal(testFile.print(), 'export { foo, baz } from "bar";\n');
        t.end();
    });
    void t.test('appends a type only export where one exists, and moves type only annotation', (t) => {
        const project = new ts_morph_1.Project();
        const testFile = project.createSourceFile('test.ts', 'export { type foo } from "bar";\n');
        (0, exports_1.ensureNamedExports)(testFile, 'bar', { types: ['baz'] });
        t.equal(testFile.print(), 'export type { foo, baz } from "bar";\n');
        t.end();
    });
    void t.test('appends a type only export where a normal one exists', (t) => {
        const project = new ts_morph_1.Project();
        const testFile = project.createSourceFile('test.ts', 'export { foo } from "bar";\n');
        (0, exports_1.ensureNamedExports)(testFile, 'bar', { types: ['baz'] });
        t.equal(testFile.print(), 'export { foo, type baz } from "bar";\n');
        t.end();
    });
    void t.test('appends a normal export where a type only one exists', (t) => {
        const project = new ts_morph_1.Project();
        const testFile = project.createSourceFile('test.ts', 'export { type foo } from "bar";\n');
        (0, exports_1.ensureNamedExports)(testFile, 'bar', { named: ['baz'] });
        t.equal(testFile.print(), 'export { type foo, baz } from "bar";\n');
        t.end();
    });
    void t.test('removes type only annotation from statement when adding a normal export', (t) => {
        const project = new ts_morph_1.Project();
        const testFile = project.createSourceFile('test.ts', 'export type { foo } from "bar";\n');
        (0, exports_1.ensureNamedExports)(testFile, 'bar', { named: ['baz'] });
        t.equal(testFile.print(), 'export { type foo, baz } from "bar";\n');
        t.end();
    });
    void t.test('moves a type only export to a regular export', (t) => {
        const project = new ts_morph_1.Project();
        const testFile = project.createSourceFile('test.ts', 'export type { foo } from "bar";\n');
        (0, exports_1.ensureNamedExports)(testFile, 'bar', { named: ['foo'] });
        t.equal(testFile.print(), 'export { foo } from "bar";\n');
        t.end();
    });
    void t.test('moves a normal export to a type only export', (t) => {
        const project = new ts_morph_1.Project();
        const testFile = project.createSourceFile('test.ts', 'export { foo } from "bar";\n');
        (0, exports_1.ensureNamedExports)(testFile, 'bar', { types: ['foo'] });
        t.equal(testFile.print(), 'export type { foo } from "bar";\n');
        t.end();
    });
    t.end();
});
