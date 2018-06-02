// https://eslint.org/docs/user-guide/configuring

module.exports = {
    root: true,
    parserOptions: {
        parser: 'babel-eslint'
    },
    env: {
        browser: true,
    },
    extends: [
        // https://github.com/vuejs/eslint-plugin-vue#priority-a-essential-error-prevention
        // consider switching to `plugin:vue/strongly-recommended` or `plugin:vue/recommended` for stricter rules.
        'plugin:vue/essential',
        // https://github.com/standard/standard/blob/master/docs/RULES-en.md
        'standard'
    ],
    // required to lint *.vue files
    plugins: [
        'vue'
    ],
    // add your custom rules here
    rules: {
        // allow async-await
        'generator-star-spacing': 'off',
        // allow debugger during development
        'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
        // Allow only 4 spaces
        "indent": ["error", 4],
        // allow only ===
        "eqeqeq": ["error", "always", { "null": "ignore" }],
        // missing semicolons are always an error
        "semi": ["error", "always"],
        // disallow spaces between 'function' and the function name
        "space-before-function-paren": ["error", "never"],
        // allow alignment on variable declaration
        "no-multi-spaces": ["error", { "exceptions": { "VariableDeclarator": true, "AssignmentExpression": true } }],
        // allow alignment on values
        "key-spacing": ["error", { "align": { "beforeColon": true, "afterColon": true, "on": "colon" } }],
        // Don't allow spaces before blocks
        "space-before-blocks": ["error", "never"],
    }
}
