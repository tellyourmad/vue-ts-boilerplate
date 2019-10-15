import Vue from "vue";
import Router, { Route } from "vue-router";


import RouteGuard from "@/guard/router-guard";
const routeGuard = new RouteGuard();
Vue.use(Router);

const router = new Router({
    mode: "hash",
    base: process.env.BASE_URL,
    routes: [
        {
            path: "/",
            name: "home",
            meta: {
                title: "首页",
                requireAuth: false
            },
            components: {
                default: () =>
                    import(/* webpackChunkName: "Home" */ "@/views/home"),
                tabBar: () =>
                    import(/* webpackChunkName: "Home" */ "@/views/tab-bar")
            }
        },
        {
            path: "/user",
            name: "user",
            meta: {
                title: "我的",
                requireAuth: true
            },
            components: {
                default: resolve => {
                    require(["@/views/user/index"], resolve);
                },
                tabBar: resolve => {
                    require(["@/views/tab-bar"], resolve);
                }
            }
        },
        {
            path: "/login",
            name: "login",
            meta: {
                title: "登录",
                requireAuth: false
            },
            component: resolve => {
                require(["@/views/login"], resolve);
            }
        }
    ]
});
router.beforeEach((to: Route, from: Route, next: any) =>
    routeGuard.guard(to, next)
);
export default router;
