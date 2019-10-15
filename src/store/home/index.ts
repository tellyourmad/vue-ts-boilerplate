// tslint:disable: no-shadowed-variable
import { Module, ActionTree, MutationTree, GetterTree } from "vuex";
import { HomeState } from "./types";
import { RootState } from "../types";
import { SET_HOME_PRODUCT } from "../mutation-types";

import HomeApi from "@/http/api/home";
import { IHome } from "@/http/api/home/home.interface";
/**
 * state
 */
export const state: HomeState = {
    version: "0.0.1",
    homeProduct: {}
};

/**
 * getters
 */
export const getters: GetterTree<HomeState, RootState> = {
    getVersion(state: HomeState): string {
        return state.version;
    },
    getHomeInfo(state: HomeState): IHome {
        return state.homeProduct;
    }
};

/**
 * mutations
 */
export const mutations: MutationTree<HomeState> = {
    setVersion(state: HomeState, payload: string) {
        state.version = payload;
    },
    [SET_HOME_PRODUCT](state: HomeState, payload: IHome) {
        state.homeProduct = payload;
    }
};

/**
 * actions
 */
export const actions: ActionTree<HomeState, RootState> = {
    Version({ commit }, payload: string) {
        commit("setVersion", payload);
    },
    async getHomeProduct({ commit }) {
        try {
            const response = await HomeApi.lazyGet("/promotion-pages/home", {});
            commit("SET_HOME_PRODUCT", response.data.data);
        } catch (error) {
            console.error(error);
        }
    }
};

const namespaced: boolean = true;

export const home: Module<HomeState, RootState> = {
    namespaced,
    state,
    getters,
    mutations,
    actions
};
