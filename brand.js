// BOLTS brand kit — tokens lifted directly from boltsapp.app
export const BRAND = {
  bg: '#0d0d25',
  surface: '#16163a',
  surfaceHi: '#1d1d44',
  fg: '#ffffff',
  muted: '#9a9ac4',
  cyan: '#00ffff',
  magenta: '#ff00ff',
  magentaSoft: '#ff47ff',
  hairline: '#2a2a4a',
  handle: '@bolts.app',
  site: 'boltsapp.app',
};

const FONT_DIR = new URL('./node_modules/geist/dist/fonts/', import.meta.url).pathname;

export const baseCSS = `
@font-face{font-family:'Geist';src:url('file://${FONT_DIR}geist-sans/Geist-Variable.woff2') format('woff2');font-weight:100 900;font-style:normal;}
@font-face{font-family:'Geist Mono';src:url('file://${FONT_DIR}geist-mono/GeistMono-Variable.woff2') format('woff2');font-weight:100 900;font-style:normal;}
*{margin:0;padding:0;box-sizing:border-box;}
html,body{width:1080px;height:1080px;}
body{
  background:${BRAND.bg};
  color:${BRAND.fg};
  font-family:'Geist',-apple-system,system-ui,sans-serif;
  -webkit-font-smoothing:antialiased;
  overflow:hidden;
}
.canvas{position:relative;width:1080px;height:1080px;overflow:hidden;display:flex;flex-direction:column;}

/* ambient brand glows */
.glow{position:absolute;border-radius:50%;filter:blur(110px);pointer-events:none;}
.glow-cyan{width:620px;height:620px;background:${BRAND.cyan};opacity:.13;top:-230px;left:-180px;}
.glow-mag{width:680px;height:680px;background:${BRAND.magenta};opacity:.15;bottom:-280px;right:-220px;}

/* faint grid */
.grid{position:absolute;inset:0;pointer-events:none;opacity:.5;
  background-image:linear-gradient(${BRAND.hairline} 1px,transparent 1px),linear-gradient(90deg,${BRAND.hairline} 1px,transparent 1px);
  background-size:90px 90px;
  -webkit-mask-image:radial-gradient(circle at 50% 45%,#000 30%,transparent 78%);}

.pad{position:relative;z-index:2;flex:1;display:flex;flex-direction:column;padding:82px 84px;}

/* header */
.head{display:flex;align-items:center;justify-content:space-between;}
.wordmark{font-size:34px;font-weight:700;letter-spacing:.34em;color:${BRAND.fg};}
.eyebrow{font-family:'Geist Mono',monospace;font-size:20px;font-weight:500;letter-spacing:.2em;text-transform:uppercase;color:${BRAND.cyan};
  border:1px solid ${BRAND.cyan}55;border-radius:999px;padding:11px 22px;background:${BRAND.cyan}0f;}

/* body slot */
.body{flex:1;display:flex;flex-direction:column;justify-content:center;}

/* footer */
.foot{display:flex;align-items:center;justify-content:space-between;
  border-top:1px solid ${BRAND.hairline};padding-top:30px;}
.handle{font-family:'Geist Mono',monospace;font-size:23px;color:${BRAND.muted};letter-spacing:.06em;}
.cta{font-size:23px;font-weight:600;color:${BRAND.fg};display:flex;align-items:center;gap:13px;}
.dot{width:11px;height:11px;border-radius:50%;background:${BRAND.magenta};box-shadow:0 0 18px ${BRAND.magenta};}

/* shared type */
.kicker{font-family:'Geist Mono',monospace;font-size:22px;letter-spacing:.22em;text-transform:uppercase;color:${BRAND.magentaSoft};margin-bottom:30px;}
.headline{font-size:108px;line-height:.98;font-weight:700;letter-spacing:-.035em;}
.headline .hl{color:${BRAND.cyan};}
.sub{margin-top:34px;font-size:33px;line-height:1.45;color:${BRAND.muted};max-width:800px;font-weight:400;}
.rule{width:104px;height:7px;border-radius:4px;background:linear-gradient(90deg,${BRAND.cyan},${BRAND.magenta});margin-top:44px;}
`;

