@import url('https://cdn.jsdelivr.net/gh/rastikerdar/tanha-font@v0.10/dist/font-face.css');

@font-face {
  font-family: 'GFS Didot';
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: url('https://cdn.jsdelivr.net/fontsource/fonts/gfs-didot@5.3.0/latin-400-normal.woff2') format('woff2'),
       url('https://cdn.jsdelivr.net/fontsource/fonts/gfs-didot@5.3.0/latin-400-normal.woff') format('woff');
}

:root {
  --radius: 4px;
  --font-en: 'GFS Didot', serif;
  --font-fa: 'Tanha', sans-serif;

  /* Semantic accent colors as variables */
  --color-link:    #4a9eff;
  --color-warn:    #e07b39;
  --color-danger:  #e03939;
}

[data-theme="dark"] {
  --bg:           #0a0a0a;
  --bg-raised:    #111111;
  --border:       #242424;
  --text:         #ededed;
  --text-dim:     #8a8a8a;
  --text-faint:   #5a5a5a;

  --code-bg:      #0e0e0e;
  --code-border:  #292929;
  --code-text:    #d7d7d7;

  --table-head:   #181818;
  --table-hover:  #151515;

  --quote-bg:     #141414;
  --quote-border: #555555;

  --latex-bg:     #101010;
}

[data-theme="light"] {
  --bg:           #ffffff;
  --bg-raised:    #f5f5f5;
  --border:       #e4e4e4;
  --text:         #111111;
  --text-dim:     #666666;
  --text-faint:   #a0a0a0;

  --code-bg:      #f5f5f5;
  --code-border:  #d0d0d0;
  --code-text:    #1a1a1a;

  --table-head:   #f0f0f0;
  --table-hover:  #f8f8f8;

  --quote-bg:     #eef2ff;
  --quote-border: #7b8cde;

  --latex-bg:     #f7f7f7;
}

/* Ensure theme tokens are always set — fallback to dark if attr missing */
:root { color-scheme: dark light; }

* { box-sizing: border-box; }

html, body {
  margin: 0;
  padding: 0;
  background: var(--bg);
  color: var(--text);
  font-family: var(--font-en);
  transition: background .15s ease, color .15s ease;
}

img {
  max-width: 100%;
  display: block;
}

a {
  color: inherit;
  text-decoration: none;
}

button {
  font-family: inherit;
  cursor: pointer;
}

/* ---------- Header ---------- */

.site-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 28px;
  border-bottom: 1px solid var(--border);
  position: sticky;
  top: 0;
  background: var(--bg);
  z-index: 20;
}

.brand {
  display: flex;
  align-items: center;
  gap: 6px;
}

.brand img {
  height: 30px;
  width: 30px;
}

.brand-name {
  font-family: var(--font-en);
  font-size: 17px;
  font-weight: 700;
  letter-spacing: 0.2px;
}

.header-icons {
  display: flex;
  align-items: center;
  gap: 2px;
}

.icon-btn {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: transparent;
  border-radius: 50%;
  color: var(--text);
  transition: background .15s ease;
}

.icon-btn:hover {
  background: var(--bg-raised);
}

.icon-btn svg {
  width: 17px;
  height: 17px;
}

.btn-new {
  display: flex;
  align-items: center;
  gap: 6px;
  height: 32px;
  padding: 0 14px;
  border-radius: 999px;
  background: transparent;
  border: 1px solid var(--text);
  color: var(--text);
  font-size: 13px;
  font-weight: 600;
  white-space: nowrap;
  transition: background .15s ease;
  margin-inline-end: 4px;
}

.btn-new:hover {
  background: var(--bg-raised);
}

.btn-new svg {
  width: 15px;
  height: 15px;
}

[data-theme="dark"]  .icon-sun  { display: none; }
[data-theme="light"] .icon-moon { display: none; }

/* ---------- Search overlay ---------- */

.search-bar {
  display: flex;
  align-items: center;
  gap: 8px;
  max-width: 760px;
  margin: 0 auto;
  padding: 14px 24px 0;
}

