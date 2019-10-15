module.exports = {
    presets: ["@vue/app"],
    plugins: ["vue-jsx-sync", "jsx-v-model", ["import", {
        libraryName: "vant",
        libraryDirectory: "es",
        style: true
    }, "vant"]]
};
