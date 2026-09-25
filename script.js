/* ============================================================
   Maborai — script.js
   ============================================================ */

'use strict';

/* ----------------------------------------------------------
   1. Theme toggle
   ---------------------------------------------------------- */

(function () {
  const root = document.documentElement;
  const btn  = document.getElementById('theme-toggle');
  const logo = document.getElementById('logo-img');

  function applyTheme(theme) {
    root.setAttribute('data-theme', theme);
    try { localStorage.setItem('theme', theme); } catch (_) {}
    if (logo) {
      logo.src = theme === 'dark' ? 'logo-dark.png' : 'logo-light.png';
    }
  }

  if (btn) {
    btn.addEventListener('click', () => {
      const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      applyTheme(next);
    });
  }

  /* Sync logo on first load */
  if (logo) {
    const current = root.getAttribute('data-theme') || 'dark';
    logo.src = current === 'dark' ? 'logo-dark.png' : 'logo-light.png';
  }
})();


/* ----------------------------------------------------------
   2. Search bar toggle
   ---------------------------------------------------------- */

(function () {
  const toggleBtn = document.getElementById('search-toggle');
  const searchBar = document.getElementById('search-bar');
  const input     = document.getElementById('search-input');

  if (!toggleBtn || !searchBar) return;

  toggleBtn.addEventListener('click', () => {
    const hidden = searchBar.classList.toggle('hidden');
    if (!hidden && input) input.focus();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !searchBar.classList.contains('hidden')) {
      searchBar.classList.add('hidden');
    }
  });
})();


/* ----------------------------------------------------------
   3. Data — fetch from index.json
   ---------------------------------------------------------- */

/*
  index.json schema (per item):
  {
    title        : string
    authorName   : string
    authorAvatar : string (URL)
    content      : string (HTML)
    date         : string (YYYY-MM-DD)
    pinned       : boolean
    banner       : string (URL, optional)
  }
*/

const PAGE_SIZE = 10;
let currentPage = 1;
let cachedPosts = null;   /* in-memory cache after first fetch */

async function fetchPosts() {
  if (cachedPosts) return cachedPosts;
  try {
    const res = await fetch('index.json');
    if (!res.ok) throw new Error('fetch failed');
    const data = await res.json();
    /* Normalise field names to internal format */
    cachedPosts = data.map((p, i) => ({
      id     : String(i),
      title  : p.title        || '',
      author : p.authorName   || 'ناشناس',
      avatar : p.authorAvatar || '',
      body   : p.content      || '',
      date   : p.date         || '',
      pinned : p.pinned       || false,
      banner : p.banner       || '',
    }));
    return cachedPosts;
  } catch (err) {
    console.error('Maborai: could not load index.json', err);
    return [];
  }
}


/* ----------------------------------------------------------
   4. Rendering helpers
   ---------------------------------------------------------- */

/* Sanitise HTML with DOMPurify if available */
function sanitise(html) {
  if (window.DOMPurify) {
    return DOMPurify.sanitize(html, { USE_PROFILES: { html: true } });
  }
  return html;
}

/* Format ISO date → Persian */
function formatDate(iso) {
  if (!iso) return '';
  try {
    return new Date(iso).toLocaleDateString('fa-IR', {
      year: 'numeric', month: 'long', day: 'numeric'
    });
  } catch (_) {
    return iso;
  }
}

/* Strip HTML tags to make a plain-text excerpt */
function makeExcerpt(html, maxLen = 160) {
  const div = document.createElement('div');
  div.innerHTML = html;
  const text = (div.textContent || '').trim().replace(/\s+/g, ' ');
  return text.length > maxLen ? text.slice(0, maxLen) + '…' : text;
}

