"use strict";
exports.__esModule = true;
exports.runCli = exports.setupYargs = void 0;
var yargs = require("yargs");
function setupYargs(commands, options) {
    commands.forEach(function (command) {
        yargs.command(command.command, command.description, function () { }, command.module.handler);
    });
    yargs.options(options).recommendCommands();
    return yargs;
}
exports.setupYargs = setupYargs;
function runCli(cliCfg) {
    setupYargs(cliCfg.commands, cliCfg.options).argv;
}
exports.runCli = runCli;
