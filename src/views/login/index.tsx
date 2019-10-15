import { Component, Vue } from "vue-property-decorator";
import { Row, Col, NavBar, Icon, CellGroup, Button, Toast } from "vant";
import { Action } from "vuex-class";
import { ILoginBody } from "@/http/api/login/login.interface";
import ImgWrap from "@/components/img-wrap";
import Field from "@/components/hoc-field";
import style from "./in.module.scss";

const namespace = "login";
@Component({
    components: {
        [Row.name]: Row,
        [Col.name]: Col,
        [Icon.name]: Icon,
        [Field.name]: Field,
        [CellGroup.name]: CellGroup,
        [NavBar.name]: NavBar,
        [Button.name]: Button
    },
    name: "login"
})
export default class extends Vue {
    @Action("onLogin", { namespace }) onLogin: any;
    public loginObj: ILoginBody = { username: "", password: "" };
    private loading: boolean = false;
    createHeader() {
        return (
            <van-nav-bar title="登录" border={false} on-click-left={() => this.$router.replace("/")}>
                {/* <van-icon name="cross" /> */}
                <icon-svg slot="left" icon-class="guanbi" />
            </van-nav-bar>
        );
    }
    async login() {
        this.loading = true;
        try {
            await this.onLogin({
                username: this.loginObj.username,
                password: this.loginObj.password
            });
            this.$router.push({ name: "home" });
        } finally {
            setTimeout(() => {
                this.loading = false;
            }, 1000);
        }
    }
    // 验证输入信息
    get loginObjCheck() {
        return this.loginObj.password && this.loginObj.username;
    }
    protected render() {
        return (
            <van-row class={style.login}>
                {this.createHeader()}
                <van-col style={{ width: "100vw", background: "#fff" }}>
                    <ImgWrap respW={256} respH={256} class={style.logo} src={require("@/assets/logo.png")} />
                </van-col>
                <van-col span={24}>
                    <van-cell-group>
                        <van-field
                            center
                            class={style.field}
                            size="large"
                            type="number"
                            v-model={this.loginObj.username}
                            rules={[["require", "账号必须输入"]]}
                            placeholder="请输入您的账号/手机"
                        />
                        <van-field
                            center
                            class={style.field}
                            size="large"
                            type="password"
                            v-model={this.loginObj.password}
                            rules={[["require", "密码必须输入"]]}
                            placeholder="请输入您的密码"
                        >
                            <span slot="button" class={style.forgetPass} onClick={() => this.$router.push("forget/0")}>
                                <i class={style.noneBorder} />
                                忘记密码
                            </span>
                        </van-field>
                    </van-cell-group>
                </van-col>
                <van-col span={22} offset={1} style={{ marginTop: "30px" }}>
                    <van-button
                        type="danger"
                        size="large"
                        disabled={!this.loginObjCheck}
                        round
                        loading={this.loading}
                        onClick={() => this.login()}
                    >
                        登录
                    </van-button>
                </van-col>
                <van-col span={8} offset={8}>
                    <div class={style.register} onClick={() => this.$router.push({ name: "register" })}>
                        新用户注册
                    </div>
                </van-col>
            </van-row>
        );
    }
}
