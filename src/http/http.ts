import axios, {
    AxiosInstance,
    AxiosInterceptorManager,
    AxiosRequestConfig,
    AxiosResponse
} from "axios";
import {
    IHttpConfig,
    IAxiosRequestConfig,
    ApiUidPromise
} from "./http.interface";
import TokenGuard from "@/guard/token-guard";
import {
    addUnhandleAPI,
    removeUnhandleAPI,
    handleAPIStatusError
} from "./http-lib/unhandle-request";
import { judgeNormalResponseStatusCode } from "./http-lib/status-code";
const tokenGuard = new TokenGuard();
// 环境的切换
// if (process.env.NODE_ENV === "development") {
//   axios.defaults.baseURL = process.env.VUE_APP_DATA_URL + "/api/v1/client/";
// } else if (process.env.NODE_ENV === "debug") {
//   axios.defaults.baseURL = "";
// } else if (process.env.NODE_ENV === "production") {
//   axios.defaults.baseURL = "http://api2.9daye.com.cn" + "/api/v1/client/";
// }
axios.defaults.baseURL = process.env.VUE_APP_DATA_URL + "/api/v1/client/";
let uid = 0;
const axiosRequest = axios.Axios.prototype.request;
axios.Axios.prototype.request = function(config: IAxiosRequestConfig) {
    uid += 1;
    const apiUid = `${config.url}?uid=${uid}`; // 接口调用的唯一标识
    config.apiUid = apiUid; // 响应拦截器内需要使用到 apiUid，所以添加为 config 属性
    addUnhandleAPI(apiUid); // 添加到接口异常处理状态存储的数组对象
    const p = axiosRequest.call(this, config); // 触发 axios 接口调用
    p.apiUid = apiUid; // 在当前接口调用所返回的 Promise 实例中添加唯一标识属性
    return p;
};
class Http {
    /**
     *
     * @param request axios request对象
     * @param whiteList 请求白名单 白名单里的Url不会添加Authorization
     */
    static manageRequestInterceptor(
        request: AxiosInterceptorManager<AxiosRequestConfig>,
        whiteList: string[]
    ) {
        request.use(
            config => {
                // 应对动态URL无法添加白名单的问题
                const { withToken } = config;
                // TODO 这里为了测试 要修改成 ===
                if (
                    whiteList.indexOf(config.url as string) !== -1 ||
                    withToken
                ) {
                    config.headers = {
                        Authorization: `Bearer ${tokenGuard.getToken()}`
                    };
                }
                return config;
            },
            error => {
                return Promise.reject(error);
            }
        );
    }
    static manageResponseInterceptor(
        response: AxiosInterceptorManager<AxiosResponse>
    ) {
        response.use(
            (value: AxiosResponse<any>) => {
                // tslint:disable
                let { config } = value;
                return judgeNormalResponseStatusCode(value, config);
            },
            error => {
                if (axios.isCancel(error)) {
                    return;
                }
                const { response, config } = error;
                if (response) {
                    // return judgeNormalResponseStatusCode(response, config)
                    const pr = Promise.reject("异常错误") as ApiUidPromise<any>;
                    pr.apiUid = config.apiUid; // Promise 实例中添加当前接口的唯一标识属性
                    setTimeout(handleAPIStatusError, 0, pr, response.data.msg); // 异常先交由业务端处理，延迟执行统一处理函数
                    return pr;
                }
                return Promise.reject(error);
            }
        );
    }
    public axiosInstance: AxiosInstance;
    private whiteList: string[];
    constructor(config?: IHttpConfig) {
        const { whiteList = [] } = config;
        this.axiosInstance = axios.create(config);
        this.whiteList = whiteList;
        this.init();
    }
    init(): void {
        Http.manageRequestInterceptor(
            this.axiosInstance.interceptors.request,
            this.whiteList
        );
        Http.manageResponseInterceptor(
            this.axiosInstance.interceptors.response
        );
    }
}
// const request = axios.create();
// request.interceptors.request.use((config: AxiosRequestConfig) => {
//   return config;
// });
// TODO: 这里以后要加参数
export default new Http({
    validateStatus: status => {
        return status === 200;
    },
    whiteList: [
        "/base",
        "/promotion-pages/home",
        "/products",
        "/customer",
        "/customer/shopping-cart",
        "/customer/shopping-cart/products/Invalid",
        "/customer/shopping-cart/total-price",
        "/customer/shopping-cart/shoppingcartids",
        "/customer/shopping-cart/invaildproduct/productIds",
        "/customer/shopping-cart/productcount/shoppingcartid",
        "/customer/pay-produt/payOrder",
        "/customer/addresses",
        "/customer/addresses/edit",
        "/customer/coupons",
        "/customer/fix-status",
        "/order/order-count",
        "/product-search-words",
        "/keyword-products",
        "/product-details/$productId", // dynamic
        "/sales-promotion" // dynamic
    ]
}).axiosInstance;
