import http from 'http';
import fs from 'fs';
import path from 'path';
import { spawn } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distDir = path.resolve(__dirname, '..', 'dist');
const artifactDir = 'C:/Users/sakth/.gemini/antigravity/brain/3db37d29-9ad6-4957-85b5-a5f23f5faebd';

const mimeTypes = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
};

// 1. Static Web Server
const server = http.createServer((req, res) => {
  let reqPath = req.url.split('?')[0];
  if (reqPath === '/') reqPath = '/index.html';

  const filePath = path.join(distDir, reqPath);
  const ext = path.extname(filePath).toLowerCase();
  const contentType = mimeTypes[ext] || 'application/octet-stream';

  fs.readFile(filePath, (err, content) => {
    if (err) {
      fs.readFile(path.join(distDir, 'index.html'), (err2, fallback) => {
        if (err2) {
          res.writeHead(404);
          res.end('Not Found');
        } else {
          res.writeHead(200, { 'Content-Type': 'text/html' });
          res.end(fallback, 'utf-8');
        }
      });
    } else {
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content, 'utf-8');
    }
  });
});

const PORT = 4173;
const CDP_PORT = 9222;
const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

server.listen(PORT, async () => {
  console.log(`[HTTP] Server active on http://localhost:${PORT}`);

  // Launch Edge in Headless mode with CDP
  const edgeProcess = spawn(edgePath, [
    '--headless=new',
    `--remote-debugging-port=${CDP_PORT}`,
    '--window-size=1440,900',
    `http://localhost:${PORT}/?skipIntro=true`,
  ]);

  // Wait 1.5s for CDP endpoint to become ready
  await new Promise((r) => setTimeout(r, 1500));

  try {
    // Query CDP targets
    const targetsRes = await fetch(`http://localhost:${CDP_PORT}/json/list`);
    const targets = await targetsRes.json();
    console.log(`[CDP] Found ${targets.length} targets`);

    const pageTarget = targets.find((t) => t.type === 'page') || targets[0];
    if (!pageTarget || !pageTarget.webSocketDebuggerUrl) {
      throw new Error('No valid CDP page target found');
    }

    console.log(`[CDP] Connecting to: ${pageTarget.webSocketDebuggerUrl}`);
    const ws = new WebSocket(pageTarget.webSocketDebuggerUrl);

    let msgId = 1;
    const pending = new Map();

    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.method === 'Runtime.consoleAPICalled') {
        const text = msg.params.args.map((a) => a.value || a.description).join(' ');
        console.log(`[BROWSER CONSOLE] ${msg.params.type}:`, text);
      } else if (msg.method === 'Runtime.exceptionThrown') {
        console.error('[BROWSER EXCEPTION]', msg.params.exceptionDetails);
      }

      if (msg.id && pending.has(msg.id)) {
        pending.get(msg.id)(msg.result);
        pending.delete(msg.id);
      }
    };

    function send(method, params = {}) {
      return new Promise((resolve) => {
        const id = msgId++;
        pending.set(id, resolve);
        ws.send(JSON.stringify({ id, method, params }));
      });
    }

    await new Promise((resolve) => {
      ws.onopen = resolve;
    });

    console.log('[CDP] Connected. Enabling domains...');
    await send('Runtime.enable');
    await send('Page.enable');

    console.log('[CDP] Navigating to target URL...');
    await send('Page.navigate', { url: `http://localhost:${PORT}/?skipIntro=true` });

    // Wait for Page.loadEventFired
    await new Promise((resolve) => {
      const loadHandler = (event) => {
        const msg = JSON.parse(event.data);
        if (msg.method === 'Page.loadEventFired') {
          ws.removeEventListener('message', loadHandler);
          resolve();
        }
      };
      ws.addEventListener('message', loadHandler);
      setTimeout(resolve, 3000); // Fallback timeout
    });

    // Wait 3.5s for Three.js scene, textures, particles, and animation to render frames
    console.log('[CDP] Allowing WebGL world to render frames...');
    await new Promise((r) => setTimeout(r, 3500));

    // Inspect Canvas & WebGL in browser context
    const evalRes = await send('Runtime.evaluate', {
      expression: `
        (() => {
          const canvas = document.querySelector('canvas');
          const hud = document.querySelector('.font-cinzel');
          return {
            hasCanvas: !!canvas,
            canvasWidth: canvas ? canvas.width : 0,
            canvasHeight: canvas ? canvas.height : 0,
            hudTitle: hud ? hud.textContent.trim() : null,
            bodyText: document.body.innerText.substring(0, 100),
          };
        })()
      `,
      returnByValue: true,
    });

    console.log('[CDP] Browser DOM Inspection:', evalRes.result ? evalRes.result.value : evalRes);

    // Capture Desktop Screenshot
    console.log('[CDP] Capturing Desktop Screenshot...');
    const desktopShot = await send('Page.captureScreenshot', { format: 'png' });
    if (desktopShot && desktopShot.data) {
      const desktopBuffer = Buffer.from(desktopShot.data, 'base64');
      const desktopPath = path.join(artifactDir, 'm3_shinobi_world_desktop.png');
      fs.writeFileSync(desktopPath, desktopBuffer);
      console.log(`[CDP] Saved desktop screenshot to: ${desktopPath} (${desktopBuffer.length} bytes)`);
    }

    // Set mobile viewport and capture mobile screenshot
    console.log('[CDP] Emulating mobile viewport (390x844)...');
    await send('Emulation.setDeviceMetricsOverride', {
      width: 390,
      height: 844,
      deviceScaleFactor: 2,
      mobile: true,
    });
    await new Promise((r) => setTimeout(r, 1000));

    const mobileShot = await send('Page.captureScreenshot', { format: 'png' });
    if (mobileShot && mobileShot.data) {
      const mobileBuffer = Buffer.from(mobileShot.data, 'base64');
      const mobilePath = path.join(artifactDir, 'm3_shinobi_world_mobile.png');
      fs.writeFileSync(mobilePath, mobileBuffer);
      console.log(`[CDP] Saved mobile screenshot to: ${mobilePath} (${mobileBuffer.length} bytes)`);
    }

    // Also capture Awakening Sequence (M2)
    console.log('[CDP] Navigating to Awakening Sequence (M2)...');
    await send('Page.navigate', { url: `http://localhost:${PORT}/` });
    await new Promise((r) => setTimeout(r, 2200));

    const introShot = await send('Page.captureScreenshot', { format: 'png' });
    if (introShot && introShot.data) {
      const introBuffer = Buffer.from(introShot.data, 'base64');
      const introPath = path.join(artifactDir, 'm2_awakening_intro.png');
      fs.writeFileSync(introPath, introBuffer);
      console.log(`[CDP] Saved Awakening intro screenshot to: ${introPath} (${introBuffer.length} bytes)`);
    }

    ws.close();
  } catch (err) {
    console.error('[CDP] Error during verification:', err);
  } finally {
    edgeProcess.kill();
    server.close(() => {
      console.log('[HTTP] Server stopped. CDP verification complete.');
      process.exit(0);
    });
  }
});
