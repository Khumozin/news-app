let { exec } = require("child_process");
const os = require("os");

const isWindows = os.platform() === "win32";

const windowsCommand = `powershell -Command "& {git diff --staged --name-only --diff-filter=d | findstr /R '.*\\.ts$ .*\\.json$ .*\\.scss$ .*\\.html$' | ForEach-Object {npx prettier --write $_}; git add $(git diff --staged --name-only --diff-filter=d | findstr /R '.*\\.ts$ .*\\.json$ .*\\.scss$ .*\\.html$') }"`;
const unixCommand = `git diff --staged --name-only --diff-filter=d | grep -E '\\.(ts|json|scss|html)$' | xargs npx prettier --write && git add $(git diff --staged --name-only --diff-filter=d | grep -E '\\.(ts|json|scss|html)$')`;

const command = isWindows ? windowsCommand : unixCommand;

exec(command, (error, stdout, stderr) => {
  if (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
  if (stderr) {
    console.error(`stderr: ${stderr}`);
  }
  if (stdout) {
    console.log(`stdout: ${stdout}`);
  }
});
