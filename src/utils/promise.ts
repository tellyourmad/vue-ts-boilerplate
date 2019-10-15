import { removeUnhandleAPI } from "@/http/http-lib/unhandle-request";
import { ApiUidPromise } from "@/http/http.interface";

Promise.prototype.catch = function(onRejected) {
  const that = this as ApiUidPromise<any>;
  function $onRejected() {
    /* tslint:disable */
    var values = Array.prototype.slice.call(arguments, 0)!
    const catchResult = onRejected(values)
    if (typeof catchResult === undefined && that.apiUid) {
      removeUnhandleAPI(that.apiUid)
    }
  }
  return this.then(null, $onRejected.bind(this))
}
const promiseThen = Promise.prototype.then
Promise.prototype.then = function(onFulfilled, onRejected) {
  const that = this as ApiUidPromise<any>
  // 获取 then 方法返回的新 Promise 实例对象
  const p = promiseThen.call(this, onFulfilled, onRejected) as ApiUidPromise<any>
  // 在 promise 对象上有 apiUid 的情况下，表示是接口层的 Promise
  // 则给 then 方法返回的 Promise 实例对象也加上 apiUid
  if (that.apiUid) p.apiUid = that.apiUid
  return p
}
