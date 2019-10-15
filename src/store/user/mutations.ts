import {
    UPDATE_USER_INFO,
    UPDATE_ICON_COUNTS,
    UPDATE_COUPON_LIST,
    UPDATE_ADDRESS_LIST
} from "../mutation-types";
import {
    IUserInfo,
    IIconsCounts,
    ICoupon,
    IAddress
} from "@/http/api/user/user.interface";
import { MutationTree } from "vuex";
import { UserState } from "./type";

const mutations: MutationTree<UserState> = {
    [UPDATE_USER_INFO](state: UserState, payload: IUserInfo) {
        state.userInfo = payload;
    },
    [UPDATE_ICON_COUNTS](state: UserState, payload: IIconsCounts) {
        state.iconCounts = payload;
    },
    [UPDATE_COUPON_LIST](state: UserState, payload: ICoupon[]) {
        state.coupons = payload;
    },
    [UPDATE_ADDRESS_LIST](state: UserState, payload: IAddress[]) {
        state.addresses = payload;
    }
};

export default mutations;
