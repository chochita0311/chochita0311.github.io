const LOCAL_DB_DIR = "docs/tables/localdb";
const LOCAL_BOARD_FILE = `${LOCAL_DB_DIR}/mst_board.json`;
const LOCAL_POST_FILE = `${LOCAL_DB_DIR}/mst_post.json`;
const PAGE_SIZE_OPTIONS = new Set([5, 15, 30, 100]);

const state = {
  posts: [],
  filteredPosts: [],
  pageSize: 15,
  page: 1,
  boardId: null,
};

const refs = {
  desktop: {
    pageSizeSelect: document.getElementById("page-size"),
    listBody: document.getElementById("notes-list-body"),
    prevBtn: document.getElementById("prev-btn"),
    nextBtn: document.getElementById("next-btn"),
    pageIndicator: document.getElementById("page-indicator"),
  },
  mobile: {
    listWrap: document.getElementById("mobile-notes-list"),
    pageIndicator: document.getElementById("mobile-page-indicator"),
    prevBtn: document.getElementById("mobile-prev-btn"),
    nextBtn: document.getElementById("mobile-next-btn"),
    pageSizeButtons: Array.from(document.querySelectorAll("[data-mobile-page-size]")),
  },
};

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  }[char]));
}

function formatDate(value) {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  }).format(date);
}

async function fetchJson(url) {
  const response = await fetch(url, {
    headers: { Accept: "application/json" },
    cache: "no-cache",
  });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return response.json();
}

function resolveMyNotesBoardId(boards) {
  const rows = Array.isArray(boards) ? boards : [];
  const myNotes = rows.find((row) => {
    if (!row || row.record_status === "DELETED") return false;
    const name = String(row.display_name || "").trim().toLowerCase();
    return name === "my notes";
  });

  if (myNotes) return Number(myNotes.board_id);

  const activeRows = rows
    .filter((row) => row && row.record_status !== "DELETED")
    .sort((a, b) => (Number(a.sort_order) || 0) - (Number(b.sort_order) || 0));

  return activeRows.length ? Number(activeRows[0].board_id) : null;
}

function toRenderablePosts(rows) {
  return rows
    .map((row) => ({
      postId: Number(row.post_id),
      boardId: Number(row.board_id),
      title: row.title || "Untitled",
      dateCreated: row.reg_dt || row.published_at || row.upd_dt || "",
      postStatus: String(row.post_status || "").toUpperCase(),
    }))
    .filter((row) => row.postStatus !== "DELETED")
    .sort((a, b) => {
      const aTime = new Date(a.dateCreated || 0).getTime() || 0;
      const bTime = new Date(b.dateCreated || 0).getTime() || 0;
      if (aTime !== bTime) return bTime - aTime;
      return b.postId - a.postId;
    });
}

function paginateRows() {
  const start = (state.page - 1) * state.pageSize;
  return state.filteredPosts.slice(start, start + state.pageSize);
}

function getTotalPages() {
  return Math.max(1, Math.ceil(state.filteredPosts.length / state.pageSize));
}

function updateDesktopPageIndicator(totalPages) {
  if (!refs.desktop.pageIndicator) return;
  refs.desktop.pageIndicator.innerHTML = `
    <button class="size-10 flex items-center justify-center rounded-lg bg-primary text-white text-sm font-bold shadow-lg shadow-primary/20" type="button">
      ${state.page}
    </button>
    <span class="px-2 text-slate-400 text-sm font-semibold">/ ${totalPages}</span>
  `;
}

function updateMobilePageIndicator(totalPages) {
  if (!refs.mobile.pageIndicator) return;
  refs.mobile.pageIndicator.innerHTML = `${state.page} <span class="text-slate-300 mx-1">/</span> ${totalPages}`;
}

function renderDesktopRows(rows) {
  if (!refs.desktop.listBody) return;

  if (!rows.length) {
    refs.desktop.listBody.innerHTML = `
      <div class="px-6 py-10 text-center text-sm font-semibold text-slate-400 border-b border-primary/5">
        No notes found in My Notes.
      </div>
    `;
    return;
  }

  refs.desktop.listBody.innerHTML = rows.map((row) => `
    <div class="grid grid-cols-[1fr_150px_150px_80px] px-6 py-4 items-center border-b border-primary/5 list-row-hover transition-colors">
      <div class="flex items-center gap-3 min-w-0">
        <span class="material-symbols-outlined text-primary/40">description</span>
        <a class="text-sm font-bold text-luxury-navy dark:text-slate-200 truncate hover:text-primary transition-colors" href="assets/styleguide/board/myboards_detail.html?post_id=${encodeURIComponent(row.postId)}">${escapeHtml(row.title)}</a>
      </div>
      <div class="text-sm text-slate-500">${escapeHtml(formatDate(row.dateCreated))}</div>
      <div>
        <span class="px-2 py-1 rounded-md bg-slate-100 text-slate-600 text-[10px] font-bold uppercase">General</span>
      </div>
      <div class="flex justify-end gap-2 text-slate-400">
        <button class="hover:text-primary transition-colors" type="button" aria-label="Edit disabled"><span class="material-symbols-outlined text-lg">edit</span></button>
        <button class="hover:text-primary transition-colors" type="button" aria-label="More disabled"><span class="material-symbols-outlined text-lg">more_vert</span></button>
      </div>
    </div>
  `).join("");
}

