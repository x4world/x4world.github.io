const config = require('../config');

function getDefaultConfig() {
    const configs = [];
    for (let key in config.siteConfigs) {
        configs.push({ key, value: config.siteConfigs[key] });
    }
    return configs;
}

module.exports = {
    define: table => {
        table.string('key', 30).primary();
        table.text('value');
    },
    initValue: getDefaultConfig()
};