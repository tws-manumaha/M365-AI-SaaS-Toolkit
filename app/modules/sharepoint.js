const powerShellPool = require('../engine/powershellPool');
const common = require('./common');


// ✅ GET SITES
async function getSites(username) {

    return common.safeExecute(async () => {

        common.logExecution(username, "SharePoint", "get");

        return await powerShellPool.execute(
            username,
            `Get-Sites`
        );
    });
}


// ✅ ADD USER TO SITE
async function addUser(username, params) {

    return common.safeExecute(async () => {

        common.validateRequired(params, ['SiteUrl', 'UPN']);

        common.logExecution(username, "SharePoint", "addUser");

        return await powerShellPool.execute(
            username,
            `Add-SiteUser -SiteUrl "${params.SiteUrl}" -UPN "${params.UPN}"`
        );
    });
}


module.exports = {
    getSites,
    addUser
};