.search-bar.hidden {
  display: none;
}

#search-input {
  flex: 1;
  background: var(--bg-raised);
  border: 1px solid var(--border);
  color: var(--text);
  padding: 10px 14px;
  border-radius: var(--radius);
  font-family: inherit;
  font-size: 14px;
  outline: none;
}

#search-input:focus {
  border-color: var(--text-dim);
}

#search-input::placeholder {
  color: var(--text-faint);
}

#date-filter {
  background: var(--bg-raised);
  border: 1px solid var(--border);
  color: var(--text-dim);
  padding: 9px 10px;
  border-radius: var(--radius);
  font-family: inherit;
  font-size: 13px;
  outline: none;
}

/* ---------- Post list ---------- */

.post-list {
  max-width: 760px;
  margin: 0 auto;
  padding: 32px 24px 100px;
  display: flex;
  flex-direction: column;
}

.post-card {
  display: block;
  border-bottom: 1px solid var(--border);
  padding: 32px 0;
}

.post-card:first-child {
  padding-top: 0;
}

.post-banner {
  width: 100%;
  aspect-ratio: 16 / 7;
  object-fit: cover;
  border-radius: var(--radius);
  margin-bottom: 20px;
  background: var(--bg-raised);
  pointer-events: none;
  user-select: none;
}

.post-title {
  font-family: var(--font-fa);
  font-size: 26px;
  font-weight: 700;
  line-height: 1.5;
  margin: 0 0 10px;
}

.post-excerpt {
  font-family: var(--font-fa);
  font-size: 15px;
  line-height: 1.9;
  color: var(--text-dim);
  margin: 0 0 18px;
}

.post-footer {
  display: flex;
  align-items: center;
  gap: 12px;
}

.post-meta {
  display: flex;
  align-items: center;
  gap: 10px;
}

.author-avatar {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  object-fit: cover;
  background: var(--bg-raised);
}

.author-name {
  font-size: 13px;
  font-weight: 500;
}

.post-date {
  font-size: 13px;
  color: var(--text-faint);
  margin-inline-start: auto;
  display: flex;
  align-items: center;
  gap: 5px;
}

.pin-icon {
  width: 13px;
  height: 13px;
}

.empty-state {
  text-align: center;
  color: var(--text-faint);
  padding: 60px 0;
  font-size: 14px;
}

.btn-readmore {
  display: inline-block;
  background: none;
  border: none;
  padding: 0;
  color: var(--text-dim);
  font-size: 14px;
  margin-bottom: 18px;
  cursor: pointer;
  text-decoration: underline;
  text-underline-offset: 2px;
  transition: color .15s ease;
}

.btn-readmore:hover {
  color: var(--text);
}

.post-body {
  font-family: var(--font-fa);
  font-size: 15px;
  line-height: 1.9;
  color: var(--text);
  margin: 0 0 18px;
  direction: rtl;
  text-align: right;
}

/* ---------- Post content ---------- */

.post-body h1,
.post-body h2,
.post-body h3,
.post-body h4,
.post-body h5,
.post-body h6 {
  font-family: var(--font-fa);
  color: var(--text);
  line-height: 1.5;
}

.post-body h1 { font-size: 28px; margin: 24px 0 12px; }
.post-body h2 { font-size: 23px; margin: 22px 0 10px; }
.post-body h3 { font-size: 20px; margin: 20px 0  8px; }
.post-body h4 { font-size: 17px; margin: 18px 0  7px; }
.post-body h5 { font-size: 15px; margin: 16px 0  6px; }
.post-body h6 { font-size: 14px; margin: 14px 0  5px; color: var(--text-dim); }

.post-body p { margin: 0 0 16px; }

.post-body strong { font-weight: 800; }
.post-body em     { font-style: italic; }
.post-body u      { text-underline-offset: 3px; }
.post-body s      { opacity: .75; }

.post-body img,
.post-body video,
.post-body iframe {
  max-width: 100%;
  border-radius: var(--radius);
  margin: 16px 0;
  display: block;
}

/* ---------- Blockquote ---------- */

