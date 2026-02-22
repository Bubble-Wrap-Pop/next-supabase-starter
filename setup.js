const { execSync } = require('child_process');

function run(command) {
  try {
    console.log(`Running: ${command}`);
    execSync(command, { stdio: 'inherit' });
  } catch (error) {
    console.error(`Failed to execute: ${command}`);
    process.exit(1);
  }
}

console.log('Starting Project Setup...');

run('npm install');

console.log('Starting Supabase... This might take a minute.');
run('npx supabase start');

console.log('Setup Complete!');
console.log('You can now run "npm run dev" to start your Next.js server.');