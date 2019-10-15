// tslint:disable: no-shadowed-variable
import { Module, ActionTree, MutationTree, GetterTree } from "vuex";
import { GlobalState, IScrollStorageItem } from "./types";
import { RootState } from "../types";
import { DELETE_SCROLL_STORAGE, ADD_SCROLL_STORAGE, TOGGLE_PULL_REFRESH } from "../mutation-types";

export const state: GlobalState = {
    scrollStorage: [],
    pullLoading: false
};

/* getter */
export const getters: GetterTree<GlobalState, RootState> = {
    getScrollStorage: ({ scrollStorage }: GlobalState): any => (path: string, name: string): IScrollStorageItem => {
        const finds = scrollStorage.filter(item => item.path === path && item.name === name);
        return finds.length > 0 ? finds[0] : null;
    },
    getScrollTop: ({ scrollStorage }: GlobalState): any => (path: string, name: string = "default"): number => {
        const finds = scrollStorage.filter(item => item.path === path && item.name === name);
        return finds.length > 0 && finds[0] ? finds[0].value : 0;
    },
    getPullRefreshStatus({ pullLoading }: GlobalState): boolean {
        return pullLoading;
    }
};
/* mutations */
export const mutations: MutationTree<GlobalState> = {
    [TOGGLE_PULL_REFRESH](state: GlobalState, pullLoading) {
        state.pullLoading = pullLoading;
    },
    [DELETE_SCROLL_STORAGE](state: GlobalState, storage: IScrollStorageItem) {
        const index = state.scrollStorage.indexOf(storage);
        if (index >= 0) {
            state.scrollStorage.splice(index, 1);
        }
    },
    [ADD_SCROLL_STORAGE](state: GlobalState, storage: IScrollStorageItem) {
        state.scrollStorage.push(storage);
    }
};

/* actions */
export const actions: ActionTree<GlobalState, RootState> = {
    addStorage({ commit, getters }, { path, name = "default", value = 0 }: IScrollStorageItem) {
        const find = getters.getScrollStorage(path, name);
        if (!!find) {
            commit(DELETE_SCROLL_STORAGE, find);
        }
        commit(ADD_SCROLL_STORAGE, { path, name, value });
    },
    togglePullRefreshStatus({ commit }, pullLoading: GlobalState["pullLoading"]) {
        commit(TOGGLE_PULL_REFRESH, pullLoading);
    }
};
const namespaced: boolean = true;

export const global: Module<GlobalState, RootState> = {
    namespaced,
    state,
    getters,
    mutations,
    actions
};