.post-body blockquote {
  background: var(--quote-bg);
  border-inline-end: 3px solid var(--quote-border);
  border-inline-start: none;
  margin: 18px 0;
  padding: 12px 16px 12px 12px;
  border-radius: var(--radius) 0 0 var(--radius);
  color: var(--text-dim);
  font-style: italic;
}

.post-body blockquote p:last-child { margin-bottom: 0; }

/* ---------- Code ---------- */

.post-body pre,
.editor-body pre {
  direction: ltr;
  text-align: left;
  background: var(--code-bg);
  border: 1px solid var(--code-border);
  border-radius: 8px;
  padding: 16px 18px;
  margin: 18px 0;
  overflow-x: auto;
  white-space: pre;
  font-family: monospace;
  font-size: 13px;
  line-height: 1.7;
  color: var(--code-text);
  tab-size: 2;
  -webkit-overflow-scrolling: touch;
}

.post-body code,
.editor-body code {
  direction: ltr;
  unicode-bidi: isolate;
  font-family: monospace;
  font-size: .9em;
  background: var(--code-bg);
  border: 1px solid var(--code-border);
  color: var(--code-text);
  padding: 2px 5px;
  border-radius: 4px;
}

.post-body pre code,
.editor-body pre code {
  background: transparent;
  border: none;
  padding: 0;
  border-radius: 0;
  font-size: inherit;
  color: inherit;
}

/* ---------- Lists ---------- */

.post-body ul,
.post-body ol {
  padding-inline-start: 26px;
  margin: 10px 0 18px;
}

.post-body li {
  margin: 4px 0;
  padding-inline-start: 2px;
}

/* ---------- Links ---------- */

.post-body a {
  color: var(--text);
  text-decoration: underline;
  text-decoration-thickness: 1px;
  text-underline-offset: 3px;
  transition: opacity .15s ease;
}

.post-body a:hover { opacity: .65; }

/* ---------- Tables ---------- */

.post-body table,
.editor-body table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  margin: 20px 0;
  border: 1px solid var(--border);
  border-radius: 8px;
  overflow: hidden;
  background: var(--bg-raised);
}

.post-body th,
.post-body td,
.editor-body th,
.editor-body td {
  border-inline-start: 1px solid var(--border);
  border-bottom: 1px solid var(--border);
  padding: 10px 12px;
  font-family: var(--font-fa);
  font-size: 14px;
  line-height: 1.8;
  text-align: right;
  vertical-align: middle;
  color: var(--text);
  position: relative;
}

.post-body th,
.editor-body th {
  background: var(--table-head);
  font-weight: 700;
}

.post-body tr:last-child td,
.post-body tr:last-child th,
.editor-body tr:last-child td,
.editor-body tr:last-child th {
  border-bottom: none;
}

.post-body th:last-child,
.post-body td:last-child,
.editor-body th:last-child,
.editor-body td:last-child {
  border-inline-start: none;
}

.post-body tbody tr:hover td,
.editor-body tbody tr:hover td {
  background: var(--table-hover);
}

.post-body table p,
.editor-body table p { margin: 0; }

/* ---------- Horizontal rule ---------- */

.post-body hr,
.editor-body hr {
  border: none;
  border-top: 1px solid var(--border);
  margin: 28px 0;
}

/* ---------- LaTeX ---------- */

.post-body .katex,
.editor-body .katex { color: var(--text); }

.post-body .katex-block,
.editor-body .katex-block {
  display: block;
  width: 100%;
  margin: 20px 0;
  padding: 16px;
  background: var(--latex-bg);
  border: 1px solid var(--border);
  border-radius: 8px;
  text-align: center;
  overflow-x: auto;
  overflow-y: hidden;
  direction: ltr;
  -webkit-overflow-scrolling: touch;
}

.post-body .katex-inline,
.editor-body .katex-inline {
  display: inline-block;
  padding: 0 2px;
  direction: ltr;
  vertical-align: middle;
}

.post-body .katex-display,
.editor-body .katex-display { margin: 0; }

