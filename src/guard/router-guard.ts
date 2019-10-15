import { Route } from "vue-router";
import store from "@/store";
import TokenGuard from "./token-guard";
const tokenGuard = new TokenGuard();
interface IMeta {
    title?: string;
    requireAuth?: boolean;
}
class RouteGuard {
    verifyUsersAuthToRoute(meta: IMeta, next: any) {
        if ("requireAuth" in meta) {
            // 路由页存在requireAuth字段
            if (meta.requireAuth) {
                // 路由页需要权限
                if (tokenGuard.isLogin()) {
                    // 用户已经登录
                    // 正常跳转
                    next();
                } else {
                    // 用户尚未登录
                    // 去登陆页
                    next({
                        name: "login"
                    });
                }
            } else {
                // 路由页不需要权限
                next();
            }
        } else {
            next();
        }
    }
    guard(to: Route, next: any) {
        this.verifyUsersAuthToRoute(to.meta, next);
    }
}

export default RouteGuard;
