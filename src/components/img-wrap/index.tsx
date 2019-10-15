import * as Tsx from "vue-tsx-support";
import { Component, Prop, Watch } from "vue-property-decorator";
import * as style from "./img-wrap.module.scss";


interface Props extends Tsx.AllHTMLAttributes {
    oss?: boolean;
    src: string;
    alt?: string;
    placeholder?: any;
    respW?: number;
    respH?: number | "auto";
    onClick?: (e: Event) => void;
}

@Component({
    name: "ImageWrap"
})
export default class extends Tsx.Component<Props> {
    /****** Prop ******/
    @Prop({ default: true }) readonly oss?: boolean; // 是否使用OSS
    @Prop() readonly src!: string; // 图片src
    @Prop() readonly alt?: string; // 原生alt属性
    @Prop() placeholder?: any; // 占位图
    @Prop({ default: 750 }) readonly respW?: number; // DOM已知宽度，为设计稿中DOM的宽度
    @Prop({ default: 750 }) readonly respH?: number | "auto"; // DOM已知高度，为设计稿中DOM的高度，若高度未知（即需要通过目标图片的宽高比决定）则填写auto

    /****** Data ******/
    private imgInfo: { width: number; height: number } = {
        width: 0,
        height: 0
    }; // 存放图片真实尺寸（非DOM的尺寸）
    private haventSee: boolean = true; // DOM是否从来没有在可视区域内（从未看到过）
    private imgStatus: number = 0; // 图片加载状态    // 0:pending(default);1:success;-1:error
    private isIntersecting: boolean = false; // DOM是否在可视区域内（是否看得到）

    mounted() {
        this.$nextTick(() => {
            const observer = new IntersectionObserver(
                entries => {
                    this.isIntersecting = entries[0].isIntersecting;
                },
                {
                    root: null
                }
            );
            observer.observe(this.$refs.lazyImg as HTMLElement);
        });
    }

    /* EventHandle 图片加载失败 */
    listenError() {
        this.imgStatus = -1;
    }

    /* EventHandle 图片加载成功 */
    listenLoad(e: Event) {
        this.imgStatus = 1;
        const img = e.target as HTMLImageElement;
        if (img.naturalWidth) {
            this.imgInfo = {
                width: img.naturalWidth,
                height: img.naturalHeight
            };
        } else {
            const image = new Image() as HTMLImageElement;
            image.src = img.src;
            image.onload = () => {
                this.imgInfo = {
                    width: image.width,
                    height: image.height
                };
            };
        }
    }

    /* EventHandle 处理click并推送event */
    clickEvent(e: Event) {
        this.$emit("click", e);
    }

    /* 监听DOM可视情况的变化 */
    @Watch("isIntersecting")
    onIntersectingChange(newValue: boolean) {
        if (newValue) {
            this.haventSee = false;
        }
    }

    /* 状态码转化为className */
    get statusStyle() {
        if (!this.src) {
            return style.empty;
        }
        switch (+this.imgStatus) {
            case 0:
                return style.pending;
            case -1:
                return style.error;
            case 1:
                return style.succ;
            default:
                return style.empty;
        }
    }

    /* 计算矩形宽高比 */
    get calcAspectRatio(): { paddingTop: string; marginTop: string } {
        let ratio: number = 0;
        if (typeof this.respH === "number") {
            ratio = 100 / (this.respW / this.respH);
        } else {
            /*目前使用此方式，后面使用其它途径计算*/
            const { width, height } = this.imgInfo;
            if (width > 0 && height > 0) {
                ratio = (height / width) * 100;
            }
        }
        return {
            paddingTop: ratio + "%",
            marginTop: "-" + ratio + "%"
        };
    }

    /* 计算图片DOM在页面中实际尺寸（用于OSS压缩）（包含dpr） */
    calcImgSize() {
        const { innerWidth, devicePixelRatio = 1 } = window;
        return {
            width: Math.round(
                devicePixelRatio * innerWidth * (this.respW / 750)
            ),
            height:
                typeof this.respH === "number"
                    ? Math.round(
                          devicePixelRatio * innerWidth * (this.respH / 750)
                      )
                    : undefined
        };
    }

    /* OSS压缩处理 */
    get manageSrc(): string {
        if (!this.oss) {
            // 不使用OSS
            return this.src;
        }
        const { width, height } = this.calcImgSize();
        const array = [];
        array.push(`${this.src}?x-oss-process=image/resize`);
        if (width) {
            array.push(`w_${width}`);
        }
        if (height) {
            array.push(`h_${height}`);
        }
        array.push("m_fill");
        return array.join(",");
    }

    render() {
        return (
            <div
                onClick={this.clickEvent.bind(this)}
                ref="lazyImg"
                class={[style.imageWrap, this.statusStyle]}
            >
                <div
                    class={style.frame}
                    style={{ paddingTop: this.calcAspectRatio.paddingTop }}
                >
                    <div
                        style={{ paddingTop: this.calcAspectRatio.marginTop }}
                    />
                </div>
                <div class={style.content}>
                    <img
                        src={this.placeholder}
                        class={[style.image, style.placeholder]}
                    />
                    {(this.isIntersecting || !this.haventSee) && (
                        <img
                            src={this.manageSrc}
                            class={[style.image, style.trueImg]}
                            onError={this.listenError.bind(this)}
                            onLoad={this.listenLoad.bind(this)}
                            alt={this.alt}
                        />
                    )}

                    <div class={style.loading}>{/*加载效果，后面加上*/}</div>

                    <span class={style.errorIcon}>&#xe105;</span>
                </div>
            </div>
        );
    }
}
