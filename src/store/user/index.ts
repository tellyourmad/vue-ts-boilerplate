// tslint:disable: no-shadowed-variable
import { Module, GetterTree } from "vuex";
import { RootState } from "../types";
import { UserState } from "./type";

import mutations from "./mutations";
import actions from "./actions";

const state: UserState = {
    userInfo: undefined,
    iconCounts: undefined,
    coupons: [],
    addresses: []
};

const getters: GetterTree<UserState, RootState> = {
    getUserInfo(state: UserState) {
        return state.userInfo;
    },
    getIconCounts(state: UserState) {
        const counts = { ...state.iconCounts };
        // @ts-ignore
        return Object.keys(counts).map(count => counts[count]);
    }
};
const namespaced: boolean = true;

export const user: Module<UserState, RootState> = {
    namespaced,
    state,
    getters,
    mutations,
    actions
};
