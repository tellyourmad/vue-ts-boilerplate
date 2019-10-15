import Http from "@/http/http";
import { AxiosPromise } from "axios";
import { IOrderAPI, IOrderParams } from "./order.interface";

class OrderApi {
    get<URL extends keyof IOrderAPI, BODY extends keyof IOrderParams>(
        url: URL,
        config: IOrderParams[BODY]
    ): AxiosPromise<any> {
        return Http({
            url,
            ...config
        });
    }
    post<URL extends keyof IOrderAPI, BODY extends keyof IOrderParams>(
        url: URL,
        config: IOrderParams[BODY]
    ): AxiosPromise<any> {
        return Http({
            url,
            method: "post",
            ...config
        });
    }
}
export default new OrderApi();
