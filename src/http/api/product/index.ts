import Http from "@/http/http";
import { AxiosPromise } from "axios";
import { IProductParams } from "./product.interface";

class ProductApi {
  get<URL, PARAMS extends keyof IProductParams>(
    url: URL,
    config: IProductParams[PARAMS],
  ): AxiosPromise<any> {
    return Http({
      url,
      withToken: true,
      ...config,
    });
  }
  post<URL, PARAMS extends keyof IProductParams>(
    url: URL,
    config: IProductParams[PARAMS],
  ): AxiosPromise<any> {
    return Http({
      url,
      ...config,
    });
  }
}
export default new ProductApi();
