#!/usr/bin/env node
const { execSync } = require('child_process');
console.log('⚡ Running Vite build via webpack alias shim...');
try {
  execSync('npm run build', { stdio: 'inherit' });
  process.exit(0);
} catch (e) {
  process.exit(e.status || 1);
}
