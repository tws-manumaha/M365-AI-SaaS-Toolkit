const moduleRegistry = require('../config/modules');

// ✅ BUILD STANDARD COMMAND
function buildCommand(moduleName, action, params = {}) {

    const module = moduleRegistry[moduleName];

    if (!module) {
        throw new Error(`Module not found: ${moduleName}`);
    }

    const command = module.commands[action];

    if (!command) {
        throw new Error(`Action not found: ${action} in ${moduleName}`);
    }

    const paramString = Object.entries(params)
        .map(([key, value]) => {

            if (value === null || value === undefined) return '';

            if (typeof value === 'string') {
                return `-${key} "${value}"`;
            }

            return `-${key} ${value}`;
        })
        .join(' ');

    return `${command} ${paramString}`;
}


// ✅ VALIDATE REQUIRED FIELDS
function validateRequired(params = {}, requiredFields = []) {

    const missing = requiredFields.filter(field => !params[field]);

    if (missing.length > 0) {
        throw new Error(`Missing required fields: ${missing.join(', ')}`);
    }

    return true;
}


// ✅ STANDARD RESPONSE FORMAT
function formatResponse(success, data, message = '') {

    return {
        success,
        message,
        data
    };
}


// ✅ LOGGING WRAPPER
function logExecution(user, module, action) {

    console.log(`📌 User: ${user} | Module: ${module} | Action: ${action}`);
}


// ✅ ERROR HANDLER
function handleError(error) {

    console.error(`❌ Error: ${error.message}`);

    return formatResponse(false, null, error.message);
}


// ✅ SAFE EXECUTION WRAPPER
async function safeExecute(fn) {

    try {
        const result = await fn();
        return formatResponse(true, result, '✅ Success');

    } catch (error) {
        return handleError(error);
    }
}


// ✅ EXPORT
module.exports = {
    buildCommand,
    validateRequired,
    formatResponse,
    logExecution,
    handleError,
    safeExecute
};
