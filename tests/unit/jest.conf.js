const path = require("path");

module.exports = {
    rootDir: process.cwd(), // 类似 webpack.context
    moduleNameMapper: {
        "^@/(.*)$": "<rootDir>/src/$1"
    },
    "setupFiles": [
        "jest-localstorage-mock"
    ],
    "moduleFileExtensions": [
        "js",
        "ts",
        "json",
        "vue"
    ],
    "transform": {
        ".*\\.(vue)$": "vue-jest",
        "^.+\\.tsx?$": "ts-jest"
    },
    testURL: "http://localhost/",
    testRegex: "(/__tests__/.*|(\\.|/)(test|spec))\\.(jsx?|tsx?)$",
    coverageDirectory: "<rootDir>/tests/unit/coverage", // 类似 webpack.output,
};
