const root = document.documentElement;
const themeToggle = document.getElementById('theme-toggle');
const logoImg = document.getElementById('logo-img');


/* =========================================================
   THEME
========================================================= */

function applyTheme(theme) {

  root.setAttribute('data-theme', theme);

  localStorage.setItem('theme', theme);

  if (logoImg) {
    logoImg.src =
      theme === 'dark'
        ? 'logo-dark.png'
        : 'logo-light.png';
  }

}


const savedTheme =
  localStorage.getItem('theme');

const systemDark =
  window.matchMedia(
    '(prefers-color-scheme: dark)'
  ).matches;


applyTheme(
  savedTheme ||
  (systemDark ? 'dark' : 'light')
);


if (themeToggle) {

  themeToggle.addEventListener(
    'click',
    () => {

      const current =
        root.getAttribute('data-theme');

      applyTheme(
        current === 'dark'
          ? 'light'
          : 'dark'
      );

    }
  );

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


if (searchToggle) {

  searchToggle.addEventListener(
    'click',
    () => {

      searchBar.classList.toggle('hidden');

      if (
        !searchBar.classList.contains('hidden')
      ) {

        searchInput.focus();

      }

    }
  );

}


/* =========================================================
   POSTS
========================================================= */

const listEl =
  document.getElementById('post-list');

const emptyEl =
  document.getElementById('empty-state');

const pagerEl =
  document.getElementById('pager');

const prevBtn =
  document.getElementById('prev-page');

const nextBtn =
  document.getElementById('next-page');

const pageLabel =
  document.getElementById('page-label');


const PAGE_SIZE = 25;

const PAGER_ENABLED = false;

let allPosts = [];

let currentPage = 1;

let currentFiltered = [];


/* =========================================================
   LOAD POSTS
========================================================= */

async function loadPosts() {

  try {

    const response =
      await fetch(
        'index.json',
        { cache: 'no-store' }
      );

    if (!response.ok) {
      throw new Error(
        'index.json not found'
      );
    }

    const data =
      await response.json();

    allPosts =
      Array.isArray(data)
        ? data
        : [];


    allPosts.sort(
      (a, b) => {

        if (
          a.pinned &&
          !b.pinned
        ) {
          return -1;
        }

        if (
          !a.pinned &&
          b.pinned
        ) {
          return 1;
        }

        return (
          new Date(b.date) -
          new Date(a.date)
        );

      }
    );


    render(allPosts);

  } catch (error) {

    console.error(error);

    listEl.innerHTML = '';

    emptyEl.hidden = false;

    emptyEl.textContent =
      'Failed to load posts.';

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
    ).format(
      new Date(dateStr)
    );

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

  listEl.innerHTML = '';

  if (
    !currentFiltered.length
  ) {

    emptyEl.hidden = false;

    emptyEl.textContent =
      'No posts found.';

    pagerEl.hidden = true;

    return;

  }


  emptyEl.hidden = true;


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


  const fragment =
    document.createDocumentFragment();


  pagePosts.forEach(
    post => {

      fragment.appendChild(
        buildCard(post)
      );

    }
  );


  listEl.appendChild(
    fragment
  );


  pagerEl.hidden =
    !PAGER_ENABLED;


  prevBtn.disabled =
    currentPage <= 1;

  nextBtn.disabled =
    currentPage >= totalPages;


  pageLabel.textContent =
    `Page ${currentPage} of ${totalPages}`;

}


/* =========================================================
   BUILD CARD
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

        ? DOMPurify.sanitize(
            post.content
          )

        : post.content;

  } else if (post.excerpt) {

    bodyHtml =
      escapeHtml(
        post.excerpt
      );

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
      ${escapeHtml(
        post.title || ''
      )}
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
                src="${escapeAttr(
                  post.authorAvatar
                )}"
                alt=""
                loading="lazy"
                onerror="this.style.display='none'"
              >
            `
            : ''
        }

        <span class="author-name">
          ${escapeHtml(
            post.authorName || ''
          )}
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

            : formatDate(
                post.date
              )
        }

      </span>

    </div>

  `;


  setupCodeBlocks(card);


  return card;

}


/* =========================================================
   CODE BLOCK
   No copy / no download
========================================================= */

function setupCodeBlocks(container) {

  const blocks =
    container.querySelectorAll(
      'pre code'
    );


  blocks.forEach(
    code => {

      const pre =
        code.closest('pre');

      if (!pre) return;


      addLineNumbers(
        pre,
        code
      );

    }
  );

}


/* =========================================================
   LINE NUMBERS
========================================================= */

function addLineNumbers(
  pre,
  code
) {

  if (
    pre.querySelector(
      '.line-number-list'
    )
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

    const number =
      document.createElement('span');

    number.textContent =
      i;

    numbers.appendChild(
      number
    );

  }


  pre.appendChild(
    numbers
  );

}


/* =========================================================
   PAGER
========================================================= */

prevBtn.addEventListener(
  'click',
  () => {

    if (currentPage > 1) {

      currentPage--;

      renderPage();

    }

  }
);


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


/* =========================================================
   FILTERS
========================================================= */

function applyFilters() {

  const query =
    searchInput.value
      .trim()
      .toLowerCase();


  const date =
    dateFilter.value;


  const filtered =
    allPosts.filter(
      post => {

        const matchesQuery =
          !query ||

          (post.title || '')
            .toLowerCase()
            .includes(query) ||

          (post.excerpt || '')
            .toLowerCase()
            .includes(query) ||

          (post.content || '')
            .toLowerCase()
            .includes(query) ||

          (post.authorName || '')
            .toLowerCase()
            .includes(query);


        const matchesDate =
          !date ||

          (
            post.date &&
            post.date.slice(0, 10) === date
          );


        return (
          matchesQuery &&
          matchesDate
        );

      }
    );


  render(filtered);

}


searchInput.addEventListener(
  'input',
  applyFilters
);


dateFilter.addEventListener(
  'change',
  applyFilters
);


/* =========================================================
   HELPERS
========================================================= */

function escapeHtml(str = '') {

  return String(str)
    .replace(
      /&/g,
      '&amp;'
    )
    .replace(
      /</g,
      '&lt;'
    )
    .replace(
      />/g,
      '&gt;'
    );

}


function escapeAttr(str = '') {

  return escapeHtml(str)
    .replace(
      /"/g,
      '&quot;'
    );

}


/* =========================================================
   START
========================================================= */

loadPosts();
