import http from 'http';
import fs from 'fs';
import path from 'path';
import { spawn } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distDir = path.resolve(__dirname, '..', 'dist');

const server = http.createServer((req, res) => {
  let reqPath = req.url.split('?')[0];
  if (reqPath === '/') reqPath = '/index.html';
  const filePath = path.join(distDir, reqPath);
  fs.readFile(filePath, (err, content) => {
    if (err) {
      fs.readFile(path.join(distDir, 'index.html'), (e2, fb) => {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(fb);
      });
    } else {
      const ext = path.extname(filePath);
      const ct = ext === '.js' ? 'text/javascript' : ext === '.css' ? 'text/css' : 'text/html';
      res.writeHead(200, { 'Content-Type': ct });
      res.end(content);
    }
  });
});

server.listen(4174, async () => {
  const edge = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const edgeP = spawn(edge, [
    '--headless=new',
    '--remote-debugging-port=9223',
    '--window-size=1440,900',
    'http://localhost:4174/?skipIntro=true',
  ]);
  await new Promise((r) => setTimeout(r, 1500));

  const res = await fetch('http://localhost:9223/json/list');
  const targets = await res.json();
  const page = targets.find((t) => t.type === 'page') || targets[0];
  const ws = new WebSocket(page.webSocketDebuggerUrl);

  ws.onopen = async () => {
    let id = 1;
    function send(m, p = {}) {
      return new Promise((r) => {
        const curId = id++;
        const handler = (e) => {
          const d = JSON.parse(e.data);
          if (d.id === curId) {
            ws.removeEventListener('message', handler);
            r(d.result);
          }
        };
        ws.addEventListener('message', handler);
        ws.send(JSON.stringify({ id: curId, method: m, params: p }));
      });
    }
    await send('Runtime.enable');
    await send('Page.enable');
    await new Promise((r) => setTimeout(r, 2000));

    const info = await send('Runtime.evaluate', {
      expression: `(() => {
        const hudTitle = document.querySelector('.font-cinzel');
        if (!hudTitle) return { found: false };
        const rect = hudTitle.getBoundingClientRect();
        const style = window.getComputedStyle(hudTitle);
        const parent = hudTitle.closest('div[class*="z-10"]');
        const parentRect = parent ? parent.getBoundingClientRect() : null;
        return {
          found: true,
          titleRect: { top: rect.top, left: rect.left, width: rect.width, height: rect.height },
          parentRect: parentRect ? { top: parentRect.top, left: parentRect.left, width: parentRect.width, height: parentRect.height } : null,
          color: style.color,
          display: style.display,
          visibility: style.visibility,
          opacity: style.opacity,
          windowHeight: window.innerHeight,
          windowWidth: window.innerWidth,
          canvasRect: document.querySelector('canvas') ? document.querySelector('canvas').getBoundingClientRect() : null,
          hudZIndex: parent ? window.getComputedStyle(parent).zIndex : null
        };
      })()`,
      returnByValue: true,
    });
    console.log('HUD DEBUG INFO:', JSON.stringify(info.result.value, null, 2));
    ws.close();
    edgeP.kill();
    server.close();
  };
});
