import { ApiUidPromise } from "../http.interface";
import { Toast } from "vant";

const unhandleAPI: string[] = [];

export function matchUnhandleAPI(id: string) {
    return unhandleAPI.find(apiUid => apiUid === id);
}

export function addUnhandleAPI(id: string) {
    unhandleAPI.push(id);
}

export function removeUnhandleAPI(id: string) {
    const index = unhandleAPI.findIndex(apiUid => apiUid === id);
    unhandleAPI.splice(index, 1);
}

export function handleAPIStatusError(pr: ApiUidPromise<any>, msg: string) {
    const index = unhandleAPI.findIndex(apiUid => apiUid === pr.apiUid);
    if (index >= 0) {
        pr.catch(error => {
            Toast.fail(msg);
            removeUnhandleAPI(pr.apiUid);
            console.error("你没抓到错误,我抓到了");
        });
    }
}
