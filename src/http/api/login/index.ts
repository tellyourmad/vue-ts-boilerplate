import Http from "@/http/http";
import { IResponse } from "@/http/http.interface";

import { AxiosPromise } from "axios";
import { ILoginAPI, ILoginAPIBody } from "./login.interface";
class LoginApi {
  request<URL extends keyof ILoginAPI, BODY extends keyof ILoginAPIBody>(
    url: URL,
    config: ILoginAPIBody[BODY]
  ): AxiosPromise<ILoginAPI[URL]> {
    return Http({
      url,
      ...config
    });
  }
  get(url: string): AxiosPromise<IResponse<null>> {
    return Http({
      url
    });
  }
}
export default new LoginApi();
