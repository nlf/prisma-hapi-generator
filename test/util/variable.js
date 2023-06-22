"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const tap_1 = __importDefault(require("tap"));
const ts_morph_1 = require("ts-morph");
const variable_1 = require("../../lib/util/variable");
void tap_1.default.test('ensureArrayDeclaration', (t) => {
    void t.test('adds an array if one does not exist', (t) => {
        const project = new ts_morph_1.Project();
        const testFile = project.createSourceFile('test.ts', '');
        (0, variable_1.ensureArrayDeclaration)(testFile, 'foo', {
            elements: ['bar', 'baz'],
        });
        t.equal(testFile.print(), 'const foo = [bar, baz];\n');
        t.end();
    });
    void t.test('creates an empty array when no elements are given', (t) => {
        const project = new ts_morph_1.Project();
        const testFile = project.createSourceFile('test.ts', '');
        (0, variable_1.ensureArrayDeclaration)(testFile, 'foo', {});
        t.equal(testFile.print(), 'const foo = [];\n');
        t.end();
    });
    void t.test('adds an element to an existing array', (t) => {
        const project = new ts_morph_1.Project();
        const testFile = project.createSourceFile('test.ts', 'const foo = []');
        (0, variable_1.ensureArrayDeclaration)(testFile, 'foo', {
            elements: ['bar'],
        });
        t.equal(testFile.print(), 'const foo = [bar];\n');
        t.end();
    });
    void t.test('does not insert a duplicate element', (t) => {
        const project = new ts_morph_1.Project();
        const testFile = project.createSourceFile('test.ts', 'const foo = [bar]');
        (0, variable_1.ensureArrayDeclaration)(testFile, 'foo', {
            elements: ['bar'],
        });
        t.equal(testFile.print(), 'const foo = [bar];\n');
        t.end();
    });
    t.end();
});
void tap_1.default.test('ensureObjectDeclaration', (t) => {
    void t.test('adds an object if one does not exist', (t) => {
        const project = new ts_morph_1.Project();
        const testFile = project.createSourceFile('test.ts', '');
        (0, variable_1.ensureObjectDeclaration)(testFile, 'foo', {
            properties: {
                bar: {
                    kind: ts_morph_1.StructureKind.PropertyAssignment,
                    initializer: 'baz',
                },
            },
        });
        t.equal(testFile.print(), 'const foo = {\n    bar: baz\n};\n');
        t.end();
    });
    void t.test('adds an object with a shorthand property', (t) => {
        const project = new ts_morph_1.Project();
        const testFile = project.createSourceFile('test.ts', '');
        (0, variable_1.ensureObjectDeclaration)(testFile, 'foo', {
            properties: {
                bar: {
                    kind: ts_morph_1.StructureKind.ShorthandPropertyAssignment,
                },
            },
        });
        t.equal(testFile.print(), 'const foo = {\n    bar\n};\n');
        t.end();
    });
    void t.test('adds an object with no properties', (t) => {
        const project = new ts_morph_1.Project();
        const testFile = project.createSourceFile('test.ts', '');
        (0, variable_1.ensureObjectDeclaration)(testFile, 'foo', {});
        t.equal(testFile.print(), 'const foo = {};\n');
        t.end();
    });
    void t.test('adds a let scoped variable', (t) => {
        const project = new ts_morph_1.Project();
        const testFile = project.createSourceFile('test.ts', '');
        (0, variable_1.ensureObjectDeclaration)(testFile, 'foo', {
            declarationKind: ts_morph_1.VariableDeclarationKind.Let,
            properties: {
                bar: {
                    kind: ts_morph_1.StructureKind.PropertyAssignment,
                    initializer: 'baz',
                },
            },
        });
        t.equal(testFile.print(), 'let foo = {\n    bar: baz\n};\n');
        t.end();
    });
    void t.test('can set exportable', (t) => {
        const project = new ts_morph_1.Project();
        const testFile = project.createSourceFile('test.ts', '');
        (0, variable_1.ensureObjectDeclaration)(testFile, 'foo', {
            isExported: true,
            properties: {
                bar: {
                    kind: ts_morph_1.StructureKind.PropertyAssignment,
                    initializer: 'baz',
                },
            },
        });
        t.equal(testFile.print(), 'export const foo = {\n    bar: baz\n};\n');
        t.end();
    });
    void t.test('can change const to let', (t) => {
        const project = new ts_morph_1.Project();
        const testFile = project.createSourceFile('test.ts', 'const foo = {\n    bar: baz\n};\n');
        (0, variable_1.ensureObjectDeclaration)(testFile, 'foo', {
            declarationKind: ts_morph_1.VariableDeclarationKind.Let,
            properties: {
                bar: {
                    kind: ts_morph_1.StructureKind.PropertyAssignment,
                    initializer: 'baz',
                },
            },
        });
        t.equal(testFile.print(), 'let foo = {\n    bar: baz\n};\n');
        t.end();
    });
    void t.test('can change non exported to exported', (t) => {
        const project = new ts_morph_1.Project();
        const testFile = project.createSourceFile('test.ts', 'const foo = {\n    bar: baz\n};\n');
        (0, variable_1.ensureObjectDeclaration)(testFile, 'foo', {
            isExported: true,
            properties: {
                bar: {
                    kind: ts_morph_1.StructureKind.PropertyAssignment,
                    initializer: 'baz',
                },
            },
        });
        t.equal(testFile.print(), 'export const foo = {\n    bar: baz\n};\n');
        t.end();
    });
    void t.test('can add a property to an existing object', (t) => {
        const project = new ts_morph_1.Project();
        const testFile = project.createSourceFile('test.ts', 'const foo = {\n    bar: baz\n};\n');
        (0, variable_1.ensureObjectDeclaration)(testFile, 'foo', {
            properties: {
                bar: {
                    kind: ts_morph_1.StructureKind.PropertyAssignment,
                    initializer: 'baz',
                },
                baz: {
                    kind: ts_morph_1.StructureKind.PropertyAssignment,
                    initializer: 'bop',
                },
            },
        });
        t.equal(testFile.print(), 'const foo = {\n    bar: baz,\n    baz: bop\n};\n');
        t.end();
    });
    void t.test('can change a property from normal to shorthand', (t) => {
        const project = new ts_morph_1.Project();
        const testFile = project.createSourceFile('test.ts', 'const foo = {\n    bar: baz\n};\n');
        (0, variable_1.ensureObjectDeclaration)(testFile, 'foo', {
            properties: {
                bar: {
                    kind: ts_morph_1.StructureKind.ShorthandPropertyAssignment,
                },
            },
        });
        t.equal(testFile.print(), 'const foo = {\n    bar\n};\n');
        t.end();
    });
    void t.test('can change a property from shorthand to normal', (t) => {
        const project = new ts_morph_1.Project();
        const testFile = project.createSourceFile('test.ts', 'const foo = {\n    bar\n};\n');
        (0, variable_1.ensureObjectDeclaration)(testFile, 'foo', {
            properties: {
                bar: {
                    kind: ts_morph_1.StructureKind.PropertyAssignment,
                    initializer: 'baz',
                },
            },
        });
        t.equal(testFile.print(), 'const foo = {\n    bar: baz\n};\n');
        t.end();
    });
    t.end();
});
