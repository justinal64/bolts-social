import { chromium } from 'playwright';
import { writeFileSync, mkdirSync } from 'fs';
import { buildHTML } from './brand.js';

/**
 * Render BOLTS Instagram graphics (1080x1080) from post specs.
 * Usage: node render.mjs posts.json outdir
 */
const [, , specPath = 'posts.json', outDir = 'out'] = process.argv;
const posts = JSON.parse(await import('fs').then(fs => fs.readFileSync(specPath, 'utf8')));
mkdirSync(outDir, { recursive: true });

// Use the container's preinstalled Chromium (version-independent of the npm playwright build)
const EXEC = process.env.CHROMIUM_PATH || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
const browser = await chromium.launch({ executablePath: EXEC, args: ['--font-render-hinting=none'] });
const page = await browser.newPage({ viewport: { width: 1080, height: 1080 }, deviceScaleFactor: 1 });

const written = [];
for (const post of posts) {
  const html = buildHTML(post);
  writeFileSync(`${outDir}/${post.id}.html`, html);
  await page.setContent(html, { waitUntil: 'load' });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(250);
  const file = `${outDir}/${post.id}.png`;
  await page.screenshot({ path: file, type: 'png' });
  written.push(file);
  console.log('rendered', file);
}

await browser.close();
console.log(JSON.stringify(written));