function buildPostCard(post) {
  const card = document.createElement('article');
  card.className = 'post-card';
  card.dataset.id = post.id;

  const bannerHTML = post.banner
    ? `<img class="post-banner" src="${post.banner}" alt="">`
    : '';

  const pinHTML = post.pinned
    ? `<svg class="pin-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
         <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
       </svg>`
    : '';

  const avatarHTML = post.avatar
    ? `<img class="author-avatar" src="${post.avatar}" alt="${post.author}">`
    : `<div class="author-avatar"></div>`;

  const excerpt = makeExcerpt(post.body);

  card.innerHTML = `
    ${bannerHTML}
    <h2 class="post-title">${post.title || 'بدون عنوان'}</h2>
    ${excerpt ? `<p class="post-excerpt">${excerpt}</p>` : ''}
    <button class="btn-readmore" data-id="${post.id}">ادامه مطلب</button>
    <div class="post-body" hidden></div>
    <div class="post-footer">
      <div class="post-meta">
        ${avatarHTML}
        <span class="author-name">${post.author}</span>
      </div>
      <span class="post-date">
        ${pinHTML}
        ${formatDate(post.date)}
      </span>
    </div>
  `;

  const btn  = card.querySelector('.btn-readmore');
  const body = card.querySelector('.post-body');

  btn.addEventListener('click', () => {
    if (!body.hidden) {
      body.hidden = true;
      body.innerHTML = '';
      btn.textContent = 'ادامه مطلب';
    } else {
      body.innerHTML = sanitise(post.body);
      body.hidden = false;
      btn.textContent = 'بستن';
    }
  });

  return card;
}


/* ----------------------------------------------------------
   5. Sort + filter
   ---------------------------------------------------------- */

function getSorted(posts) {
  return [...posts].sort((a, b) => {
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return  1;
    /* newest date first */
    return (b.date || '').localeCompare(a.date || '');
  });
}

function applyFilter(posts, query, dateVal) {
  let result = getSorted(posts);
  if (query) {
    const q = query.toLowerCase();
    result = result.filter(p =>
      p.title.toLowerCase().includes(q)  ||
      p.author.toLowerCase().includes(q) ||
      makeExcerpt(p.body).toLowerCase().includes(q)
    );
  }
  if (dateVal) {
    result = result.filter(p => p.date === dateVal);
  }
  return result;
}


/* ----------------------------------------------------------
   6. Render list + pagination
   ---------------------------------------------------------- */

function renderList(filtered) {
  const list      = document.getElementById('post-list');
  const empty     = document.getElementById('empty-state');
  const pager     = document.getElementById('pager');
  const prevBtn   = document.getElementById('prev-page');
  const nextBtn   = document.getElementById('next-page');
  const pageLabel = document.getElementById('page-label');

  if (!list) return;
  list.innerHTML = '';

  if (!filtered.length) {
    if (empty) empty.hidden = false;
    if (pager) pager.hidden = true;
    return;
  }

  if (empty) empty.hidden = true;

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  currentPage = Math.max(1, Math.min(currentPage, totalPages));

  const slice = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
     currentPage      * PAGE_SIZE
  );

  slice.forEach(p => list.appendChild(buildPostCard(p)));

  if (pager) {
    pager.hidden = totalPages <= 1;
    if (pageLabel) pageLabel.textContent = `صفحه ${currentPage} از ${totalPages}`;
    if (prevBtn)   prevBtn.disabled = currentPage === 1;
    if (nextBtn)   nextBtn.disabled = currentPage === totalPages;
  }
}


/* ----------------------------------------------------------
   7. Wire everything together
   ---------------------------------------------------------- */

(async function init() {
  const searchInput = document.getElementById('search-input');
  const dateFilter  = document.getElementById('date-filter');
  const prevBtn     = document.getElementById('prev-page');
  const nextBtn     = document.getElementById('next-page');

  const posts = await fetchPosts();

  function refresh() {
    const query   = searchInput ? searchInput.value.trim() : '';
    const dateVal = dateFilter  ? dateFilter.value         : '';
    renderList(applyFilter(posts, query, dateVal));
  }

  if (searchInput) searchInput.addEventListener('input',  () => { currentPage = 1; refresh(); });
  if (dateFilter)  dateFilter.addEventListener('change',  () => { currentPage = 1; refresh(); });
  if (prevBtn)     prevBtn.addEventListener('click',      () => { currentPage--;   refresh(); });
  if (nextBtn)     nextBtn.addEventListener('click',      () => { currentPage++;   refresh(); });

  refresh();
})();
