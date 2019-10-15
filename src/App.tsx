import { Vue, Component, Watch } from "vue-property-decorator";
import * as style from "./app.module.scss";
// import { Route } from "vue-router";
import { Action } from "vuex-class";
import "@/base-styles/common/index.scss";

import ScrollWrap from "@/components/scroll-wrap";
import FlexCoverWrap from "@/components/flex-cover-wrap";

// const SCREEN_LEFT = (document.documentElement.clientWidth * 2) / 5;
// const POS_THRESHOLD = 10;
// const VELOCITY_THRESHOLD = 0.3;

@Component({
    name: "app"
})
export default class App extends Vue {
    @Action("getHomeProduct", { namespace: "home" })
    getHomeProduct: any;
    private direction: string = "slide-left";
    // private touchStartX: number = 0;
    // private touchStartY: number = 0;
    // private touchStartTime: number = 0;
    // private quickBackTimer: number | null = null;

    // private backBtn: HTMLElement;

    private show: boolean = true;       // 如果把其它东西注释掉的话，这里应该改为false
    // private showDelayTimer: number | null = null;

    // private transTimer: number | null = null;

    // @Watch("$route")
    // onRouteChange(to: Route, from: Route) {
    //     const rootRouterArrange: any = {
    //         home: 1,
    //         categoriesPrimary: 2,
    //         cart: 3,
    //         user: 4
    //     };
    //     const isLogin = (path: string) => {
    //         return path.search(/^\/login\/.*/);
    //     };
    //     window.clearTimeout(this.transTimer);
    //     this.transTimer = window.setTimeout(() => {
    //         this.transTimer = null;
    //     }, 600);
    //     if (isLogin(from.path) && !isLogin(to.path)) {
    //         this.direction = "slide-up";
    //     } else if (isLogin(to.path) && !isLogin(from.path)) {
    //         this.direction = "slide-down";
    //     } else if (
    //         from.name in rootRouterArrange &&
    //         to.name in rootRouterArrange
    //     ) {
    //         if (rootRouterArrange[to.name] > rootRouterArrange[from.name]) {
    //             this.direction = "slide-left";
    //         } else {
    //             this.direction = "slide-right";
    //         }
    //     } else {
    //         const toDepth = to.path.split("/").length;
    //         const fromDepth = from.path.split("/").length;
    //         this.direction = toDepth < fromDepth ? "slide-right" : "slide-left";
    //     }
    // }

    // created() {
    //     document.addEventListener(
    //         "touchmove",
    //         (e: UIEvent) => {
    //             e.preventDefault();
    //         },
    //         { passive: false }
    //     );
    // }

    // mounted() {
    //     this.showDelayTimer = window.setTimeout(() => {
    //         this.showDelayTimer = null;
    //         this.show = true;
    //     }, 1000);
    // }

    // bodyTouchStart(event: TouchEvent) {
    //     this.backBtn = document.getElementById("navback");
    //     if (this.backBtn) {
    //         // 记录起始位置和时间
    //         this.touchStartX = event.targetTouches[0].pageX;
    //         this.touchStartY = event.targetTouches[0].pageY;
    //         this.touchStartTime = Date.now();
    //     }
    // }

    // bodyTouchMove(event: TouchEvent) {
    //     if (this.backBtn && this.touchStartX < SCREEN_LEFT) {
    //         // 只监听单指划动，多指划动不作响应
    //         if (event.targetTouches.length > 1) {
    //             return;
    //         }
    //         // 实时计算distance
    //         const distance = event.targetTouches[0].pageX - this.touchStartX;
    //         // 根据distance在页面上做出反馈。这里演示通过返回按钮的背景变化作出反馈
    //         if (distance > POS_THRESHOLD && distance < 100) {
    //             this.backBtn.style.backgroundPosition =
    //                 ((distance - 100) / 100) * 50 + "px 0";
    //         } else if (distance >= 100) {
    //             this.backBtn.style.backgroundPosition = "0 0";
    //         } else {
    //             this.backBtn.style.backgroundPosition = "-50px 0";
    //         }
    //     }
    // }

    // bodyTouchEnd(event: TouchEvent) {
    //     if (this.backBtn && this.touchStartX < SCREEN_LEFT) {
    //         // 划动结束，重置数据
    //         this.backBtn.style.backgroundPosition = "-50px 0";

    //         const distanceX = event.targetTouches[0].pageX - this.touchStartX;
    //         const absDistanceX = Math.abs(distanceX);

    //         if (
    //             distanceX > 0 && // 向右滑
    //             Math.abs(event.targetTouches[0].pageY - this.touchStartY) <
    //                 POS_THRESHOLD * 4 && // 纵向位移不能太多
    //             absDistanceX > POS_THRESHOLD && // 横向位移要足够大
    //             absDistanceX / (Date.now() - this.touchStartTime) >
    //                 VELOCITY_THRESHOLD // 速率（标量）要够快
    //         ) {
    //             // 返回前修改样式，让过渡动画看起来更快
    //             document.getElementById("app2").classList.add("quickback");
    //             this.$router.back();
    //             this.quickBackTimer = window.setTimeout(() => {
    //                 this.quickBackTimer = null;
    //                 document
    //                     .getElementById("app2")
    //                     .classList.remove("quickback");
    //             }, 250);
    //         }
    //     }
    // }

    // beforeDestroy() {
    //     window.clearTimeout(this.quickBackTimer);
    //     this.quickBackTimer = null;
    //     window.clearTimeout(this.showDelayTimer);
    //     this.showDelayTimer = null;
    // }

    render() {
        return (
            <div
                id="app"
                class={style.appView}
                // onTouchstart={this.bodyTouchStart.bind(this)}
                // onTouchmove={this.bodyTouchMove.bind(this)}
                // onTouchend={this.bodyTouchEnd.bind(this)}
            >
                <FlexCoverWrap>
                    <transition name={this.direction}>
                        <div class={style.transWrap} key={this.$route.name}>
                            <router-view name="header" />
                            <div class={style.section}>
                                <div class={style.main}>
                                    <FlexCoverWrap>
                                        {this.show ? (
                                            <ScrollWrap
                                                class={style.scrollWrap}
                                                id="scroller"
                                                cover
                                                direction="ver"
                                            >
                                                <router-view />
                                            </ScrollWrap>
                                        ) : (
                                            <span />
                                        )}
                                    </FlexCoverWrap>
                                </div>
                            </div>
                        </div>
                    </transition>
                </FlexCoverWrap>
                <router-view name="tabBar" />
            </div>
        );
    }
}
