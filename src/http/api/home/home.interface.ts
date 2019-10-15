import { IResponse } from "@/http/http.interface";

interface IHome {
    id?: number;
    title?: string;
    appPromotionPageBlocks?: AppPromotionPageBlock[];
}

interface AppPromotionPageBlock {
    id: number;
    title: string;
    hideTitle: boolean;
    normal?: INormal;
    promotion?: Promotion;
}

interface Promotion {
    promotionId: number;
    promotionType: string;
    productsColumn: number;
    subTitle: string;
    showCoverImg: number;
    coverImgPath: string;
    showTimeRemaining: number;
    timeRemainingSec: number;
    secondToBeginTime: number;
    startTime?: any;
    hasMoreProducts: boolean;
    products: Product[];
    promotionIntensities: any[];
}

interface Product {
    blockId: number;
    title: string;
    promotionProductId: number;
    productId: number;
    price: string | number;
    discountPrice: string | number;
    imageId: string;
    image: string;
    progressPercent?: any;
    remainStockQuantity?: any;
    saleStatus: number;
    orderNum: number;
}

interface INormal {
    layoutType:
        | "BANNER"
        | "MIX1"
        | "MIX2"
        | "MIX3"
        | "MIX4"
        | "MIX5"
        | "ICON"
        | "";
    linkLayoutColumn: number;
    links: ILink[];
}

interface ILink {
    id: number;
    imgPath: string;
    linkType?: string;
    linkContent?: string;
    promotionType?: null | string | string;
    name?: string;
}

interface ICategories {
    id?: number;
    parentId?: number;
    title?: string;
    image?: string;
    imgId?: any;
    children?: any;
}

interface IProductCategories {
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
}

interface IHomeAPI {
    "/categories": IResponse<ICategories>;
    "/products": IResponse<IProductCategories>;
    "/promotion-pages/home": IResponse<IHome>;
}

interface IHomeAPIParams {
    "/categories": { params: ICategoriesParams };
    "/products": { params: IProductCategoriesParams };
    "/promotion-pages/home": {};
}

interface ICategoriesParams {
    parentId: number;
    nested: boolean;
    page: number;
    size: 20;
    paging: boolean;
}

interface IProductCategoriesParams {
    productCategoryId: number;
    page: number;
    size: number;
    paging: boolean;
}

export {
    ILink,
    IHomeAPI,
    IHomeAPIParams,
    IHome,
    INormal,
    Promotion,
    Product,
    ICategories,
    IProductCategories
};
