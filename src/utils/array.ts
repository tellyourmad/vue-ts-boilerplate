
/**
 * 数组是否相等
 * @param a
 * @param b
 */
export const equals = (a: [], b: []) => a.sort().join() === b.sort().join();

/**
 * 深度铺平数组
 * @param arr
 */
export const deepFlatten = (arr: any) =>
    [].concat(...arr.map((v: any) => (Array.isArray(v) ? deepFlatten(v) : v)));

/**
 * 转换搜索数组
 * @param arr
 * @param str
 */
export const convert = (arr: any[], str: string) => {
  arr.unshift(str);
  const distinct = [...new Set(arr)];
  return distinct.length > 5 ? distinct.slice(0, -1) : distinct;
};