export const layouts = {
  // Big statement — the workhorse
  statement: (d) => `
    <div class="body">
      ${d.kicker ? `<div class="kicker">${d.kicker}</div>` : ''}
      <div class="headline">${d.headline}</div>
      ${d.sub ? `<div class="sub">${d.sub}</div>` : ''}
      <div class="rule"></div>
    </div>`,

  // Giant number
  stat: (d) => `
    <div class="body" style="align-items:flex-start;">
      ${d.kicker ? `<div class="kicker">${d.kicker}</div>` : ''}
      <div style="font-size:280px;line-height:.84;font-weight:800;letter-spacing:-.05em;
        background:linear-gradient(135deg,${BRAND.cyan},${BRAND.magentaSoft});
        -webkit-background-clip:text;background-clip:text;color:transparent;">${d.stat}</div>
      <div style="margin-top:38px;font-size:52px;font-weight:600;letter-spacing:-.02em;max-width:840px;line-height:1.15;">${d.headline}</div>
      ${d.sub ? `<div class="sub" style="margin-top:24px;font-size:30px;">${d.sub}</div>` : ''}
    </div>`,

  // Feature with a mock app card
  feature: (d) => `
    <div class="body">
      ${d.kicker ? `<div class="kicker">${d.kicker}</div>` : ''}
      <div class="headline" style="font-size:92px;">${d.headline}</div>
      ${d.sub ? `<div class="sub" style="margin-top:28px;">${d.sub}</div>` : ''}
      <div style="margin-top:52px;background:${BRAND.surface};border:1px solid ${BRAND.hairline};border-radius:26px;padding:34px 38px;display:flex;flex-direction:column;gap:20px;max-width:880px;">
        ${(d.rows || []).map((r, i) => `
          <div style="display:flex;align-items:center;justify-content:space-between;${i ? `border-top:1px solid ${BRAND.hairline};padding-top:20px;` : ''}">
            <div style="display:flex;align-items:center;gap:20px;">
              <div style="width:15px;height:15px;border-radius:50%;background:${i === 0 ? BRAND.cyan : BRAND.hairline};${i === 0 ? `box-shadow:0 0 16px ${BRAND.cyan};` : ''}"></div>
              <div style="font-size:31px;font-weight:${i === 0 ? 600 : 400};color:${i === 0 ? BRAND.fg : BRAND.muted};">${r.label}</div>
            </div>
            <div style="font-family:'Geist Mono',monospace;font-size:28px;color:${i === 0 ? BRAND.cyan : BRAND.muted};">${r.value}</div>
          </div>`).join('')}
      </div>
    </div>`,

  // Numbered steps / list
  list: (d) => `
    <div class="body">
      ${d.kicker ? `<div class="kicker">${d.kicker}</div>` : ''}
      <div class="headline" style="font-size:82px;margin-bottom:52px;">${d.headline}</div>
      <div style="display:flex;flex-direction:column;gap:34px;">
        ${(d.items || []).map((it, i) => `
          <div style="display:flex;align-items:flex-start;gap:30px;">
            <div style="flex:none;width:64px;height:64px;border-radius:18px;background:${BRAND.surfaceHi};border:1px solid ${BRAND.hairline};
              display:flex;align-items:center;justify-content:center;font-family:'Geist Mono',monospace;font-size:28px;font-weight:600;color:${BRAND.cyan};">${i + 1}</div>
            <div style="font-size:36px;line-height:1.35;color:${BRAND.fg};font-weight:500;padding-top:9px;max-width:790px;">${it}</div>
          </div>`).join('')}
      </div>
    </div>`,
};

export function buildHTML(post) {
  const layout = layouts[post.layout] || layouts.statement;
  return `<!doctype html><html><head><meta charset="utf-8"><style>${baseCSS}</style></head>
<body><div class="canvas">
  <div class="glow glow-cyan"></div>
  <div class="glow glow-mag"></div>
  <div class="grid"></div>
  <div class="pad">
    <div class="head">
      <div class="wordmark">BOLTS</div>
      ${post.badge ? `<div class="eyebrow">${post.badge}</div>` : ''}
    </div>
    ${layout(post)}
    <div class="foot">
      <div class="handle">${BRAND.site}</div>
      <div class="cta"><span class="dot"></span>${post.cta || 'Track every trick'}</div>
    </div>
  </div>
</div></body></html>`;
}
