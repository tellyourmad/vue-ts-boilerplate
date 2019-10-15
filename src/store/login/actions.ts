import { ActionTree } from "vuex";
import { Toast } from "vant";
import { RootState } from "../types";
import { LoginState } from "./type";

import LoginApi from "@/http/api/login";
import TokenGuard from "@/guard/token-guard";
const tokenGuard = new TokenGuard();

const actions: ActionTree<LoginState, RootState> = {
    async onRegister({ commit }, obj) {
        const response = await LoginApi.request("/customers", {
            data: obj,
            method: "post"
        });
        Toast.success("登陆成功");
        return Promise.resolve(response);
    },
    onLogout({ commit }, obj) {
        commit("DELETE_B2B_TOKEN");
        return tokenGuard.logout();
    },
    async onLogin({ commit }, obj) {
        const response = await LoginApi.request("/customer/login", {
            data: obj,
            method: "post"
        });
        const token = await tokenGuard.login(response.data.data);
        Toast.success("登陆成功");
        commit("UPDATE_B2B_TOKEN", token);
        return Promise.resolve(token);
    },
    async onSendSmsCode({ commit }, mobile) {
        const $Toast = Toast.loading({ message: "发送中...", duration: 0 });
        const response = await LoginApi.request("/customer/reset-password", {
            data: { mobile },
            method: "post"
        });
        commit("START_COUNTDOWN", 60);
        $Toast.clear();
        Toast.success("发送成功");
        commit("UPDATE_SMS_CAPTCHA", response.data.data);
        return Promise.resolve(response.data.data);
    },
    async onSendRegisterSmsCode({ commit }, mobile) {
        const $Toast = Toast.loading({ message: "发送中...", duration: 0 });
        const response = await LoginApi.request("/customer/send-captcha-register", {
            data: { mobile },
            method: "post"
        });
        commit("START_COUNTDOWN", 60);
        $Toast.clear();
        Toast.success("发送成功");
        commit("UPDATE_SMS_CAPTCHA", response.data.data);
        return Promise.resolve(response.data.data);
    },
    onResetPassword({ commit }, data) {
        LoginApi.request("/create-new-password", { data, method: "post" }).then(response => {
            const { success, msg } = response.data;
            success ? Toast.success("重置密码成功") : Toast.fail(msg.replace(/！|，/g, ""));
        });
    },
    async onCheckSmsCode({ commit }, data) {
        return LoginApi.request("/customer/reset-password", {
            data,
            method: "post"
        }).then(response => {
            const { success, msg } = response.data;
            success ? Toast.success("验证成功") : Toast.fail(msg.replace(/！|，/g, ""));
            success && commit("UPDATE_SMS_MOBILE", data.mobile);
            return Promise.resolve(success);
        });
    },
    async getRegisterCodes({ commit }, params) {
        return LoginApi.get(`registercodes/${params}/is-effective`).then(response => {
            const { success, msg } = response.data;
            success ? Toast.success("注册码有效") : Toast.fail(msg.replace(/！/, ""));
            return Promise.resolve(success);
        });
    },
    getProvinceList({ commit }) {
        LoginApi.request("/provinces", {})
            .then(response => {
                commit("UPDATE_PROVINCE_LIST", response.data.data);
            })
            .catch(error => {
                console.log(error);
            });
    },
    getCityList({ commit }, id) {
        LoginApi.get(`provinces/${id}`)
            .then(response => {
                commit("UPDATE_CITY_LIST", response.data.data);
            })
            .catch(error => {
                console.log(error);
            });
    },
    getCountyList({ commit }, id) {
        LoginApi.get(`cities/${id}`)
            .then(response => {
                commit("UPDATE_COUNTY_LIST", response.data.data);
            })
            .catch(error => {
                console.log(error);
            });
    }
};

export default actions;
