const { execSync } = require('child_process')
execSync('npx ts-node --compiler-options {"module":"CommonJS"} prisma/seed.ts', {
  stdio: 'inherit',
  cwd: __dirname,
  shell: true
})
