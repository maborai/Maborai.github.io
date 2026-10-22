/* ---------- Helpers ---------- */
function escapeHtml(str = '') {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
function escapeAttr(str = '') {
  return escapeHtml(str).replace(/"/g, '&quot;');
}

function slugify(title = '') {
  return title.trim().toLowerCase()
    .replace(/[\s_]+/g, '-')
    .replace(/[^\w\u0600-\u06FF-]/g, '')
    .replace(/--+/g, '-')
    .slice(0, 80);
}

function formatDate(dateStr) {
  try {
    return new Intl.DateTimeFormat('fa-IR', {
      year: 'numeric', month: 'long', day: 'numeric'
    }).format(new Date(dateStr));
  } catch { return dateStr; }
}

/* ---------- Theme ---------- */
const root       = document.documentElement;
const themeToggle = document.getElementById('theme-toggle');
const logoImg    = document.getElementById('logo-img');

function applyTheme(theme) {
  root.setAttribute('data-theme', theme);
  if (logoImg) logoImg.src = theme === 'dark' ? 'logo-dark.png' : 'logo-light.png';
  localStorage.setItem('theme', theme);
}

const savedTheme   = localStorage.getItem('theme');
const systemDark   = window.matchMedia('(prefers-color-scheme: dark)').matches;
applyTheme(savedTheme || (systemDark ? 'dark' : 'light'));

themeToggle.addEventListener('click', () => {
  applyTheme(root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
});

/* ---------- Dropdown menu ---------- */
const menuToggle   = document.getElementById('menu-toggle');
const dropdownMenu = document.getElementById('dropdown-menu');

menuToggle.addEventListener('click', (e) => {
  e.stopPropagation();
  const open = !dropdownMenu.classList.contains('hidden');
  dropdownMenu.classList.toggle('hidden', open);
  menuToggle.setAttribute('aria-expanded', String(!open));
});

document.addEventListener('click', () => {
  dropdownMenu.classList.add('hidden');
  menuToggle.setAttribute('aria-expanded', 'false');
});

dropdownMenu.addEventListener('click', (e) => e.stopPropagation());

/* ---------- Search toggle ---------- */
const searchToggle = document.getElementById('search-toggle');
const searchBar    = document.getElementById('search-bar');
searchToggle.addEventListener('click', () => {
  searchBar.classList.toggle('hidden');
  if (!searchBar.classList.contains('hidden')) {
    document.getElementById('search-input').focus();
  }
});

/* ---------- Post list ---------- */
const listEl      = document.getElementById('post-list');
const emptyEl     = document.getElementById('empty-state');
const searchInput = document.getElementById('search-input');
const dateFilter  = document.getElementById('date-filter');

const PAGE_SIZE     = 25;
const PAGER_ENABLED = false;

let allPosts        = [];
let currentFiltered = [];
let currentPage     = 1;

const pagerEl   = document.getElementById('pager');
const prevBtn   = document.getElementById('prev-page');
const nextBtn   = document.getElementById('next-page');
const pageLabel = document.getElementById('page-label');

/* ---------- Load posts from posts/*.json ----------
   Expects posts/index.json to be an array of slugs:
   ["hello-world", "second-post", ...]
   Each slug maps to posts/<slug>.json
----------------------------------------------------- */
async function loadPosts() {
  try {
    const manifestRes = await fetch('posts/index.json', { cache: 'no-store' });
    if (!manifestRes.ok) throw new Error('posts/index.json not found');
    const slugs = await manifestRes.json(); // string[]

    if (!Array.isArray(slugs) || slugs.length === 0) {
      showEmpty('هنوز پستی منتشر نشده.');
      return;
    }

    // Fetch all post JSONs in parallel
    const results = await Promise.allSettled(
      slugs.map(slug =>
        fetch(`posts/${slug}.json`, { cache: 'no-store' }).then(r => {
          if (!r.ok) throw new Error(`posts/${slug}.json not found`);
          return r.json();
        }).then(post => ({ ...post, slug: post.slug || slug }))
      )
    );

    allPosts = results
      .filter(r => r.status === 'fulfilled')
      .map(r => r.value)
      .sort((a, b) => {
        if (a.pinned && !b.pinned) return -1;
        if (!a.pinned && b.pinned) return  1;
        return new Date(b.date) - new Date(a.date);
      });

    if (allPosts.length === 0) {
      showEmpty('هیچ پستی بارگذاری نشد.');
      return;
    }

    render(allPosts);
  } catch (err) {
    console.error(err);
    showEmpty('خطا در بارگذاری پست‌ها: ' + err.message);
  }
}

function showEmpty(msg) {
  listEl.innerHTML = '';
  emptyEl.hidden = false;
  emptyEl.textContent = msg;
}

/* ---------- Render ---------- */
function render(posts) {
  currentFiltered = posts;
  currentPage = 1;
  renderPage();
}

function renderPage() {
  listEl.innerHTML = '';

  if (!currentFiltered.length) {
    emptyEl.hidden = false;
    emptyEl.textContent = 'پستی پیدا نشد.';
    if (pagerEl) pagerEl.hidden = true;
    return;
  }
  emptyEl.hidden = true;

  const totalPages = Math.max(1, Math.ceil(currentFiltered.length / PAGE_SIZE));
  currentPage = Math.min(currentPage, totalPages);
  const start     = (currentPage - 1) * PAGE_SIZE;
  const pagePosts = currentFiltered.slice(start, start + PAGE_SIZE);

  const frag = document.createDocumentFragment();
  pagePosts.forEach(post => frag.appendChild(buildCard(post)));
  listEl.appendChild(frag);

  if (pagerEl) {
    pagerEl.hidden = !PAGER_ENABLED;
    prevBtn.disabled = currentPage <= 1;
    nextBtn.disabled = currentPage >= totalPages;
    pageLabel.textContent = `صفحه ${currentPage} از ${totalPages}`;
  }

  window.scrollTo({ top: 0, behavior: 'instant' });
}

/* ---------- Build card ---------- */
function buildCard(post) {
  const slug = post.slug || slugify(post.title || '');
  const card = document.createElement('a');
  card.className = 'post-card';
  card.href = `post.html?slug=${encodeURIComponent(slug)}`;

  let bodyHtml = '';
  if (post.excerpt) {
    bodyHtml = escapeHtml(post.excerpt);
  } else if (post.content) {
    // Strip HTML tags for excerpt preview, max 200 chars
    const tmp = document.createElement('div');
    tmp.innerHTML = typeof DOMPurify !== 'undefined'
      ? DOMPurify.sanitize(post.content)
      : post.content;
    const text = (tmp.textContent || '').trim();
    bodyHtml = escapeHtml(text.length > 200 ? text.slice(0, 200) + '…' : text);
  }

  const bannerHtml = post.banner
    ? `<img class="post-banner" src="${escapeAttr(post.banner)}" alt="" loading="lazy" onerror="this.style.display='none'">`
    : '';

  const avatarHtml = post.authorAvatar
    ? `<img class="author-avatar" src="${escapeAttr(post.authorAvatar)}" alt="" loading="lazy" onerror="this.style.display='none'">`
    : '';

  const dateHtml = post.pinned
    ? `<svg class="pin-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 17v5M8 3h8l-1 6 3 3v2H6v-2l3-3-1-6Z"/></svg> پین شده`
    : formatDate(post.date);

  card.innerHTML = `
    ${bannerHtml}
    <h2 class="post-title">${escapeHtml(post.title || '')}</h2>
    ${bodyHtml ? `<p class="post-excerpt">${bodyHtml}</p>` : ''}
    <div class="post-footer">
      <div class="post-meta">
        ${avatarHtml}
        <span class="author-name">${escapeHtml(post.authorName || '')}</span>
      </div>
      <span class="post-date">${dateHtml}</span>
    </div>`;

  return card;
}

/* ---------- Pager ---------- */
if (prevBtn) {
  prevBtn.addEventListener('click', () => {
    if (currentPage > 1) { currentPage--; renderPage(); }
  });
}
if (nextBtn) {
  nextBtn.addEventListener('click', () => {
    const total = Math.max(1, Math.ceil(currentFiltered.length / PAGE_SIZE));
    if (currentPage < total) { currentPage++; renderPage(); }
  });
}

/* ---------- Filters ---------- */
function applyFilters() {
  const q       = searchInput.value.trim().toLowerCase();
  const dateVal = dateFilter.value;
  const filtered = allPosts.filter(post => {
    const haystack = [post.title, post.excerpt, post.content, post.authorName]
      .map(s => (s || '').toLowerCase()).join(' ');
    const matchQ    = !q || haystack.includes(q);
    const matchDate = !dateVal || (post.date && post.date.slice(0, 10) === dateVal);
    return matchQ && matchDate;
  });
  render(filtered);
}

if (searchInput) searchInput.addEventListener('input', applyFilters);
if (dateFilter)  dateFilter.addEventListener('change', applyFilters);

loadPosts();
