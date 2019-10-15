import { IHome } from "@/http/api/home/home.interface";
import { Component, Vue } from "vue-property-decorator";
import { PullRefresh } from "vant";
import { Action, Getter } from "vuex-class";
import * as style from "./home.module.scss";

const namespace = "home";
@Component({
    name: "home",
    components: {
        [PullRefresh.name]: PullRefresh
    }
})
export default class Home extends Vue {
    @Action("getHomeProduct", { namespace })
    getHomeProduct: any;
    @Getter("getHomeInfo", { namespace })
    homeInfo: IHome;
    @Action("togglePullRefreshStatus", { namespace: "global" })
    togglePullRefreshStatus: any;

    private isLoading: boolean = false;
    private timer: number | null = null;

    async created() {
        await this.getHomeProduct();
    }
    activated() {
        console.log("call activated");
    }
    deactivated() {
        console.log("I AM deactivated");
    }
    destroyed() {
        console.log("parent destroyed");
    }

    async refresh() {
        this.togglePullRefreshStatus(true);
        this.isLoading = true;
        await this.getHomeProduct();
        this.timer = window.setTimeout(() => {
            this.isLoading = false;
            this.timer = null;
            this.togglePullRefreshStatus(false);
        }, 1000);
    }

    beforeDestroy() {
        window.clearTimeout(this.timer);
        this.isLoading = false;
        this.timer = null;
        this.togglePullRefreshStatus(false);
    }

    protected render() {
        return (
            <van-pull-refresh
                v-model={this.isLoading}
                onRefresh={this.refresh.bind(this)}
            >
                <div class={style.home}>
                    {this.homeInfo.title}
                </div>
            </van-pull-refresh>
        );
    }
}
