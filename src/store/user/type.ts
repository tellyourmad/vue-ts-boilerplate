import {
    IUserInfo,
    IIconsCounts,
    ICoupon,
    IAddress
} from "@/http/api//user/user.interface";

export interface UserState {
    userInfo: IUserInfo;
    iconCounts: IIconsCounts;
    coupons: ICoupon[];
    addresses: IAddress[];
}
