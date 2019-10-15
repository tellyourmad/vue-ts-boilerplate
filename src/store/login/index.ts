// tslint:disable: no-shadowed-variable
import { Module, GetterTree } from "vuex";
import { RootState } from "../types";
import { LoginState } from "./type";

import mutations from "./mutations";
import actions from "./actions";

const state: LoginState = {
    protocalAgree: false,
    provinces: [],
    cities: [],
    counties: [],
    captcha: "",
    mobile: "",
    token: {},
    smsCountDown: 0
};

const getters: GetterTree<LoginState, RootState> = {
    smsCountDown(state: LoginState): number {
        return state.smsCountDown;
    },
    isProtocalAgree(state: LoginState): boolean {
        return state.protocalAgree;
    },
    getProvinces(state: LoginState) {
        return state.provinces;
    },
    getCities(state: LoginState) {
        return state.cities;
    },
    getCounties(state: LoginState) {
        return state.counties;
    },
    getCaptcha(state: LoginState): string {
        return state.captcha;
    },
    getMobile(state: LoginState): string {
        return state.mobile;
    }
};
const namespaced: boolean = true;

export const login: Module<LoginState, RootState> = {
    namespaced,
    state,
    getters,
    mutations,
    actions
};
