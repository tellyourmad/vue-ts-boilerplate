import { AxiosResponse, AxiosRequestConfig } from "axios";
import { IResponse, ApiUidPromise } from "../http.interface";
import { handleAPIStatusError, removeUnhandleAPI } from "./unhandle-request";

/**
 * 判断正常请求情况下 status的值
 * @param response 返回值
 */
export function judgeNormalResponseStatusCode(
    response: AxiosResponse<IResponse<any>>,
    config: AxiosRequestConfig
) {
    // 判断是否是axios response类型
    if ("status" in response) {
        const {
            status,
            data: { success, msg }
        } = response;
        if (status === 200 && success) {
            removeUnhandleAPI(config.apiUid);
            return response;
        } else {
            const pr = Promise.reject(response.data.msg) as ApiUidPromise<any>;
            pr.apiUid = config.apiUid;
            setTimeout(handleAPIStatusError, 0, pr, msg); // 异常放入macro-task 先交由业务端处理，延迟执行统一处理函数
            return pr;
        }
    } else {
        const pr = Promise.reject("异常错误") as ApiUidPromise<any>;
        pr.apiUid = config.apiUid;
        setTimeout(handleAPIStatusError, 0, pr, "异常错误"); // 异常放入macro-task 先交由业务端处理，延迟执行统一处理函数
        return pr;
    }
}
