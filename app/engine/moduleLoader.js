const path = require('path');
const modulesRegistry = require('../config/modules');
const powerShellPool = require('./powershellPool');

class ModuleLoader {

    constructor() {
        this.modules = {};

        this.loadAllModules();
    }

    // ✅ LOAD ALL MODULES
    loadAllModules() {

        console.log("🔄 Loading modules...");

        Object.keys(modulesRegistry).forEach(moduleName => {

            try {
                const modulePath = path.join(__dirname, '..', 'modules', moduleName.toLowerCase() + '.js');

                this.modules[moduleName] = require(modulePath);

                console.log(`✅ Loaded module: ${moduleName}`);

            } catch (err) {

                console.warn(`⚠️ Failed to load module ${moduleName}: ${err.message}`);
            }
        });
    }


    // ✅ EXECUTE STANDARD COMMAND
    async execute(username, moduleName, action, params = {}) {

        const moduleConfig = modulesRegistry[moduleName];

        if (!moduleConfig) {
            throw new Error(`Module ${moduleName} not found`);
        }

        const commandName = moduleConfig.commands[action];

        if (!commandName) {
            throw new Error(`Action ${action} not defined in ${moduleName}`);
        }

        // ✅ BUILD PARAMETERS
        const paramString = this._buildParams(params);

        const fullCommand = `${commandName} ${paramString}`;

        console.log(`🚀 Executing: ${fullCommand}`);

        // ✅ EXECUTE USING PS POOL
        const result = await powerShellPool.execute(username, fullCommand);

        return result;
    }


    // ✅ BUILD PARAM STRING
    _buildParams(params) {

        return Object.entries(params)
            .map(([key, value]) => {

                if (value === null || value === undefined) return '';

                // Wrap string values
                if (typeof value === 'string') {
                    return `-${key} "${value}"`;
                }

                return `-${key} ${value}`;
            })
            .join(' ');
    }


    // ✅ GET AVAILABLE MODULES
    getModules() {
        return Object.keys(modulesRegistry);
    }


    // ✅ GET MODULE ACTIONS
    getModuleActions(moduleName) {

        const module = modulesRegistry[moduleName];

        if (!module) return [];

        return Object.keys(module.commands);
    }

}


// ✅ EXPORT SINGLETON
module.exports = new ModuleLoader();