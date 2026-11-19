const { spawn } = require('child_process');
const path = require('path');

console.log('[TEST] Starting Electron desktop launch test...');

const electronBin = path.join(__dirname, '..', 'node_modules', '.bin', 'electron.cmd');
const child = spawn(electronBin, ['.'], {
  cwd: path.join(__dirname, '..'),
  env: {
    ...process.env,
    ELECTRON_ENABLE_LOGGING: '1',
  },
  stdio: 'pipe',
  shell: true,
});

let serverStarted = false;
let backendStarted = false;
let urlLoaded = false;
let gpuCrashDetected = false;

child.stdout.on('data', (d) => {
  const str = d.toString();
  console.log('[ELECTRON OUT]', str.trim());
  if (str.includes('Embedded static UI server listening')) serverStarted = true;
  if (str.includes('Synapse Backend') || str.includes('listening on port 5000')) backendStarted = true;
  if (str.includes('Loading URL: http://127.0.0.1')) urlLoaded = true;
});

child.stderr.on('data', (d) => {
  const str = d.toString();
  console.log('[ELECTRON ERR]', str.trim());
  if (str.includes('GPU process exited unexpectedly')) gpuCrashDetected = true;
});

setTimeout(() => {
  console.log('\n--- VERIFICATION REPORT ---');
  console.log('1. Embedded Static Server Started:', serverStarted);
  console.log('2. Target URL Loaded:', urlLoaded);
  console.log('3. Backend Process Spawned:', backendStarted);
  console.log('4. GPU Crash Occurred:', gpuCrashDetected);

  child.kill();

  if (serverStarted && urlLoaded && !gpuCrashDetected) {
    console.log('\n[TEST SUCCESS] Electron desktop app launched cleanly without black screen!');
    process.exit(0);
  } else {
    console.error('\n[TEST FAILURE] Issues detected during launch.');
    process.exit(1);
  }
}, 6000);
