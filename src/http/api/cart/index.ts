import Http from "@/http/http";
import { AxiosPromise } from "axios";
import { ICartAPI, ICartAPIParams } from "./cart.interface";
class CartApi {
  get<URL extends keyof ICartAPI, PARAMS extends keyof ICartAPIParams>(
    url: URL,
    config: ICartAPIParams[PARAMS],
  ): AxiosPromise<ICartAPI[URL]> {
    return Http({
      url,
      ...config,
    });
  }
  post<URL extends keyof ICartAPI, BODY extends keyof ICartAPIParams>(
    url: URL,
    config: ICartAPIParams[BODY],
  ): AxiosPromise<ICartAPI[URL]> {
    return Http({
      url,
      method: "post",
      ...config,
    });
  }
}
export default new CartApi();

