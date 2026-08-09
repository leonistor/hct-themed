const { chromium } = require('@playwright/test');
const { spawn, execFileSync } = require('node:child_process');
const path = require('node:path');
const fs = require('node:fs');

const ROOT = path.resolve(__dirname, '..', '..');
const OUT_DIR = path.resolve(__dirname, '..', 'test-results');
const PORT = 4321;
const HOME_URL = `http://localhost:${PORT}/`;
const VIEWPORT = { width: 1280, height: 720 };
const SCROLL_STEPS = 120;
const SETTLE_MS = 7000;

function timestamp() {
  const pad = (n) => String(n).padStart(2, '0');
  const d = new Date();
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}-${pad(d.getHours())}-${pad(d.getMinutes())}`;
}

function waitForServer(url, timeoutMs = 120_000) {
  return new Promise((resolve, reject) => {
    const start = Date.now();
    const tick = async () => {
      if (Date.now() - start >= timeoutMs) {
        reject(new Error(`Timed out waiting for ${url}`));
        return;
      }
      try {
        const res = await fetch(url);
        if (res.ok) {
          resolve();
          return;
        }
      } catch {}
      setTimeout(tick, 1500);
    };
    tick();
  });
}

async function slowScrollToBottom(page) {
  await page.evaluate(
    ({ steps }) => {
      const height = document.documentElement.scrollHeight;
      const viewport = window.innerHeight;
      let i = 0;
      return new Promise((resolve) => {
        const interval = setInterval(() => {
          i++;
          window.scrollTo(0, (height - viewport) * (i / steps));
          if (i >= steps) {
            clearInterval(interval);
            window.scrollTo(0, document.documentElement.scrollHeight);
            resolve();
          }
        }, 50);
      });
    },
    { steps: SCROLL_STEPS }
  );
  // let lazy-loaded media and entrance animations settle
  await new Promise((r) => setTimeout(r, SETTLE_MS));
}

async function capture(page, colorScheme, mode) {
  await page.emulateMedia({ colorScheme });
  await page.goto(HOME_URL, { waitUntil: 'networkidle' });
  await slowScrollToBottom(page);
  const file = path.join(OUT_DIR, `home-${mode}-${timestamp()}.png`);
  await page.screenshot({ path: file, fullPage: true, scale: 'css' });
  console.log(`Saved ${file}`);
}

function stopServer(child) {
  if (!child) return;
  try {
    process.kill(-child.pid, 'SIGTERM');
  } catch {}
  setTimeout(() => {
    try {
      process.kill(-child.pid, 'SIGKILL');
    } catch {}
    killPort(PORT);
  }, 3000);
}

function killPort(port) {
  try {
    const pids = execFileSync('lsof', ['-ti', `:${port}`], { encoding: 'utf-8' }).trim().split('\n').filter(Boolean);
    for (const pid of pids) {
      try {
        process.kill(Number(pid), 'SIGKILL');
      } catch {}
    }
  } catch {}
}

let server = null;
const onExit = () => stopServer(server);
process.on('SIGINT', onExit);
process.on('SIGTERM', onExit);

(async () => {
  fs.mkdirSync(OUT_DIR, { recursive: true });

  server = spawn('bun', ['run', 'dev:web'], {
    cwd: ROOT,
    detached: true,
    stdio: 'inherit',
  });

  let browser;
  try {
    await waitForServer(HOME_URL);
    browser = await chromium.launch();
    const page = await browser.newPage({ viewport: VIEWPORT });

    await capture(page, 'light', 'light');
    await capture(page, 'dark', 'dark');
  } finally {
    if (browser) {
      await browser.close();
    }
    stopServer(server);
  }
})().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});