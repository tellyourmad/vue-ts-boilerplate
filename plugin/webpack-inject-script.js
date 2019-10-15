class InjectScriptPlugin {
    /**
     *
     * @param options object
     *      path    string              所要注入的script
     *      paths   array               所要注入的script的src集合
     *      target  'head'|'body'       注入的标签位置（在head中注入还是在body中）
     *      inject  'before'|'after'    注入的位置（在其他asset之前还是之后）
     *
     */
    constructor(options) {
        this.options = options;
    }
    apply(compiler) {
        const { path, paths = [], target = "head", inject = "before" } = this.options;
        compiler.hooks.compilation.tap("webpack-inject-script", compilation => {
            compilation.hooks.htmlWebpackPluginAlterAssetTags.tapAsync(
                "webpack-inject-script",
                async (data, cb) => {
                    data[target][inject === "before" ? "unshift" : "push"]({
                        tagName: "script",
                        closeTag: true,
                        attributes: {
                            src: path
                        }
                    });
                    for (const path of paths) {
                        data[target][inject === "before" ? "unshift" : "push"]({
                            tagName: "script",
                            closeTag: true,
                            attributes: {
                                src: path
                            }
                        });
                    }

                    cb();
                }
            );
        });
    }
}

module.exports = InjectScriptPlugin;