.post-body .katex-block .katex,
.editor-body .katex-block .katex { font-size: 1.1em; }

/* ---------- Editor ---------- */

.editor-body {
  min-height: 300px;
  max-height: min(560px, 60vh);
  overflow-y: auto;
  background: var(--bg-raised);
  border: 1px solid var(--border);
  border-radius: 0 0 var(--radius) var(--radius);
  padding: 16px;
  font-family: var(--font-fa);
  font-size: 15px;
  line-height: 1.9;
  color: var(--text);
  outline: none;
  word-break: break-word;
  direction: rtl;
  text-align: right;
}

.editor-body:empty::before {
  content: attr(data-placeholder);
  color: var(--text-faint);
  pointer-events: none;
  display: block;
}

.editor-body h1 { font-size: 28px; font-weight: 800; line-height: 1.5; margin: 14px 0 6px; }
.editor-body h2 { font-size: 22px; font-weight: 700; line-height: 1.5; margin: 12px 0 5px; }
.editor-body h3 { font-size: 18px; font-weight: 700; line-height: 1.5; margin: 10px 0 4px; }
.editor-body h4 { font-size: 16px; font-weight: 700; line-height: 1.5; margin:  8px 0 3px; }
.editor-body h5 { font-size: 14px; font-weight: 700; line-height: 1.5; margin:  7px 0 3px; }
.editor-body h6 { font-size: 13px; font-weight: 700; line-height: 1.5; margin:  6px 0 3px; color: var(--text-dim); }

.editor-body p { margin: 0 0 14px; }

.editor-body img,
.editor-body video,
.editor-body iframe {
  max-width: 100%;
  border-radius: var(--radius);
  margin: 10px 0;
  display: block;
}

.editor-body img   { height: auto; }
.editor-body video { background: var(--bg); }
.editor-body iframe {
  border: 1px solid var(--border);
  background: var(--bg);
}

.editor-body blockquote {
  background: var(--quote-bg);
  border-inline-end: 3px solid var(--quote-border);
  border-inline-start: none;
  margin: 10px 0;
  padding: 8px 14px 8px 10px;
  border-radius: var(--radius) 0 0 var(--radius);
  color: var(--text-dim);
  font-style: italic;
}

.editor-body blockquote p:last-child { margin-bottom: 0; }

.editor-body pre {
  background: var(--code-bg);
  border: 1px solid var(--code-border);
  border-radius: 8px;
  padding: 14px 16px;
  font-family: monospace;
  font-size: 13px;
  line-height: 1.7;
  color: var(--code-text);
  overflow-x: auto;
  white-space: pre;
  direction: ltr;
  text-align: left;
  margin: 12px 0;
}

.editor-body code {
  background: var(--code-bg);
  border: 1px solid var(--code-border);
  color: var(--code-text);
  padding: 2px 5px;
  border-radius: 4px;
  font-family: monospace;
  font-size: .9em;
  direction: ltr;
  unicode-bidi: isolate;
}

.editor-body pre code {
  background: transparent;
  border: none;
  padding: 0;
  font-size: inherit;
}

.editor-body ul,
.editor-body ol {
  padding-inline-start: 24px;
  margin: 6px 0 14px;
}

.editor-body li { margin: 2px 0; }

.editor-body a {
  color: var(--text);
  text-decoration: underline;
  text-underline-offset: 3px;
}

.editor-body a:hover { opacity: .7; }

.editor-body table {
  border-collapse: separate;
  border-spacing: 0;
  width: 100%;
  margin: 16px 0;
  border: 1px solid var(--border);
  border-radius: 8px;
  overflow: hidden;
  background: var(--bg-raised);
}

.editor-body td,
.editor-body th {
  border-inline-start: 1px solid var(--border);
  border-bottom: 1px solid var(--border);
  padding: 8px 12px;
  font-size: 14px;
  text-align: right;
  vertical-align: middle;
  color: var(--text);
  position: relative;
}

.editor-body th {
  background: var(--table-head);
  font-weight: 700;
}

