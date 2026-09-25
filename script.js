/* =========================================================
   HELPERS
========================================================= */

function escapeHtml(str = '') {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function escapeAttr(str = '') {
  return escapeHtml(str)
    .replace(/"/g, '&quot;');
}


/* =========================================================
   THEME
========================================================= */

const root = document.documentElement;
const themeToggle = document.getElementById('theme-toggle');
const logoImg = document.getElementById('logo-img');

function applyTheme(theme) {

  root.setAttribute('data-theme', theme);

  if (logoImg) {
    logoImg.src =
      theme === 'dark'
        ? 'logo-dark.png'
        : 'logo-light.png';
  }

  localStorage.setItem('theme', theme);
}

const savedTheme = localStorage.getItem('theme');

const systemPrefersDark =
  window.matchMedia('(prefers-color-scheme: dark)').matches;

applyTheme(
  savedTheme ||
  (systemPrefersDark ? 'dark' : 'light')
);

if (themeToggle) {

  themeToggle.addEventListener('click', () => {

    const current =
      root.getAttribute('data-theme');

    applyTheme(
      current === 'dark'
        ? 'light'
        : 'dark'
    );

  });

}


/* =========================================================
   SEARCH
========================================================= */

const searchToggle =
  document.getElementById('search-toggle');

const searchBar =
  document.getElementById('search-bar');

const searchInput =
  document.getElementById('search-input');

const dateFilter =
  document.getElementById('date-filter');

if (searchToggle && searchBar) {

  searchToggle.addEventListener('click', () => {

    searchBar.classList.toggle('hidden');

    if (!searchBar.classList.contains('hidden')) {

      if (searchInput) {
        searchInput.focus();
      }

    }

  });

}


/* =========================================================
   POSTS
========================================================= */

const listEl =
  document.getElementById('post-list');

const emptyEl =
  document.getElementById('empty-state');

const PAGE_SIZE = 25;

const PAGER_ENABLED = false;

let allPosts = [];

let currentPage = 1;

let currentFiltered = [];


const pagerEl =
  document.getElementById('pager');

const prevBtn =
  document.getElementById('prev-page');

const nextBtn =
  document.getElementById('next-page');

const pageLabel =
  document.getElementById('page-label');


/* =========================================================
   LOAD POSTS
========================================================= */

async function loadPosts() {

  try {

    const res =
      await fetch('index.json', {
        cache: 'no-store'
      });

    if (!res.ok) {
      throw new Error('index.json not found');
    }

    const data =
      await res.json();

    allPosts = Array.isArray(data)
      ? data
      : [];

    allPosts.sort((a, b) => {

      if (a.pinned && !b.pinned) {
        return -1;
      }

      if (!a.pinned && b.pinned) {
        return 1;
      }

      return new Date(b.date) -
             new Date(a.date);

    });

    render(allPosts);

  } catch (err) {

    console.error(err);

    if (listEl) {
      listEl.innerHTML = '';
    }

    if (emptyEl) {

      emptyEl.hidden = false;

      emptyEl.textContent =
        'Failed to load posts.';

    }

  }

}


/* =========================================================
   DATE
========================================================= */

function formatDate(dateStr) {

  try {

    return new Intl.DateTimeFormat(
      'en-US',
      {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }
    ).format(new Date(dateStr));

  } catch {

    return dateStr;

  }

}


/* =========================================================
   RENDER
========================================================= */

function render(posts) {

  currentFiltered = posts;

  currentPage = 1;

  renderPage();

}


function renderPage() {

  if (!listEl) return;

  listEl.innerHTML = '';

  if (!currentFiltered.length) {

    if (emptyEl) {

      emptyEl.hidden = false;

      emptyEl.textContent =
        'No posts found.';

    }

    if (pagerEl) {
      pagerEl.hidden = true;
    }

    return;

  }

  if (emptyEl) {
    emptyEl.hidden = true;
  }

  const totalPages =
    Math.max(
      1,
      Math.ceil(
        currentFiltered.length /
        PAGE_SIZE
      )
    );

  currentPage =
    Math.min(
      currentPage,
      totalPages
    );

  const start =
    (currentPage - 1) *
    PAGE_SIZE;

  const pagePosts =
    currentFiltered.slice(
      start,
      start + PAGE_SIZE
    );

  const frag =
    document.createDocumentFragment();

  pagePosts.forEach(post => {

    frag.appendChild(
      buildCard(post)
    );

  });

  listEl.appendChild(frag);

  if (pagerEl) {
    pagerEl.hidden =
      !PAGER_ENABLED;
  }

  if (prevBtn) {
    prevBtn.disabled =
      currentPage <= 1;
  }

  if (nextBtn) {
    nextBtn.disabled =
      currentPage >= totalPages;
  }

  if (pageLabel) {
    pageLabel.textContent =
      `Page ${currentPage} of ${totalPages}`;
  }

  window.scrollTo({
    top: 0,
    behavior: 'instant'
  });

}


/* =========================================================
   BUILD POST
========================================================= */

function buildCard(post) {

  const card =
    document.createElement('article');

  card.className =
    'post-card';

  let bodyHtml = '';

  if (post.content) {

    bodyHtml =
      typeof DOMPurify !== 'undefined'
        ? DOMPurify.sanitize(post.content)
        : post.content;

  } else if (post.excerpt) {

    bodyHtml =
      escapeHtml(post.excerpt);

  }


  card.innerHTML = `

    ${
      post.banner
        ? `
          <img
            class="post-banner"
            src="${escapeAttr(post.banner)}"
            alt=""
            loading="lazy"
            onerror="this.style.display='none'"
          >
        `
        : ''
    }

    <h2 class="post-title">
      ${escapeHtml(post.title || '')}
    </h2>

    <div class="post-body">
      ${bodyHtml}
    </div>

    <div class="post-footer">

      <div class="post-meta">

        ${
          post.authorAvatar
            ? `
              <img
                class="author-avatar"
                src="${escapeAttr(post.authorAvatar)}"
                alt=""
                loading="lazy"
                onerror="this.style.display='none'"
              >
            `
            : ''
        }

        <span class="author-name">
          ${escapeHtml(post.authorName || '')}
        </span>

      </div>

      <span class="post-date">

        ${
          post.pinned
            ? `
              <svg
                class="pin-icon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <path d="M12 17v5M8 3h8l-1 6 3 3v2H6v-2l3-3-1-6Z"/>
              </svg>
              Pinned post
            `
            : formatDate(post.date)
        }

      </span>

    </div>

  `;


  setupCodeBlocks(card);

  return card;

}


/* =========================================================
   CODE BLOCKS
   No syntax highlighting
========================================================= */

function setupCodeBlocks(container) {

  const codeBlocks =
    container.querySelectorAll(
      'pre code'
    );

  codeBlocks.forEach((code, index) => {

    const pre =
      code.closest('pre');

    if (!pre) return;


    /* -----------------------------------------
       Line numbers
    ----------------------------------------- */

    addLineNumbers(
      pre,
      code
    );


    /* -----------------------------------------
       Code dots
    ----------------------------------------- */

    if (
      !pre.querySelector('.code-dots')
    ) {

      const dots =
        document.createElement('div');

      dots.className =
        'code-dots';

      dots.innerHTML = `
        <span></span>
        <span></span>
        <span></span>
      `;

      pre.appendChild(dots);

    }


    /* -----------------------------------------
       Buttons
    ----------------------------------------- */

    if (
      !pre.querySelector('.code-actions')
    ) {

      const actions =
        document.createElement('div');

      actions.className =
        'code-actions';


      /* Copy */

      const copyButton =
        document.createElement('button');

      copyButton.type =
        'button';

      copyButton.className =
        'code-action';

      copyButton.title =
        'Copy code';

      copyButton.innerHTML = `
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        >
          <rect
            x="9"
            y="9"
            width="13"
            height="13"
            rx="2"
          />

          <path
            d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"
          />
        </svg>

        <span>Copy</span>
      `;


      copyButton.addEventListener(
        'click',
        async () => {

          const text =
            code.textContent || '';

          const success =
            await copyText(text);

          if (!success) return;

          const oldHtml =
            copyButton.innerHTML;

          copyButton.innerHTML = `
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <path d="m5 12 4 4L19 6"/>
            </svg>

            <span>Copied</span>
          `;

          setTimeout(() => {

            copyButton.innerHTML =
              oldHtml;

          }, 1200);

        }
      );


      /* Download */

      const downloadButton =
        document.createElement('button');

      downloadButton.type =
        'button';

      downloadButton.className =
        'code-action';

      downloadButton.title =
        'Download TXT';

      downloadButton.innerHTML = `
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        >
          <path d="M12 3v12"/>
          <path d="m7 10 5 5 5-5"/>
          <path d="M5 21h14"/>
        </svg>

        <span>TXT</span>
      `;


      downloadButton.addEventListener(
        'click',
        () => {

          downloadCode(
            code.textContent || '',
            `code-${index + 1}.txt`
          );

        }
      );


      actions.appendChild(
        copyButton
      );

      actions.appendChild(
        downloadButton
      );

      pre.appendChild(actions);

    }

  });

}


/* =========================================================
   LINE NUMBERS
========================================================= */

function addLineNumbers(pre, code) {

  if (
    pre.querySelector('.line-number-list')
  ) {
    return;
  }

  const text =
    code.textContent || '';

  const lineCount =
    Math.max(
      1,
      text.split('\n').length
    );


  const numbers =
    document.createElement('div');

  numbers.className =
    'line-number-list';

  for (
    let i = 1;
    i <= lineCount;
    i++
  ) {

    const line =
      document.createElement('span');

    line.textContent =
      i;

    numbers.appendChild(line);

  }

  pre.appendChild(numbers);

}


/* =========================================================
   COPY
========================================================= */

async function copyText(text) {

  try {

    if (
      navigator.clipboard &&
      window.isSecureContext
    ) {

      await navigator.clipboard.writeText(
        text
      );

      return true;

    }

  } catch (err) {

    console.warn(
      'Clipboard API failed:',
      err
    );

  }


  return fallbackCopy(text);

}


function fallbackCopy(text) {

  try {

    const textarea =
      document.createElement('textarea');

    textarea.value =
      text;

    textarea.style.position =
      'fixed';

    textarea.style.opacity =
      '0';

    document.body.appendChild(
      textarea
    );

    textarea.focus();

    textarea.select();

    const success =
      document.execCommand('copy');

    textarea.remove();

    return success;

  } catch {

    return false;

  }

}


/* =========================================================
   DOWNLOAD TXT
========================================================= */

function downloadCode(
  text,
  filename
) {

  const blob =
    new Blob(
      [text],
      {
        type:
          'text/plain;charset=utf-8'
      }
    );

  const url =
    URL.createObjectURL(blob);

  const link =
    document.createElement('a');

  link.href = url;

  link.download =
    filename;

  document.body.appendChild(
    link
  );

  link.click();

  link.remove();

  setTimeout(() => {

    URL.revokeObjectURL(url);

  }, 1000);

}


/* =========================================================
   PAGER
========================================================= */

if (prevBtn) {

  prevBtn.addEventListener(
    'click',
    () => {

      if (currentPage > 1) {

        currentPage--;

        renderPage();

      }

    }
  );

}


if (nextBtn) {

  nextBtn.addEventListener(
    'click',
    () => {

      const totalPages =
        Math.max(
          1,
          Math.ceil(
            currentFiltered.length /
            PAGE_SIZE
          )
        );

      if (
        currentPage < totalPages
      ) {

        currentPage++;

        renderPage();

      }

    }
  );

}


/* =========================================================
   FILTERS
========================================================= */

function applyFilters() {

  const q =
    searchInput
      ? searchInput.value
          .trim()
          .toLowerCase()
      : '';

  const dateVal =
    dateFilter
      ? dateFilter.value
      : '';


  const filtered =
    allPosts.filter(post => {

      const matchesQuery =
        !q ||

        (post.title || '')
          .toLowerCase()
          .includes(q) ||

        (post.excerpt || '')
          .toLowerCase()
          .includes(q) ||

        (post.content || '')
          .toLowerCase()
          .includes(q) ||

        (post.authorName || '')
          .toLowerCase()
          .includes(q);


      const matchesDate =
        !dateVal ||
        (
          post.date &&
          post.date.slice(0, 10) === dateVal
        );


      return (
        matchesQuery &&
        matchesDate
      );

    });


  render(filtered);

}


if (searchInput) {

  searchInput.addEventListener(
    'input',
    applyFilters
  );

}

if (dateFilter) {

  dateFilter.addEventListener(
    'change',
    applyFilters
  );

}


/* =========================================================
   START
========================================================= */

loadPosts();
