/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { StaticSymbol } from './aot/static_symbol';
import { identifierName, sanitizeIdentifier } from './parse_util';
import { splitAtColon } from './util';
// group 0: "[prop] or (event) or @trigger"
// group 1: "prop" from "[prop]"
// group 2: "event" from "(event)"
// group 3: "@trigger" from "@trigger"
const HOST_REG_EXP = /^(?:(?:\[([^\]]+)\])|(?:\(([^\)]+)\)))|(\@[-\w]+)$/;
export function viewClassName(compType, embeddedTemplateIndex) {
    return `View_${identifierName({ reference: compType })}_${embeddedTemplateIndex}`;
}
export function rendererTypeName(compType) {
    return `RenderType_${identifierName({ reference: compType })}`;
}
export function hostViewClassName(compType) {
    return `HostView_${identifierName({ reference: compType })}`;
}
export function componentFactoryName(compType) {
    return `${identifierName({ reference: compType })}NgFactory`;
}
export var CompileSummaryKind;
(function (CompileSummaryKind) {
    CompileSummaryKind[CompileSummaryKind["Pipe"] = 0] = "Pipe";
    CompileSummaryKind[CompileSummaryKind["Directive"] = 1] = "Directive";
    CompileSummaryKind[CompileSummaryKind["NgModule"] = 2] = "NgModule";
    CompileSummaryKind[CompileSummaryKind["Injectable"] = 3] = "Injectable";
})(CompileSummaryKind || (CompileSummaryKind = {}));
export function tokenName(token) {
    return token.value != null ? sanitizeIdentifier(token.value) : identifierName(token.identifier);
}
export function tokenReference(token) {
    if (token.identifier != null) {
        return token.identifier.reference;
    }
    else {
        return token.value;
    }
}
/**
 * Metadata about a stylesheet
 */
export class CompileStylesheetMetadata {
    constructor({ moduleUrl, styles, styleUrls } = {}) {
        this.moduleUrl = moduleUrl || null;
        this.styles = _normalizeArray(styles);
        this.styleUrls = _normalizeArray(styleUrls);
    }
}
/**
 * Metadata regarding compilation of a template.
 */
export class CompileTemplateMetadata {
    constructor({ encapsulation, template, templateUrl, htmlAst, styles, styleUrls, externalStylesheets, animations, ngContentSelectors, interpolation, isInline, preserveWhitespaces }) {
        this.encapsulation = encapsulation;
        this.template = template;
        this.templateUrl = templateUrl;
        this.htmlAst = htmlAst;
        this.styles = _normalizeArray(styles);
        this.styleUrls = _normalizeArray(styleUrls);
        this.externalStylesheets = _normalizeArray(externalStylesheets);
        this.animations = animations ? flatten(animations) : [];
        this.ngContentSelectors = ngContentSelectors || [];
        if (interpolation && interpolation.length != 2) {
            throw new Error(`'interpolation' should have a start and an end symbol.`);
        }
        this.interpolation = interpolation;
        this.isInline = isInline;
        this.preserveWhitespaces = preserveWhitespaces;
    }
    toSummary() {
        return {
            ngContentSelectors: this.ngContentSelectors,
            encapsulation: this.encapsulation,
            styles: this.styles,
            animations: this.animations
        };
    }
}
/**
 * Metadata regarding compilation of a directive.
 */
export class CompileDirectiveMetadata {
    constructor({ isHost, type, isComponent, selector, exportAs, changeDetection, inputs, outputs, hostListeners, hostProperties, hostAttributes, providers, viewProviders, queries, guards, viewQueries, entryComponents, template, componentViewType, rendererType, componentFactory }) {
        this.isHost = !!isHost;
        this.type = type;
        this.isComponent = isComponent;
        this.selector = selector;
        this.exportAs = exportAs;
        this.changeDetection = changeDetection;
        this.inputs = inputs;
        this.outputs = outputs;
        this.hostListeners = hostListeners;
        this.hostProperties = hostProperties;
        this.hostAttributes = hostAttributes;
        this.providers = _normalizeArray(providers);
        this.viewProviders = _normalizeArray(viewProviders);
        this.queries = _normalizeArray(queries);
        this.guards = guards;
        this.viewQueries = _normalizeArray(viewQueries);
        this.entryComponents = _normalizeArray(entryComponents);
        this.template = template;
        this.componentViewType = componentViewType;
        this.rendererType = rendererType;
        this.componentFactory = componentFactory;
    }
    static create({ isHost, type, isComponent, selector, exportAs, changeDetection, inputs, outputs, host, providers, viewProviders, queries, guards, viewQueries, entryComponents, template, componentViewType, rendererType, componentFactory }) {
        const hostListeners = {};
        const hostProperties = {};
        const hostAttributes = {};
        if (host != null) {
            Object.keys(host).forEach(key => {
                const value = host[key];
                const matches = key.match(HOST_REG_EXP);
                if (matches === null) {
                    hostAttributes[key] = value;
                }
                else if (matches[1] != null) {
                    hostProperties[matches[1]] = value;
                }
                else if (matches[2] != null) {
                    hostListeners[matches[2]] = value;
                }
            });
        }
        const inputsMap = {};
        if (inputs != null) {
            inputs.forEach((bindConfig) => {
                // canonical syntax: `dirProp: elProp`
                // if there is no `:`, use dirProp = elProp
                const parts = splitAtColon(bindConfig, [bindConfig, bindConfig]);
                inputsMap[parts[0]] = parts[1];
            });
        }
        const outputsMap = {};
        if (outputs != null) {
            outputs.forEach((bindConfig) => {
                // canonical syntax: `dirProp: elProp`
                // if there is no `:`, use dirProp = elProp
                const parts = splitAtColon(bindConfig, [bindConfig, bindConfig]);
                outputsMap[parts[0]] = parts[1];
            });
        }
        return new CompileDirectiveMetadata({
            isHost,
            type,
            isComponent: !!isComponent,
            selector,
            exportAs,
            changeDetection,
            inputs: inputsMap,
            outputs: outputsMap,
            hostListeners,
            hostProperties,
            hostAttributes,
            providers,
            viewProviders,
            queries,
            guards,
            viewQueries,
            entryComponents,
            template,
            componentViewType,
            rendererType,
            componentFactory,
        });
    }
    toSummary() {
        return {
            summaryKind: CompileSummaryKind.Directive,
            type: this.type,
            isComponent: this.isComponent,
            selector: this.selector,
            exportAs: this.exportAs,
            inputs: this.inputs,
            outputs: this.outputs,
            hostListeners: this.hostListeners,
            hostProperties: this.hostProperties,
            hostAttributes: this.hostAttributes,
            providers: this.providers,
            viewProviders: this.viewProviders,
            queries: this.queries,
            guards: this.guards,
            viewQueries: this.viewQueries,
            entryComponents: this.entryComponents,
            changeDetection: this.changeDetection,
            template: this.template && this.template.toSummary(),
            componentViewType: this.componentViewType,
            rendererType: this.rendererType,
            componentFactory: this.componentFactory
        };
    }
}
export class CompilePipeMetadata {
    constructor({ type, name, pure }) {
        this.type = type;
        this.name = name;
        this.pure = !!pure;
    }
    toSummary() {
        return {
            summaryKind: CompileSummaryKind.Pipe,
            type: this.type,
            name: this.name,
            pure: this.pure
        };
    }
}
export class CompileShallowModuleMetadata {
}
/**
 * Metadata regarding compilation of a module.
 */
