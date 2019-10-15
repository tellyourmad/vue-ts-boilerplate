import { IResponse } from "@/http/http.interface";

interface ISearch {
    id: number;
    title: string;
    description?: any;
    minPrice: string;
    maxPrice: string;
    saleStatus: number;
    isCustomization: number;
    sales: number;
    productBigImages: ProductBigImage[];
    productSkuVos?: any;
    productSkuVo?: any;
}

interface ProductBigImage {
    id: number;
    productId: number;
    ossUploadFileId: number;
    filename: string;
}

interface ISearchParams {
    keyword: string;
    sortUI?: number;
    productSort?: number;
    page?: number;
    size?: number;
    paging?: boolean;
}

interface ISearchAPI {
    "/product-search-words": IResponse<string[]>;
    "/keyword-products": IResponse<ISearch[]>;
}

interface ISearchAPIParams {
    "/product-search-words": {};
    "/keyword-products": { params: ISearchParams };
}

export { ISearchAPI, ISearchAPIParams, ISearch, ISearchParams };
