const powerShellPool = require('../engine/powershellPool');
const common = require('./common');


// ✅ GET MAILBOXES
async function getMailboxes(username) {

    return common.safeExecute(async () => {

        common.logExecution(username, "Exchange", "getMailboxes");

        return await powerShellPool.execute(
            username,
            `Get-Mailboxes`
        );
    });
}


// ✅ ENABLE MAILBOX
async function enableMailbox(username, params) {

    return common.safeExecute(async () => {

        common.validateRequired(params, ['UPN']);

        common.logExecution(username, "Exchange", "enableMailbox");

        return await powerShellPool.execute(
            username,
            `Enable-Mailbox -UPN "${params.UPN}"`
        );
    });
}


module.exports = {
    getMailboxes,
    enableMailbox
};