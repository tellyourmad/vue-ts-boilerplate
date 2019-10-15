import { Vue, Component } from "vue-property-decorator";
import { Row, Col, Icon, Cell, CellGroup, Tabbar, TabbarItem } from "vant";
import { Getter, Action } from "vuex-class";

import style from "./user.module.scss";

const icons = [
    { name: "待付款", icon: "ziyuan" },
    { name: "待发货", icon: "ziyuan1" },
    { name: "待收货", icon: "ziyuan4" },
    { name: "待评价", icon: "ziyuan2" },
    { name: "已取消", icon: "tuihuoshouhou" }
];
const cells = [
    { id: 1, name: "我的钱包", icon: "gold-coin-o", link: "" },
    { id: 2, name: "地址管理", icon: "location-o", link: "address" },
    { id: 3, name: "我的卡券", icon: "coupon-o", link: "coupon" },
    { id: 4, name: "设置", icon: "setting-o", link: "setting" }
];
const namespace = "user";
@Component({
    components: {
        [Row.name]: Row,
        [Col.name]: Col,
        [Icon.name]: Icon,
        [Cell.name]: Cell,
        [CellGroup.name]: CellGroup,
        [Tabbar.name]: Tabbar,
        [TabbarItem.name]: TabbarItem
    }
})
export default class extends Vue {
    @Getter("getIconCounts", { namespace }) getIconCounts: [];
    @Action("getIconsNumber", { namespace }) getIconsNumber: () => void;
    created() {
        this.getIconsNumber();
    }
    createTabItem() {
        return icons.map((item, index) => {
            return (
                <van-tabbar-item
                    class={style.userTab}
                    info={
                        this.getIconCounts[index]
                            ? this.getIconCounts[index]
                            : null
                    }
                >
                    <span
                        slot="icon"
                        class={[`WebApp WebApp-${item.icon}`, style.userIcon]}
                    />
                    <span style={{ color: "#434343" }}>{item.name}</span>
                </van-tabbar-item>
            );
        });
    }
    render() {
        return (
            <div class={style.wrap}>

                <van-row>
                    <van-tabbar class={style.userLinks} fixed={false}>
                        {this.createTabItem()}
                    </van-tabbar>
                </van-row>

                <van-cell-group style={{ marginTop: "10px" }}>
                    {cells.map(cell => {
                        return (
                            <van-cell
                                key={cell.id}
                                icon={cell.icon}
                                size="large"
                                title={cell.name}
                                is-link
                                center
                                onClick={() => {
                                    this.$router.push(cell.link);
                                }}
                            />
                        );
                    })}
                </van-cell-group>
            </div>
        );
    }
}
