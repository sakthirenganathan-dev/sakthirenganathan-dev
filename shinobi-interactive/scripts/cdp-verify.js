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

const PORT = 4178;
const CDP_PORT = 9227;
const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

server.listen(PORT, async () => {
  console.log(`[CDP CAPTURE] Server active on http://localhost:${PORT}`);

  const edgeProcess = spawn(edgePath, [
    '--headless=new',
    `--remote-debugging-port=${CDP_PORT}`,
    '--window-size=1440,900',
    `http://localhost:${PORT}/?skipIntro=true`,
  ]);

  await new Promise((r) => setTimeout(r, 1500));

  try {
    const targetsRes = await fetch(`http://localhost:${CDP_PORT}/json/list`);
    const targets = await targetsRes.json();
    const pageTarget = targets.find((t) => t.type === 'page') || targets[0];
    const ws = new WebSocket(pageTarget.webSocketDebuggerUrl);

    let msgId = 1;
    const pending = new Map();

    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
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

    await new Promise((resolve) => { ws.onopen = resolve; });

    await send('Runtime.enable');
    await send('Page.enable');
    await send('Page.navigate', { url: `http://localhost:${PORT}/?skipIntro=true` });

    // Wait for load event
    await new Promise((resolve) => {
      const loadHandler = (event) => {
        const msg = JSON.parse(event.data);
        if (msg.method === 'Page.loadEventFired') {
          ws.removeEventListener('message', loadHandler);
          resolve();
        }
      };
      ws.addEventListener('message', loadHandler);
      setTimeout(resolve, 3000);
    });

    async function capture(filename) {
      const shot = await send('Page.captureScreenshot', { format: 'png' });
      if (shot && shot.data) {
        const buffer = Buffer.from(shot.data, 'base64');
        
        // 1. Save to artifact directory
        const outPath = path.join(artifactDir, filename);
        fs.writeFileSync(outPath, buffer);
        
        // 2. Also save to workspace screenshots directory
        const wsScreenshotsDir = path.resolve(__dirname, '..', 'screenshots');
        if (!fs.existsSync(wsScreenshotsDir)) fs.mkdirSync(wsScreenshotsDir, { recursive: true });
        fs.writeFileSync(path.join(wsScreenshotsDir, filename), buffer);

        console.log(`[CDP] Saved ${filename} (${buffer.length} bytes)`);
      }
    }

    console.log('[CDP] Waiting for React and 3D WebGL to finish rendering...');
    await new Promise((r) => setTimeout(r, 4500));

    // 1. Desktop Stage 0: Hero & Identity
    console.log('[CDP] Capturing Desktop Stage 0 (Identity)...');
    await capture('m3_refined_desktop_identity.png');

    // 2. Desktop Stage 1: Developer Story (About)
    console.log('[CDP] Switching to Stage 1 (Story)...');
    await send('Runtime.evaluate', {
      expression: `document.querySelectorAll('nav button')[1]?.click()`
    });
    await new Promise((r) => setTimeout(r, 800));
    await capture('m3_refined_desktop_story.png');

    // 3. Desktop Stage 2: Tech Arsenal
    console.log('[CDP] Switching to Stage 2 (Arsenal)...');
    await send('Runtime.evaluate', {
      expression: `document.querySelectorAll('nav button')[2]?.click()`
    });
    await new Promise((r) => setTimeout(r, 800));
    await capture('m3_refined_desktop_arsenal.png');

    // 4. Desktop Stage 4: GitHub Intelligence
    console.log('[CDP] Switching to Stage 4 (Telemetry)...');
    await send('Runtime.evaluate', {
      expression: `document.querySelectorAll('nav button')[4]?.click()`
    });
    await new Promise((r) => setTimeout(r, 800));
    await capture('m3_refined_desktop_telemetry.png');

    // 5. Mobile Emulation (390x844)
    console.log('[CDP] Emulating Mobile Viewport (390x844)...');
    await send('Emulation.setDeviceMetricsOverride', {
      width: 390,
      height: 844,
      deviceScaleFactor: 2,
      mobile: true,
      hasTouch: true,
    });
    await new Promise((r) => setTimeout(r, 800));

    // Reset to Stage 0 for mobile
    await send('Runtime.evaluate', {
      expression: `document.querySelectorAll('footer button')[1]?.click()`
    });
    await new Promise((r) => setTimeout(r, 600));
    await capture('m3_refined_mobile_identity.png');

    // Mobile Stage 1: Developer Story
    await send('Runtime.evaluate', {
      expression: `document.querySelectorAll('footer button')[2]?.click()`
    });
    await new Promise((r) => setTimeout(r, 600));
    await capture('m3_refined_mobile_story.png');

    ws.close();
  } catch (e) {
    console.error('[CDP ERROR]:', e);
  } finally {
    edgeProcess.kill();
    server.close(() => {
      console.log('[CDP CAPTURE] Server closed cleanly.');
      process.exit(0);
    });
  }
});