function renderMobileCards(rows) {
  if (!refs.mobile.listWrap) return;

  if (!rows.length) {
    refs.mobile.listWrap.innerHTML = `
      <div class="luxury-card-shadow bg-white rounded-xl border border-primary/5 p-6 text-center text-sm font-semibold text-slate-400">
        No notes found in My Notes.
      </div>
    `;
    return;
  }

  refs.mobile.listWrap.innerHTML = rows.map((row) => `
    <div class="luxury-card-shadow bg-white rounded-xl border border-primary/5 p-6 active:scale-[0.98] transition-transform">
      <div class="flex justify-between items-start mb-3 gap-3">
        <a class="text-lg font-bold text-luxury-navy leading-tight hover:text-primary transition-colors" href="assets/styleguide/board/myboards_detail.html?post_id=${encodeURIComponent(row.postId)}">${escapeHtml(row.title)}</a>
        <span class="text-[10px] font-bold text-primary uppercase bg-primary/5 px-2 py-0.5 rounded border border-primary/10">General</span>
      </div>
      <div class="mt-4 flex items-center justify-between">
        <span class="text-[11px] text-slate-400 font-medium italic">${escapeHtml(formatDate(row.dateCreated))}</span>
        <a class="text-primary text-sm font-bold flex items-center gap-1" href="assets/styleguide/board/myboards_detail.html?post_id=${encodeURIComponent(row.postId)}">
          View Note <span class="material-symbols-outlined text-base">chevron_right</span>
        </a>
      </div>
    </div>
  `).join("");
}

function syncPageSizeControls() {
  if (refs.desktop.pageSizeSelect) {
    refs.desktop.pageSizeSelect.value = String(state.pageSize);
  }

  refs.mobile.pageSizeButtons.forEach((btn) => {
    const value = Number(btn.dataset.mobilePageSize || "0");
    const active = value === state.pageSize;
    btn.className = active
      ? "flex-none px-5 py-2 rounded-full bg-primary text-white text-xs font-bold shadow-md shadow-primary/20 transition-all"
      : "flex-none px-5 py-2 rounded-full bg-white border border-primary/10 text-slate-600 text-xs font-semibold hover:border-primary transition-colors";
  });
}

function renderPagination(totalPages) {
  const isFirst = state.page <= 1;
  const isLast = state.page >= totalPages;

  if (refs.desktop.prevBtn) {
    refs.desktop.prevBtn.disabled = isFirst;
    refs.desktop.prevBtn.classList.toggle("opacity-40", isFirst);
  }
  if (refs.desktop.nextBtn) {
    refs.desktop.nextBtn.disabled = isLast;
    refs.desktop.nextBtn.classList.toggle("opacity-40", isLast);
  }

  if (refs.mobile.prevBtn) {
    refs.mobile.prevBtn.disabled = isFirst;
    refs.mobile.prevBtn.classList.toggle("opacity-40", isFirst);
  }
  if (refs.mobile.nextBtn) {
    refs.mobile.nextBtn.disabled = isLast;
    refs.mobile.nextBtn.classList.toggle("opacity-40", isLast);
  }

  updateDesktopPageIndicator(totalPages);
  updateMobilePageIndicator(totalPages);
}

function render() {
  const totalPages = getTotalPages();
  if (state.page > totalPages) state.page = totalPages;

  const rows = paginateRows();
  renderDesktopRows(rows);
  renderMobileCards(rows);
  syncPageSizeControls();
  renderPagination(totalPages);
}

function goPrev() {
  if (state.page <= 1) return;
  state.page -= 1;
  render();
}

function goNext() {
  const totalPages = getTotalPages();
  if (state.page >= totalPages) return;
  state.page += 1;
  render();
}

function setPageSize(next) {
  const value = Number(next || 15);
  state.pageSize = PAGE_SIZE_OPTIONS.has(value) ? value : 15;
  state.page = 1;
  render();
}

function bindEvents() {
  refs.desktop.pageSizeSelect?.addEventListener("change", () => {
    setPageSize(refs.desktop.pageSizeSelect.value);
  });

  refs.desktop.prevBtn?.addEventListener("click", goPrev);
  refs.desktop.nextBtn?.addEventListener("click", goNext);

  refs.mobile.prevBtn?.addEventListener("click", goPrev);
  refs.mobile.nextBtn?.addEventListener("click", goNext);

  refs.mobile.pageSizeButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      setPageSize(btn.dataset.mobilePageSize);
    });
  });
}

function renderLoadError(error) {
  const message = `Failed to load local notes data (${escapeHtml(error.message)}).`;
  if (refs.desktop.listBody) {
    refs.desktop.listBody.innerHTML = `
      <div class="px-6 py-10 text-center text-sm font-semibold text-red-500 border-b border-primary/5">
        ${message}
      </div>
    `;
  }
  if (refs.mobile.listWrap) {
    refs.mobile.listWrap.innerHTML = `
      <div class="luxury-card-shadow bg-white rounded-xl border border-primary/5 p-6 text-center text-sm font-semibold text-red-500">
        ${message}
      </div>
    `;
  }
}

async function init() {
  bindEvents();

  try {
    const [boardPayload, postPayload] = await Promise.all([
      fetchJson(LOCAL_BOARD_FILE),
      fetchJson(LOCAL_POST_FILE),
    ]);

    state.boardId = resolveMyNotesBoardId(boardPayload?.rows);
    state.posts = toRenderablePosts(Array.isArray(postPayload?.rows) ? postPayload.rows : []);
    state.filteredPosts = state.boardId === null
      ? []
      : state.posts.filter((row) => row.boardId === state.boardId);

    render();
  } catch (error) {
    renderLoadError(error);
  }
}

init();
