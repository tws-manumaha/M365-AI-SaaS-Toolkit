const powerShellPool = require('../engine/powershellPool');
const common = require('./common');


// ✅ GET LICENSES
async function getLicenses(username) {

    return common.safeExecute(async () => {

        common.logExecution(username, "Licensing", "get");

        return await powerShellPool.execute(
            username,
            `Get-License`
        );
    });
}


// ✅ ASSIGN LICENSE
async function assignLicense(username, params) {

    return common.safeExecute(async () => {

        common.validateRequired(params, ['User', 'Sku']);

        common.logExecution(username, "Licensing", "assign");

        return await powerShellPool.execute(
            username,
            `Assign-License -User "${params.User}" -Sku "${params.Sku}"`
        );
    });
}


module.exports = {
    getLicenses,
    assignLicense
};