import {
    IProvinces,
    ICities,
    ICounties
} from "@/http/api/login/login.interface";

export interface LoginState {
    token: {};
    protocalAgree: boolean;
    provinces: IProvinces[];
    cities: ICities[];
    counties: ICounties[];
    captcha: string;
    mobile: string;
    smsCountDown?: number;
}
