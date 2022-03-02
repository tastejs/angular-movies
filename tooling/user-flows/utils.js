"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.resolveAnyFile = exports.captureReport = void 0;
var fs = require("fs");
var open = require("open");
// @ts-ignore
var puppeteer_1 = require("puppeteer");
// @ts-ignore
var api_1 = require("lighthouse/lighthouse-core/fraggle-rock/api");
var path_1 = require("path");
function captureReport(pptOptions, flowOptions, flowActions) {
    if (pptOptions === void 0) { pptOptions = { headless: false }; }
    return __awaiter(this, void 0, void 0, function () {
        var browser, page, flow, report, fileName;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, puppeteer_1["default"].launch(pptOptions)];
                case 1:
                    browser = _a.sent();
                    return [4 /*yield*/, browser.newPage()];
                case 2:
                    page = _a.sent();
                    return [4 /*yield*/, (0, api_1.startFlow)(page, { name: flowOptions.name })];
                case 3:
                    flow = _a.sent();
                    return [4 /*yield*/, flowActions(flow, page)];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, browser.close()];
                case 5:
                    _a.sent();
                    report = flow.generateReport();
                    fileName = "measures/user-flows/" + flowOptions.name + ".report.html";
                    fs.writeFileSync(fileName, report);
                    open(fileName, { wait: false });
                    return [2 /*return*/];
            }
        });
    });
}
exports.captureReport = captureReport;
function resolveAnyFile(path) {
    path = (0, path_1.join)(process.cwd(), path);
    var file;
    if (path.endsWith('.ts')) {
        // Register TS compiler lazily
        // tsNode needs the compilerOptions.module resolution to be 'commonjs',
        // so that imports in the `.uf.ts` files work.
        require('ts-node').register({
            compilerOptions: {
                module: 'commonjs'
            }
        });
    }
    file = require(path);
    // If the user provides a configuration in TS file
    // then there are 2 cases for exporing an object. The first one is:
    // `module.exports = { ... }`. And the second one is:
    // `export default { ... }`. The ESM format is compiled into:
    // `{ default: { ... } }`
    var exports = file["default"] || file;
    return exports;
}
exports.resolveAnyFile = resolveAnyFile;
