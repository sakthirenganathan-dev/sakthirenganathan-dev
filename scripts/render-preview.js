import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const svg = fs.readFileSync('assets/id-dashboard.svg', 'utf8');
const base64 = Buffer.from(svg).toString('base64');
const html = `<!DOCTYPE html>
<html>
<body style="background:#0d1117;margin:0;padding:30px;display:flex;justify-content:center;">
  <div style="width:1000px;">
    <img style="width:100%;height:auto;display:block;" src="data:image/svg+xml;base64,${base64}">
  </div>
</body>
</html>`;

fs.writeFileSync('test-dash-render.html', html, 'utf8');
const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const outPath = 'C:\\Users\\sakth\\.gemini\\antigravity\\brain\\3db37d29-9ad6-4957-85b5-a5f23f5faebd\\test_updated_dashboard.png';
const fileUrl = 'file:///' + path.resolve('test-dash-render.html').replace(/\\/g, '/');

execSync(`"${chromePath}" --headless=new --screenshot="${outPath}" --window-size=1200,600 "${fileUrl}"`);
fs.unlinkSync('test-dash-render.html');
console.log('Rendered test_updated_dashboard.png successfully');

