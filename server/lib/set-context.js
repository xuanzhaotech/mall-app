const yaml = require('js-yaml');
const fs = require('fs');
const path = require('path');
const config = yaml.safeLoad(fs.readFileSync(path.join(__dirname, '../../config.yml')));
const isEmpty = require('lodash/isEmpty');
const axios = require('./vendor/axios');

/**
 * 基础上下文配置(静态)
 */
function appContextConfig(app) {
    let argv = process.argv.splice(2);
    let env = process.env.NODE_ENV = argv[0] !== 'production' ? 'development' : 'production';
    let appConfig = Object.assign({},
        config,
        config[env],
        {env: env},
        {urlLocalesRegExp: ''}
    );
    let locales = config.locales;
    //多语言前缀
    if (!isEmpty(locales)) {
        let regexp = '';
        for (let i = 0; i < locales.length; i++) {
            let item = locales[i];
            if (i === locales.length - 1) {
                regexp += `${item}`;
            }
            else {
                regexp += `${item}|`;
            }
        }
        if (regexp) {
            appConfig.urlLocalesRegExp = `(${regexp})*/`;
        }
    }
    delete appConfig['development'];
    delete appConfig['production'];



    for (let item in appConfig) {
        app.context[item] = appConfig[item];
    }


    wrapCommonToContext(app);
}


/**
 * 包上通用内容到上下文(可变) 比如axios ,某些utils方法....
 */
function wrapCommonToContext(app){
    app.context.axios = axios;
}


/**
 * 设置上下文
 */
module.exports.default = module.exports = async (app) => {
    appContextConfig(app);
    console.log('set-context initialized');
};
