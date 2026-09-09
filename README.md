# BOLTS Instagram automation

Generates on-brand 1080×1080 graphics + captions and files them as **drafts** in Zernio
for review. Nothing publishes without you.

## Cadence
Mon / Wed / Fri. Each run produces one draft.

## Brand tokens
Pulled directly from the live `boltsapp.app` stylesheet — keep in sync if the site changes.

| Token | Value |
|---|---|
| background | `#0d0d25` |
| surface | `#16163a` |
| surface elevated | `#1d1d44` |
| muted text | `#9a9ac4` |
| accent (cyan) | `#00ffff` |
| accent (magenta) | `#ff00ff` / `#ff47ff` |
| hairline | `#2a2a4a` |
| typeface | Geist / Geist Mono (npm `geist`) |

## Files
- `brand.js` — design tokens, base CSS, and the four layout templates
- `render.mjs` — Playwright renderer, spec JSON → 1080×1080 PNG
- `content.json` — voice rules, hashtag pools, 24-topic bank, rotation state
- `package.json`

## Layouts
| Layout | Use |
|---|---|
| `statement` | Big headline. The workhorse — progression and mindset posts. |
| `list` | Numbered tips, three items. |
| `feature` | App capability with a mock session card. |
| `stat` | Giant number. **Real App Store Connect data only.** |

## Content rules (enforced, not suggestions)
- **Never invent statistics**, download counts, or research claims. The `stat`
  layout is flagged `requiresRealData` and must not run on estimated figures.
- Lead with the skating insight; mention BOLTS at most once in the body.
- Skater-to-skater voice. No hype, no exclamation marks, minimal emoji.
- 8–12 hashtags, mixed reach.

## Pipeline
1. Pick least-recently-used topic from `content.json` (skipping `requiresRealData`).
2. Write a fresh caption from the topic's `captionSeed` + voice rules.
3. Render the PNG in the cloud container (Chromium + Geist).
4. Commit the PNG to the assets repo; take its `raw.githubusercontent.com` URL.
5. Create a Zernio **draft** for `bolts.app` with caption + media URL.
6. Append `{topicId, date, postId}` to `content.json` state; notify Justin.

## Network constraint (important)
Both the cloud container and the Mac shell sit behind the same egress allowlist.
Zernio's media storage (`media.zernio.com`, R2) is **blocked** from both. GitHub
(`api.github.com`, `raw.githubusercontent.com`) is reachable, which is why assets
are hosted there. Verified: Zernio successfully fetches `raw.githubusercontent.com`
URLs as Instagram media.

## Local run
```bash
npm install
node render.mjs posts.json out
```
Requires a Chromium path; in the cloud container use
`/opt/pw-browsers/chromium-1194/chrome-linux/chrome`.
