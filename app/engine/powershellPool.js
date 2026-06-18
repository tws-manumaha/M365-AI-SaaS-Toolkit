const { spawn } = require('child_process');

class PowerShellPool {

    constructor() {
        this.sessions = {};
    }

    createSession(username) {

        if (this.sessions[username]) {
            return this.sessions[username];
        }

        console.log(`✅ Starting PowerShell for ${username}`);

        const ps = spawn('powershell.exe', [
            '-NoLogo',
            '-NoProfile',
            '-ExecutionPolicy', 'Bypass',
            '-Command', '-'
        ]);

        ps.stdout.setEncoding('utf8');
        ps.stderr.setEncoding('utf8');

        this.sessions[username] = {
            process: ps,
            busy: false,
            queue: []
        };

        // ✅ LOAD YOUR ORIGINAL TOOLKIT
        this._initializeSession(username);

        return this.sessions[username];
    }


    // ✅ ✅ ✅ CORRECT INTEGRATION
    _initializeSession(username) {

        const initScript = `
        Import-Module Microsoft.Graph;
        Import-Module ExchangeOnlineManagement;
        Import-Module MicrosoftTeams;

        # ✅ LOAD YOUR ORIGINAL MODULE FILES
        . ./modules/Users.ps1
        . ./modules/Licensing.ps1
        . ./modules/Groups.ps1
        . ./modules/Exchange.ps1
        . ./modules/Teams.ps1
        . ./modules/SharePoint.ps1

        Write-Output "SESSION_READY";
        `;

        this._write(username, initScript);
    }


    execute(username, command) {

        return new Promise((resolve, reject) => {

            const session = this.sessions[username] || this.createSession(username);

            const job = { command, resolve, reject };

            if (session.busy) {
                session.queue.push(job);
            } else {
                this._run(username, job);
            }
        });
    }


    _run(username, job) {

        const session = this.sessions[username];
        session.busy = true;

        let output = "";

        const onData = (data) => output += data;

        session.process.stdout.on('data', onData);
        session.process.stderr.on('data', onData);

        const cmd = `${job.command} \n Write-Output "END_CMD"\n`;

        session.process.stdin.write(cmd);

        const timer = setInterval(() => {

            if (output.includes("END_CMD")) {

                clearInterval(timer);

                output = output.replace("END_CMD", "").trim();

                session.process.stdout.removeListener('data', onData);
                session.process.stderr.removeListener('data', onData);

                job.resolve(output);

                session.busy = false;

                if (session.queue.length > 0) {
                    const next = session.queue.shift();
                    this._run(username, next);
                }
            }

        }, 100);
    }


    _write(username, script) {

        const session = this.sessions[username];

        session.process.stdin.write(script + "\n");
    }


    destroySession(username) {

        const s = this.sessions[username];

        if (s) {
            s.process.kill();
            delete this.sessions[username];
        }
    }


    destroyAll() {

        Object.keys(this.sessions).forEach(u => this.destroySession(u));
    }
}

module.exports = new PowerShellPool();