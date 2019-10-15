import { isEmpty, every, partial, has } from "lodash";
import { IResponse } from "@/http/http.interface";
import dayjs from "dayjs";
type IDefaultValue = [] | {} | 0 | "";
/**
 * 将response.data不符合预期的类型转成默认值
 * @param param0 api返回response
 * @param defaultValue 默认值
 */
function responseTransforamtor<T>(
    { data, ...res }: IResponse<T>,
    defaultValue: IDefaultValue
) {
    if (typeof data === "number" && data > 0) {
        return { data, ...res };
    } else if (isEmpty(data)) {
        return { data: defaultValue, ...res };
    } else {
        return { data, ...res };
    }
}
interface IBaseToken {
    authorities: string[];
    sub: number;
    jti: number;
    exp: number;
}

/**
 * 将token转换成对象
 *
 * @param {string} token
 * @returns
 */
function parseToken(token: string): IBaseToken {
    const parsedToken = token.split(".");
    try {
        const base64Url = parsedToken[1];
        const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
        return JSON.parse(window.atob(base64));
    } catch (error) {
        throw error;
    }
}
/**
 * 判断传入时间是否晚于当前时间
 *
 * @param {number} 传入时间
 * @returns
 */
function isLaterThanNow(time: number) {
    // tslint:disable-next-line: variable-name
    let _time = time;
    // timestamp 最大值
    if (time < 2147483647) {
        _time = time * 1000;
    }
    const currentTime = dayjs();
    // TODO: 如果服务器返回时间戳是秒数 则需要转成毫秒
    const testTime = dayjs(_time);
    return dayjs(testTime).isAfter(currentTime);
}

interface IParams {
    [key: string]: string | number | any;
}
/**
 *  判断对象是否包含目标对象的所有键值
 *
 * @param {string[]} requiredKeys 包含的Keys
 * @param {IParams} params 目标对象
 * @returns {boolean}
 */
function hasKeys(requiredKeys: string[], params: IParams): boolean {
    return every(requiredKeys, partial(has, params));
}
export { responseTransforamtor, parseToken, isLaterThanNow, hasKeys };