export class CompileNgModuleMetadata {
    constructor({ type, providers, declaredDirectives, exportedDirectives, declaredPipes, exportedPipes, entryComponents, bootstrapComponents, importedModules, exportedModules, schemas, transitiveModule, id }) {
        this.type = type || null;
        this.declaredDirectives = _normalizeArray(declaredDirectives);
        this.exportedDirectives = _normalizeArray(exportedDirectives);
        this.declaredPipes = _normalizeArray(declaredPipes);
        this.exportedPipes = _normalizeArray(exportedPipes);
        this.providers = _normalizeArray(providers);
        this.entryComponents = _normalizeArray(entryComponents);
        this.bootstrapComponents = _normalizeArray(bootstrapComponents);
        this.importedModules = _normalizeArray(importedModules);
        this.exportedModules = _normalizeArray(exportedModules);
        this.schemas = _normalizeArray(schemas);
        this.id = id || null;
        this.transitiveModule = transitiveModule || null;
    }
    toSummary() {
        const module = this.transitiveModule;
        return {
            summaryKind: CompileSummaryKind.NgModule,
            type: this.type,
            entryComponents: module.entryComponents,
            providers: module.providers,
            modules: module.modules,
            exportedDirectives: module.exportedDirectives,
            exportedPipes: module.exportedPipes
        };
    }
}
export class TransitiveCompileNgModuleMetadata {
    constructor() {
        this.directivesSet = new Set();
        this.directives = [];
        this.exportedDirectivesSet = new Set();
        this.exportedDirectives = [];
        this.pipesSet = new Set();
        this.pipes = [];
        this.exportedPipesSet = new Set();
        this.exportedPipes = [];
        this.modulesSet = new Set();
        this.modules = [];
        this.entryComponentsSet = new Set();
        this.entryComponents = [];
        this.providers = [];
    }
    addProvider(provider, module) {
        this.providers.push({ provider: provider, module: module });
    }
    addDirective(id) {
        if (!this.directivesSet.has(id.reference)) {
            this.directivesSet.add(id.reference);
            this.directives.push(id);
        }
    }
    addExportedDirective(id) {
        if (!this.exportedDirectivesSet.has(id.reference)) {
            this.exportedDirectivesSet.add(id.reference);
            this.exportedDirectives.push(id);
        }
    }
    addPipe(id) {
        if (!this.pipesSet.has(id.reference)) {
            this.pipesSet.add(id.reference);
            this.pipes.push(id);
        }
    }
    addExportedPipe(id) {
        if (!this.exportedPipesSet.has(id.reference)) {
            this.exportedPipesSet.add(id.reference);
            this.exportedPipes.push(id);
        }
    }
    addModule(id) {
        if (!this.modulesSet.has(id.reference)) {
            this.modulesSet.add(id.reference);
            this.modules.push(id);
        }
    }
    addEntryComponent(ec) {
        if (!this.entryComponentsSet.has(ec.componentType)) {
            this.entryComponentsSet.add(ec.componentType);
            this.entryComponents.push(ec);
        }
    }
}
function _normalizeArray(obj) {
    return obj || [];
}
export class ProviderMeta {
    constructor(token, { useClass, useValue, useExisting, useFactory, deps, multi }) {
        this.token = token;
        this.useClass = useClass || null;
        this.useValue = useValue;
        this.useExisting = useExisting;
        this.useFactory = useFactory || null;
        this.dependencies = deps || null;
        this.multi = !!multi;
    }
}
export function flatten(list) {
    return list.reduce((flat, item) => {
        const flatItem = Array.isArray(item) ? flatten(item) : item;
        return flat.concat(flatItem);
    }, []);
}
function jitSourceUrl(url) {
    // Note: We need 3 "/" so that ng shows up as a separate domain
    // in the chrome dev tools.
    return url.replace(/(\w+:\/\/[\w:-]+)?(\/+)?/, 'ng:///');
}
export function templateSourceUrl(ngModuleType, compMeta, templateMeta) {
    let url;
    if (templateMeta.isInline) {
        if (compMeta.type.reference instanceof StaticSymbol) {
            // Note: a .ts file might contain multiple components with inline templates,
            // so we need to give them unique urls, as these will be used for sourcemaps.
            url = `${compMeta.type.reference.filePath}.${compMeta.type.reference.name}.html`;
        }
        else {
            url = `${identifierName(ngModuleType)}/${identifierName(compMeta.type)}.html`;
        }
    }
    else {
        url = templateMeta.templateUrl;
    }
    return compMeta.type.reference instanceof StaticSymbol ? url : jitSourceUrl(url);
}
export function sharedStylesheetJitUrl(meta, id) {
    const pathParts = meta.moduleUrl.split(/\/\\/g);
    const baseName = pathParts[pathParts.length - 1];
    return jitSourceUrl(`css/${id}${baseName}.ngstyle.js`);
}
export function ngModuleJitUrl(moduleMeta) {
    return jitSourceUrl(`${identifierName(moduleMeta.type)}/module.ngfactory.js`);
}
export function templateJitUrl(ngModuleType, compMeta) {
    return jitSourceUrl(`${identifierName(ngModuleType)}/${identifierName(compMeta.type)}.ngfactory.js`);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tcGlsZV9tZXRhZGF0YS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvbXBpbGVyL3NyYy9jb21waWxlX21ldGFkYXRhLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRztBQUVILE9BQU8sRUFBQyxZQUFZLEVBQUMsTUFBTSxxQkFBcUIsQ0FBQztBQUlqRCxPQUFPLEVBQTRCLGNBQWMsRUFBRSxrQkFBa0IsRUFBQyxNQUFNLGNBQWMsQ0FBQztBQUMzRixPQUFPLEVBQUMsWUFBWSxFQUFDLE1BQU0sUUFBUSxDQUFDO0FBRXBDLDJDQUEyQztBQUMzQyxnQ0FBZ0M7QUFDaEMsa0NBQWtDO0FBQ2xDLHNDQUFzQztBQUN0QyxNQUFNLFlBQVksR0FBRyxvREFBb0QsQ0FBQztBQUUxRSxNQUFNLFVBQVUsYUFBYSxDQUFDLFFBQWEsRUFBRSxxQkFBNkI7SUFDeEUsT0FBTyxRQUFRLGNBQWMsQ0FBQyxFQUFDLFNBQVMsRUFBRSxRQUFRLEVBQUMsQ0FBQyxJQUFJLHFCQUFxQixFQUFFLENBQUM7QUFDbEYsQ0FBQztBQUVELE1BQU0sVUFBVSxnQkFBZ0IsQ0FBQyxRQUFhO0lBQzVDLE9BQU8sY0FBYyxjQUFjLENBQUMsRUFBQyxTQUFTLEVBQUUsUUFBUSxFQUFDLENBQUMsRUFBRSxDQUFDO0FBQy9ELENBQUM7QUFFRCxNQUFNLFVBQVUsaUJBQWlCLENBQUMsUUFBYTtJQUM3QyxPQUFPLFlBQVksY0FBYyxDQUFDLEVBQUMsU0FBUyxFQUFFLFFBQVEsRUFBQyxDQUFDLEVBQUUsQ0FBQztBQUM3RCxDQUFDO0FBRUQsTUFBTSxVQUFVLG9CQUFvQixDQUFDLFFBQWE7SUFDaEQsT0FBTyxHQUFHLGNBQWMsQ0FBQyxFQUFDLFNBQVMsRUFBRSxRQUFRLEVBQUMsQ0FBQyxXQUFXLENBQUM7QUFDN0QsQ0FBQztBQU1ELE1BQU0sQ0FBTixJQUFZLGtCQUtYO0FBTEQsV0FBWSxrQkFBa0I7SUFDNUIsMkRBQUksQ0FBQTtJQUNKLHFFQUFTLENBQUE7SUFDVCxtRUFBUSxDQUFBO0lBQ1IsdUVBQVUsQ0FBQTtBQUNaLENBQUMsRUFMVyxrQkFBa0IsS0FBbEIsa0JBQWtCLFFBSzdCO0FBc0NELE1BQU0sVUFBVSxTQUFTLENBQUMsS0FBMkI7SUFDbkQsT0FBTyxLQUFLLENBQUMsS0FBSyxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsa0JBQWtCLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxjQUFjLENBQUMsS0FBSyxDQUFDLFVBQVUsQ0FBQyxDQUFDO0FBQ2xHLENBQUM7QUFFRCxNQUFNLFVBQVUsY0FBYyxDQUFDLEtBQTJCO0lBQ3hELElBQUksS0FBSyxDQUFDLFVBQVUsSUFBSSxJQUFJLEVBQUU7UUFDNUIsT0FBTyxLQUFLLENBQUMsVUFBVSxDQUFDLFNBQVMsQ0FBQztLQUNuQztTQUFNO1FBQ0wsT0FBTyxLQUFLLENBQUMsS0FBSyxDQUFDO0tBQ3BCO0FBQ0gsQ0FBQztBQXVDRDs7R0FFRztBQUNILE1BQU0sT0FBTyx5QkFBeUI7SUFJcEMsWUFDSSxFQUFDLFNBQVMsRUFBRSxNQUFNLEVBQUUsU0FBUyxLQUN1QyxFQUFFO1FBQ3hFLElBQUksQ0FBQyxTQUFTLEdBQUcsU0FBUyxJQUFJLElBQUksQ0FBQztRQUNuQyxJQUFJLENBQUMsTUFBTSxHQUFHLGVBQWUsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUN0QyxJQUFJLENBQUMsU0FBUyxHQUFHLGVBQWUsQ0FBQyxTQUFTLENBQUMsQ0FBQztJQUM5QyxDQUFDO0NBQ0Y7QUFZRDs7R0FFRztBQUNILE1BQU0sT0FBTyx1QkFBdUI7SUFhbEMsWUFBWSxFQUNWLGFBQWEsRUFDYixRQUFRLEVBQ1IsV0FBVyxFQUNYLE9BQU8sRUFDUCxNQUFNLEVBQ04sU0FBUyxFQUNULG1CQUFtQixFQUNuQixVQUFVLEVBQ1Ysa0JBQWtCLEVBQ2xCLGFBQWEsRUFDYixRQUFRLEVBQ1IsbUJBQW1CLEVBY3BCO1FBQ0MsSUFBSSxDQUFDLGFBQWEsR0FBRyxhQUFhLENBQUM7UUFDbkMsSUFBSSxDQUFDLFFBQVEsR0FBRyxRQUFRLENBQUM7UUFDekIsSUFBSSxDQUFDLFdBQVcsR0FBRyxXQUFXLENBQUM7UUFDL0IsSUFBSSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUM7UUFDdkIsSUFBSSxDQUFDLE1BQU0sR0FBRyxlQUFlLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDdEMsSUFBSSxDQUFDLFNBQVMsR0FBRyxlQUFlLENBQUMsU0FBUyxDQUFDLENBQUM7UUFDNUMsSUFBSSxDQUFDLG1CQUFtQixHQUFHLGVBQWUsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDO1FBQ2hFLElBQUksQ0FBQyxVQUFVLEdBQUcsVUFBVSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQztRQUN4RCxJQUFJLENBQUMsa0JBQWtCLEdBQUcsa0JBQWtCLElBQUksRUFBRSxDQUFDO1FBQ25ELElBQUksYUFBYSxJQUFJLGFBQWEsQ0FBQyxNQUFNLElBQUksQ0FBQyxFQUFFO1lBQzlDLE1BQU0sSUFBSSxLQUFLLENBQUMsd0RBQXdELENBQUMsQ0FBQztTQUMzRTtRQUNELElBQUksQ0FBQyxhQUFhLEdBQUcsYUFBYSxDQUFDO1FBQ25DLElBQUksQ0FBQyxRQUFRLEdBQUcsUUFBUSxDQUFDO1FBQ3pCLElBQUksQ0FBQyxtQkFBbUIsR0FBRyxtQkFBbUIsQ0FBQztJQUNqRCxDQUFDO0lBRUQsU0FBUztRQUNQLE9BQU87WUFDTCxrQkFBa0IsRUFBRSxJQUFJLENBQUMsa0JBQWtCO1lBQzNDLGFBQWEsRUFBRSxJQUFJLENBQUMsYUFBYTtZQUNqQyxNQUFNLEVBQUUsSUFBSSxDQUFDLE1BQU07WUFDbkIsVUFBVSxFQUFFLElBQUksQ0FBQyxVQUFVO1NBQzVCLENBQUM7SUFDSixDQUFDO0NBQ0Y7QUFnQ0Q7O0dBRUc7QUFDSCxNQUFNLE9BQU8sd0JBQXdCO0lBNkhuQyxZQUFZLEVBQ1YsTUFBTSxFQUNOLElBQUksRUFDSixXQUFXLEVBQ1gsUUFBUSxFQUNSLFFBQVEsRUFDUixlQUFlLEVBQ2YsTUFBTSxFQUNOLE9BQU8sRUFDUCxhQUFhLEVBQ2IsY0FBYyxFQUNkLGNBQWMsRUFDZCxTQUFTLEVBQ1QsYUFBYSxFQUNiLE9BQU8sRUFDUCxNQUFNLEVBQ04sV0FBVyxFQUNYLGVBQWUsRUFDZixRQUFRLEVBQ1IsaUJBQWlCLEVBQ2pCLFlBQVksRUFDWixnQkFBZ0IsRUF1QmpCO1FBQ0MsSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsTUFBTSxDQUFDO1FBQ3ZCLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO1FBQ2pCLElBQUksQ0FBQyxXQUFXLEdBQUcsV0FBVyxDQUFDO1FBQy9CLElBQUksQ0FBQyxRQUFRLEdBQUcsUUFBUSxDQUFDO1FBQ3pCLElBQUksQ0FBQyxRQUFRLEdBQUcsUUFBUSxDQUFDO1FBQ3pCLElBQUksQ0FBQyxlQUFlLEdBQUcsZUFBZSxDQUFDO1FBQ3ZDLElBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDO1FBQ3JCLElBQUksQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDO1FBQ3ZCLElBQUksQ0FBQyxhQUFhLEdBQUcsYUFBYSxDQUFDO1FBQ25DLElBQUksQ0FBQyxjQUFjLEdBQUcsY0FBYyxDQUFDO1FBQ3JDLElBQUksQ0FBQyxjQUFjLEdBQUcsY0FBYyxDQUFDO1FBQ3JDLElBQUksQ0FBQyxTQUFTLEdBQUcsZUFBZSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBQzVDLElBQUksQ0FBQyxhQUFhLEdBQUcsZUFBZSxDQUFDLGFBQWEsQ0FBQyxDQUFDO1FBQ3BELElBQUksQ0FBQyxPQUFPLEdBQUcsZUFBZSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQ3hDLElBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDO1FBQ3JCLElBQUksQ0FBQyxXQUFXLEdBQUcsZUFBZSxDQUFDLFdBQVcsQ0FBQyxDQUFDO1FBQ2hELElBQUksQ0FBQyxlQUFlLEdBQUcsZUFBZSxDQUFDLGVBQWUsQ0FBQyxDQUFDO1FBQ3hELElBQUksQ0FBQyxRQUFRLEdBQUcsUUFBUSxDQUFDO1FBRXpCLElBQUksQ0FBQyxpQkFBaUIsR0FBRyxpQkFBaUIsQ0FBQztRQUMzQyxJQUFJLENBQUMsWUFBWSxHQUFHLFlBQVksQ0FBQztRQUNqQyxJQUFJLENBQUMsZ0JBQWdCLEdBQUcsZ0JBQWdCLENBQUM7SUFDM0MsQ0FBQztJQS9MRCxNQUFNLENBQUMsTUFBTSxDQUFDLEVBQ1osTUFBTSxFQUNOLElBQUksRUFDSixXQUFXLEVBQ1gsUUFBUSxFQUNSLFFBQVEsRUFDUixlQUFlLEVBQ2YsTUFBTSxFQUNOLE9BQU8sRUFDUCxJQUFJLEVBQ0osU0FBUyxFQUNULGFBQWEsRUFDYixPQUFPLEVBQ1AsTUFBTSxFQUNOLFdBQVcsRUFDWCxlQUFlLEVBQ2YsUUFBUSxFQUNSLGlCQUFpQixFQUNqQixZQUFZLEVBQ1osZ0JBQWdCLEVBcUJqQjtRQUNDLE1BQU0sYUFBYSxHQUE0QixFQUFFLENBQUM7UUFDbEQsTUFBTSxjQUFjLEdBQTRCLEVBQUUsQ0FBQztRQUNuRCxNQUFNLGNBQWMsR0FBNEIsRUFBRSxDQUFDO1FBQ25ELElBQUksSUFBSSxJQUFJLElBQUksRUFBRTtZQUNoQixNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsRUFBRTtnQkFDOUIsTUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO2dCQUN4QixNQUFNLE9BQU8sR0FBRyxHQUFHLENBQUMsS0FBSyxDQUFDLFlBQVksQ0FBQyxDQUFDO2dCQUN4QyxJQUFJLE9BQU8sS0FBSyxJQUFJLEVBQUU7b0JBQ3BCLGNBQWMsQ0FBQyxHQUFHLENBQUMsR0FBRyxLQUFLLENBQUM7aUJBQzdCO3FCQUFNLElBQUksT0FBTyxDQUFDLENBQUMsQ0FBQyxJQUFJLElBQUksRUFBRTtvQkFDN0IsY0FBYyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEtBQUssQ0FBQztpQkFDcEM7cUJBQU0sSUFBSSxPQUFPLENBQUMsQ0FBQyxDQUFDLElBQUksSUFBSSxFQUFFO29CQUM3QixhQUFhLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsS0FBSyxDQUFDO2lCQUNuQztZQUNILENBQUMsQ0FBQyxDQUFDO1NBQ0o7UUFDRCxNQUFNLFNBQVMsR0FBNEIsRUFBRSxDQUFDO1FBQzlDLElBQUksTUFBTSxJQUFJLElBQUksRUFBRTtZQUNsQixNQUFNLENBQUMsT0FBTyxDQUFDLENBQUMsVUFBa0IsRUFBRSxFQUFFO2dCQUNwQyxzQ0FBc0M7Z0JBQ3RDLDJDQUEyQztnQkFDM0MsTUFBTSxLQUFLLEdBQUcsWUFBWSxDQUFDLFVBQVUsRUFBRSxDQUFDLFVBQVUsRUFBRSxVQUFVLENBQUMsQ0FBQyxDQUFDO2dCQUNqRSxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ2pDLENBQUMsQ0FBQyxDQUFDO1NBQ0o7UUFDRCxNQUFNLFVBQVUsR0FBNEIsRUFBRSxDQUFDO1FBQy9DLElBQUksT0FBTyxJQUFJLElBQUksRUFBRTtZQUNuQixPQUFPLENBQUMsT0FBTyxDQUFDLENBQUMsVUFBa0IsRUFBRSxFQUFFO2dCQUNyQyxzQ0FBc0M7Z0JBQ3RDLDJDQUEyQztnQkFDM0MsTUFBTSxLQUFLLEdBQUcsWUFBWSxDQUFDLFVBQVUsRUFBRSxDQUFDLFVBQVUsRUFBRSxVQUFVLENBQUMsQ0FBQyxDQUFDO2dCQUNqRSxVQUFVLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ2xDLENBQUMsQ0FBQyxDQUFDO1NBQ0o7UUFFRCxPQUFPLElBQUksd0JBQXdCLENBQUM7WUFDbEMsTUFBTTtZQUNOLElBQUk7WUFDSixXQUFXLEVBQUUsQ0FBQyxDQUFDLFdBQVc7WUFDMUIsUUFBUTtZQUNSLFFBQVE7WUFDUixlQUFlO1lBQ2YsTUFBTSxFQUFFLFNBQVM7WUFDakIsT0FBTyxFQUFFLFVBQVU7WUFDbkIsYUFBYTtZQUNiLGNBQWM7WUFDZCxjQUFjO1lBQ2QsU0FBUztZQUNULGFBQWE7WUFDYixPQUFPO1lBQ1AsTUFBTTtZQUNOLFdBQVc7WUFDWCxlQUFlO1lBQ2YsUUFBUTtZQUNSLGlCQUFpQjtZQUNqQixZQUFZO1lBQ1osZ0JBQWdCO1NBQ2pCLENBQUMsQ0FBQztJQUNMLENBQUM7SUE4RkQsU0FBUztRQUNQLE9BQU87WUFDTCxXQUFXLEVBQUUsa0JBQWtCLENBQUMsU0FBUztZQUN6QyxJQUFJLEVBQUUsSUFBSSxDQUFDLElBQUk7WUFDZixXQUFXLEVBQUUsSUFBSSxDQUFDLFdBQVc7WUFDN0IsUUFBUSxFQUFFLElBQUksQ0FBQyxRQUFRO1lBQ3ZCLFFBQVEsRUFBRSxJQUFJLENBQUMsUUFBUTtZQUN2QixNQUFNLEVBQUUsSUFBSSxDQUFDLE1BQU07WUFDbkIsT0FBTyxFQUFFLElBQUksQ0FBQyxPQUFPO1lBQ3JCLGFBQWEsRUFBRSxJQUFJLENBQUMsYUFBYTtZQUNqQyxjQUFjLEVBQUUsSUFBSSxDQUFDLGNBQWM7WUFDbkMsY0FBYyxFQUFFLElBQUksQ0FBQyxjQUFjO1lBQ25DLFNBQVMsRUFBRSxJQUFJLENBQUMsU0FBUztZQUN6QixhQUFhLEVBQUUsSUFBSSxDQUFDLGFBQWE7WUFDakMsT0FBTyxFQUFFLElBQUksQ0FBQyxPQUFPO1lBQ3JCLE1BQU0sRUFBRSxJQUFJLENBQUMsTUFBTTtZQUNuQixXQUFXLEVBQUUsSUFBSSxDQUFDLFdBQVc7WUFDN0IsZUFBZSxFQUFFLElBQUksQ0FBQyxlQUFlO1lBQ3JDLGVBQWUsRUFBRSxJQUFJLENBQUMsZUFBZTtZQUNyQyxRQUFRLEVBQUUsSUFBSSxDQUFDLFFBQVEsSUFBSSxJQUFJLENBQUMsUUFBUSxDQUFDLFNBQVMsRUFBRTtZQUNwRCxpQkFBaUIsRUFBRSxJQUFJLENBQUMsaUJBQWlCO1lBQ3pDLFlBQVksRUFBRSxJQUFJLENBQUMsWUFBWTtZQUMvQixnQkFBZ0IsRUFBRSxJQUFJLENBQUMsZ0JBQWdCO1NBQ3hDLENBQUM7SUFDSixDQUFDO0NBQ0Y7QUFRRCxNQUFNLE9BQU8sbUJBQW1CO0lBSzlCLFlBQVksRUFBQyxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFJNUI7UUFDQyxJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztRQUNqQixJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztRQUNqQixJQUFJLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUM7SUFDckIsQ0FBQztJQUVELFNBQVM7UUFDUCxPQUFPO1lBQ0wsV0FBVyxFQUFFLGtCQUFrQixDQUFDLElBQUk7WUFDcEMsSUFBSSxFQUFFLElBQUksQ0FBQyxJQUFJO1lBQ2YsSUFBSSxFQUFFLElBQUksQ0FBQyxJQUFJO1lBQ2YsSUFBSSxFQUFFLElBQUksQ0FBQyxJQUFJO1NBQ2hCLENBQUM7SUFDSixDQUFDO0NBQ0Y7QUFvQkQsTUFBTSxPQUFPLDRCQUE0QjtDQU94QztBQUVEOztHQUVHO0FBQ0gsTUFBTSxPQUFPLHVCQUF1QjtJQWtCbEMsWUFBWSxFQUNWLElBQUksRUFDSixTQUFTLEVBQ1Qsa0JBQWtCLEVBQ2xCLGtCQUFrQixFQUNsQixhQUFhLEVBQ2IsYUFBYSxFQUNiLGVBQWUsRUFDZixtQkFBbUIsRUFDbkIsZUFBZSxFQUNmLGVBQWUsRUFDZixPQUFPLEVBQ1AsZ0JBQWdCLEVBQ2hCLEVBQUUsRUFlSDtRQUNDLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxJQUFJLElBQUksQ0FBQztRQUN6QixJQUFJLENBQUMsa0JBQWtCLEdBQUcsZUFBZSxDQUFDLGtCQUFrQixDQUFDLENBQUM7UUFDOUQsSUFBSSxDQUFDLGtCQUFrQixHQUFHLGVBQWUsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO1FBQzlELElBQUksQ0FBQyxhQUFhLEdBQUcsZUFBZSxDQUFDLGFBQWEsQ0FBQyxDQUFDO1FBQ3BELElBQUksQ0FBQyxhQUFhLEdBQUcsZUFBZSxDQUFDLGFBQWEsQ0FBQyxDQUFDO1FBQ3BELElBQUksQ0FBQyxTQUFTLEdBQUcsZUFBZSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBQzVDLElBQUksQ0FBQyxlQUFlLEdBQUcsZUFBZSxDQUFDLGVBQWUsQ0FBQyxDQUFDO1FBQ3hELElBQUksQ0FBQyxtQkFBbUIsR0FBRyxlQUFlLENBQUMsbUJBQW1CLENBQUMsQ0FBQztRQUNoRSxJQUFJLENBQUMsZUFBZSxHQUFHLGVBQWUsQ0FBQyxlQUFlLENBQUMsQ0FBQztRQUN4RCxJQUFJLENBQUMsZUFBZSxHQUFHLGVBQWUsQ0FBQyxlQUFlLENBQUMsQ0FBQztRQUN4RCxJQUFJLENBQUMsT0FBTyxHQUFHLGVBQWUsQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUN4QyxJQUFJLENBQUMsRUFBRSxHQUFHLEVBQUUsSUFBSSxJQUFJLENBQUM7UUFDckIsSUFBSSxDQUFDLGdCQUFnQixHQUFHLGdCQUFnQixJQUFJLElBQUksQ0FBQztJQUNuRCxDQUFDO0lBRUQsU0FBUztRQUNQLE1BQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxnQkFBaUIsQ0FBQztRQUN0QyxPQUFPO1lBQ0wsV0FBVyxFQUFFLGtCQUFrQixDQUFDLFFBQVE7WUFDeEMsSUFBSSxFQUFFLElBQUksQ0FBQyxJQUFJO1lBQ2YsZUFBZSxFQUFFLE1BQU0sQ0FBQyxlQUFlO1lBQ3ZDLFNBQVMsRUFBRSxNQUFNLENBQUMsU0FBUztZQUMzQixPQUFPLEVBQUUsTUFBTSxDQUFDLE9BQU87WUFDdkIsa0JBQWtCLEVBQUUsTUFBTSxDQUFDLGtCQUFrQjtZQUM3QyxhQUFhLEVBQUUsTUFBTSxDQUFDLGFBQWE7U0FDcEMsQ0FBQztJQUNKLENBQUM7Q0FDRjtBQUVELE1BQU0sT0FBTyxpQ0FBaUM7SUFBOUM7UUFDRSxrQkFBYSxHQUFHLElBQUksR0FBRyxFQUFPLENBQUM7UUFDL0IsZUFBVSxHQUFnQyxFQUFFLENBQUM7UUFDN0MsMEJBQXFCLEdBQUcsSUFBSSxHQUFHLEVBQU8sQ0FBQztRQUN2Qyx1QkFBa0IsR0FBZ0MsRUFBRSxDQUFDO1FBQ3JELGFBQVEsR0FBRyxJQUFJLEdBQUcsRUFBTyxDQUFDO1FBQzFCLFVBQUssR0FBZ0MsRUFBRSxDQUFDO1FBQ3hDLHFCQUFnQixHQUFHLElBQUksR0FBRyxFQUFPLENBQUM7UUFDbEMsa0JBQWEsR0FBZ0MsRUFBRSxDQUFDO1FBQ2hELGVBQVUsR0FBRyxJQUFJLEdBQUcsRUFBTyxDQUFDO1FBQzVCLFlBQU8sR0FBMEIsRUFBRSxDQUFDO1FBQ3BDLHVCQUFrQixHQUFHLElBQUksR0FBRyxFQUFPLENBQUM7UUFDcEMsb0JBQWUsR0FBb0MsRUFBRSxDQUFDO1FBRXRELGNBQVMsR0FBNkUsRUFBRSxDQUFDO0lBMEMzRixDQUFDO0lBeENDLFdBQVcsQ0FBQyxRQUFpQyxFQUFFLE1BQWlDO1FBQzlFLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLEVBQUMsUUFBUSxFQUFFLFFBQVEsRUFBRSxNQUFNLEVBQUUsTUFBTSxFQUFDLENBQUMsQ0FBQztJQUM1RCxDQUFDO0lBRUQsWUFBWSxDQUFDLEVBQTZCO1FBQ3hDLElBQUksQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsU0FBUyxDQUFDLEVBQUU7WUFDekMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1lBQ3JDLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1NBQzFCO0lBQ0gsQ0FBQztJQUNELG9CQUFvQixDQUFDLEVBQTZCO1FBQ2hELElBQUksQ0FBQyxJQUFJLENBQUMscUJBQXFCLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxTQUFTLENBQUMsRUFBRTtZQUNqRCxJQUFJLENBQUMscUJBQXFCLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxTQUFTLENBQUMsQ0FBQztZQUM3QyxJQUFJLENBQUMsa0JBQWtCLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1NBQ2xDO0lBQ0gsQ0FBQztJQUNELE9BQU8sQ0FBQyxFQUE2QjtRQUNuQyxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLFNBQVMsQ0FBQyxFQUFFO1lBQ3BDLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxTQUFTLENBQUMsQ0FBQztZQUNoQyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQztTQUNyQjtJQUNILENBQUM7SUFDRCxlQUFlLENBQUMsRUFBNkI7UUFDM0MsSUFBSSxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLFNBQVMsQ0FBQyxFQUFFO1lBQzVDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1lBQ3hDLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1NBQzdCO0lBQ0gsQ0FBQztJQUNELFNBQVMsQ0FBQyxFQUF1QjtRQUMvQixJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLFNBQVMsQ0FBQyxFQUFFO1lBQ3RDLElBQUksQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxTQUFTLENBQUMsQ0FBQztZQUNsQyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQztTQUN2QjtJQUNILENBQUM7SUFDRCxpQkFBaUIsQ0FBQyxFQUFpQztRQUNqRCxJQUFJLENBQUMsSUFBSSxDQUFDLGtCQUFrQixDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsYUFBYSxDQUFDLEVBQUU7WUFDbEQsSUFBSSxDQUFDLGtCQUFrQixDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsYUFBYSxDQUFDLENBQUM7WUFDOUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7U0FDL0I7SUFDSCxDQUFDO0NBQ0Y7QUFFRCxTQUFTLGVBQWUsQ0FBQyxHQUF5QjtJQUNoRCxPQUFPLEdBQUcsSUFBSSxFQUFFLENBQUM7QUFDbkIsQ0FBQztBQUVELE1BQU0sT0FBTyxZQUFZO0lBU3ZCLFlBQVksS0FBVSxFQUFFLEVBQUMsUUFBUSxFQUFFLFFBQVEsRUFBRSxXQUFXLEVBQUUsVUFBVSxFQUFFLElBQUksRUFBRSxLQUFLLEVBT2hGO1FBQ0MsSUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7UUFDbkIsSUFBSSxDQUFDLFFBQVEsR0FBRyxRQUFRLElBQUksSUFBSSxDQUFDO1FBQ2pDLElBQUksQ0FBQyxRQUFRLEdBQUcsUUFBUSxDQUFDO1FBQ3pCLElBQUksQ0FBQyxXQUFXLEdBQUcsV0FBVyxDQUFDO1FBQy9CLElBQUksQ0FBQyxVQUFVLEdBQUcsVUFBVSxJQUFJLElBQUksQ0FBQztRQUNyQyxJQUFJLENBQUMsWUFBWSxHQUFHLElBQUksSUFBSSxJQUFJLENBQUM7UUFDakMsSUFBSSxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsS0FBSyxDQUFDO0lBQ3ZCLENBQUM7Q0FDRjtBQUVELE1BQU0sVUFBVSxPQUFPLENBQUksSUFBa0I7SUFDM0MsT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBVyxFQUFFLElBQVcsRUFBTyxFQUFFO1FBQ25ELE1BQU0sUUFBUSxHQUFHLEtBQUssQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDO1FBQzVELE9BQWEsSUFBSyxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUN0QyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUM7QUFDVCxDQUFDO0FBRUQsU0FBUyxZQUFZLENBQUMsR0FBVztJQUMvQiwrREFBK0Q7SUFDL0QsMkJBQTJCO0lBQzNCLE9BQU8sR0FBRyxDQUFDLE9BQU8sQ0FBQywwQkFBMEIsRUFBRSxRQUFRLENBQUMsQ0FBQztBQUMzRCxDQUFDO0FBRUQsTUFBTSxVQUFVLGlCQUFpQixDQUM3QixZQUF1QyxFQUFFLFFBQTJDLEVBQ3BGLFlBQTJEO0lBQzdELElBQUksR0FBVyxDQUFDO0lBQ2hCLElBQUksWUFBWSxDQUFDLFFBQVEsRUFBRTtRQUN6QixJQUFJLFFBQVEsQ0FBQyxJQUFJLENBQUMsU0FBUyxZQUFZLFlBQVksRUFBRTtZQUNuRCw0RUFBNEU7WUFDNUUsNkVBQTZFO1lBQzdFLEdBQUcsR0FBRyxHQUFHLFFBQVEsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLFFBQVEsSUFBSSxRQUFRLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLE9BQU8sQ0FBQztTQUNsRjthQUFNO1lBQ0wsR0FBRyxHQUFHLEdBQUcsY0FBYyxDQUFDLFlBQVksQ0FBQyxJQUFJLGNBQWMsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQztTQUMvRTtLQUNGO1NBQU07UUFDTCxHQUFHLEdBQUcsWUFBWSxDQUFDLFdBQVksQ0FBQztLQUNqQztJQUNELE9BQU8sUUFBUSxDQUFDLElBQUksQ0FBQyxTQUFTLFlBQVksWUFBWSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLFlBQVksQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUNuRixDQUFDO0FBRUQsTUFBTSxVQUFVLHNCQUFzQixDQUFDLElBQStCLEVBQUUsRUFBVTtJQUNoRixNQUFNLFNBQVMsR0FBRyxJQUFJLENBQUMsU0FBVSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUNqRCxNQUFNLFFBQVEsR0FBRyxTQUFTLENBQUMsU0FBUyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQztJQUNqRCxPQUFPLFlBQVksQ0FBQyxPQUFPLEVBQUUsR0FBRyxRQUFRLGFBQWEsQ0FBQyxDQUFDO0FBQ3pELENBQUM7QUFFRCxNQUFNLFVBQVUsY0FBYyxDQUFDLFVBQW1DO0lBQ2hFLE9BQU8sWUFBWSxDQUFDLEdBQUcsY0FBYyxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsc0JBQXNCLENBQUMsQ0FBQztBQUNoRixDQUFDO0FBRUQsTUFBTSxVQUFVLGNBQWMsQ0FDMUIsWUFBdUMsRUFBRSxRQUFrQztJQUM3RSxPQUFPLFlBQVksQ0FDZixHQUFHLGNBQWMsQ0FBQyxZQUFZLENBQUMsSUFBSSxjQUFjLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsQ0FBQztBQUN2RixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7U3RhdGljU3ltYm9sfSBmcm9tICcuL2FvdC9zdGF0aWNfc3ltYm9sJztcbmltcG9ydCB7Q2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksIFNjaGVtYU1ldGFkYXRhLCBUeXBlLCBWaWV3RW5jYXBzdWxhdGlvbn0gZnJvbSAnLi9jb3JlJztcbmltcG9ydCB7TGlmZWN5Y2xlSG9va3N9IGZyb20gJy4vbGlmZWN5Y2xlX3JlZmxlY3Rvcic7XG5pbXBvcnQge1BhcnNlVHJlZVJlc3VsdCBhcyBIdG1sUGFyc2VUcmVlUmVzdWx0fSBmcm9tICcuL21sX3BhcnNlci9wYXJzZXInO1xuaW1wb3J0IHtDb21waWxlSWRlbnRpZmllck1ldGFkYXRhLCBpZGVudGlmaWVyTmFtZSwgc2FuaXRpemVJZGVudGlmaWVyfSBmcm9tICcuL3BhcnNlX3V0aWwnO1xuaW1wb3J0IHtzcGxpdEF0Q29sb259IGZyb20gJy4vdXRpbCc7XG5cbi8vIGdyb3VwIDA6IFwiW3Byb3BdIG9yIChldmVudCkgb3IgQHRyaWdnZXJcIlxuLy8gZ3JvdXAgMTogXCJwcm9wXCIgZnJvbSBcIltwcm9wXVwiXG4vLyBncm91cCAyOiBcImV2ZW50XCIgZnJvbSBcIihldmVudClcIlxuLy8gZ3JvdXAgMzogXCJAdHJpZ2dlclwiIGZyb20gXCJAdHJpZ2dlclwiXG5jb25zdCBIT1NUX1JFR19FWFAgPSAvXig/Oig/OlxcWyhbXlxcXV0rKVxcXSl8KD86XFwoKFteXFwpXSspXFwpKSl8KFxcQFstXFx3XSspJC87XG5cbmV4cG9ydCBmdW5jdGlvbiB2aWV3Q2xhc3NOYW1lKGNvbXBUeXBlOiBhbnksIGVtYmVkZGVkVGVtcGxhdGVJbmRleDogbnVtYmVyKTogc3RyaW5nIHtcbiAgcmV0dXJuIGBWaWV3XyR7aWRlbnRpZmllck5hbWUoe3JlZmVyZW5jZTogY29tcFR5cGV9KX1fJHtlbWJlZGRlZFRlbXBsYXRlSW5kZXh9YDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHJlbmRlcmVyVHlwZU5hbWUoY29tcFR5cGU6IGFueSk6IHN0cmluZyB7XG4gIHJldHVybiBgUmVuZGVyVHlwZV8ke2lkZW50aWZpZXJOYW1lKHtyZWZlcmVuY2U6IGNvbXBUeXBlfSl9YDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGhvc3RWaWV3Q2xhc3NOYW1lKGNvbXBUeXBlOiBhbnkpOiBzdHJpbmcge1xuICByZXR1cm4gYEhvc3RWaWV3XyR7aWRlbnRpZmllck5hbWUoe3JlZmVyZW5jZTogY29tcFR5cGV9KX1gO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gY29tcG9uZW50RmFjdG9yeU5hbWUoY29tcFR5cGU6IGFueSk6IHN0cmluZyB7XG4gIHJldHVybiBgJHtpZGVudGlmaWVyTmFtZSh7cmVmZXJlbmNlOiBjb21wVHlwZX0pfU5nRmFjdG9yeWA7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgUHJveHlDbGFzcyB7XG4gIHNldERlbGVnYXRlKGRlbGVnYXRlOiBhbnkpOiB2b2lkO1xufVxuXG5leHBvcnQgZW51bSBDb21waWxlU3VtbWFyeUtpbmQge1xuICBQaXBlLFxuICBEaXJlY3RpdmUsXG4gIE5nTW9kdWxlLFxuICBJbmplY3RhYmxlXG59XG5cbi8qKlxuICogQSBDb21waWxlU3VtbWFyeSBpcyB0aGUgZGF0YSBuZWVkZWQgdG8gdXNlIGEgZGlyZWN0aXZlIC8gcGlwZSAvIG1vZHVsZVxuICogaW4gb3RoZXIgbW9kdWxlcyAvIGNvbXBvbmVudHMuIEhvd2V2ZXIsIHRoaXMgZGF0YSBpcyBub3QgZW5vdWdoIHRvIGNvbXBpbGVcbiAqIHRoZSBkaXJlY3RpdmUgLyBtb2R1bGUgaXRzZWxmLlxuICovXG5leHBvcnQgaW50ZXJmYWNlIENvbXBpbGVUeXBlU3VtbWFyeSB7XG4gIHN1bW1hcnlLaW5kOiBDb21waWxlU3VtbWFyeUtpbmR8bnVsbDtcbiAgdHlwZTogQ29tcGlsZVR5cGVNZXRhZGF0YTtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBDb21waWxlRGlEZXBlbmRlbmN5TWV0YWRhdGEge1xuICBpc0F0dHJpYnV0ZT86IGJvb2xlYW47XG4gIGlzU2VsZj86IGJvb2xlYW47XG4gIGlzSG9zdD86IGJvb2xlYW47XG4gIGlzU2tpcFNlbGY/OiBib29sZWFuO1xuICBpc09wdGlvbmFsPzogYm9vbGVhbjtcbiAgaXNWYWx1ZT86IGJvb2xlYW47XG4gIHRva2VuPzogQ29tcGlsZVRva2VuTWV0YWRhdGE7XG4gIHZhbHVlPzogYW55O1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIENvbXBpbGVQcm92aWRlck1ldGFkYXRhIHtcbiAgdG9rZW46IENvbXBpbGVUb2tlbk1ldGFkYXRhO1xuICB1c2VDbGFzcz86IENvbXBpbGVUeXBlTWV0YWRhdGE7XG4gIHVzZVZhbHVlPzogYW55O1xuICB1c2VFeGlzdGluZz86IENvbXBpbGVUb2tlbk1ldGFkYXRhO1xuICB1c2VGYWN0b3J5PzogQ29tcGlsZUZhY3RvcnlNZXRhZGF0YTtcbiAgZGVwcz86IENvbXBpbGVEaURlcGVuZGVuY3lNZXRhZGF0YVtdO1xuICBtdWx0aT86IGJvb2xlYW47XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgQ29tcGlsZUZhY3RvcnlNZXRhZGF0YSBleHRlbmRzIENvbXBpbGVJZGVudGlmaWVyTWV0YWRhdGEge1xuICBkaURlcHM6IENvbXBpbGVEaURlcGVuZGVuY3lNZXRhZGF0YVtdO1xuICByZWZlcmVuY2U6IGFueTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHRva2VuTmFtZSh0b2tlbjogQ29tcGlsZVRva2VuTWV0YWRhdGEpIHtcbiAgcmV0dXJuIHRva2VuLnZhbHVlICE9IG51bGwgPyBzYW5pdGl6ZUlkZW50aWZpZXIodG9rZW4udmFsdWUpIDogaWRlbnRpZmllck5hbWUodG9rZW4uaWRlbnRpZmllcik7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiB0b2tlblJlZmVyZW5jZSh0b2tlbjogQ29tcGlsZVRva2VuTWV0YWRhdGEpIHtcbiAgaWYgKHRva2VuLmlkZW50aWZpZXIgIT0gbnVsbCkge1xuICAgIHJldHVybiB0b2tlbi5pZGVudGlmaWVyLnJlZmVyZW5jZTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gdG9rZW4udmFsdWU7XG4gIH1cbn1cblxuZXhwb3J0IGludGVyZmFjZSBDb21waWxlVG9rZW5NZXRhZGF0YSB7XG4gIHZhbHVlPzogYW55O1xuICBpZGVudGlmaWVyPzogQ29tcGlsZUlkZW50aWZpZXJNZXRhZGF0YXxDb21waWxlVHlwZU1ldGFkYXRhO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIENvbXBpbGVJbmplY3RhYmxlTWV0YWRhdGEge1xuICBzeW1ib2w6IFN0YXRpY1N5bWJvbDtcbiAgdHlwZTogQ29tcGlsZVR5cGVNZXRhZGF0YTtcblxuICBwcm92aWRlZEluPzogU3RhdGljU3ltYm9sO1xuXG4gIHVzZVZhbHVlPzogYW55O1xuICB1c2VDbGFzcz86IFN0YXRpY1N5bWJvbDtcbiAgdXNlRXhpc3Rpbmc/OiBTdGF0aWNTeW1ib2w7XG4gIHVzZUZhY3Rvcnk/OiBTdGF0aWNTeW1ib2w7XG4gIGRlcHM/OiBhbnlbXTtcbn1cblxuLyoqXG4gKiBNZXRhZGF0YSByZWdhcmRpbmcgY29tcGlsYXRpb24gb2YgYSB0eXBlLlxuICovXG5leHBvcnQgaW50ZXJmYWNlIENvbXBpbGVUeXBlTWV0YWRhdGEgZXh0ZW5kcyBDb21waWxlSWRlbnRpZmllck1ldGFkYXRhIHtcbiAgZGlEZXBzOiBDb21waWxlRGlEZXBlbmRlbmN5TWV0YWRhdGFbXTtcbiAgbGlmZWN5Y2xlSG9va3M6IExpZmVjeWNsZUhvb2tzW107XG4gIHJlZmVyZW5jZTogYW55O1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIENvbXBpbGVRdWVyeU1ldGFkYXRhIHtcbiAgc2VsZWN0b3JzOiBBcnJheTxDb21waWxlVG9rZW5NZXRhZGF0YT47XG4gIGRlc2NlbmRhbnRzOiBib29sZWFuO1xuICBmaXJzdDogYm9vbGVhbjtcbiAgcHJvcGVydHlOYW1lOiBzdHJpbmc7XG4gIHJlYWQ6IENvbXBpbGVUb2tlbk1ldGFkYXRhO1xuICBzdGF0aWM/OiBib29sZWFuO1xuICBlbWl0RGlzdGluY3RDaGFuZ2VzT25seT86IGJvb2xlYW47XG59XG5cbi8qKlxuICogTWV0YWRhdGEgYWJvdXQgYSBzdHlsZXNoZWV0XG4gKi9cbmV4cG9ydCBjbGFzcyBDb21waWxlU3R5bGVzaGVldE1ldGFkYXRhIHtcbiAgbW9kdWxlVXJsOiBzdHJpbmd8bnVsbDtcbiAgc3R5bGVzOiBzdHJpbmdbXTtcbiAgc3R5bGVVcmxzOiBzdHJpbmdbXTtcbiAgY29uc3RydWN0b3IoXG4gICAgICB7bW9kdWxlVXJsLCBzdHlsZXMsIHN0eWxlVXJsc306XG4gICAgICAgICAge21vZHVsZVVybD86IHN0cmluZywgc3R5bGVzPzogc3RyaW5nW10sIHN0eWxlVXJscz86IHN0cmluZ1tdfSA9IHt9KSB7XG4gICAgdGhpcy5tb2R1bGVVcmwgPSBtb2R1bGVVcmwgfHwgbnVsbDtcbiAgICB0aGlzLnN0eWxlcyA9IF9ub3JtYWxpemVBcnJheShzdHlsZXMpO1xuICAgIHRoaXMuc3R5bGVVcmxzID0gX25vcm1hbGl6ZUFycmF5KHN0eWxlVXJscyk7XG4gIH1cbn1cblxuLyoqXG4gKiBTdW1tYXJ5IE1ldGFkYXRhIHJlZ2FyZGluZyBjb21waWxhdGlvbiBvZiBhIHRlbXBsYXRlLlxuICovXG5leHBvcnQgaW50ZXJmYWNlIENvbXBpbGVUZW1wbGF0ZVN1bW1hcnkge1xuICBuZ0NvbnRlbnRTZWxlY3RvcnM6IHN0cmluZ1tdO1xuICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbnxudWxsO1xuICBzdHlsZXM6IHN0cmluZ1tdO1xuICBhbmltYXRpb25zOiBhbnlbXXxudWxsO1xufVxuXG4vKipcbiAqIE1ldGFkYXRhIHJlZ2FyZGluZyBjb21waWxhdGlvbiBvZiBhIHRlbXBsYXRlLlxuICovXG5leHBvcnQgY2xhc3MgQ29tcGlsZVRlbXBsYXRlTWV0YWRhdGEge1xuICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbnxudWxsO1xuICB0ZW1wbGF0ZTogc3RyaW5nfG51bGw7XG4gIHRlbXBsYXRlVXJsOiBzdHJpbmd8bnVsbDtcbiAgaHRtbEFzdDogSHRtbFBhcnNlVHJlZVJlc3VsdHxudWxsO1xuICBpc0lubGluZTogYm9vbGVhbjtcbiAgc3R5bGVzOiBzdHJpbmdbXTtcbiAgc3R5bGVVcmxzOiBzdHJpbmdbXTtcbiAgZXh0ZXJuYWxTdHlsZXNoZWV0czogQ29tcGlsZVN0eWxlc2hlZXRNZXRhZGF0YVtdO1xuICBhbmltYXRpb25zOiBhbnlbXTtcbiAgbmdDb250ZW50U2VsZWN0b3JzOiBzdHJpbmdbXTtcbiAgaW50ZXJwb2xhdGlvbjogW3N0cmluZywgc3RyaW5nXXxudWxsO1xuICBwcmVzZXJ2ZVdoaXRlc3BhY2VzOiBib29sZWFuO1xuICBjb25zdHJ1Y3Rvcih7XG4gICAgZW5jYXBzdWxhdGlvbixcbiAgICB0ZW1wbGF0ZSxcbiAgICB0ZW1wbGF0ZVVybCxcbiAgICBodG1sQXN0LFxuICAgIHN0eWxlcyxcbiAgICBzdHlsZVVybHMsXG4gICAgZXh0ZXJuYWxTdHlsZXNoZWV0cyxcbiAgICBhbmltYXRpb25zLFxuICAgIG5nQ29udGVudFNlbGVjdG9ycyxcbiAgICBpbnRlcnBvbGF0aW9uLFxuICAgIGlzSW5saW5lLFxuICAgIHByZXNlcnZlV2hpdGVzcGFjZXNcbiAgfToge1xuICAgIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9ufG51bGwsXG4gICAgdGVtcGxhdGU6IHN0cmluZ3xudWxsLFxuICAgIHRlbXBsYXRlVXJsOiBzdHJpbmd8bnVsbCxcbiAgICBodG1sQXN0OiBIdG1sUGFyc2VUcmVlUmVzdWx0fG51bGwsXG4gICAgc3R5bGVzOiBzdHJpbmdbXSxcbiAgICBzdHlsZVVybHM6IHN0cmluZ1tdLFxuICAgIGV4dGVybmFsU3R5bGVzaGVldHM6IENvbXBpbGVTdHlsZXNoZWV0TWV0YWRhdGFbXSxcbiAgICBuZ0NvbnRlbnRTZWxlY3RvcnM6IHN0cmluZ1tdLFxuICAgIGFuaW1hdGlvbnM6IGFueVtdLFxuICAgIGludGVycG9sYXRpb246IFtzdHJpbmcsIHN0cmluZ118bnVsbCxcbiAgICBpc0lubGluZTogYm9vbGVhbixcbiAgICBwcmVzZXJ2ZVdoaXRlc3BhY2VzOiBib29sZWFuXG4gIH0pIHtcbiAgICB0aGlzLmVuY2Fwc3VsYXRpb24gPSBlbmNhcHN1bGF0aW9uO1xuICAgIHRoaXMudGVtcGxhdGUgPSB0ZW1wbGF0ZTtcbiAgICB0aGlzLnRlbXBsYXRlVXJsID0gdGVtcGxhdGVVcmw7XG4gICAgdGhpcy5odG1sQXN0ID0gaHRtbEFzdDtcbiAgICB0aGlzLnN0eWxlcyA9IF9ub3JtYWxpemVBcnJheShzdHlsZXMpO1xuICAgIHRoaXMuc3R5bGVVcmxzID0gX25vcm1hbGl6ZUFycmF5KHN0eWxlVXJscyk7XG4gICAgdGhpcy5leHRlcm5hbFN0eWxlc2hlZXRzID0gX25vcm1hbGl6ZUFycmF5KGV4dGVybmFsU3R5bGVzaGVldHMpO1xuICAgIHRoaXMuYW5pbWF0aW9ucyA9IGFuaW1hdGlvbnMgPyBmbGF0dGVuKGFuaW1hdGlvbnMpIDogW107XG4gICAgdGhpcy5uZ0NvbnRlbnRTZWxlY3RvcnMgPSBuZ0NvbnRlbnRTZWxlY3RvcnMgfHwgW107XG4gICAgaWYgKGludGVycG9sYXRpb24gJiYgaW50ZXJwb2xhdGlvbi5sZW5ndGggIT0gMikge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGAnaW50ZXJwb2xhdGlvbicgc2hvdWxkIGhhdmUgYSBzdGFydCBhbmQgYW4gZW5kIHN5bWJvbC5gKTtcbiAgICB9XG4gICAgdGhpcy5pbnRlcnBvbGF0aW9uID0gaW50ZXJwb2xhdGlvbjtcbiAgICB0aGlzLmlzSW5saW5lID0gaXNJbmxpbmU7XG4gICAgdGhpcy5wcmVzZXJ2ZVdoaXRlc3BhY2VzID0gcHJlc2VydmVXaGl0ZXNwYWNlcztcbiAgfVxuXG4gIHRvU3VtbWFyeSgpOiBDb21waWxlVGVtcGxhdGVTdW1tYXJ5IHtcbiAgICByZXR1cm4ge1xuICAgICAgbmdDb250ZW50U2VsZWN0b3JzOiB0aGlzLm5nQ29udGVudFNlbGVjdG9ycyxcbiAgICAgIGVuY2Fwc3VsYXRpb246IHRoaXMuZW5jYXBzdWxhdGlvbixcbiAgICAgIHN0eWxlczogdGhpcy5zdHlsZXMsXG4gICAgICBhbmltYXRpb25zOiB0aGlzLmFuaW1hdGlvbnNcbiAgICB9O1xuICB9XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgQ29tcGlsZUVudHJ5Q29tcG9uZW50TWV0YWRhdGEge1xuICBjb21wb25lbnRUeXBlOiBhbnk7XG4gIGNvbXBvbmVudEZhY3Rvcnk6IFN0YXRpY1N5bWJvbHxvYmplY3Q7XG59XG5cbi8vIE5vdGU6IFRoaXMgc2hvdWxkIG9ubHkgdXNlIGludGVyZmFjZXMgYXMgbmVzdGVkIGRhdGEgdHlwZXNcbi8vIGFzIHdlIG5lZWQgdG8gYmUgYWJsZSB0byBzZXJpYWxpemUgdGhpcyBmcm9tL3RvIEpTT04hXG5leHBvcnQgaW50ZXJmYWNlIENvbXBpbGVEaXJlY3RpdmVTdW1tYXJ5IGV4dGVuZHMgQ29tcGlsZVR5cGVTdW1tYXJ5IHtcbiAgdHlwZTogQ29tcGlsZVR5cGVNZXRhZGF0YTtcbiAgaXNDb21wb25lbnQ6IGJvb2xlYW47XG4gIHNlbGVjdG9yOiBzdHJpbmd8bnVsbDtcbiAgZXhwb3J0QXM6IHN0cmluZ3xudWxsO1xuICBpbnB1dHM6IHtba2V5OiBzdHJpbmddOiBzdHJpbmd9O1xuICBvdXRwdXRzOiB7W2tleTogc3RyaW5nXTogc3RyaW5nfTtcbiAgaG9zdExpc3RlbmVyczoge1trZXk6IHN0cmluZ106IHN0cmluZ307XG4gIGhvc3RQcm9wZXJ0aWVzOiB7W2tleTogc3RyaW5nXTogc3RyaW5nfTtcbiAgaG9zdEF0dHJpYnV0ZXM6IHtba2V5OiBzdHJpbmddOiBzdHJpbmd9O1xuICBwcm92aWRlcnM6IENvbXBpbGVQcm92aWRlck1ldGFkYXRhW107XG4gIHZpZXdQcm92aWRlcnM6IENvbXBpbGVQcm92aWRlck1ldGFkYXRhW107XG4gIHF1ZXJpZXM6IENvbXBpbGVRdWVyeU1ldGFkYXRhW107XG4gIGd1YXJkczoge1trZXk6IHN0cmluZ106IGFueX07XG4gIHZpZXdRdWVyaWVzOiBDb21waWxlUXVlcnlNZXRhZGF0YVtdO1xuICBlbnRyeUNvbXBvbmVudHM6IENvbXBpbGVFbnRyeUNvbXBvbmVudE1ldGFkYXRhW107XG4gIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3l8bnVsbDtcbiAgdGVtcGxhdGU6IENvbXBpbGVUZW1wbGF0ZVN1bW1hcnl8bnVsbDtcbiAgY29tcG9uZW50Vmlld1R5cGU6IFN0YXRpY1N5bWJvbHxQcm94eUNsYXNzfG51bGw7XG4gIHJlbmRlcmVyVHlwZTogU3RhdGljU3ltYm9sfG9iamVjdHxudWxsO1xuICBjb21wb25lbnRGYWN0b3J5OiBTdGF0aWNTeW1ib2x8b2JqZWN0fG51bGw7XG59XG5cbi8qKlxuICogTWV0YWRhdGEgcmVnYXJkaW5nIGNvbXBpbGF0aW9uIG9mIGEgZGlyZWN0aXZlLlxuICovXG5leHBvcnQgY2xhc3MgQ29tcGlsZURpcmVjdGl2ZU1ldGFkYXRhIHtcbiAgc3RhdGljIGNyZWF0ZSh7XG4gICAgaXNIb3N0LFxuICAgIHR5cGUsXG4gICAgaXNDb21wb25lbnQsXG4gICAgc2VsZWN0b3IsXG4gICAgZXhwb3J0QXMsXG4gICAgY2hhbmdlRGV0ZWN0aW9uLFxuICAgIGlucHV0cyxcbiAgICBvdXRwdXRzLFxuICAgIGhvc3QsXG4gICAgcHJvdmlkZXJzLFxuICAgIHZpZXdQcm92aWRlcnMsXG4gICAgcXVlcmllcyxcbiAgICBndWFyZHMsXG4gICAgdmlld1F1ZXJpZXMsXG4gICAgZW50cnlDb21wb25lbnRzLFxuICAgIHRlbXBsYXRlLFxuICAgIGNvbXBvbmVudFZpZXdUeXBlLFxuICAgIHJlbmRlcmVyVHlwZSxcbiAgICBjb21wb25lbnRGYWN0b3J5XG4gIH06IHtcbiAgICBpc0hvc3Q6IGJvb2xlYW4sXG4gICAgdHlwZTogQ29tcGlsZVR5cGVNZXRhZGF0YSxcbiAgICBpc0NvbXBvbmVudDogYm9vbGVhbixcbiAgICBzZWxlY3Rvcjogc3RyaW5nfG51bGwsXG4gICAgZXhwb3J0QXM6IHN0cmluZ3xudWxsLFxuICAgIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3l8bnVsbCxcbiAgICBpbnB1dHM6IHN0cmluZ1tdLFxuICAgIG91dHB1dHM6IHN0cmluZ1tdLFxuICAgIGhvc3Q6IHtba2V5OiBzdHJpbmddOiBzdHJpbmd9LFxuICAgIHByb3ZpZGVyczogQ29tcGlsZVByb3ZpZGVyTWV0YWRhdGFbXSxcbiAgICB2aWV3UHJvdmlkZXJzOiBDb21waWxlUHJvdmlkZXJNZXRhZGF0YVtdLFxuICAgIHF1ZXJpZXM6IENvbXBpbGVRdWVyeU1ldGFkYXRhW10sXG4gICAgZ3VhcmRzOiB7W2tleTogc3RyaW5nXTogYW55fTtcbiAgICB2aWV3UXVlcmllczogQ29tcGlsZVF1ZXJ5TWV0YWRhdGFbXSxcbiAgICBlbnRyeUNvbXBvbmVudHM6IENvbXBpbGVFbnRyeUNvbXBvbmVudE1ldGFkYXRhW10sXG4gICAgdGVtcGxhdGU6IENvbXBpbGVUZW1wbGF0ZU1ldGFkYXRhLFxuICAgIGNvbXBvbmVudFZpZXdUeXBlOiBTdGF0aWNTeW1ib2x8UHJveHlDbGFzc3xudWxsLFxuICAgIHJlbmRlcmVyVHlwZTogU3RhdGljU3ltYm9sfG9iamVjdHxudWxsLFxuICAgIGNvbXBvbmVudEZhY3Rvcnk6IFN0YXRpY1N5bWJvbHxvYmplY3R8bnVsbCxcbiAgfSk6IENvbXBpbGVEaXJlY3RpdmVNZXRhZGF0YSB7XG4gICAgY29uc3QgaG9zdExpc3RlbmVyczoge1trZXk6IHN0cmluZ106IHN0cmluZ30gPSB7fTtcbiAgICBjb25zdCBob3N0UHJvcGVydGllczoge1trZXk6IHN0cmluZ106IHN0cmluZ30gPSB7fTtcbiAgICBjb25zdCBob3N0QXR0cmlidXRlczoge1trZXk6IHN0cmluZ106IHN0cmluZ30gPSB7fTtcbiAgICBpZiAoaG9zdCAhPSBudWxsKSB7XG4gICAgICBPYmplY3Qua2V5cyhob3N0KS5mb3JFYWNoKGtleSA9PiB7XG4gICAgICAgIGNvbnN0IHZhbHVlID0gaG9zdFtrZXldO1xuICAgICAgICBjb25zdCBtYXRjaGVzID0ga2V5Lm1hdGNoKEhPU1RfUkVHX0VYUCk7XG4gICAgICAgIGlmIChtYXRjaGVzID09PSBudWxsKSB7XG4gICAgICAgICAgaG9zdEF0dHJpYnV0ZXNba2V5XSA9IHZhbHVlO1xuICAgICAgICB9IGVsc2UgaWYgKG1hdGNoZXNbMV0gIT0gbnVsbCkge1xuICAgICAgICAgIGhvc3RQcm9wZXJ0aWVzW21hdGNoZXNbMV1dID0gdmFsdWU7XG4gICAgICAgIH0gZWxzZSBpZiAobWF0Y2hlc1syXSAhPSBudWxsKSB7XG4gICAgICAgICAgaG9zdExpc3RlbmVyc1ttYXRjaGVzWzJdXSA9IHZhbHVlO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gICAgY29uc3QgaW5wdXRzTWFwOiB7W2tleTogc3RyaW5nXTogc3RyaW5nfSA9IHt9O1xuICAgIGlmIChpbnB1dHMgIT0gbnVsbCkge1xuICAgICAgaW5wdXRzLmZvckVhY2goKGJpbmRDb25maWc6IHN0cmluZykgPT4ge1xuICAgICAgICAvLyBjYW5vbmljYWwgc3ludGF4OiBgZGlyUHJvcDogZWxQcm9wYFxuICAgICAgICAvLyBpZiB0aGVyZSBpcyBubyBgOmAsIHVzZSBkaXJQcm9wID0gZWxQcm9wXG4gICAgICAgIGNvbnN0IHBhcnRzID0gc3BsaXRBdENvbG9uKGJpbmRDb25maWcsIFtiaW5kQ29uZmlnLCBiaW5kQ29uZmlnXSk7XG4gICAgICAgIGlucHV0c01hcFtwYXJ0c1swXV0gPSBwYXJ0c1sxXTtcbiAgICAgIH0pO1xuICAgIH1cbiAgICBjb25zdCBvdXRwdXRzTWFwOiB7W2tleTogc3RyaW5nXTogc3RyaW5nfSA9IHt9O1xuICAgIGlmIChvdXRwdXRzICE9IG51bGwpIHtcbiAgICAgIG91dHB1dHMuZm9yRWFjaCgoYmluZENvbmZpZzogc3RyaW5nKSA9PiB7XG4gICAgICAgIC8vIGNhbm9uaWNhbCBzeW50YXg6IGBkaXJQcm9wOiBlbFByb3BgXG4gICAgICAgIC8vIGlmIHRoZXJlIGlzIG5vIGA6YCwgdXNlIGRpclByb3AgPSBlbFByb3BcbiAgICAgICAgY29uc3QgcGFydHMgPSBzcGxpdEF0Q29sb24oYmluZENvbmZpZywgW2JpbmRDb25maWcsIGJpbmRDb25maWddKTtcbiAgICAgICAgb3V0cHV0c01hcFtwYXJ0c1swXV0gPSBwYXJ0c1sxXTtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIHJldHVybiBuZXcgQ29tcGlsZURpcmVjdGl2ZU1ldGFkYXRhKHtcbiAgICAgIGlzSG9zdCxcbiAgICAgIHR5cGUsXG4gICAgICBpc0NvbXBvbmVudDogISFpc0NvbXBvbmVudCxcbiAgICAgIHNlbGVjdG9yLFxuICAgICAgZXhwb3J0QXMsXG4gICAgICBjaGFuZ2VEZXRlY3Rpb24sXG4gICAgICBpbnB1dHM6IGlucHV0c01hcCxcbiAgICAgIG91dHB1dHM6IG91dHB1dHNNYXAsXG4gICAgICBob3N0TGlzdGVuZXJzLFxuICAgICAgaG9zdFByb3BlcnRpZXMsXG4gICAgICBob3N0QXR0cmlidXRlcyxcbiAgICAgIHByb3ZpZGVycyxcbiAgICAgIHZpZXdQcm92aWRlcnMsXG4gICAgICBxdWVyaWVzLFxuICAgICAgZ3VhcmRzLFxuICAgICAgdmlld1F1ZXJpZXMsXG4gICAgICBlbnRyeUNvbXBvbmVudHMsXG4gICAgICB0ZW1wbGF0ZSxcbiAgICAgIGNvbXBvbmVudFZpZXdUeXBlLFxuICAgICAgcmVuZGVyZXJUeXBlLFxuICAgICAgY29tcG9uZW50RmFjdG9yeSxcbiAgICB9KTtcbiAgfVxuICBpc0hvc3Q6IGJvb2xlYW47XG4gIHR5cGU6IENvbXBpbGVUeXBlTWV0YWRhdGE7XG4gIGlzQ29tcG9uZW50OiBib29sZWFuO1xuICBzZWxlY3Rvcjogc3RyaW5nfG51bGw7XG4gIGV4cG9ydEFzOiBzdHJpbmd8bnVsbDtcbiAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneXxudWxsO1xuICBpbnB1dHM6IHtba2V5OiBzdHJpbmddOiBzdHJpbmd9O1xuICBvdXRwdXRzOiB7W2tleTogc3RyaW5nXTogc3RyaW5nfTtcbiAgaG9zdExpc3RlbmVyczoge1trZXk6IHN0cmluZ106IHN0cmluZ307XG4gIGhvc3RQcm9wZXJ0aWVzOiB7W2tleTogc3RyaW5nXTogc3RyaW5nfTtcbiAgaG9zdEF0dHJpYnV0ZXM6IHtba2V5OiBzdHJpbmddOiBzdHJpbmd9O1xuICBwcm92aWRlcnM6IENvbXBpbGVQcm92aWRlck1ldGFkYXRhW107XG4gIHZpZXdQcm92aWRlcnM6IENvbXBpbGVQcm92aWRlck1ldGFkYXRhW107XG4gIHF1ZXJpZXM6IENvbXBpbGVRdWVyeU1ldGFkYXRhW107XG4gIGd1YXJkczoge1trZXk6IHN0cmluZ106IGFueX07XG4gIHZpZXdRdWVyaWVzOiBDb21waWxlUXVlcnlNZXRhZGF0YVtdO1xuICBlbnRyeUNvbXBvbmVudHM6IENvbXBpbGVFbnRyeUNvbXBvbmVudE1ldGFkYXRhW107XG5cbiAgdGVtcGxhdGU6IENvbXBpbGVUZW1wbGF0ZU1ldGFkYXRhfG51bGw7XG5cbiAgY29tcG9uZW50Vmlld1R5cGU6IFN0YXRpY1N5bWJvbHxQcm94eUNsYXNzfG51bGw7XG4gIHJlbmRlcmVyVHlwZTogU3RhdGljU3ltYm9sfG9iamVjdHxudWxsO1xuICBjb21wb25lbnRGYWN0b3J5OiBTdGF0aWNTeW1ib2x8b2JqZWN0fG51bGw7XG5cbiAgY29uc3RydWN0b3Ioe1xuICAgIGlzSG9zdCxcbiAgICB0eXBlLFxuICAgIGlzQ29tcG9uZW50LFxuICAgIHNlbGVjdG9yLFxuICAgIGV4cG9ydEFzLFxuICAgIGNoYW5nZURldGVjdGlvbixcbiAgICBpbnB1dHMsXG4gICAgb3V0cHV0cyxcbiAgICBob3N0TGlzdGVuZXJzLFxuICAgIGhvc3RQcm9wZXJ0aWVzLFxuICAgIGhvc3RBdHRyaWJ1dGVzLFxuICAgIHByb3ZpZGVycyxcbiAgICB2aWV3UHJvdmlkZXJzLFxuICAgIHF1ZXJpZXMsXG4gICAgZ3VhcmRzLFxuICAgIHZpZXdRdWVyaWVzLFxuICAgIGVudHJ5Q29tcG9uZW50cyxcbiAgICB0ZW1wbGF0ZSxcbiAgICBjb21wb25lbnRWaWV3VHlwZSxcbiAgICByZW5kZXJlclR5cGUsXG4gICAgY29tcG9uZW50RmFjdG9yeVxuICB9OiB7XG4gICAgaXNIb3N0OiBib29sZWFuLFxuICAgIHR5cGU6IENvbXBpbGVUeXBlTWV0YWRhdGEsXG4gICAgaXNDb21wb25lbnQ6IGJvb2xlYW4sXG4gICAgc2VsZWN0b3I6IHN0cmluZ3xudWxsLFxuICAgIGV4cG9ydEFzOiBzdHJpbmd8bnVsbCxcbiAgICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5fG51bGwsXG4gICAgaW5wdXRzOiB7W2tleTogc3RyaW5nXTogc3RyaW5nfSxcbiAgICBvdXRwdXRzOiB7W2tleTogc3RyaW5nXTogc3RyaW5nfSxcbiAgICBob3N0TGlzdGVuZXJzOiB7W2tleTogc3RyaW5nXTogc3RyaW5nfSxcbiAgICBob3N0UHJvcGVydGllczoge1trZXk6IHN0cmluZ106IHN0cmluZ30sXG4gICAgaG9zdEF0dHJpYnV0ZXM6IHtba2V5OiBzdHJpbmddOiBzdHJpbmd9LFxuICAgIHByb3ZpZGVyczogQ29tcGlsZVByb3ZpZGVyTWV0YWRhdGFbXSxcbiAgICB2aWV3UHJvdmlkZXJzOiBDb21waWxlUHJvdmlkZXJNZXRhZGF0YVtdLFxuICAgIHF1ZXJpZXM6IENvbXBpbGVRdWVyeU1ldGFkYXRhW10sXG4gICAgZ3VhcmRzOiB7W2tleTogc3RyaW5nXTogYW55fSxcbiAgICB2aWV3UXVlcmllczogQ29tcGlsZVF1ZXJ5TWV0YWRhdGFbXSxcbiAgICBlbnRyeUNvbXBvbmVudHM6IENvbXBpbGVFbnRyeUNvbXBvbmVudE1ldGFkYXRhW10sXG4gICAgdGVtcGxhdGU6IENvbXBpbGVUZW1wbGF0ZU1ldGFkYXRhfG51bGwsXG4gICAgY29tcG9uZW50Vmlld1R5cGU6IFN0YXRpY1N5bWJvbHxQcm94eUNsYXNzfG51bGwsXG4gICAgcmVuZGVyZXJUeXBlOiBTdGF0aWNTeW1ib2x8b2JqZWN0fG51bGwsXG4gICAgY29tcG9uZW50RmFjdG9yeTogU3RhdGljU3ltYm9sfG9iamVjdHxudWxsLFxuICB9KSB7XG4gICAgdGhpcy5pc0hvc3QgPSAhIWlzSG9zdDtcbiAgICB0aGlzLnR5cGUgPSB0eXBlO1xuICAgIHRoaXMuaXNDb21wb25lbnQgPSBpc0NvbXBvbmVudDtcbiAgICB0aGlzLnNlbGVjdG9yID0gc2VsZWN0b3I7XG4gICAgdGhpcy5leHBvcnRBcyA9IGV4cG9ydEFzO1xuICAgIHRoaXMuY2hhbmdlRGV0ZWN0aW9uID0gY2hhbmdlRGV0ZWN0aW9uO1xuICAgIHRoaXMuaW5wdXRzID0gaW5wdXRzO1xuICAgIHRoaXMub3V0cHV0cyA9IG91dHB1dHM7XG4gICAgdGhpcy5ob3N0TGlzdGVuZXJzID0gaG9zdExpc3RlbmVycztcbiAgICB0aGlzLmhvc3RQcm9wZXJ0aWVzID0gaG9zdFByb3BlcnRpZXM7XG4gICAgdGhpcy5ob3N0QXR0cmlidXRlcyA9IGhvc3RBdHRyaWJ1dGVzO1xuICAgIHRoaXMucHJvdmlkZXJzID0gX25vcm1hbGl6ZUFycmF5KHByb3ZpZGVycyk7XG4gICAgdGhpcy52aWV3UHJvdmlkZXJzID0gX25vcm1hbGl6ZUFycmF5KHZpZXdQcm92aWRlcnMpO1xuICAgIHRoaXMucXVlcmllcyA9IF9ub3JtYWxpemVBcnJheShxdWVyaWVzKTtcbiAgICB0aGlzLmd1YXJkcyA9IGd1YXJkcztcbiAgICB0aGlzLnZpZXdRdWVyaWVzID0gX25vcm1hbGl6ZUFycmF5KHZpZXdRdWVyaWVzKTtcbiAgICB0aGlzLmVudHJ5Q29tcG9uZW50cyA9IF9ub3JtYWxpemVBcnJheShlbnRyeUNvbXBvbmVudHMpO1xuICAgIHRoaXMudGVtcGxhdGUgPSB0ZW1wbGF0ZTtcblxuICAgIHRoaXMuY29tcG9uZW50Vmlld1R5cGUgPSBjb21wb25lbnRWaWV3VHlwZTtcbiAgICB0aGlzLnJlbmRlcmVyVHlwZSA9IHJlbmRlcmVyVHlwZTtcbiAgICB0aGlzLmNvbXBvbmVudEZhY3RvcnkgPSBjb21wb25lbnRGYWN0b3J5O1xuICB9XG5cbiAgdG9TdW1tYXJ5KCk6IENvbXBpbGVEaXJlY3RpdmVTdW1tYXJ5IHtcbiAgICByZXR1cm4ge1xuICAgICAgc3VtbWFyeUtpbmQ6IENvbXBpbGVTdW1tYXJ5S2luZC5EaXJlY3RpdmUsXG4gICAgICB0eXBlOiB0aGlzLnR5cGUsXG4gICAgICBpc0NvbXBvbmVudDogdGhpcy5pc0NvbXBvbmVudCxcbiAgICAgIHNlbGVjdG9yOiB0aGlzLnNlbGVjdG9yLFxuICAgICAgZXhwb3J0QXM6IHRoaXMuZXhwb3J0QXMsXG4gICAgICBpbnB1dHM6IHRoaXMuaW5wdXRzLFxuICAgICAgb3V0cHV0czogdGhpcy5vdXRwdXRzLFxuICAgICAgaG9zdExpc3RlbmVyczogdGhpcy5ob3N0TGlzdGVuZXJzLFxuICAgICAgaG9zdFByb3BlcnRpZXM6IHRoaXMuaG9zdFByb3BlcnRpZXMsXG4gICAgICBob3N0QXR0cmlidXRlczogdGhpcy5ob3N0QXR0cmlidXRlcyxcbiAgICAgIHByb3ZpZGVyczogdGhpcy5wcm92aWRlcnMsXG4gICAgICB2aWV3UHJvdmlkZXJzOiB0aGlzLnZpZXdQcm92aWRlcnMsXG4gICAgICBxdWVyaWVzOiB0aGlzLnF1ZXJpZXMsXG4gICAgICBndWFyZHM6IHRoaXMuZ3VhcmRzLFxuICAgICAgdmlld1F1ZXJpZXM6IHRoaXMudmlld1F1ZXJpZXMsXG4gICAgICBlbnRyeUNvbXBvbmVudHM6IHRoaXMuZW50cnlDb21wb25lbnRzLFxuICAgICAgY2hhbmdlRGV0ZWN0aW9uOiB0aGlzLmNoYW5nZURldGVjdGlvbixcbiAgICAgIHRlbXBsYXRlOiB0aGlzLnRlbXBsYXRlICYmIHRoaXMudGVtcGxhdGUudG9TdW1tYXJ5KCksXG4gICAgICBjb21wb25lbnRWaWV3VHlwZTogdGhpcy5jb21wb25lbnRWaWV3VHlwZSxcbiAgICAgIHJlbmRlcmVyVHlwZTogdGhpcy5yZW5kZXJlclR5cGUsXG4gICAgICBjb21wb25lbnRGYWN0b3J5OiB0aGlzLmNvbXBvbmVudEZhY3RvcnlcbiAgICB9O1xuICB9XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgQ29tcGlsZVBpcGVTdW1tYXJ5IGV4dGVuZHMgQ29tcGlsZVR5cGVTdW1tYXJ5IHtcbiAgdHlwZTogQ29tcGlsZVR5cGVNZXRhZGF0YTtcbiAgbmFtZTogc3RyaW5nO1xuICBwdXJlOiBib29sZWFuO1xufVxuXG5leHBvcnQgY2xhc3MgQ29tcGlsZVBpcGVNZXRhZGF0YSB7XG4gIHR5cGU6IENvbXBpbGVUeXBlTWV0YWRhdGE7XG4gIG5hbWU6IHN0cmluZztcbiAgcHVyZTogYm9vbGVhbjtcblxuICBjb25zdHJ1Y3Rvcih7dHlwZSwgbmFtZSwgcHVyZX06IHtcbiAgICB0eXBlOiBDb21waWxlVHlwZU1ldGFkYXRhLFxuICAgIG5hbWU6IHN0cmluZyxcbiAgICBwdXJlOiBib29sZWFuLFxuICB9KSB7XG4gICAgdGhpcy50eXBlID0gdHlwZTtcbiAgICB0aGlzLm5hbWUgPSBuYW1lO1xuICAgIHRoaXMucHVyZSA9ICEhcHVyZTtcbiAgfVxuXG4gIHRvU3VtbWFyeSgpOiBDb21waWxlUGlwZVN1bW1hcnkge1xuICAgIHJldHVybiB7XG4gICAgICBzdW1tYXJ5S2luZDogQ29tcGlsZVN1bW1hcnlLaW5kLlBpcGUsXG4gICAgICB0eXBlOiB0aGlzLnR5cGUsXG4gICAgICBuYW1lOiB0aGlzLm5hbWUsXG4gICAgICBwdXJlOiB0aGlzLnB1cmVcbiAgICB9O1xuICB9XG59XG5cbi8vIE5vdGU6IFRoaXMgc2hvdWxkIG9ubHkgdXNlIGludGVyZmFjZXMgYXMgbmVzdGVkIGRhdGEgdHlwZXNcbi8vIGFzIHdlIG5lZWQgdG8gYmUgYWJsZSB0byBzZXJpYWxpemUgdGhpcyBmcm9tL3RvIEpTT04hXG5leHBvcnQgaW50ZXJmYWNlIENvbXBpbGVOZ01vZHVsZVN1bW1hcnkgZXh0ZW5kcyBDb21waWxlVHlwZVN1bW1hcnkge1xuICB0eXBlOiBDb21waWxlVHlwZU1ldGFkYXRhO1xuXG4gIC8vIE5vdGU6IFRoaXMgaXMgdHJhbnNpdGl2ZSBvdmVyIHRoZSBleHBvcnRlZCBtb2R1bGVzLlxuICBleHBvcnRlZERpcmVjdGl2ZXM6IENvbXBpbGVJZGVudGlmaWVyTWV0YWRhdGFbXTtcbiAgLy8gTm90ZTogVGhpcyBpcyB0cmFuc2l0aXZlIG92ZXIgdGhlIGV4cG9ydGVkIG1vZHVsZXMuXG4gIGV4cG9ydGVkUGlwZXM6IENvbXBpbGVJZGVudGlmaWVyTWV0YWRhdGFbXTtcblxuICAvLyBOb3RlOiBUaGlzIGlzIHRyYW5zaXRpdmUuXG4gIGVudHJ5Q29tcG9uZW50czogQ29tcGlsZUVudHJ5Q29tcG9uZW50TWV0YWRhdGFbXTtcbiAgLy8gTm90ZTogVGhpcyBpcyB0cmFuc2l0aXZlLlxuICBwcm92aWRlcnM6IHtwcm92aWRlcjogQ29tcGlsZVByb3ZpZGVyTWV0YWRhdGEsIG1vZHVsZTogQ29tcGlsZUlkZW50aWZpZXJNZXRhZGF0YX1bXTtcbiAgLy8gTm90ZTogVGhpcyBpcyB0cmFuc2l0aXZlLlxuICBtb2R1bGVzOiBDb21waWxlVHlwZU1ldGFkYXRhW107XG59XG5cbmV4cG9ydCBjbGFzcyBDb21waWxlU2hhbGxvd01vZHVsZU1ldGFkYXRhIHtcbiAgLy8gVE9ETyhpc3N1ZS8yNDU3MSk6IHJlbW92ZSAnIScuXG4gIHR5cGUhOiBDb21waWxlVHlwZU1ldGFkYXRhO1xuXG4gIHJhd0V4cG9ydHM6IGFueTtcbiAgcmF3SW1wb3J0czogYW55O1xuICByYXdQcm92aWRlcnM6IGFueTtcbn1cblxuLyoqXG4gKiBNZXRhZGF0YSByZWdhcmRpbmcgY29tcGlsYXRpb24gb2YgYSBtb2R1bGUuXG4gKi9cbmV4cG9ydCBjbGFzcyBDb21waWxlTmdNb2R1bGVNZXRhZGF0YSB7XG4gIHR5cGU6IENvbXBpbGVUeXBlTWV0YWRhdGE7XG4gIGRlY2xhcmVkRGlyZWN0aXZlczogQ29tcGlsZUlkZW50aWZpZXJNZXRhZGF0YVtdO1xuICBleHBvcnRlZERpcmVjdGl2ZXM6IENvbXBpbGVJZGVudGlmaWVyTWV0YWRhdGFbXTtcbiAgZGVjbGFyZWRQaXBlczogQ29tcGlsZUlkZW50aWZpZXJNZXRhZGF0YVtdO1xuXG4gIGV4cG9ydGVkUGlwZXM6IENvbXBpbGVJZGVudGlmaWVyTWV0YWRhdGFbXTtcbiAgZW50cnlDb21wb25lbnRzOiBDb21waWxlRW50cnlDb21wb25lbnRNZXRhZGF0YVtdO1xuICBib290c3RyYXBDb21wb25lbnRzOiBDb21waWxlSWRlbnRpZmllck1ldGFkYXRhW107XG4gIHByb3ZpZGVyczogQ29tcGlsZVByb3ZpZGVyTWV0YWRhdGFbXTtcblxuICBpbXBvcnRlZE1vZHVsZXM6IENvbXBpbGVOZ01vZHVsZVN1bW1hcnlbXTtcbiAgZXhwb3J0ZWRNb2R1bGVzOiBDb21waWxlTmdNb2R1bGVTdW1tYXJ5W107XG4gIHNjaGVtYXM6IFNjaGVtYU1ldGFkYXRhW107XG4gIGlkOiBzdHJpbmd8bnVsbDtcblxuICB0cmFuc2l0aXZlTW9kdWxlOiBUcmFuc2l0aXZlQ29tcGlsZU5nTW9kdWxlTWV0YWRhdGE7XG5cbiAgY29uc3RydWN0b3Ioe1xuICAgIHR5cGUsXG4gICAgcHJvdmlkZXJzLFxuICAgIGRlY2xhcmVkRGlyZWN0aXZlcyxcbiAgICBleHBvcnRlZERpcmVjdGl2ZXMsXG4gICAgZGVjbGFyZWRQaXBlcyxcbiAgICBleHBvcnRlZFBpcGVzLFxuICAgIGVudHJ5Q29tcG9uZW50cyxcbiAgICBib290c3RyYXBDb21wb25lbnRzLFxuICAgIGltcG9ydGVkTW9kdWxlcyxcbiAgICBleHBvcnRlZE1vZHVsZXMsXG4gICAgc2NoZW1hcyxcbiAgICB0cmFuc2l0aXZlTW9kdWxlLFxuICAgIGlkXG4gIH06IHtcbiAgICB0eXBlOiBDb21waWxlVHlwZU1ldGFkYXRhLFxuICAgIHByb3ZpZGVyczogQ29tcGlsZVByb3ZpZGVyTWV0YWRhdGFbXSxcbiAgICBkZWNsYXJlZERpcmVjdGl2ZXM6IENvbXBpbGVJZGVudGlmaWVyTWV0YWRhdGFbXSxcbiAgICBleHBvcnRlZERpcmVjdGl2ZXM6IENvbXBpbGVJZGVudGlmaWVyTWV0YWRhdGFbXSxcbiAgICBkZWNsYXJlZFBpcGVzOiBDb21waWxlSWRlbnRpZmllck1ldGFkYXRhW10sXG4gICAgZXhwb3J0ZWRQaXBlczogQ29tcGlsZUlkZW50aWZpZXJNZXRhZGF0YVtdLFxuICAgIGVudHJ5Q29tcG9uZW50czogQ29tcGlsZUVudHJ5Q29tcG9uZW50TWV0YWRhdGFbXSxcbiAgICBib290c3RyYXBDb21wb25lbnRzOiBDb21waWxlSWRlbnRpZmllck1ldGFkYXRhW10sXG4gICAgaW1wb3J0ZWRNb2R1bGVzOiBDb21waWxlTmdNb2R1bGVTdW1tYXJ5W10sXG4gICAgZXhwb3J0ZWRNb2R1bGVzOiBDb21waWxlTmdNb2R1bGVTdW1tYXJ5W10sXG4gICAgdHJhbnNpdGl2ZU1vZHVsZTogVHJhbnNpdGl2ZUNvbXBpbGVOZ01vZHVsZU1ldGFkYXRhLFxuICAgIHNjaGVtYXM6IFNjaGVtYU1ldGFkYXRhW10sXG4gICAgaWQ6IHN0cmluZ3xudWxsXG4gIH0pIHtcbiAgICB0aGlzLnR5cGUgPSB0eXBlIHx8IG51bGw7XG4gICAgdGhpcy5kZWNsYXJlZERpcmVjdGl2ZXMgPSBfbm9ybWFsaXplQXJyYXkoZGVjbGFyZWREaXJlY3RpdmVzKTtcbiAgICB0aGlzLmV4cG9ydGVkRGlyZWN0aXZlcyA9IF9ub3JtYWxpemVBcnJheShleHBvcnRlZERpcmVjdGl2ZXMpO1xuICAgIHRoaXMuZGVjbGFyZWRQaXBlcyA9IF9ub3JtYWxpemVBcnJheShkZWNsYXJlZFBpcGVzKTtcbiAgICB0aGlzLmV4cG9ydGVkUGlwZXMgPSBfbm9ybWFsaXplQXJyYXkoZXhwb3J0ZWRQaXBlcyk7XG4gICAgdGhpcy5wcm92aWRlcnMgPSBfbm9ybWFsaXplQXJyYXkocHJvdmlkZXJzKTtcbiAgICB0aGlzLmVudHJ5Q29tcG9uZW50cyA9IF9ub3JtYWxpemVBcnJheShlbnRyeUNvbXBvbmVudHMpO1xuICAgIHRoaXMuYm9vdHN0cmFwQ29tcG9uZW50cyA9IF9ub3JtYWxpemVBcnJheShib290c3RyYXBDb21wb25lbnRzKTtcbiAgICB0aGlzLmltcG9ydGVkTW9kdWxlcyA9IF9ub3JtYWxpemVBcnJheShpbXBvcnRlZE1vZHVsZXMpO1xuICAgIHRoaXMuZXhwb3J0ZWRNb2R1bGVzID0gX25vcm1hbGl6ZUFycmF5KGV4cG9ydGVkTW9kdWxlcyk7XG4gICAgdGhpcy5zY2hlbWFzID0gX25vcm1hbGl6ZUFycmF5KHNjaGVtYXMpO1xuICAgIHRoaXMuaWQgPSBpZCB8fCBudWxsO1xuICAgIHRoaXMudHJhbnNpdGl2ZU1vZHVsZSA9IHRyYW5zaXRpdmVNb2R1bGUgfHwgbnVsbDtcbiAgfVxuXG4gIHRvU3VtbWFyeSgpOiBDb21waWxlTmdNb2R1bGVTdW1tYXJ5IHtcbiAgICBjb25zdCBtb2R1bGUgPSB0aGlzLnRyYW5zaXRpdmVNb2R1bGUhO1xuICAgIHJldHVybiB7XG4gICAgICBzdW1tYXJ5S2luZDogQ29tcGlsZVN1bW1hcnlLaW5kLk5nTW9kdWxlLFxuICAgICAgdHlwZTogdGhpcy50eXBlLFxuICAgICAgZW50cnlDb21wb25lbnRzOiBtb2R1bGUuZW50cnlDb21wb25lbnRzLFxuICAgICAgcHJvdmlkZXJzOiBtb2R1bGUucHJvdmlkZXJzLFxuICAgICAgbW9kdWxlczogbW9kdWxlLm1vZHVsZXMsXG4gICAgICBleHBvcnRlZERpcmVjdGl2ZXM6IG1vZHVsZS5leHBvcnRlZERpcmVjdGl2ZXMsXG4gICAgICBleHBvcnRlZFBpcGVzOiBtb2R1bGUuZXhwb3J0ZWRQaXBlc1xuICAgIH07XG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIFRyYW5zaXRpdmVDb21waWxlTmdNb2R1bGVNZXRhZGF0YSB7XG4gIGRpcmVjdGl2ZXNTZXQgPSBuZXcgU2V0PGFueT4oKTtcbiAgZGlyZWN0aXZlczogQ29tcGlsZUlkZW50aWZpZXJNZXRhZGF0YVtdID0gW107XG4gIGV4cG9ydGVkRGlyZWN0aXZlc1NldCA9IG5ldyBTZXQ8YW55PigpO1xuICBleHBvcnRlZERpcmVjdGl2ZXM6IENvbXBpbGVJZGVudGlmaWVyTWV0YWRhdGFbXSA9IFtdO1xuICBwaXBlc1NldCA9IG5ldyBTZXQ8YW55PigpO1xuICBwaXBlczogQ29tcGlsZUlkZW50aWZpZXJNZXRhZGF0YVtdID0gW107XG4gIGV4cG9ydGVkUGlwZXNTZXQgPSBuZXcgU2V0PGFueT4oKTtcbiAgZXhwb3J0ZWRQaXBlczogQ29tcGlsZUlkZW50aWZpZXJNZXRhZGF0YVtdID0gW107XG4gIG1vZHVsZXNTZXQgPSBuZXcgU2V0PGFueT4oKTtcbiAgbW9kdWxlczogQ29tcGlsZVR5cGVNZXRhZGF0YVtdID0gW107XG4gIGVudHJ5Q29tcG9uZW50c1NldCA9IG5ldyBTZXQ8YW55PigpO1xuICBlbnRyeUNvbXBvbmVudHM6IENvbXBpbGVFbnRyeUNvbXBvbmVudE1ldGFkYXRhW10gPSBbXTtcblxuICBwcm92aWRlcnM6IHtwcm92aWRlcjogQ29tcGlsZVByb3ZpZGVyTWV0YWRhdGEsIG1vZHVsZTogQ29tcGlsZUlkZW50aWZpZXJNZXRhZGF0YX1bXSA9IFtdO1xuXG4gIGFkZFByb3ZpZGVyKHByb3ZpZGVyOiBDb21waWxlUHJvdmlkZXJNZXRhZGF0YSwgbW9kdWxlOiBDb21waWxlSWRlbnRpZmllck1ldGFkYXRhKSB7XG4gICAgdGhpcy5wcm92aWRlcnMucHVzaCh7cHJvdmlkZXI6IHByb3ZpZGVyLCBtb2R1bGU6IG1vZHVsZX0pO1xuICB9XG5cbiAgYWRkRGlyZWN0aXZlKGlkOiBDb21waWxlSWRlbnRpZmllck1ldGFkYXRhKSB7XG4gICAgaWYgKCF0aGlzLmRpcmVjdGl2ZXNTZXQuaGFzKGlkLnJlZmVyZW5jZSkpIHtcbiAgICAgIHRoaXMuZGlyZWN0aXZlc1NldC5hZGQoaWQucmVmZXJlbmNlKTtcbiAgICAgIHRoaXMuZGlyZWN0aXZlcy5wdXNoKGlkKTtcbiAgICB9XG4gIH1cbiAgYWRkRXhwb3J0ZWREaXJlY3RpdmUoaWQ6IENvbXBpbGVJZGVudGlmaWVyTWV0YWRhdGEpIHtcbiAgICBpZiAoIXRoaXMuZXhwb3J0ZWREaXJlY3RpdmVzU2V0LmhhcyhpZC5yZWZlcmVuY2UpKSB7XG4gICAgICB0aGlzLmV4cG9ydGVkRGlyZWN0aXZlc1NldC5hZGQoaWQucmVmZXJlbmNlKTtcbiAgICAgIHRoaXMuZXhwb3J0ZWREaXJlY3RpdmVzLnB1c2goaWQpO1xuICAgIH1cbiAgfVxuICBhZGRQaXBlKGlkOiBDb21waWxlSWRlbnRpZmllck1ldGFkYXRhKSB7XG4gICAgaWYgKCF0aGlzLnBpcGVzU2V0LmhhcyhpZC5yZWZlcmVuY2UpKSB7XG4gICAgICB0aGlzLnBpcGVzU2V0LmFkZChpZC5yZWZlcmVuY2UpO1xuICAgICAgdGhpcy5waXBlcy5wdXNoKGlkKTtcbiAgICB9XG4gIH1cbiAgYWRkRXhwb3J0ZWRQaXBlKGlkOiBDb21waWxlSWRlbnRpZmllck1ldGFkYXRhKSB7XG4gICAgaWYgKCF0aGlzLmV4cG9ydGVkUGlwZXNTZXQuaGFzKGlkLnJlZmVyZW5jZSkpIHtcbiAgICAgIHRoaXMuZXhwb3J0ZWRQaXBlc1NldC5hZGQoaWQucmVmZXJlbmNlKTtcbiAgICAgIHRoaXMuZXhwb3J0ZWRQaXBlcy5wdXNoKGlkKTtcbiAgICB9XG4gIH1cbiAgYWRkTW9kdWxlKGlkOiBDb21waWxlVHlwZU1ldGFkYXRhKSB7XG4gICAgaWYgKCF0aGlzLm1vZHVsZXNTZXQuaGFzKGlkLnJlZmVyZW5jZSkpIHtcbiAgICAgIHRoaXMubW9kdWxlc1NldC5hZGQoaWQucmVmZXJlbmNlKTtcbiAgICAgIHRoaXMubW9kdWxlcy5wdXNoKGlkKTtcbiAgICB9XG4gIH1cbiAgYWRkRW50cnlDb21wb25lbnQoZWM6IENvbXBpbGVFbnRyeUNvbXBvbmVudE1ldGFkYXRhKSB7XG4gICAgaWYgKCF0aGlzLmVudHJ5Q29tcG9uZW50c1NldC5oYXMoZWMuY29tcG9uZW50VHlwZSkpIHtcbiAgICAgIHRoaXMuZW50cnlDb21wb25lbnRzU2V0LmFkZChlYy5jb21wb25lbnRUeXBlKTtcbiAgICAgIHRoaXMuZW50cnlDb21wb25lbnRzLnB1c2goZWMpO1xuICAgIH1cbiAgfVxufVxuXG5mdW5jdGlvbiBfbm9ybWFsaXplQXJyYXkob2JqOiBhbnlbXXx1bmRlZmluZWR8bnVsbCk6IGFueVtdIHtcbiAgcmV0dXJuIG9iaiB8fCBbXTtcbn1cblxuZXhwb3J0IGNsYXNzIFByb3ZpZGVyTWV0YSB7XG4gIHRva2VuOiBhbnk7XG4gIHVzZUNsYXNzOiBUeXBlfG51bGw7XG4gIHVzZVZhbHVlOiBhbnk7XG4gIHVzZUV4aXN0aW5nOiBhbnk7XG4gIHVzZUZhY3Rvcnk6IEZ1bmN0aW9ufG51bGw7XG4gIGRlcGVuZGVuY2llczogT2JqZWN0W118bnVsbDtcbiAgbXVsdGk6IGJvb2xlYW47XG5cbiAgY29uc3RydWN0b3IodG9rZW46IGFueSwge3VzZUNsYXNzLCB1c2VWYWx1ZSwgdXNlRXhpc3RpbmcsIHVzZUZhY3RvcnksIGRlcHMsIG11bHRpfToge1xuICAgIHVzZUNsYXNzPzogVHlwZSxcbiAgICB1c2VWYWx1ZT86IGFueSxcbiAgICB1c2VFeGlzdGluZz86IGFueSxcbiAgICB1c2VGYWN0b3J5PzogRnVuY3Rpb258bnVsbCxcbiAgICBkZXBzPzogT2JqZWN0W118bnVsbCxcbiAgICBtdWx0aT86IGJvb2xlYW5cbiAgfSkge1xuICAgIHRoaXMudG9rZW4gPSB0b2tlbjtcbiAgICB0aGlzLnVzZUNsYXNzID0gdXNlQ2xhc3MgfHwgbnVsbDtcbiAgICB0aGlzLnVzZVZhbHVlID0gdXNlVmFsdWU7XG4gICAgdGhpcy51c2VFeGlzdGluZyA9IHVzZUV4aXN0aW5nO1xuICAgIHRoaXMudXNlRmFjdG9yeSA9IHVzZUZhY3RvcnkgfHwgbnVsbDtcbiAgICB0aGlzLmRlcGVuZGVuY2llcyA9IGRlcHMgfHwgbnVsbDtcbiAgICB0aGlzLm11bHRpID0gISFtdWx0aTtcbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gZmxhdHRlbjxUPihsaXN0OiBBcnJheTxUfFRbXT4pOiBUW10ge1xuICByZXR1cm4gbGlzdC5yZWR1Y2UoKGZsYXQ6IGFueVtdLCBpdGVtOiBUfFRbXSk6IFRbXSA9PiB7XG4gICAgY29uc3QgZmxhdEl0ZW0gPSBBcnJheS5pc0FycmF5KGl0ZW0pID8gZmxhdHRlbihpdGVtKSA6IGl0ZW07XG4gICAgcmV0dXJuICg8VFtdPmZsYXQpLmNvbmNhdChmbGF0SXRlbSk7XG4gIH0sIFtdKTtcbn1cblxuZnVuY3Rpb24gaml0U291cmNlVXJsKHVybDogc3RyaW5nKSB7XG4gIC8vIE5vdGU6IFdlIG5lZWQgMyBcIi9cIiBzbyB0aGF0IG5nIHNob3dzIHVwIGFzIGEgc2VwYXJhdGUgZG9tYWluXG4gIC8vIGluIHRoZSBjaHJvbWUgZGV2IHRvb2xzLlxuICByZXR1cm4gdXJsLnJlcGxhY2UoLyhcXHcrOlxcL1xcL1tcXHc6LV0rKT8oXFwvKyk/LywgJ25nOi8vLycpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gdGVtcGxhdGVTb3VyY2VVcmwoXG4gICAgbmdNb2R1bGVUeXBlOiBDb21waWxlSWRlbnRpZmllck1ldGFkYXRhLCBjb21wTWV0YToge3R5cGU6IENvbXBpbGVJZGVudGlmaWVyTWV0YWRhdGF9LFxuICAgIHRlbXBsYXRlTWV0YToge2lzSW5saW5lOiBib29sZWFuLCB0ZW1wbGF0ZVVybDogc3RyaW5nfG51bGx9KSB7XG4gIGxldCB1cmw6IHN0cmluZztcbiAgaWYgKHRlbXBsYXRlTWV0YS5pc0lubGluZSkge1xuICAgIGlmIChjb21wTWV0YS50eXBlLnJlZmVyZW5jZSBpbnN0YW5jZW9mIFN0YXRpY1N5bWJvbCkge1xuICAgICAgLy8gTm90ZTogYSAudHMgZmlsZSBtaWdodCBjb250YWluIG11bHRpcGxlIGNvbXBvbmVudHMgd2l0aCBpbmxpbmUgdGVtcGxhdGVzLFxuICAgICAgLy8gc28gd2UgbmVlZCB0byBnaXZlIHRoZW0gdW5pcXVlIHVybHMsIGFzIHRoZXNlIHdpbGwgYmUgdXNlZCBmb3Igc291cmNlbWFwcy5cbiAgICAgIHVybCA9IGAke2NvbXBNZXRhLnR5cGUucmVmZXJlbmNlLmZpbGVQYXRofS4ke2NvbXBNZXRhLnR5cGUucmVmZXJlbmNlLm5hbWV9Lmh0bWxgO1xuICAgIH0gZWxzZSB7XG4gICAgICB1cmwgPSBgJHtpZGVudGlmaWVyTmFtZShuZ01vZHVsZVR5cGUpfS8ke2lkZW50aWZpZXJOYW1lKGNvbXBNZXRhLnR5cGUpfS5odG1sYDtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgdXJsID0gdGVtcGxhdGVNZXRhLnRlbXBsYXRlVXJsITtcbiAgfVxuICByZXR1cm4gY29tcE1ldGEudHlwZS5yZWZlcmVuY2UgaW5zdGFuY2VvZiBTdGF0aWNTeW1ib2wgPyB1cmwgOiBqaXRTb3VyY2VVcmwodXJsKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHNoYXJlZFN0eWxlc2hlZXRKaXRVcmwobWV0YTogQ29tcGlsZVN0eWxlc2hlZXRNZXRhZGF0YSwgaWQ6IG51bWJlcikge1xuICBjb25zdCBwYXRoUGFydHMgPSBtZXRhLm1vZHVsZVVybCEuc3BsaXQoL1xcL1xcXFwvZyk7XG4gIGNvbnN0IGJhc2VOYW1lID0gcGF0aFBhcnRzW3BhdGhQYXJ0cy5sZW5ndGggLSAxXTtcbiAgcmV0dXJuIGppdFNvdXJjZVVybChgY3NzLyR7aWR9JHtiYXNlTmFtZX0ubmdzdHlsZS5qc2ApO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gbmdNb2R1bGVKaXRVcmwobW9kdWxlTWV0YTogQ29tcGlsZU5nTW9kdWxlTWV0YWRhdGEpOiBzdHJpbmcge1xuICByZXR1cm4gaml0U291cmNlVXJsKGAke2lkZW50aWZpZXJOYW1lKG1vZHVsZU1ldGEudHlwZSl9L21vZHVsZS5uZ2ZhY3RvcnkuanNgKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHRlbXBsYXRlSml0VXJsKFxuICAgIG5nTW9kdWxlVHlwZTogQ29tcGlsZUlkZW50aWZpZXJNZXRhZGF0YSwgY29tcE1ldGE6IENvbXBpbGVEaXJlY3RpdmVNZXRhZGF0YSk6IHN0cmluZyB7XG4gIHJldHVybiBqaXRTb3VyY2VVcmwoXG4gICAgICBgJHtpZGVudGlmaWVyTmFtZShuZ01vZHVsZVR5cGUpfS8ke2lkZW50aWZpZXJOYW1lKGNvbXBNZXRhLnR5cGUpfS5uZ2ZhY3RvcnkuanNgKTtcbn1cbiJdfQ==