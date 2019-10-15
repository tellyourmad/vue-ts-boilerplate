import { IResponse } from "@/http/http.interface";
interface IProduct {
    productDetailsVo: IProductDetailsVo;
    returnSkuVos: IReturnSkuVo[];
    priceAndStock: IPriceAndStock2[];
    productSpuVos: IProductSpuVo[];
    promotionVo: IPromotionVo;
    couponNames: string[];
    supplyId: number;
    coupons: ICoupon[];
    isCustomization?: boolean;
    productEvaluation: IProductEvaluation;
    title: string;
}

interface ICoupon {
    id: number;
    name: string;
    price: number;
    totalLimit: number;
    receiveLimit: number;
    totalQuantity: number;
    sendQuantity: number;
    startTime: number;
    endTime: number;
    supplyUserId: number;
    maxQuantity: number;
    maxCode: number;
    status: number;
    couponStatus4Customer: number;
    couponStatus4CustomerIntro: string;
    startTimeUnix: number;
    endTimeUnix: number;
}

interface IPromotion {
    promotionId: number;
    title: string;
    promotionType: string;
    promotionProductId: number;
}

interface IProductEvaluation {
    headImg: string;
    imgColl: any[];
    rate?: string;
    count?: number;
    time: number;
    content: string;
    username: string;
}

interface IPromotionVo {
    startDate: string;
    endDate: string;
    startUnixTime?: any;
    endUnixTime: number;
    differenceTime?: any;
    promotionType: string;
    personalMaxNum: number;
    count: string;
    promotionDescription: string;
    blockId: number;
    column: number;
    showText: boolean;
    orderNum: number;
    gap: boolean;
    compare: string;
    promotionIntensities: any[];
}

interface IProductSpuVo {
    attributeName: string;
    optionName: string;
}

interface IPriceAndStock2 {
    skuId: number;
    list: string[];
    priceAndStock: IPriceAndStock;
}

interface IPriceAndStock {
    price: number;
    guidancePrice: number;
    stock: number;
}

interface IReturnSkuVo {
    skuAttributeVo: ISkuAttributeVo;
    list: IList[];
}

interface IList {
    optionId: number;
    optionName: string;
}

interface ISkuAttributeVo {
    attributeId: number;
    attributeName: string;
}

interface IProductDetailsVo {
    id: number;
    filenames: IFilename[];
    saleStatus: number;
    minPrice: number;
    maxPrice: number;
    title: string;
    description: string;
    detail: string;
    productSupplyUserVo: IProductSupplyUserVo;
}

interface IProductSupplyUserVo {
    id: number;
    storeName: string;
    companyName: string;
    brandName: string;
    headerImg: string;
    province: string;
    productSize: number;
}

interface IFilename {
    filename: string;
}

interface IProductListItem {
    id: number;
    firstCategoryId: number;
    productCategoryId: number;
    supplyUserId: number;
    title: string;
    saleStatus: number;
    minPrice: string;
    maxPrice: string;
    productImage: string;
    isCustomization: number;
    productKind: number;
    productBigImagesId: number;
}

interface IProductAPI {
    "/product-details": IResponse<IProduct>;
    "/products": IResponse<IProductListItem>;
}

interface IProductParams {
    "/product-details": {};
    "/products": { params: IProductListItemParams };
}

interface IProductListItemParams {
    productCategoryId: number;
    keyword: string;
    supplyUserId: number;
    page: number;
    size: 20;
    paging: boolean;
}

interface ISkuData {
    count: number;
    price: number;
    productId: number;
    productSkuId: number;
    promotionId: number;
    stock: number;
}

interface IEvaluateData {
  countAndDoFlag: ICountAndDoFlag[];
  list: IProductEvaluation[];
}

interface ICountAndDoFlag {
  flag: number;
  name: string;
}

export {
    IProductAPI,
    ICoupon,
    IProductParams,
    IProduct,
    IPriceAndStock,
    IPriceAndStock2,
    IProductDetailsVo,
    IProductSupplyUserVo,
    IProductEvaluation,
    IProductSpuVo,
    IPromotionVo,
    IFilename,
    IPromotion,
    IEvaluateData,
    IProductListItem,
    ISkuData
};
