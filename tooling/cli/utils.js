"use strict";
exports.__esModule = true;
exports.getCliParam = void 0;
var yargs = require("yargs");
function getCliParam(names) {
    // @TODO move  cli stuff into separate task
    // Check for tag params from cli command
    var params = Object.keys(yargs.argv)
        .filter(function (k) { return names.includes(k); })
        .map(function (k) { return yargs.argv[k].toString().trim(); })
        .filter(function (p) { return !!p; });
    return params.length ? params.pop() : false;
}
exports.getCliParam = getCliParam;
