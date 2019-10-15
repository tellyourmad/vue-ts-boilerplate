import { createLocalVue, mount } from "@vue/test-utils";
import TokenGuard from "../token-guard";
import { ILoginData, IUserToken } from "../token-guard.interface";
import VueGlobal from "../../global";
import jwt from "jsonwebtoken";
import dayjs from "dayjs";
import { isError } from "lodash";
const tokenGuard = new TokenGuard();
describe("TOKEN_GUARD", () => {
    const localVue = createLocalVue();
    localVue.use(VueGlobal);

    const component = {
        template: `
            <div>Hello</div>
        `
    };
    let token: string = "";
    let time: number = 0;
    beforeEach(() => {
        time = new Date().getTime() + 50000;
        token = jwt.sign(
            {
                authorities: "ROLE_ADMIN,AUTH_WRITE",
                sub: "781348352",
                jti: "21445",
                exp: time
            },
            "P@ssw02d"
        );
    });
    afterEach(() => {
        localStorage.removeItem("B2B_TOKEN");
    });
    // mount(component, {
    //     localVue,
    //     attachToDocument: true
    // });
    it("adds an $dataStore method to the Vue prototype", () => {
        expect(typeof localVue.prototype.$dataStore.set).toEqual("function");
        expect(typeof localVue.prototype.$dataStore).toEqual("object");
    });
    it("should return false if token is substandard(lack required keys).", () => {
        const mockToken = jwt.sign(
            {
                // lack authorities
                sub: "781348352",
                jti: "21445",
                exp: time
            },
            "P@ssw02d"
        );
        const mockUserData: ILoginData = {
            token: mockToken,
            fixed: false,
            status: "login",
            username: "595586865",
            perms: null,
            perm: null
        };
        tokenGuard.login(mockUserData).catch(e => {
            expect(e).toEqual("Token不合法!");
        });
    });
    it("should throw error if token is substandard(exp is expired).", () => {
        const mockToken = jwt.sign(
            {
                authorities: "foo,bar",
                sub: "781348352",
                jti: "21445",
                exp: dayjs()
                    .subtract(1, "day")
                    .valueOf()
            },
            "P@ssw02d"
        );
        const mockUserData: ILoginData = {
            token: mockToken,
            fixed: false,
            status: "login",
            username: "595586865",
            perms: null,
            perm: null
        };
        tokenGuard.login(mockUserData).catch(e => {
            expect(e).toEqual("Token不合法!");
        });
    });
    it("should store user's token when set method was called", () => {
        const mockUserData: ILoginData = {
            // tslint:disable-next-line: max-line-length
            token: `eyJhbGciOiJIUzUxMiJ9.eyJhdXRob3JpdGllcyI6IlJPTEVfQURNSU4sQVVUSF9XUklURSIsInN1YiI6IjU5NTU4Njg2NSIsImp0aSI6IjcwMjUyIiwiZXhwIjoxNTU0OTc3NDg2fQ.M0Sj5dU0xh74f0Hvyso23I-_F_XHOHsaRXYdUP_oQzxFPzDSHQl5Yd8sbNx2LuIfFxcQNqTOVbUpdmBZyMs-tQ`,
            fixed: false,
            status: "login",
            username: "595586865",
            perms: null,
            perm: null
        };
        const expectMockUserData: IUserToken = {
            data: {
                // tslint:disable-next-line: max-line-length
                token: `eyJhbGciOiJIUzUxMiJ9.eyJhdXRob3JpdGllcyI6IlJPTEVfQURNSU4sQVVUSF9XUklURSIsInN1YiI6IjU5NTU4Njg2NSIsImp0aSI6IjcwMjUyIiwiZXhwIjoxNTU0OTc3NDg2fQ.M0Sj5dU0xh74f0Hvyso23I-_F_XHOHsaRXYdUP_oQzxFPzDSHQl5Yd8sbNx2LuIfFxcQNqTOVbUpdmBZyMs-tQ`,
                openId: ""
            },
            expire: new Date().getTime() + 7 * 24 * 60 * 60 * 1000
        };
        tokenGuard.login(mockUserData);
        const data: string | null = localStorage.getItem("B2B_TOKEN");
        const receivedData: IUserToken = JSON.parse(data ? data : "");
        expect(receivedData.data.token.trim()).toBe(
            expectMockUserData.data.token.trim()
        );
        expect(tokenGuard.getToken()).toBe(
            expectMockUserData.data.token.trim()
        );
    });
    it("should remove user token if logout was called", () => {
        const mockUserData: ILoginData = {
            // tslint:disable-next-line: max-line-length
            token: `eyJhbGciOiJIUzUxMiJ9.eyJhdXRob3JpdGllcyI6IlJPTEVfQURNSU4sQVVUSF9XUklURSIsInN1YiI6IjU5NTU4Njg2NSIsImp0aSI6IjcwMjUyIiwiZXhwIjoxNTU0OTc3NDg2fQ.M0Sj5dU0xh74f0Hvyso23I-_F_XHOHsaRXYdUP_oQzxFPzDSHQl5Yd8sbNx2LuIfFxcQNqTOVbUpdmBZyMs-tQ`,
            fixed: false,
            status: "login",
            username: "595586865",
            perms: null,
            perm: null
        };
        tokenGuard.login(mockUserData);
        expect(tokenGuard.isLogin()).toEqual(true);
        tokenGuard.logout();
        expect(tokenGuard.isLogin()).toEqual(false);
    });
    it("should remove user's token if logout method was called", () => {
        const mockUserData: ILoginData = {
            // tslint:disable-next-line: max-line-length
            token,
            fixed: false,
            status: "login",
            username: "595586865",
            perms: null,
            perm: null
        };
        tokenGuard.login(mockUserData);
        expect(tokenGuard.getToken()).toEqual(token);
        expect(tokenGuard.isLogin()).toEqual(true);
        tokenGuard.logout();
        expect(tokenGuard.getToken()).toEqual("");
        expect(tokenGuard.isLogin()).toEqual(false);
    });
    it("should return false if user's token is inexist", () => {
        expect(tokenGuard.isLogin()).toEqual(false);
    });
});
