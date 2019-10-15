const path = require("path");
const webpack = require("webpack");

const package = require("./package.json");

const InjectScriptPlugin = require("./plugin/webpack-inject-script");

const postcssConfig = {
    selectorBlackList: [/^html$/, /^body$/],
    propList: ["*"],
    replace: true,
    minPixelValue: 1.01,
    mediaQuery: false,
    unitPrecision: 5
};

module.exports = {
    publicPath: "./",
    outputDir: "www",
    productionSourceMap: false,
    chainWebpack(config) {
        config
            .plugin("define")
            .tap(args => {
                args[0]["process.env"]["VERSION"] = JSON.stringify(package.version);
                return args;
            })
            .end()
            .plugin("webpack-inject-script")
            .use(
                new InjectScriptPlugin({
                    target: "head",
                    inject: "before",
                    path:
                        process.env.PLATFORM === "app"
                            ? "cordova.js"
                            : "http://res.wx.qq.com/open/js/jweixin-1.4.0.js"
                })
            );
        // config.resolve.alias.set("src", path.resolve(__dirname, "src"));
        // 热重载
        if (process.env.NODE_ENV !== "production") {
            config.module
                .rule("tsx")
                .test(/\.tsx$/)
                .use("vue-jsx-hot-loader")
                .before("babel-loader")
                .loader("vue-jsx-hot-loader");
        }

        // bundle-analyzer
        if (process.env.npm_config_report) {
            config
                .plugin("webpack-bundle-analyzer")
                .use(require("webpack-bundle-analyzer").BundleAnalyzerPlugin);
        }

        // 忽略提示
        // ignoreCssWarnings(config);
        // css to typings-for-css-modules-loader
        ["css", "less", "scss", "sass", "stylus", "postcss"].forEach(rule => {
            // rules for *.module.* files
            config.module
                .rule(rule)
                .oneOf("normal-modules")
                .uses.get("css-loader")
                .set("loader", "typings-for-css-modules-loader");
        });
    },
    css: {
        loaderOptions: {
            postcss: {
                plugins: [
                    require("autoprefixer")({
                        browsers: ["Android >= 4.0", "iOS >= 7"]
                    }),

                    // 先对非vant的样式以75为rootValue进行转化
                    require("postcss-pxtorem")({
                        ...postcssConfig,
                        rootValue: 75,
                        selectorBlackList: [
                            "van-",
                            ...postcssConfig.selectorBlackList
                        ]
                    }),

                    // 再对剩下未转化的样式以37.5为rootValue进行转化
                    require("postcss-pxtorem")({
                        ...postcssConfig,
                        rootValue: 37.5
                    })
                ]
            },
            css: {
                namedExport: true,
                camelCase: true,
                localIdentName:
                    process.env.NODE_ENV !== "production"
                        ? "[local]-[hash:base64:5]"
                        : "[hash:base64:5]"
            },
            sass: {
                // @/ 是 src/ 的别名
                // 所以这里假设你有 `src/base-style/variables.scss` 这个文件
                data: `@import "@/base-styles/variables.scss";`
            }
        }
    },
    devServer: {
        proxy: {
            "/api": {
                target: "http://localhost:3000",
                changeOrigin: true,
                secure: false,
                pathRewrite: {
                    "^/api": "/"
                }
            }
        }
    },
    parallel: require("os").cpus().length > 1
};
