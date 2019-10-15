// Type definitions for store 2.0
// Project: https://github.com/marcuswestin/store.js#readme
// Definitions by: Vincent Bortone <https://github.com/vbortone>
//                 harry0000 <https://github.com/harry0000>
//                 Roman Nuritdinov (Ky6uk) <https://github.com/Ky6uk>
//                 Johnny Edwards (igl00) <https://github.com/igl00>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped

// Cross-browser storage for all use cases, used across the web.

interface StoreJsAPI {
    readonly version: string;
    readonly enabled: boolean;
    get(key: string, optionalDefaultValue?: any): any;
    set(key: string, value: any, expire?: any): any;
    remove(key: string): void;
    each(callback: (val: any, namespacedKey: string) => void): void;
    clearAll(): void;
    hasNamespace(namespace: string): boolean;
    createStore(plugins?: Function[], namespace?: string): StoreJsAPI;
    addPlugin(plugin: Function): void;
    namespace(namespace: string): StoreJsAPI;
}
