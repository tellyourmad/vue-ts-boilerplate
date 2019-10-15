import { ActionTree } from "vuex";
import { RootState } from "../types";
import { UserState } from "./type";

import UserApi from "@/http/api/user";
import { responseTransforamtor } from "@/utils/common";

const actions: ActionTree<UserState, RootState> = {
  fixStatus({ commit }) {
    // DOTO 之后添加逻辑
    UserApi.get("/customer/fix-status", {}).then(
      response => {
        !response.data.data && console.log(1);
      }
    );
  },
  getCustomerInfo({ commit }) {
    UserApi.get("/customer", {}).then(
      response => {
        commit("UPDATE_USER_INFO", response.data.data);
      }
    );
  },
  getIconsNumber({ commit }) {
    UserApi.get("/order/order-count", {}).then(
      response => {
        commit("UPDATE_ICON_COUNTS", response.data.data);
      }
    );
  },
  getCouponsList({ commit }) {
    UserApi.get("/customer/coupons", {}).then(
      response => {
        commit("UPDATE_COUPON_LIST", response.data.data);
      }
    );
  },
  getAddressList({ commit }) {
    UserApi.get("/customer/addresses", {}).then(
      response => {
        commit("UPDATE_ADDRESS_LIST", response.data.data);
      }
    );
  },
  onEditAddress({ commit }, data) {
    UserApi.post("/customer/addresses/edit", { data }).then(
      response => {
        commit("UPDATE_ADDRESS_LIST", response.data.data);
      }
    );
  }
};
export default actions;
