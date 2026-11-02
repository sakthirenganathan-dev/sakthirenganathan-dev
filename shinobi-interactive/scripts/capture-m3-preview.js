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

// Simple static file server for dist/
const server = http.createServer((req, res) => {
  let reqPath = req.url.split('?')[0];
  if (reqPath === '/') reqPath = '/index.html';

  const filePath = path.join(distDir, reqPath);
  const ext = path.extname(filePath).toLowerCase();
  const contentType = mimeTypes[ext] || 'application/octet-stream';

  fs.readFile(filePath, (err, content) => {
    if (err) {
      if (err.code === 'ENOENT') {
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
        res.writeHead(500);
        res.end(`Server Error: ${err.code}`);
      }
    } else {
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content, 'utf-8');
    }
  });
});

const PORT = 4173;

server.listen(PORT, async () => {
  console.log(`Preview server listening on http://localhost:${PORT}`);

  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

  const desktopOut = path.join(artifactDir, 'm3_shinobi_world_desktop.png');
  const mobileOut = path.join(artifactDir, 'm3_shinobi_world_mobile.png');

  function takeScreenshot(url, width, height, outFile) {
    return new Promise((resolve) => {
      console.log(`Capturing ${url} (${width}x${height}) to ${outFile}...`);
      const child = spawn(edgePath, [
        '--headless=new',
        '--enable-webgl',
        '--use-gl=angle',
        '--virtual-time-budget=5000',
        `--window-size=${width},${height}`,
        `--screenshot=${outFile}`,
        url,
      ]);

      child.on('close', (code) => {
        console.log(`Edge finished with exit code ${code}`);
        resolve();
      });
      child.on('error', (err) => {
        console.error('Edge spawn error:', err);
        resolve();
      });
    });
  }

  try {
    // 1. Capture Living 3D Shinobi Realm (Desktop)
    await takeScreenshot(`http://localhost:${PORT}/?skipIntro=true`, 1440, 900, desktopOut);

    // 2. Capture Living 3D Shinobi Realm (Mobile)
    await takeScreenshot(`http://localhost:${PORT}/?skipIntro=true`, 390, 844, mobileOut);

    console.log('All preview screenshots captured.');
  } catch (e) {
    console.error('Capture error:', e);
  } finally {
    server.close(() => {
      console.log('Preview server closed.');
      process.exit(0);
    });
  }
});
