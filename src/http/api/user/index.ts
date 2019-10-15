import Http from "@/http/http";
import { AxiosPromise } from "axios";
import { IUserAPI, IUserAPIParams } from "./user.interface";
class UserApi {
  get<URL extends keyof IUserAPI, PARAMS extends keyof IUserAPIParams>(
    url: URL,
    config: IUserAPIParams[PARAMS],
  ): AxiosPromise<IUserAPI[URL]> {
    return Http({
      url,
      ...config,
    });
  }
  post<URL extends keyof IUserAPI, BODY extends keyof IUserAPIParams>(
    url: URL,
    config: IUserAPIParams[BODY],
  ): AxiosPromise<IUserAPI[URL]> {
    return Http({
      url,
      method: "post",
      ...config,
    });
  }
}
export default new UserApi();
