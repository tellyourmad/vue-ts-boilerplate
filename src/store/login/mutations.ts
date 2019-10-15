import {
    UPDATE_PROTOCAL_AGREE,
    UPDATE_B2B_TOKEN,
    UPDATE_PROVINCE_LIST,
    UPDATE_CITY_LIST,
    UPDATE_COUNTY_LIST,
    UPDATE_SMS_CAPTCHA,
    UPDATE_SMS_MOBILE,
    DELETE_B2B_TOKEN,
    START_COUNTDOWN
} from "../mutation-types";
import { MutationTree } from "vuex";
import { LoginState } from "./type";
import {
    ILogin,
    IProvinces,
    ICities,
    ICounties
} from "@/http/api/login/login.interface";
import TokenGuard from "@/guard/token-guard";
const tokenGuard = new TokenGuard();

const mutations: MutationTree<LoginState> = {
    [UPDATE_PROTOCAL_AGREE](state: LoginState, payload: boolean) {
        state.protocalAgree = payload;
    },
    [UPDATE_B2B_TOKEN](state: LoginState, data: ILogin) {
        state.token = data;
    },
    [DELETE_B2B_TOKEN](state: LoginState, data: ILogin) {
        state.token = {};
    },
    [UPDATE_PROVINCE_LIST](state: LoginState, payload: IProvinces[]) {
        state.provinces = [...state.provinces, ...payload];
    },
    [UPDATE_CITY_LIST](state: LoginState, payload: ICities[]) {
        state.cities = payload;
    },
    [UPDATE_COUNTY_LIST](state: LoginState, payload: ICounties[]) {
        state.counties = payload;
    },
    [UPDATE_SMS_CAPTCHA](state: LoginState, data: string) {
        state.captcha = data;
    },
    [UPDATE_SMS_MOBILE](state: LoginState, data: string) {
        state.mobile = data;
    },
    [START_COUNTDOWN](state: LoginState, data: number = 60) {
        state.smsCountDown = data;
        const timer = setInterval(() => {
            if (state.smsCountDown !== 0) {
                state.smsCountDown--;
            } else {
                state.smsCountDown = 0;
                clearInterval(timer);
            }
        }, 1000);
    }
};
export default mutations;
