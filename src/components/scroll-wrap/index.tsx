import { Component, Prop, Watch } from "vue-property-decorator";
import style from "./scroll-wrap.module.scss";
import * as Tsx from "vue-tsx-support";
import { Action, Getter } from "vuex-class";
import { Throttle } from "lodash-decorators";
import { Route } from "vue-router";
import { List } from "vant";
import { Vue } from "vue/types/vue";

interface ListProps {
    loading?: boolean;
    finished?: boolean;
    error?: boolean;
    offset?: number;
    loadingText?: string;
    finishedText?: string;
    errorText?: string;
    immediateCheck?: boolean;
    onLoad?: () => void;
    onLoadStatus?: (status: boolean) => void;
}

interface Props extends ListProps {
    direction?: "ver" | "hor" | "all";
    ref?: string;
    class?: string;
    hasTopGap?: boolean;
    cover?: boolean;
    scrollCatchMode?: "restore" | "save" | null;
    scrollName?: string;
}

const namespace = "global";

@Component({
    name: "scroll-wrap",
    components: {
        [List.name]: List
    }
})
export default class extends Tsx.Component<Props> {
    @Prop({ default: "all" }) readonly direction?: "ver" | "hor" | "all";
    @Prop({ default: false }) readonly hasTopGap?: boolean;
    @Prop({ default: false }) readonly cover?: boolean;
    @Prop({ default: "restore" })
    readonly scrollCatchMode?: "restore" | "save" | null;
    @Prop() readonly scrollName?: string;

    @Prop() loading?: boolean;
    @Prop() finished?: boolean;
    @Prop() error?: boolean;
    @Prop() offset?: number;
    @Prop() loadingText?: string;
    @Prop() finishedText?: string;
    @Prop() errorText?: string;
    @Prop({ default: false }) immediateCheck?: boolean;

    @Action("addStorage", { namespace })
    addStorage: any;
    @Getter("getScrollTop", { namespace })
    private getScrollTop: any;

    private createdScrollTop: boolean = false;
    mounted() {
        this.$nextTick(() => {
            if (this.direction === "hor") {
                return;
            }
            this.createScrollTop();
            const el = (this.$refs.scrollWrap as Vue).$el as HTMLElement;
            el.addEventListener("scroll", this.scrollHandle.bind(this));
            if (!this.isWechat()) {
                el.addEventListener(
                    "touchmove",
                    (evt: TouchEvent) => {
                        evt.stopPropagation();
                    },
                    { passive: false }
                );
                return;
            }
            let touchStartY = 0;
            el.addEventListener(
                "touchstart",
                (evt: TouchEvent) => {
                    touchStartY = evt.changedTouches[0].pageY;
                    const top = el.scrollTop;
                    if (top === 0) {
                        el.scrollTop = 1;
                    } else if (top + el.offsetHeight === el.scrollHeight) {
                        el.scrollTop = top - 1;
                    }
                },
                { passive: false }
            );
            el.addEventListener(
                "touchmove",
                (evt: TouchEvent) => {
                    if (
                        el.scrollTop <= 1 &&
                        evt.changedTouches[0].pageY > touchStartY
                    ) {
                        evt.preventDefault();
                    } else if (el.offsetHeight < el.scrollHeight) {
                        evt.stopPropagation();
                    }
                },
                { passive: false }
            );
        });
    }
    isWechat() {
        const ua = window.navigator.userAgent.toLowerCase();
        if (ua.search(/micromessenger/i) >= 0 || ua.search(/_sq_/i) >= 0) {
            return true;
        }
        return false;
    }
    beforeDestroy() {
        ((this.$refs.scrollWrap as Vue).$el as HTMLElement).removeEventListener(
            "scroll",
            this.scrollHandle.bind(this)
        );
    }

    @Watch("$route")
    onRouteChange(to: Route, from: Route) {
        if (to.path !== from.path) {
            window.setTimeout(this.createScrollTop.bind(this), 0);
        }
    }

    @Throttle(16)
    scrollHandle() {
        this.saveScrollTop();
    }

    createScrollTop() {
        if (!this.$route || !this.scrollCatchMode) {
            return;
        }
        if (this.scrollCatchMode === "restore") {
            ((this.$refs.scrollWrap as Vue)
                .$el as HTMLElement).scrollTop = this.getScrollTop(
                    this.$route.path,
                    this.scrollName
                );
            this.createdScrollTop = true;
        } else if (this.scrollCatchMode === "save") {
            ((this.$refs.scrollWrap as Vue).$el as HTMLElement).scrollTop = 0;
            this.createdScrollTop = true;
            this.saveScrollTop();
        }
    }

    saveScrollTop() {
        if (!this.$route || !this.scrollCatchMode || !this.createdScrollTop) {
            return;
        }
        this.addStorage({
            path: this.$route.path,
            name: this.scrollName,
            value: ((this.$refs.scrollWrap as Vue).$el as HTMLElement).scrollTop
        });
    }

    check() {
        (this.$refs.scrollWrap as Vue).check();
    }

    get overflowStyle() {
        return {
            overflowX: this.direction !== "ver" ? "auto" : "hidden",
            overflowY: this.direction !== "hor" ? "auto" : "hidden",
            minHeight: this.direction !== "hor" ? "100%" : "",
            height: this.direction !== "hor" && this.cover ? "100%" : ""
        };
    }

    render() {
        return (
            <van-list
                loading={this.loading}
                onInput={(e: boolean) => this.$emit("loadStatus", !!e)}
                finished={this.finished}
                error={this.error}
                offset={this.offset}
                loadingText={this.loadingText}
                finishedText={this.finishedText}
                errorText={this.errorText}
                immediateCheck={this.immediateCheck}
                ref="scrollWrap"
                class={[style.scrollWrap, this.hasTopGap && style.hasTopGap]}
                style={this.overflowStyle}
                onLoad={() => this.$emit("load")}
            >
                {this.hasTopGap && <div class={style.topGap} />}
                {Object.keys(this.$slots).reduce(
                    (arr, key) => arr.concat(this.$slots[key]),
                    []
                )}
            </van-list>
        );
    }
}
