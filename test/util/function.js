"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const function_1 = require("../../lib/util/function");
const ts_morph_1 = require("ts-morph");
const tap_1 = __importDefault(require("tap"));
void tap_1.default.test('ensureFunctionDeclaration', (t) => {
    void t.test('adds a function when none exists', (t) => {
        const project = new ts_morph_1.Project();
        const testFile = project.createSourceFile('test.ts', '');
        (0, function_1.ensureFunctionDeclaration)(testFile, 'foo', {});
        t.equal(testFile.print(), 'function foo() {\n}\n');
        t.end();
    });
    void t.test('adds an async function when none exists', (t) => {
        const project = new ts_morph_1.Project();
        const testFile = project.createSourceFile('test.ts', '');
        (0, function_1.ensureFunctionDeclaration)(testFile, 'foo', { isAsync: true });
        t.equal(testFile.print(), 'async function foo() {\n}\n');
        t.end();
    });
    void t.test('adds a function with parameters', (t) => {
        const project = new ts_morph_1.Project();
        const testFile = project.createSourceFile('test.ts', '');
        (0, function_1.ensureFunctionDeclaration)(testFile, 'foo', {
            parameters: [{ name: 'first' }, { name: 'second', type: 'string' }],
        });
        t.equal(testFile.print(), 'function foo(first, second: string) {\n}\n');
        t.end();
    });
    void t.test('adds a function with return type', (t) => {
        const project = new ts_morph_1.Project();
        const testFile = project.createSourceFile('test.ts', '');
        (0, function_1.ensureFunctionDeclaration)(testFile, 'foo', {
            type: 'string | null',
        });
        t.equal(testFile.print(), 'function foo(): string | null {\n}\n');
        t.end();
    });
    void t.test('replaces parameters when needed', (t) => {
        const project = new ts_morph_1.Project();
        const testFile = project.createSourceFile('test.ts', 'function foo(banana) {\n}\n');
        (0, function_1.ensureFunctionDeclaration)(testFile, 'foo', {
            parameters: [{ name: 'first' }, { name: 'second', type: 'string' }],
        });
        t.equal(testFile.print(), 'function foo(first, second: string) {\n}\n');
        t.end();
    });
    void t.test('replaces return type when needed', (t) => {
        const project = new ts_morph_1.Project();
        const testFile = project.createSourceFile('test.ts', 'function foo() {\n}\n');
        (0, function_1.ensureFunctionDeclaration)(testFile, 'foo', {
            type: 'string | null',
        });
        t.equal(testFile.print(), 'function foo(): string | null {\n}\n');
        t.end();
    });
    void t.test('replaces async keyword when needed', (t) => {
        const project = new ts_morph_1.Project();
        const testFile = project.createSourceFile('test.ts', 'function foo() {\n}\n');
        (0, function_1.ensureFunctionDeclaration)(testFile, 'foo', {
            isAsync: true,
        });
        t.equal(testFile.print(), 'async function foo() {\n}\n');
        t.end();
    });
    void t.test('leaves async flag alone when it needs no change', (t) => {
        const project = new ts_morph_1.Project();
        const testFile = project.createSourceFile('test.ts', 'function foo() {\n}\n');
        (0, function_1.ensureFunctionDeclaration)(testFile, 'foo', {
            isAsync: false,
        });
        t.equal(testFile.print(), 'function foo() {\n}\n');
        t.end();
    });
    t.end();
});
