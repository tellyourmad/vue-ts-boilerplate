import { AxiosRequestConfig } from "axios";

interface IHttpConfig extends AxiosRequestConfig {
  whiteList: string[];
}
interface IResponse<T> {
  data: T;
  msg: string;
  success: boolean;
  total: number;
}
interface IAxiosRequestConfig extends AxiosRequestConfig {
  apiUid: string;
}
interface ApiUidPromise<T> extends Promise<T> {
  apiUid: string;
}
export { IHttpConfig, IResponse, IAxiosRequestConfig, ApiUidPromise };
