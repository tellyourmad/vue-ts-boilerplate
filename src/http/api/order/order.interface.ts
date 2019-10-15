
import { IResponse } from "@/http/http.interface";

export interface IOrderAPI {
  "/customer/pay-produt/payOrder": IResponse<IPayOrder>;
}

export interface IOrderParams {
  "/customer/pay-produt/payOrder": { data: IPayOrderBody };
}

export interface IPayOrderBody {
  contuge: string;
  count: number;
  productId: string;
  skuName: string;
  promotionId: number;
  skuId: number;
}

export interface IPayOrder {
  consignee: string;
  mobile: number;
  detailedAddress: string;
  storeName: string;
  title: string;
  skuName: string;
  count: number;
  filename: string;
  pictureId: number;
  productId: number;
  promotionProductId?: any;
  supplyId: number;
  productUnitPrice: string;
  productDiscountPrice?: any;
  totalproductPrice: string;
  contuge?: any;
  couponName?: any;
  paymentMethod: PaymentMethod[];
  couponPrice: string;
  freight: string;
  totalPrice: string;
  addressId: number;
  skuId: number;
  useCouponsVo?: any;
  couponVoList?: any;
  promotionId: number;
  promotionType: string;
  promotionIntensities?: any;
  activityRecordVoList: any[];
  activityPrice: string;
  couponRecordsList: CouponRecordsList[];
  isCustomization: number;
  couponToDistribute?: any;
  platformChargeOrderVo?: any;
}

interface CouponRecordsList {
  id?: any;
  name?: any;
  price?: any;
  totalLimit?: any;
  receiveLimit?: any;
  totalQuantity?: any;
  sendQuantity?: any;
  startTime?: any;
  endTime?: any;
  supplyUserId?: any;
  maxQuantity?: any;
  maxCode?: any;
  status?: any;
}

interface PaymentMethod {
  id: number;
  name: string;
  payTypeName: string;
  imgUrl: string;
}