.editor-body tr:last-child td,
.editor-body tr:last-child th { border-bottom: none; }

.editor-body td:last-child,
.editor-body th:last-child { border-inline-start: none; }

.editor-body tr:hover td { background: var(--table-hover); }

.editor-body .katex-block {
  display: block;
  width: 100%;
  margin: 12px 0;
  padding: 12px;
  background: var(--latex-bg);
  border: 1px solid var(--border);
  border-radius: 8px;
  text-align: center;
  overflow-x: auto;
  overflow-y: hidden;
  direction: ltr;
  -webkit-overflow-scrolling: touch;
}

.editor-body .katex-inline {
  display: inline-block;
  padding: 0 2px;
  direction: ltr;
  vertical-align: middle;
}

.editor-body .katex { color: var(--text); }

/* ---------- Character counter ---------- */

.char-counter {
  font-family: var(--font-fa);
  font-size: 12px;
  color: var(--text-faint);
  text-align: left;
  margin-top: 4px;
}

.char-counter.warn { color: var(--color-warn); }
.char-counter.over { color: var(--color-danger); }

/* ---------- Link popup ---------- */

.link-popup {
  position: fixed;
  z-index: 400;
  background: var(--bg-raised);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 6px 10px;
  box-shadow: 0 4px 16px rgba(0,0,0,.18);
  display: none;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  font-family: var(--font-en);
  max-width: min(320px, calc(100vw - 16px));
}

.link-popup.visible { display: flex; }

.link-popup-url {
  flex: 1;
  color: var(--text-dim);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  min-width: 0;
}

.link-popup-url a {
  color: var(--color-link);
  text-decoration: none;
}

.link-popup-url a:hover { text-decoration: underline; }

.link-popup-btn {
  background: transparent;
  border: 1px solid var(--border);
  color: var(--text-dim);
  padding: 3px 8px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 11px;
  font-family: var(--font-fa);
  white-space: nowrap;
  flex-shrink: 0;
}

.link-popup-btn:hover { background: var(--border); }

.link-popup-btn.danger {
  border-color: var(--color-danger);
  color: var(--color-danger);
}

.link-popup-btn.danger:hover {
  background: var(--color-danger);
  color: #fff;
}

/* ---------- Cell menu ---------- */

.cell-menu {
  position: fixed;
  z-index: 400;
  background: var(--bg-raised);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 6px;
  box-shadow: 0 4px 16px rgba(0,0,0,.18);
  display: none;
  flex-direction: column;
  gap: 2px;
  min-width: 150px;
  max-width: calc(100vw - 16px);
}

.cell-menu.visible { display: flex; }

.cell-menu-item {
  padding: 6px 10px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 12px;
  font-family: var(--font-fa);
  color: var(--text);
  display: flex;
  align-items: center;
  gap: 8px;
}

.cell-menu-item:hover { background: var(--border); }

.cell-menu-title {
  font-size: 10px;
  color: var(--text-faint);
  padding: 4px 10px 2px;
  font-family: var(--font-fa);
}

.cell-menu-sep {
  height: 1px;
  background: var(--border);
  margin: 3px 0;
}

.cell-color-row {
  display: flex;
  gap: 4px;
  padding: 4px 10px;
  flex-wrap: wrap;
}

.cell-color-dot {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  cursor: pointer;
  border: 2px solid transparent;
  transition: transform .1s;
}

.cell-color-dot:hover {
  transform: scale(1.2);
  border-color: var(--text);
}

/* ---------- Modal ---------- */

.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,.55);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 500;
  padding: 24px;
}

.modal-overlay.hidden { display: none; }

