const fs = require('fs');
const path = require('path');

const tsConfigPath = path.resolve(__dirname, '..', 'next.config.ts');

if (fs.existsSync(tsConfigPath)) {
  try {
    fs.rmSync(tsConfigPath);
    console.log('Removed unsupported next.config.ts file before build.');
  } catch (error) {
    console.error('Failed to remove next.config.ts. Please delete it manually.', error);
    process.exitCode = 1;
  }
} else {
  console.log('No next.config.ts file detected.');
}
