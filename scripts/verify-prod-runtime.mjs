import { spawn } from 'node:child_process';
import { createServer } from 'node:net';

const host = process.env.PROD_VERIFY_HOST ?? '127.0.0.1';
const port = process.env.PROD_VERIFY_PORT ?? '4000';
const baseUrl = `http://${host}:${port}`;

let server;
let stoppingServer = false;

function run(command, args, options = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      cwd: process.cwd(),
      env: { ...process.env, ...options.env },
      stdio: options.stdio ?? 'inherit',
    });

    child.on('error', reject);
    child.on('exit', (code, signal) => {
      if (code === 0) {
        resolve();
        return;
      }

      reject(new Error(`${command} ${args.join(' ')} exited with ${signal ?? code}`));
    });
  });
}

async function waitForServer() {
  const deadline = Date.now() + 30_000;
  let lastError = 'server did not respond';

  while (Date.now() < deadline) {
    try {
      const response = await fetch(`${baseUrl}/api/health`, {
        signal: AbortSignal.timeout(1000),
      });

      if (response.ok) return;
      lastError = `health returned ${response.status}`;
    } catch (error) {
      lastError = error instanceof Error ? error.message : String(error);
    }

    await new Promise((resolve) => setTimeout(resolve, 500));
  }

  throw new Error(`Timed out waiting for ${baseUrl}: ${lastError}`);
}

async function assertNoExistingServer() {
  try {
    const response = await fetch(`${baseUrl}/api/health`, {
      signal: AbortSignal.timeout(500),
    });

    if (response.ok) {
      throw new Error(`${baseUrl} is already serving the app. Stop the running app before verify:prod-runtime.`);
    }
  } catch (error) {
    if (error instanceof Error && error.message.includes('already serving the app')) {
      throw error;
    }
  }
}

function assertPortAvailable() {
  return new Promise((resolve, reject) => {
    const probe = createServer();

    probe.once('error', (error) => {
      if ('code' in error && error.code === 'EADDRINUSE') {
        reject(new Error(`${host}:${port} is already in use. Stop the running app before verify:prod-runtime.`));
        return;
      }

      reject(error);
    });

    probe.once('listening', () => {
      probe.close(resolve);
    });

    probe.listen(Number(port), host);
  });
}

function startServer() {
  server = spawn('corepack', [
    'pnpm',
    '--dir',
    'web',
    'exec',
    'next',
    'start',
    '--hostname',
    host,
    '--port',
    port,
  ], {
    cwd: process.cwd(),
    env: process.env,
    stdio: 'inherit',
  });

  server.on('exit', (code, signal) => {
    if (stoppingServer) return;

    if (code !== null && code !== 0) {
      console.error(`Production server exited early with ${signal ?? code}`);
    }
  });
}

async function stopServer() {
  if (!server || server.killed) return;

  stoppingServer = true;
  server.kill('SIGTERM');
  await new Promise((resolve) => {
    const timer = setTimeout(resolve, 5000);
    server.once('exit', () => {
      clearTimeout(timer);
      resolve();
    });
  });
}

for (const signal of ['SIGINT', 'SIGTERM']) {
  process.once(signal, async () => {
    await stopServer();
    process.kill(process.pid, signal);
  });
}

try {
  await assertNoExistingServer();
  await assertPortAvailable();
  await run('corepack', ['pnpm', '--dir', 'web', 'build']);
  startServer();
  await waitForServer();
  await run('corepack', ['pnpm', 'smoke'], {
    env: { SMOKE_BASE_URL: baseUrl },
  });
} finally {
  await stopServer();
}
