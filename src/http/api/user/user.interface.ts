import { IResponse } from "@/http/http.interface";

interface IUserInfo {
  custom_user_id: number;
  account: number;
  nick_name?: any;
  mobile: string;
  businessArea: string;
  header_img: string;
  district_province_id: number;
  district_province_des: string;
  district_city_id: number;
  district_city_des: string;
  district_district_id: number;
  district_id_des: string;
  invoiceTitle: string;
  invoiceNumber: string;
  openWallet: boolean;
  rmb?: any;
  shopName: string;
  address?: any;
}

interface IIconsCounts {
  count0: number;
  count1: number;
  count2: number;
  count3: number;
  count4: number;
}

interface ICoupon {
  couponId: number;
  name: string;
  price: number;
  totalLimit: number;
  status: number;
  couponRecordId: number;
  startTime: number;
  endTime: number;
  usedTime: number;
  expire?: number;
}

interface IAddress {
  id: number;
  customUserId: number;
  consignee: string;
  districtProvinceId: number;
  districtProvinceDes: string;
  districtCityId: number;
  districtCityDes: string;
  districtDistrictId: number;
  districtDistrictDes: string;
  detailedAddress: string;
  mobile: number;
  postalCode: string;
  default_: number | boolean;
  addressDes: string;
}

interface IUserAPI {
  "/customer": IResponse<IUserInfo>;
  "/customer/addresses": IResponse<IAddress[]>;
  "/customer/addresses/edit": IResponse<IAddress[]>;
  "/customer/coupons": IResponse<ICoupon[]>;
  "/customer/fix-status": IResponse<boolean>;
  "/order/order-count": IResponse<IIconsCounts>;
}

interface IUserAPIParams {
  "/customer": {};
  "/customer/addresses": {};
  "/customer/addresses/edit": { data: IAddress };
  "/customer/coupons": {};
  "/customer/fix-status": {};
  "/order/order-count": {};
}

export { IUserAPI, IUserAPIParams, IUserInfo, IIconsCounts, ICoupon, IAddress };
