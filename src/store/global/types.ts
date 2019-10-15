export interface IScrollStorageItem {
    path: string;
    name: string;
    value: number;
}

export interface GlobalState {
    scrollStorage: IScrollStorageItem[];
    pullLoading?: boolean;
}
