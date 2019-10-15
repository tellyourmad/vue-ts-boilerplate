import Http from "@/http/http";
import { AxiosPromise } from "axios";
import { ISearchAPI, ISearchAPIParams } from "./search.interface";

class SearchApi {
  get<URL extends keyof ISearchAPI, PARAMS extends keyof ISearchAPIParams>(
    url: URL,
    config: ISearchAPIParams[PARAMS],
  ): AxiosPromise<ISearchAPI[URL]> {
    return Http({
      url,
      ...config,
    });
  }
}
export default new SearchApi();
