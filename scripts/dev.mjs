import { spawnSync } from 'node:child_process';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
// Next.js 15's dev overlay mistakes Node.js 25's localStorage for browser storage.
// Older Node.js versions do not expose Web Storage or accept this flag.
const nodeOptions = process.allowedNodeEnvironmentFlags.has('--no-experimental-webstorage')
  ? ['--no-experimental-webstorage']
  : [];

const result = spawnSync(
  process.execPath,
  [
    ...nodeOptions,
    require.resolve('next/dist/bin/next'),
    'dev',
    '--turbopack',
    ...process.argv.slice(2),
  ],
  { stdio: 'inherit' }
);

if (result.error) console.error(result.error);
process.exit(result.status ?? 1);
