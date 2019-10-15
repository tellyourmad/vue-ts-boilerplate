import m, { Options } from "mem";
const DEFAULT_TIMEOUT = 300;
type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };
type XOR<T, U> = (T | U) extends object
    ? (Without<T, U> & U) | (Without<U, T> & T)
    : T | U;

/**
 * @param {MemOption} - mem 配置项
 * @return {Function} - 装饰器
 */
// tslint:disable-next-line:ban-types
export const mem = (options?: any): Function => {
    return (target: object, name: string, descriptor: PropertyDescriptor) => {
        const oldValue = descriptor.value;
        descriptor.value = m(oldValue, options);
        return descriptor;
    };
};
