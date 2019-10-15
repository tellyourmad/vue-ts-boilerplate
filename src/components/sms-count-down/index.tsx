import * as Tsx from "vue-tsx-support";
import { Component, Prop, Watch } from "vue-property-decorator";
import * as style from "./sms-count-down.module.scss";

interface Prop {
    countDown: number;
    text: string;
    onSend?: (e: boolean) => void;
}
@Component({
    name: "smsCountDown"
})
export default class extends Tsx.Component<Prop> {
    @Prop({ default: "获取验证码" }) private text: string;
    @Prop({ default: 0 }) private countDown: number;
    private hasSent: boolean = false;
    handleRenderCountDown(countDown: number = 0, text: string, hasSent: boolean) {
        if (countDown > 0) {
            return (
                <span class={style.authCode} onClick={() => this.onSend}>
                    剩余时间{countDown}秒
                </span>
            );
        }
        if (!hasSent) {
            return <span class={style.authCode}>{{ text }}</span>;
        } else {
            return (
                <span class={style.authCode} onClick={() => this.onSend}>
                    重新发送
                </span>
            );
        }
    }
    protected render() {
        return this.handleRenderCountDown(this.countDown, this.text, this.hasSent);
    }
}
