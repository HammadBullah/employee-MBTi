const puppeteer = require('puppeteer');
const { spawn } = require('child_process');

(async () => {
  // Start Next.js server
  const server = spawn('npm', ['run', 'start'], { stdio: 'pipe' });
  
  // Wait a few seconds for the server to boot
  await new Promise(resolve => setTimeout(resolve, 5000));
  
  const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', err => console.log('PAGE ERROR:', err.toString()));
  
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });
  await page.screenshot({ path: 'preview.png' });
  
  await browser.close();
  server.kill();
  process.exit(0);
})();
