module.exports = {
    apps: [
        {
            name: "m365-platform",

            script: "./app/server.js",

            instances: "max", // ✅ use all CPU cores

            exec_mode: "cluster", // ✅ better performance

            watch: false, // ✅ disable in production

            max_memory_restart: "300M",

            env: {
                NODE_ENV: "development",
                PORT: 3000
            },

            env_production: {
                NODE_ENV: "production",
                PORT: 3000
            },

            error_file: "./logs/pm2-error.log",
            out_file: "./logs/pm2-out.log",

            log_date_format: "YYYY-MM-DD HH:mm:ss"
        }
    ]
};