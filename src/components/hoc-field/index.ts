/** field-hoc 功能待完善 */
import { Field } from "vant";
import { CreateElement, Component } from "vue";

const HocField = (component: Component) => {
    return {
        name: "van-field",
        data() {
            return {
                errorMessage: ""
            };
        },
        props: {
            rules: Array,
            value: String
        },
        methods: {
            onValidateValue(value: any, rule: any[]) {
                const checks: any = {
                    require: !!value,
                    length: value.length === rule[1]
                };
                return checks[rule[0]];
            },
            onBlurCallback() {
                if (!this.rules || this.rules.length === 0) {
                    this.$listeners.blur && this.$listeners.blur.call(null);
                    return;
                }
                for (const rule of this.rules) {
                    if (typeof rule[0] === "function") {
                        this.errorMessage = rule[0].call(null, this.value);
                    } else {
                        this.errorMessage = this.onValidateValue(
                            this.value,
                            rule
                        )
                            ? ""
                            : rule.slice(-1)[0];
                        if (this.errorMessage) {
                            // break loop
                            break;
                        }
                    }
                }
                // 无错误信息执行原本 blur
                !this.errorMessage &&
                    this.$listeners.blur &&
                    this.$listeners.blur.call(null);
            }
        },
        render(h: CreateElement) {
            // 将 this.$slots 格式化为数组，因为 h 函数第三个参数是子节点，是一个数组
            const slots = Object.keys(this.$slots)
                .reduce((arr, key) => arr.concat(this.$slots[key]), [])
                // 手动更正 context
                .map(vnode => {
                    vnode.context = this._self;
                    return vnode;
                });
            return h(
                component,
                {
                    on: { ...this.$listeners, blur: this.onBlurCallback },
                    attrs: { ...this.$attrs },
                    props: { ...this.$props, errorMessage: this.errorMessage }
                },
                slots
            );
        }
    };
};

export default HocField(Field);
