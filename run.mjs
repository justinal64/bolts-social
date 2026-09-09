/**
 * BOLTS Instagram automation — one run.
 *
 * Picks the next topic, renders the graphic, pushes it to the assets repo,
 * and prints a JSON payload for the caller to turn into a Zernio draft.
 *
 * Usage:  node run.mjs [--dry]
 * Env:    GH_TOKEN (required unless --dry)
 */
import { chromium } from 'playwright';
import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { buildHTML } from './brand.js';

const DRY = process.argv.includes('--dry');
const REPO = 'justinal64/bolts-social';
const BRANCH = 'main';
const CHROMIUM = process.env.CHROMIUM_PATH || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
const API = 'https://api.github.com';

const gh = async (path, init = {}) => {
  const res = await fetch(`${API}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${process.env.GH_TOKEN}`,
      Accept: 'application/vnd.github+json',
      'Content-Type': 'application/json',
      ...(init.headers || {}),
    },
  });
  const text = await res.text();
  let json; try { json = JSON.parse(text); } catch { json = { raw: text }; }
  return { ok: res.ok, status: res.status, json };
};

/** Create or update a file in the repo. Returns the raw URL. */
async function putFile(path, contentB64, message) {
  const cur = await gh(`/repos/${REPO}/contents/${encodeURI(path)}?ref=${BRANCH}`);
  const sha = cur.ok ? cur.json.sha : undefined;
  const res = await gh(`/repos/${REPO}/contents/${encodeURI(path)}`, {
    method: 'PUT',
    body: JSON.stringify({ message, content: contentB64, branch: BRANCH, ...(sha ? { sha } : {}) }),
  });
  if (!res.ok) throw new Error(`GitHub PUT ${path} failed ${res.status}: ${JSON.stringify(res.json).slice(0, 300)}`);
  return `https://raw.githubusercontent.com/${REPO}/${BRANCH}/${encodeURI(path)}`;
}

// ---- 1. pick the next topic -------------------------------------------------
const content = JSON.parse(readFileSync('content.json', 'utf8'));
const usedIds = (content.state.used || []).map(u => u.topicId);
const eligible = content.topics.filter(t => !t.requiresRealData);

// least-recently-used: never-used first, then oldest
const nextTopic =
  eligible.find(t => !usedIds.includes(t.id)) ||
  eligible
    .map(t => ({ t, last: [...(content.state.used || [])].reverse().find(u => u.topicId === t.id) }))
    .sort((a, b) => new Date(a.last.date) - new Date(b.last.date))[0].t;

const today = new Date().toISOString().slice(0, 10);
const slug = `${today}-${nextTopic.id}`;

// ---- 2. render --------------------------------------------------------------
mkdirSync('out', { recursive: true });
const html = buildHTML(nextTopic);
const browser = await chromium.launch({ executablePath: CHROMIUM, args: ['--font-render-hinting=none'] });
const page = await browser.newPage({ viewport: { width: 1080, height: 1080 }, deviceScaleFactor: 1 });
await page.setContent(html, { waitUntil: 'load' });
await page.evaluate(() => document.fonts.ready);
await page.waitForTimeout(250);
const pngPath = `out/${slug}.png`;
await page.screenshot({ path: pngPath, type: 'png' });
await browser.close();

const bytes = readFileSync(pngPath);

// ---- 3. publish -------------------------------------------------------------
let rawUrl = null;
if (!DRY) {
  rawUrl = await putFile(`posts/${slug}.png`, bytes.toString('base64'), `post: ${slug}`);

  content.state.used.push({ topicId: nextTopic.id, date: today, asset: `posts/${slug}.png` });
  writeFileSync('content.json', JSON.stringify(content, null, 2));
  await putFile('content.json', Buffer.from(JSON.stringify(content, null, 2)).toString('base64'), `state: used ${nextTopic.id}`);
}

// ---- 4. hand off ------------------------------------------------------------
console.log(JSON.stringify({
  topicId: nextTopic.id,
  pillar: nextTopic.pillar,
  layout: nextTopic.layout,
  localPng: pngPath,
  sizeKB: Math.round(bytes.length / 1024),
  rawUrl,
  captionSeed: nextTopic.captionSeed,
  cta: nextTopic.cta,
  voice: content.meta.voice,
  rules: content.meta.rules,
  hashtagPools: content.meta.hashtagPools,
  appStoreUrl: content.meta.appStoreUrl,
}, null, 2));
