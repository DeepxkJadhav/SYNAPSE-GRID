const { spawn } = require('child_process');
const path = require('path');

console.log('[RUNNER] Launching Native Electron Desktop App with SYNAPSE_CAPTURE_MODE=1...');

const electronBin = path.join(__dirname, '..', 'node_modules', '.bin', 'electron.cmd');
const child = spawn(electronBin, ['.'], {
  cwd: path.join(__dirname, '..'),
  env: {
    ...process.env,
    SYNAPSE_CAPTURE_MODE: '1',
    ELECTRON_ENABLE_LOGGING: '1',
  },
  stdio: 'inherit',
  shell: true,
});

child.on('exit', (code) => {
  console.log(`[RUNNER] Native Electron app exited with code ${code}.`);
  process.exit(code || 0);
});
