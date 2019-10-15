import { IResponse } from "@/http/http.interface";

interface IGoodsData {
  supplyId: number;
  storeName: string;
  list: IGoodField[];
}

interface IGoodField {
  shoppingCartId: number;
  promotionId: number;
  promotionType?: any;
  productId: number;
  skuId: number;
  promotionProductId?: any;
  title: string;
  price: string;
  discountPrice?: any;
  filename: string;
  pictureId?: any;
  count: number;
  optionName: string;
  isStock: boolean;
  isCustomization: number;
  promotionIntensities?: any;
  platformChargeName?: any;
  platformChargeDesc?: any;
  platformChargeprice?: any;
}

interface IGoodInvalid {
  productId: number;
  filename: string;
  title: string;
  price: number;
  sale_status?: any;
  count: number;
  supplyName?: any;
  productSpecifications: string;
  intailCause?: any;
}

interface IGoodCount {
  count: number;
  shoppingCartId: number;
}

interface IGoodId {
  shoppingCartIds: number[];
}

interface ICartAPI {
  "/customer/shopping-cart": IResponse<IGoodsData>;
  "/customer/shopping-cart/products/Invalid": IResponse<IGoodInvalid[]>;
  "/customer/shopping-cart/total-price": IResponse<number>;
  "/customer/shopping-cart/shoppingcartids": IResponse<null>;
  "/customer/shopping-cart/invaildproduct/productIds": IResponse<null>;
  "/customer/shopping-cart/productcount/shoppingcartid": IResponse<null>;
}

interface ICartAPIParams {
  "/customer/shopping-cart": {};
  "/customer/shopping-cart/products/Invalid": {};
  "/customer/shopping-cart/total-price": { data: IGoodId };
  "/customer/shopping-cart/shoppingcartids": { data: IGoodId };
  "/customer/shopping-cart/invaildproduct/productIds": {};
  "/customer/shopping-cart/productcount/shoppingcartid": { data: IGoodCount };
}

export { ICartAPI, ICartAPIParams, IGoodField, IGoodsData, IGoodCount, IGoodInvalid };
