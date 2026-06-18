const powerShellPool = require('../engine/powershellPool');
const common = require('./common');


// ✅ GET TEAMS
async function getTeams(username) {

    return common.safeExecute(async () => {

        common.logExecution(username, "Teams", "get");

        return await powerShellPool.execute(
            username,
            `Get-Teams`
        );
    });
}


// ✅ ADD USER TO TEAM
async function addUser(username, params) {

    return common.safeExecute(async () => {

        common.validateRequired(params, ['TeamId', 'UPN']);

        common.logExecution(username, "Teams", "addUser");

        return await powerShellPool.execute(
            username,
            `Add-TeamUser -TeamId "${params.TeamId}" -UPN "${params.UPN}"`
        );
    });
}


module.exports = {
    getTeams,
    addUser
};