"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ts_morph_1 = require("ts-morph");
const tap_1 = __importDefault(require("tap"));
const util_1 = require("./fixtures/util");
void tap_1.default.test('generator generates', async (t) => {
    const { root, options } = await (0, util_1.getGeneratorOptions)(t);
    const project = new ts_morph_1.Project(options.projectSettings);
    t.end();
});
