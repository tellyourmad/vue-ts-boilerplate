import { Vue, Component } from "vue-property-decorator";
import style from "./flex-cover-wrap.module.scss";

@Component({
    name: "FlexCoverWrap"
})
export default class extends Vue {
    render() {
        return (
            <div class={style.flexCoverWrap}>
                <div class={style.clearFlex}>
                    {Object.keys(this.$slots).reduce(
                        (arr, key) => arr.concat(this.$slots[key]),
                        []
                    )}
                </div>
            </div>
        );
    }
}
