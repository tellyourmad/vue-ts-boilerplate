import store from "store";
import expirePlugin from "store/plugins/expire";
import { IUserToken, ILoginData } from "./token-guard.interface";
import { parseToken, isLaterThanNow, hasKeys } from "@/utils";

class TokenGuard {
    /**
     * 生成用户token
     * @param token 用户token
     * @param openId 用户openId
     */
    static createUserToken(token: string, openId: string = ""): IUserToken {
        const { exp } = parseToken(token);
        const userToken: IUserToken = {
            data: {
                token,
                openId
            },
            expire: exp
        };
        return userToken;
    }
    /**
     * 校验token是否符合标准
     *
     * @static
     * @memberof TokenGuard
     */
    private static verifyToken(token: string) {
        try {
            const tokenEntity = parseToken(token);
            // TODO: 没有公钥无法校验token是否合法 只能逆base64之后判断对象是否符合IBasetoken
            return (
                isLaterThanNow(tokenEntity.exp) &&
                hasKeys(["authorities", "sub", "jti", "exp"], tokenEntity)
            );
        } catch (error) {
            return false;
        }
    }
    private dataStore: StoreJsAPI;
    constructor() {
        this.dataStore = store;
        this.dataStore.addPlugin(expirePlugin);
    }
    /**
     * 登录
     * @param userData 服务器返回用户登陆信息
     */
    public login(userData: ILoginData) {
        return new Promise((resolve, reject) => {
            try {
                const { token, openId } = userData;
                if (TokenGuard.verifyToken(token)) {
                    const userToken = TokenGuard.createUserToken(token, openId);
                    this.dataStore.set(
                        "B2B_TOKEN",
                        userToken,
                        userToken.expire * 1000
                    );
                    resolve(token);
                } else {
                    reject("Token不合法!");
                }
            } catch (error) {
                reject(error);
            }
        });
    }
    /**
     * 获取用户token
     */
    public getToken(): string {
        const tobToken: IUserToken = this.dataStore.get("B2B_TOKEN");
        if (tobToken) {
            const {
                data: { token }
            } = tobToken;
            if (TokenGuard.verifyToken(token)) {
                return token;
            } else {
                return "";
            }
        } else {
            return "";
        }
    }
    /**
     * 登出
     */
    public logout(): Promise<void> {
        return new Promise((resolve, reject) => {
            this.dataStore.remove("B2B_TOKEN");
            return resolve();
        });
    }
    /**
     * 判断用户是否登录
     *
     * @returns {boolean} true为已经登录 false为未登陆
     * @memberof TokenGuard
     */
    public isLogin(): boolean {
        if (this.getToken() !== "") {
            return true;
        } else {
            return false;
        }
    }
}
export default TokenGuard;
