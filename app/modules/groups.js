const powerShellPool = require('../engine/powershellPool');
const common = require('./common');


// ✅ GET GROUPS
async function getGroups(username) {

    return common.safeExecute(async () => {

        common.logExecution(username, "Groups", "get");

        return await powerShellPool.execute(
            username,
            `Get-Groups`
        );
    });
}


// ✅ ADD MEMBER
async function addMember(username, params) {

    return common.safeExecute(async () => {

        common.validateRequired(params, ['GroupId', 'UPN']);

        common.logExecution(username, "Groups", "addMember");

        return await powerShellPool.execute(
            username,
            `Add-GroupMember -GroupId "${params.GroupId}" -UPN "${params.UPN}"`
        );
    });
}


module.exports = {
    getGroups,
    addMember
};