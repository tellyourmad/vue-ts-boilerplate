// @ts-ignore;\
// decorators.js
import { createDecorator } from "vue-class-component";
import { Loading } from "vant";
import { Component, Vue, Watch } from "vue-property-decorator";

export const NoCache = createDecorator((options, key) => {
    // component options should be passed to the callback
    // and update for the options object affect the component
    console.log(options);
});

export const secondary = (
    target: Vue,
    name: string,
    descriptor: PropertyDescriptor
) => {
    let run = 1;
    const oldValue = descriptor.value;
    descriptor.value = function() {
        console.log("init", run);
        if (run && run % 2 === 0) {
            console.log(`Calling ${name} with`, target);
            run = 1;
            return oldValue.apply(this, arguments);
        }
        run++;
        return undefined;
    };
    return descriptor;
};
