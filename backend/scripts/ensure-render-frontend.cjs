const { execFileSync } = require('node:child_process');
const { existsSync, accessSync } = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '../..');
const homepage = path.join(root, 'dist', 'index.html');

// The Blueprint builds Vite before startup. Older Render services may still
// install and start only the backend package using their dashboard commands.
if (process.env.RENDER === 'true' && !existsSync(homepage)) {
  console.log('Render deployment is missing dist/index.html. Building the portfolio from the repository root.');
  const npm = process.env.npm_execpath;
  const options = { cwd: root, stdio: 'inherit' };
  execFileSync(process.execPath, [npm, '--prefix', root, 'ci', '--include=dev', '--no-audit', '--no-fund'], options);
  execFileSync(process.execPath, [npm, '--prefix', root, 'run', 'build'], options);
  accessSync(homepage);
}
