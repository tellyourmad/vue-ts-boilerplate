import Http from "@/http/http";
import { AxiosPromise } from "axios";
import { IHomeAPI, IHomeAPIParams } from "./home.interface";
import { mem } from "@/http/http-lib/http-decorator";
class HomeApi {
    get<URL extends keyof IHomeAPI, PARAMS extends keyof IHomeAPIParams>(
        url: URL,
        config: IHomeAPIParams[PARAMS]
    ): AxiosPromise<IHomeAPI[URL]> {
        return Http({
            url,
            ...config
        });
    }

    @mem({ maxAge: 1000 * 60 })
    lazyGet<URL extends keyof IHomeAPI, PARAMS extends keyof IHomeAPIParams>(
        url: URL,
        config: IHomeAPIParams[PARAMS]
    ): AxiosPromise<IHomeAPI[URL]> {
        return Http({
            url,
            ...config
        });
    }
}
export default new HomeApi();
