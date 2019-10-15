import Vue from "vue";
import Vuex, { StoreOptions } from "vuex";
import { RootState } from "./types";
import { home } from "./home";
import { login } from "./login";
import { user } from "./user";
import { global } from "./global";

Vue.use(Vuex);
const store: StoreOptions<RootState> = {
    state: {
        version: "1.0.0",
        // TODO: 这里要修改
        isFillInBusinessInfo: true
    },
    modules: {
        global,
        home,
        login,
        user,
    }
};
export default new Vuex.Store<RootState>(store);
