import * as Tsx from "vue-tsx-support";
import { Component, Prop } from "vue-property-decorator";
import * as style from "./icon-svg.module.scss";
interface Props {
  iconClass: string;
  active?: boolean;
}

@Component({
  name: "IconSvg"
})
export default class IconSvg extends Tsx.Component<Props> {
  @Prop()
  iconClass!: string;
  @Prop()
  active?: boolean;
  get iconName() {
    if (typeof this.active === "boolean") {
      if (this.active) {
        return `#WebApp-${this.iconClass}-active`;
      } else {
        return `#WebApp-${this.iconClass}-inactive`;
      }
    }
    return `#WebApp-${this.iconClass}`;
  }
  render() {
    return (
      <div>
        <svg class={style.icon} aria-hidden="true">
          <use xlinkHref={this.iconName} />
        </svg>
      </div>
    );
  }
}
