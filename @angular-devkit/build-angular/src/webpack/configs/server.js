"use strict";
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.getServerConfig = void 0;
const path_1 = require("path");
const webpack_1 = require("webpack");
const helpers_1 = require("../utils/helpers");
/**
 * Returns a partial Webpack configuration specific to creating a bundle for node
 * @param wco Options which include the build options and app config
 */
function getServerConfig(wco) {
    const { sourceMap, bundleDependencies, externalDependencies = [] } = wco.buildOptions;
    const extraPlugins = [];
    const { scripts, styles, hidden } = sourceMap;
    if (scripts || styles) {
        extraPlugins.push((0, helpers_1.getSourceMapDevTool)(scripts, styles, hidden));
    }
    const externals = [...externalDependencies];
    if (!bundleDependencies) {
        externals.push(({ context, request }, callback) => externalizePackages(context !== null && context !== void 0 ? context : wco.projectRoot, request, callback));
    }
    return {
        resolve: {
            mainFields: ['es2015', 'main', 'module'],
            conditionNames: ['es2015', '...'],
        },
        output: {
            libraryTarget: 'commonjs',
        },
        module: {
            parser: {
                javascript: {
                    worker: false,
                    url: false,
                },
            },
        },
        plugins: [
            // Fixes Critical dependency: the request of a dependency is an expression
            new webpack_1.ContextReplacementPlugin(/@?hapi(\\|\/)/),
            new webpack_1.ContextReplacementPlugin(/express(\\|\/)/),
            ...extraPlugins,
        ],
        node: false,
        externals,
    };
}
exports.getServerConfig = getServerConfig;
function externalizePackages(context, request, callback) {
    if (!request) {
        return;
    }
    // Absolute & Relative paths are not externals
    if (request.startsWith('.') || (0, path_1.isAbsolute)(request)) {
        callback();
        return;
    }
    try {
        require.resolve(request, { paths: [context] });
        callback(undefined, request);
    }
    catch {
        // Node couldn't find it, so it must be user-aliased
        callback();
    }
}
