const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

try {
  // Install dependencies
  console.log('Installing dependencies...');
  execSync('npm install', { stdio: 'inherit' });

  // Verify Vite installation
  const vitePath = path.join(process.cwd(), 'node_modules', 'vite');
  if (!fs.existsSync(vitePath)) {
    console.log('Vite not found, installing...');
    execSync('npm install vite --save-dev', { stdio: 'inherit' });
  }

  // Run the build
  console.log('Running build...');
  execSync('npm run build', { stdio: 'inherit' });

  console.log('Build completed successfully!');
} catch (error) {
  console.error('Build failed:', error);
  process.exit(1);
} 