/**
 * @license Angular v13.0.2
 * (c) 2010-2021 Google LLC. https://angular.io/
 * License: MIT
 */

import { CompileMetadataResolver } from '@angular/compiler';
import { Compiler } from '@angular/core';
import { CompilerConfig } from '@angular/compiler';
import { CompileReflector } from '@angular/compiler';
import { CompilerFactory } from '@angular/core';
import { CompilerOptions } from '@angular/core';
import { ComponentFactory } from '@angular/core';
import * as i0 from '@angular/core';
import { Injector } from '@angular/core';
import { JitEvaluator } from '@angular/compiler';
import { ModuleWithComponentFactories } from '@angular/core';
import { NgModuleCompiler } from '@angular/compiler';
import { NgModuleFactory } from '@angular/core';
import { PlatformRef } from '@angular/core';
import { Provider } from '@angular/core';
import { ResourceLoader } from '@angular/compiler';
import { StaticProvider } from '@angular/core';
import { StyleCompiler } from '@angular/compiler';
import { SummaryResolver } from '@angular/compiler';
import { TemplateParser } from '@angular/compiler';
import { Type } from '@angular/core';
import { Version } from '@angular/core';
import { ViewCompiler } from '@angular/compiler';
import { ╔ÁConsole } from '@angular/core';

/**
 * @publicApi
 *
 * @deprecated
 * Ivy JIT mode doesn't require accessing this symbol.
 * See [JIT API changes due to ViewEngine deprecation](guide/deprecations#jit-api-changes) for
 * additional context.
 */
export declare class JitCompilerFactory implements CompilerFactory {
    private _defaultOptions;
    createCompiler(options?: CompilerOptions[]): Compiler;
}

/**
 * @publicApi
 */
export declare const platformBrowserDynamic: (extraProviders?: StaticProvider[] | undefined) => PlatformRef;

/**
 * @publicApi
 */
export declare const RESOURCE_CACHE_PROVIDER: Provider[];

/**
 * @publicApi
 */
export declare const VERSION: Version;

export declare const ╔ÁCOMPILER_PROVIDERS__POST_R3__: StaticProvider[];

export declare class ╔ÁCompilerImpl implements Compiler {
    private _metadataResolver;
    private _delegate;
    readonly injector: Injector;
    constructor(injector: Injector, _metadataResolver: CompileMetadataResolver, templateParser: TemplateParser, styleCompiler: StyleCompiler, viewCompiler: ViewCompiler, ngModuleCompiler: NgModuleCompiler, summaryResolver: SummaryResolver<Type<any>>, compileReflector: CompileReflector, jitEvaluator: JitEvaluator, compilerConfig: CompilerConfig, console: ╔ÁConsole);
    private getExtraNgModuleProviders;
    compileModuleSync<T>(moduleType: Type<T>): NgModuleFactory<T>;
    compileModuleAsync<T>(moduleType: Type<T>): Promise<NgModuleFactory<T>>;
    compileModuleAndAllComponentsSync<T>(moduleType: Type<T>): ModuleWithComponentFactories<T>;
    compileModuleAndAllComponentsAsync<T>(moduleType: Type<T>): Promise<ModuleWithComponentFactories<T>>;
    loadAotSummaries(summaries: () => any[]): void;
    hasAotSummary(ref: Type<any>): boolean;
    getComponentFactory<T>(component: Type<T>): ComponentFactory<T>;
    clearCache(): void;
    clearCacheFor(type: Type<any>): void;
    getModuleId(moduleType: Type<any>): string | undefined;
}

/**
 * @publicApi
 */
export declare const ╔ÁINTERNAL_BROWSER_DYNAMIC_PLATFORM_PROVIDERS: StaticProvider[];

/**
 * A platform that included corePlatform and the compiler.
 *
 * @publicApi
 */
export declare const ╔ÁplatformCoreDynamic: (extraProviders?: StaticProvider[] | undefined) => PlatformRef;

export declare class ╔ÁResourceLoaderImpl extends ResourceLoader {
    get(url: string): Promise<string>;
    static ╔Áfac: i0.╔Á╔ÁFactoryDeclaration<╔ÁResourceLoaderImpl, never>;
    static ╔Áprov: i0.╔Á╔ÁInjectableDeclaration<╔ÁResourceLoaderImpl>;
}

export { }
