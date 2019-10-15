import { Component, Vue } from "vue-property-decorator";
import { NavBar } from "vant";

@Component({
    components: {
        [NavBar.name]: NavBar
    },
    name: "login-header"
})
export default class extends Vue {
    protected render() {
        return (
            <van-nav-bar title="登录" border={false} on-click-left={() => this.$router.push("/")}>
                {/* <van-icon name="cross" /> */}
                <icon-svg slot="left" icon-class="guanbi" />
            </van-nav-bar>
        );
    }
}
