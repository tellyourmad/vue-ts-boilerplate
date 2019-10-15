import { Component, Vue, Prop } from "vue-property-decorator";
import { Tabbar, TabbarItem } from "vant";
import { RenderContext } from "vue";
import * as style from "./tab-bar.module.scss";
import * as Tsx from "vue-tsx-support";
interface IActive {
    active: boolean;
}

interface ILink {
    name?: string;
    params?: object;
}

interface ITabbarItem {
    name: string;
    icon: string;
    link?: ILink;
}

@Component({
    components: {
        [Tabbar.name]: Tabbar,
        [TabbarItem.name]: TabbarItem
    }
})
export default class MyTabbar extends Vue {
    public active: number = 0;
    public tabbarList: ITabbarItem[] = [
        { name: "首页", icon: "home", link: { name: "home" } },
        { name: "我的", icon: "mine", link: { name: "user" } }
    ];

    created() {
        this.active = this.tabbarList.findIndex(
            item => item.link.name === this.$route.name
        );
    }
    protected render() {
        const home = "首页";
        return (
            <van-tabbar fixed={false} v-model={this.active} active-color="#f44">
                {/* slot-scope在jsx中是以如下的方式进行访问的 */}
                {/* scopedSlots =  slot-scope="props" */}
                {this.tabbarList.map(({ name, icon, link }) => (
                    <van-tabbar-item
                        to={link}
                        {...{
                            scopedSlots: {
                                default: (props: IActive) => {
                                    return (
                                        <div class={style.tabItem}>
                                            <icon-svg
                                                class={style.iconSvg}
                                                icon-class={icon}
                                                active={props.active}
                                            />
                                            <div>{name}</div>
                                        </div>
                                    );
                                }
                            }
                        }}
                    />
                ))}
            </van-tabbar>
        );
    }
}

/**
 *
 * @param ctx
 * @constructor
 */
const Text = (ctx: RenderContext): JSX.Element => {
    /*
     * 从 vue@2.6 开始，在 functional component 中，
     * 可以直接通过 RenderContext.scopedSlots 属性，获取所有的 scoped slots 数据
     */
    {
        /*
                 // @ts-ignore*/
    }
    return (
        <div>
            {ctx.scopedSlots.text ? ctx.scopedSlots.text({ msg: "123" }) : null}
        </div>
    );
};
