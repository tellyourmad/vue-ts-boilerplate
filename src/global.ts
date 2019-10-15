import { VueConstructor } from "vue";
import store from "store";
import expirePlugin from "store/plugins/expire";
export default {
    install(Vue: VueConstructor<any>, options?: any) {
        store.addPlugin(expirePlugin);
        Vue.prototype.$dataStore = store;
    }
};
