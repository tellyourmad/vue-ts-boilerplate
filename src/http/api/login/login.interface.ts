import { IResponse } from "@/http/http.interface";

interface ILogin {
    token: string;
    fixed: boolean;
    status: string;
    username: string;
    perms?: any;
    perm?: any;
}

interface ILoginBody {
    password: string;
    username: string;
}

interface IRegisterBody {
    account: string;
    address: string;
    conformPwd: string;
    districtCityId: number;
    districtDistrictId: number;
    districtProvinceId: number;
    email: string;
    mobile: string;
    name: string;
    passwd: string;
    verificationCode: string;
}

interface IProvinces {
    id: number;
    name: string;
    citycode: string;
    adcode: number;
    lat: number;
    lng: number;
    show: number;
}

interface ICities {
    id: number;
    name: string;
    citycode: string;
    adcode: number;
    districtProvinceId: number;
    districtCityId: number;
    lat: number;
    lng: number;
    show: number;
}

interface ICounties {
    id: number;
    name: string;
    citycode: string;
    adcode: number;
    districtProvinceId: number;
    districtCityId: number;
    lat: number;
    lng: number;
    show: number;
}

interface ICodeCheckBody {
    mobile: string;
    captcha?: string;
}

interface IResetPwdBody {
    mobile: string;
    password: string;
    repeatPwd: string;
}

// repsonse 响应
interface ILoginAPI {
    "/customer/login": IResponse<ILogin>;
    "/provinces": IResponse<IProvinces[]>;
    "/customer/reset-password": IResponse<string>;
    "/customer/check-smscode": IResponse<any>;
    "/create-new-password": IResponse<any>;
    "/customer/send-captcha-register": IResponse<string>;
    "/customers": IResponse<string>;
    // "/promotion-pages/home": IResponse<IHome>;
}
// body 参数
interface ILoginAPIBody {
    "/customer/login": { data: ILoginBody };
    "/customer": { data: IRegisterBody };
    "/provinces": {};
    "/customer/reset-password": { data: { mobile: string } };
    "/customer/check-smscode": { data: ICodeCheckBody };
    "/create-new-password": { data: IResetPwdBody };
    "/customer/send-captcha-register": { data: { mobile: string } };
    "/customers": { data: string };
}

export {
    ILogin,
    ILoginBody,
    ILoginAPI,
    ILoginAPIBody,
    IRegisterBody,
    IProvinces,
    ICities,
    ICounties,
    ICodeCheckBody,
    IResetPwdBody
};
