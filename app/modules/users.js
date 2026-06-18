const powerShellPool = require('../engine/powershellPool');
const common = require('./common');


async function getAllUsers(username) {

    return common.safeExecute(async () => {

        return await powerShellPool.execute(username, `Get-M365Users`);
    });
}


async function disableUser(username, params) {

    return common.safeExecute(async () => {

        common.validateRequired(params, ['UPN']);

        return await powerShellPool.execute(
            username,
            `Disable-M365User -UPN "${params.UPN}"`
        );
    });
}


async function createUser(username, params) {

    return common.safeExecute(async () => {

        common.validateRequired(params, ['Name', 'UPN', 'Password']);

        return await powerShellPool.execute(
            username,
            `New-M365User -Name "${params.Name}" -UPN "${params.UPN}" -Password "${params.Password}"`
        );
    });
}


async function enableUser(username, params) {

    return common.safeExecute(async () => {

        return await powerShellPool.execute(
            username,
            `Enable-M365User -UPN "${params.UPN}"`
        );
    });
}


module.exports = {
    getAllUsers,
    disableUser,
    createUser,
    enableUser
};