.modal {
  background: var(--bg);
  border: 1px solid var(--border);
  border-radius: calc(var(--radius) * 2);
  padding: 24px;
  width: 100%;
  max-width: 400px;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.modal-title {
  font-family: var(--font-fa);
  font-size: 16px;
  font-weight: 700;
  margin: 0;
}

.modal-input {
  background: var(--bg-raised);
  border: 1px solid var(--border);
  color: var(--text);
  padding: 10px 14px;
  border-radius: var(--radius);
  font-family: var(--font-fa);
  font-size: 14px;
  outline: none;
  width: 100%;
}

.modal-input:focus      { border-color: var(--text-dim); }
.modal-input::placeholder { color: var(--text-faint); }

.modal-actions {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
}

.btn-cancel {
  background: transparent;
  border: 1px solid var(--border);
  color: var(--text-dim);
  padding: 8px 18px;
  border-radius: var(--radius);
  font-family: var(--font-fa);
  font-size: 13px;
  cursor: pointer;
}

.btn-cancel:hover { background: var(--bg-raised); }

.btn-insert {
  background: var(--text);
  border: 1px solid var(--text);
  color: var(--bg);
  padding: 8px 18px;
  border-radius: var(--radius);
  font-family: var(--font-fa);
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
}

.btn-insert:hover { opacity: .85; }

/* ---------- Focus ---------- */

button:focus-visible,
a:focus-visible,
input:focus-visible,
select:focus-visible,
.editor-body:focus-visible {
  outline: 2px solid var(--text-dim);
  outline-offset: 2px;
}

/* ---------- Responsive ---------- */

@media (max-width: 640px) {

  .site-header { padding: 14px 18px; }

  .post-title   { font-size: 21px; }
  .post-body    { font-size: 15px; }

  .post-body table,
  .editor-body table {
    display: block;
    overflow-x: auto;
    white-space: nowrap;
    -webkit-overflow-scrolling: touch;
  }

  .post-body pre,
  .editor-body pre {
    font-size: 12px;
    padding: 12px 14px;
  }

  .post-body .katex-block,
  .editor-body .katex-block { padding: 12px 8px; }

  .post-body iframe,
  .editor-body iframe { max-width: 100%; }
}

/* ---------- Pager ---------- */

.pager {
  max-width: 760px;
  margin: 0 auto;
  padding: 0 24px 48px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.pager-btn {
  background: transparent;
  border: 1px solid var(--border);
  color: var(--text-dim);
  padding: 8px 18px;
  border-radius: var(--radius);
  font-family: var(--font-fa);
  font-size: 13px;
  cursor: pointer;
  transition: background .15s ease, color .15s ease;
}

.pager-btn:hover:not(:disabled) {
  background: var(--bg-raised);
  color: var(--text);
}

.pager-btn:disabled {
  opacity: .35;
  cursor: default;
}

.pager-label {
  font-family: var(--font-fa);
  font-size: 13px;
  color: var(--text-faint);
}

/* ---------- Footer ---------- */

.site-footer {
  border-top: 1px solid var(--border);
  padding: 32px 24px 40px;
  text-align: center;
  font-family: var(--font-fa);
  font-size: 13px;
  color: var(--text-faint);
  line-height: 1.8;
  direction: rtl;
}

.footer-links {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: 6px 20px;
  margin-bottom: 16px;
}

.footer-links a {
  color: var(--text-dim);
  text-decoration: none;
  transition: color .15s ease;
}

.footer-links a:hover {
  color: var(--text);
}

.site-footer p {
  margin: 0;
  color: var(--text-faint);
}

.site-footer p a {
  color: var(--text-dim);
  text-decoration: underline;
  text-underline-offset: 2px;
  transition: color .15s ease;
}

.site-footer p a:hover {
  color: var(--text);
}

/* ---------- Code label ---------- */

.code-label {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-family: var(--font-en);
  font-size: 11px;
  font-weight: 600;
  color: var(--text-faint);
  background: var(--code-bg);
  border: 1px solid var(--code-border);
  border-radius: var(--radius) var(--radius) 0 0;
  padding: 4px 10px;
  margin-bottom: -1px;
  letter-spacing: 0.3px;
  user-select: none;
}

.code-label svg {
  width: 13px;
  height: 13px;
  flex-shrink: 0;
  stroke: currentColor;
  fill: none;
  stroke-width: 2;
}

/* ---------- Reduced motion ---------- */

@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: .01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: .01ms !important;
    scroll-behavior: auto !important;
  }
}
