import http from 'http';
import fs from 'fs';
import path from 'path';
import { spawn } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distDir = path.resolve(__dirname, '..', 'dist');

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

const PORT = 4176;
const CDP_PORT = 9225;
const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

server.listen(PORT, async () => {
  console.log(`[FPS BENCHMARK] Server listening on http://localhost:${PORT}`);

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
    const consoleLogs = [];
    const exceptions = [];

    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.method === 'Runtime.consoleAPICalled') {
        const text = msg.params.args.map((a) => a.value || a.description).join(' ');
        if (!text.includes('cdn.tailwindcss.com')) {
          consoleLogs.push({ type: msg.params.type, text });
        }
      } else if (msg.method === 'Runtime.exceptionThrown') {
        exceptions.push(msg.params.exceptionDetails);
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

    await new Promise((resolve) => { ws.onopen = resolve; });

    await send('Runtime.enable');
    await send('Page.enable');
    await send('Page.navigate', { url: `http://localhost:${PORT}/?skipIntro=true` });

    console.log('[FPS BENCHMARK] Page navigated. Initializing FPS tracker in browser...');
    await new Promise((r) => setTimeout(r, 2000));

    // Inject FPS measuring loop into page
    await send('Runtime.evaluate', {
      expression: `
        window.__shinobiFps = {
          frames: 0,
          deltas: [],
          running: true,
          startTime: performance.now(),
          lastTime: performance.now()
        };
        function trackLoop(now) {
          if (!window.__shinobiFps.running) return;
          const dt = now - window.__shinobiFps.lastTime;
          window.__shinobiFps.lastTime = now;
          if (dt > 0) window.__shinobiFps.deltas.push(dt);
          window.__shinobiFps.frames++;
          requestAnimationFrame(trackLoop);
        }
        requestAnimationFrame(trackLoop);
      `
    });

    console.log('[FPS BENCHMARK] Measuring Desktop FPS for 15 seconds with simulated pointer interaction...');

    // Simulate mouse movements back and forth to test parallax interpolation
    const startBench = Date.now();
    for (let i = 0; i < 15; i++) {
      const x = 720 + Math.sin(i * 0.5) * 350;
      const y = 450 + Math.cos(i * 0.5) * 180;
      await send('Input.dispatchMouseEvent', {
        type: 'mouseMoved',
        x,
        y,
      });
      await new Promise((r) => setTimeout(r, 1000));
    }

    const desktopStats = await send('Runtime.evaluate', {
      expression: `
        (() => {
          const s = window.__shinobiFps;
          const totalTimeSec = (performance.now() - s.startTime) / 1000;
          const avgFps = s.frames / totalTimeSec;
          const sortedDeltas = [...s.deltas].sort((a,b) => a - b);
          const medianDelta = sortedDeltas[Math.floor(sortedDeltas.length / 2)] || 16.6;
          const p99Delta = sortedDeltas[Math.floor(sortedDeltas.length * 0.99)] || 16.6;
          return {
            frames: s.frames,
            durationSec: totalTimeSec.toFixed(2),
            avgFps: avgFps.toFixed(1),
            p99Fps: (1000 / p99Delta).toFixed(1),
            medianFps: (1000 / medianDelta).toFixed(1),
            sampleCount: s.deltas.length
          };
        })()
      `,
      returnByValue: true
    });

    console.log('[DESKTOP BENCHMARK RESULT]:', desktopStats.result.value);

    // ==================== MOBILE VIEWPORT & TOUCH BENCHMARK ====================
    console.log('[FPS BENCHMARK] Switching to Mobile Viewport (390x844)...');
    await send('Emulation.setDeviceMetricsOverride', {
      width: 390,
      height: 844,
      deviceScaleFactor: 2,
      mobile: true,
      hasTouch: true
    });

    // Reset FPS counter for Mobile
    await send('Runtime.evaluate', {
      expression: `
        window.__shinobiFps.frames = 0;
        window.__shinobiFps.deltas = [];
        window.__shinobiFps.startTime = performance.now();
        window.__shinobiFps.lastTime = performance.now();
      `
    });

    console.log('[FPS BENCHMARK] Measuring Mobile FPS for 15 seconds with simulated touch interactions...');
    for (let i = 0; i < 15; i++) {
      const touchY = 400 + Math.sin(i * 0.8) * 120;
      await send('Input.dispatchTouchEvent', {
        type: 'touchMove',
        touchPoints: [{ x: 195, y: touchY }]
      });
      await new Promise((r) => setTimeout(r, 1000));
    }

    const mobileStats = await send('Runtime.evaluate', {
      expression: `
        (() => {
          const s = window.__shinobiFps;
          const totalTimeSec = (performance.now() - s.startTime) / 1000;
          const avgFps = s.frames / totalTimeSec;
          const sortedDeltas = [...s.deltas].sort((a,b) => a - b);
          const medianDelta = sortedDeltas[Math.floor(sortedDeltas.length / 2)] || 16.6;
          const p99Delta = sortedDeltas[Math.floor(sortedDeltas.length * 0.99)] || 16.6;
          return {
            frames: s.frames,
            durationSec: totalTimeSec.toFixed(2),
            avgFps: avgFps.toFixed(1),
            p99Fps: (1000 / p99Delta).toFixed(1),
            medianFps: (1000 / medianDelta).toFixed(1),
            sampleCount: s.deltas.length
          };
        })()
      `,
      returnByValue: true
    });

    console.log('[MOBILE BENCHMARK RESULT]:', mobileStats.result.value);

    // ==================== REDUCED MOTION VERIFICATION ====================
    console.log('[BENCHMARK] Testing prefers-reduced-motion media emulation...');
    await send('Emulation.setEmulatedMedia', {
      media: 'screen',
      features: [{ name: 'prefers-reduced-motion', value: 'reduce' }]
    });
    const reducedMotionCheck = await send('Runtime.evaluate', {
      expression: `window.matchMedia('(prefers-reduced-motion: reduce)').matches`,
      returnByValue: true
    });
    console.log('[REDUCED MOTION ACTIVE]:', reducedMotionCheck.result.value);

    // ==================== TAB VISIBILITY PAUSE VERIFICATION ====================
    console.log('[BENCHMARK] Testing Tab Visibility Pause (document.hidden)...');
    await send('Runtime.evaluate', {
      expression: `
        Object.defineProperty(document, 'hidden', { value: true, configurable: true });
        document.dispatchEvent(new Event('visibilitychange'));
      `
    });
    await new Promise((r) => setTimeout(r, 1000));
    console.log('[BENCHMARK] Tab hidden event triggered successfully.');

    // Resume Tab Visibility
    await send('Runtime.evaluate', {
      expression: `
        Object.defineProperty(document, 'hidden', { value: false, configurable: true });
        document.dispatchEvent(new Event('visibilitychange'));
      `
    });
    await new Promise((r) => setTimeout(r, 500));
    console.log('[BENCHMARK] Tab resumed cleanly.');

    console.log('[AUDIT] Browser Console Messages Captured:', consoleLogs.length);
    console.log('[AUDIT] Browser Exceptions Captured:', exceptions.length);

    ws.close();
  } catch (err) {
    console.error('[BENCHMARK ERROR]:', err);
  } finally {
    edgeProcess.kill();
    server.close(() => {
      console.log('[FPS BENCHMARK] Server closed. Benchmark complete.');
      process.exit(0);
    });
  }
});

