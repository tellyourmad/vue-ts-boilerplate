import { createLocalVue, mount, shallowMount } from "@vue/test-utils";
import RouteGuard from "../router-guard";
import TokenGuard from "../token-guard";

const tokenGuard = new TokenGuard();
const routeGuard = new RouteGuard();
describe("ROUTE_GUARD", () => {
    it("should call next function if route to name is Violentpopping", () => {
        const to = {
            fullPath: "/login/in",
            hash: "",
            meta: { title: "登录", requireAuth: false },
            name: "Violentpopping",
            params: {},
            path: "/login/in",
            query: {},
            matched: [] as any
        };
        const next = jest.fn();
        routeGuard.guard(to, next);
        expect(next).toHaveBeenCalled();
    });
    it("should call next function if route name is not Violentpopping and route auth is inadequate ", () => {
        const to = {
            fullPath: "/login/in",
            hash: "",
            meta: { title: "登录", requireAuth: false },
            name: "login",
            params: {},
            path: "/login/in",
            query: {},
            matched: [] as any
        };
        const next = jest.fn();
        routeGuard.guard(to, next);
        expect(next).toHaveBeenCalled();
    });
    it("should call next function if route name is not Violentpopping and route auth is inadequate ", () => {
        const to = {
            fullPath: "/login/in",
            hash: "",
            meta: { title: "登录", requireAuth: false },
            name: "login",
            params: {},
            path: "/login/in",
            query: {},
            matched: [] as any
        };
        const next = jest.fn();
        routeGuard.guard(to, next);
        expect(next).toHaveBeenCalled();
    });
    it("should call next function if route name is not Violentpopping and route auth is undefined ", () => {
        const to = {
            fullPath: "/login/in",
            hash: "",
            meta: { title: "登录" },
            name: "login",
            params: {},
            path: "/login/in",
            query: {},
            matched: [] as any
        };
        const next = jest.fn();
        routeGuard.guard(to, next);
        expect(next).toHaveBeenCalled();
    });
    // tslint:disable-next-line: max-line-length
    it("should call next function and goto loginin route if route name is not Violentpopping and route auth is required", () => {
        // const time = new Date().getTime() + 50000;
        // const token = jwt.sign(
        //     {
        //         authorities: "ROLE_ADMIN,AUTH_WRITE",
        //         sub: "781348352",
        //         jti: "21445",
        //         exp: time
        //     },
        //     "P@ssw02d"
        // );
        // const mockUserData: ILoginData = {
        //     token,
        //     fixed: true,
        //     status: "login",
        //     username: "595586865",
        //     perms: null,
        //     perm: null
        // };
        const to = {
            fullPath: "/mime",
            hash: "",
            meta: { title: "登录", requireAuth: true },
            name: "mime",
            params: {},
            path: "/mime",
            query: {},
            matched: [] as any
        };
        let redirectRouteName = {};
        const next = jest.fn(data => {
            redirectRouteName = data;
        });
        routeGuard.guard(to, next);
        expect(tokenGuard.isLogin()).toEqual(false);
        expect(next).toHaveBeenCalled();
        expect(redirectRouteName).toEqual({
            name: "loginIn"
        });
    });
});
