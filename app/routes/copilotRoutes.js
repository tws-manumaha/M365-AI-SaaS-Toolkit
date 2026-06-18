const express = require('express');
const router = express.Router();

const powerShellPool = require('../engine/powershellPool');
const { authenticate } = require('../middleware/authMiddleware');

// ✅ IN-MEMORY SESSION STATE (per user)
let aiState = {};


// ✅ STEP 1 — USER INPUT
router.post('/ask', authenticate, async (req, res) => {

    const input = req.body.prompt.toLowerCase();
    const user = req.user.username;

    aiState[user] = aiState[user] || {};

    let reasoning = [];

    // ✅ INTENT: DISABLE USER
    if (input.includes("disable user")) {

        const name = input.split("disable user")[1]?.trim();

        reasoning.push(`Searching users matching: ${name}`);

        // ✅ FETCH USERS
        const result = await powerShellPool.execute(
            user,
            `Get-M365Users | Where {$_.DisplayName -like "*${name}*"} | Select DisplayName,UserPrincipalName`
        );

        aiState[user] = {
            step: "selectUser",
            lastQuery: name,
            lastResults: result
        };

        return res.json({
            message: "⚠️ Multiple matches possible. Select user from list:",
            data: result,
            reasoning
        });
    }


    // ✅ SIMPLE GET USERS
    if (input.includes("get users")) {

        return res.json({
            message: "✅ Ready to execute Get-M365Users. Confirm?",
            command: "Get-M365Users",
            reasoning: ["Direct command mapping"]
        });
    }


    return res.json({
        message: "❌ Could not understand",
        reasoning
    });
});


// ✅ STEP 2 — USER SELECTION
router.post('/select', authenticate, async (req, res) => {

    const user = req.user.username;
    const choice = req.body.choice;

    const state = aiState[user];

    if (!state || state.step !== "selectUser") {
        return res.json({ message: "❌ No pending selection" });
    }

    const selectedUPN = choice;

    state.selectedUPN = selectedUPN;
    state.step = "confirmDisable";

    return res.json({
        message: `✅ Selected ${selectedUPN}. Confirm disable? (YES)`,
    });
});


// ✅ STEP 3 — CONFIRM
router.post('/confirm', authenticate, async (req, res) => {

    const user = req.user.username;
    const state = aiState[user];

    if (!state || state.step !== "confirmDisable") {
        return res.json({ message: "❌ Nothing to confirm" });
    }

    if (req.body.confirm !== "YES") {
        aiState[user] = null;
        return res.json({ message: "❌ Action cancelled" });
    }

    const upn = state.selectedUPN;

    const output = await powerShellPool.execute(
        user,
        `Disable-M365User -UPN "${upn}"`
    );

    aiState[user] = null;

    return res.json({
        message: "✅ User disabled",
        output
    });
});


// ✅ OPTIONAL DIRECT EXECUTION (SAFE)
router.post('/execute', authenticate, async (req, res) => {

    const user = req.user.username;
    const cmd = req.body.command;

    const output = await powerShellPool.execute(user, cmd);

    res.json({ output });
});


module.exports = router;