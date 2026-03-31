const LOCAL_DB_DIR = "docs/tables/localdb";
const LOCAL_COLLECTION_FILE = `${LOCAL_DB_DIR}/mst_board.json`;
const LOCAL_NOTE_FILE = `${LOCAL_DB_DIR}/mst_post.json`;
const PAGE_SIZE_OPTIONS = new Set([5, 15, 30, 100]);
const DETAIL_PAGE = "assets/styleguide/board/myboards_detail.html";

const state = {
  notes: [],
  filteredNotes: [],
  pageSize: 15,
  page: 1,
  collectionId: null,
};

const refs = {
  appShell: document.getElementById("appShell"),
  navToggle: document.getElementById("navToggle"),
  drawerBackdrop: document.getElementById("drawerBackdrop"),
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

function resolveDefaultCollectionId(collections) {
  const rows = Array.isArray(collections) ? collections : [];
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

function toRenderableNotes(rows) {
  return rows
    .map((row) => ({
      noteId: Number(row.post_id),
      collectionId: Number(row.board_id),
      title: row.title || "Untitled",
      dateCreated: row.reg_dt || row.published_at || row.upd_dt || "",
      status: String(row.post_status || "").toUpperCase(),
      categoryLabel: "General",
    }))
    .filter((row) => row.status !== "DELETED")
    .sort((a, b) => {
      const aTime = new Date(a.dateCreated || 0).getTime() || 0;
      const bTime = new Date(b.dateCreated || 0).getTime() || 0;
      if (aTime !== bTime) return bTime - aTime;
      return b.noteId - a.noteId;
    });
}

function paginateRows() {
  const start = (state.page - 1) * state.pageSize;
  return state.filteredNotes.slice(start, start + state.pageSize);
}

function getTotalPages() {
  return Math.max(1, Math.ceil(state.filteredNotes.length / state.pageSize));
}

function noteHref(noteId) {
  return `${DETAIL_PAGE}?post_id=${encodeURIComponent(noteId)}`;
}

function updateDesktopPageIndicator(totalPages) {
  if (!refs.desktop.pageIndicator) return;
  refs.desktop.pageIndicator.innerHTML = `
    <span class="page-indicator">
      ${state.page}
      <small>/ ${totalPages}</small>
    </span>
  `;
}

function updateMobilePageIndicator(totalPages) {
  if (!refs.mobile.pageIndicator) return;
  refs.mobile.pageIndicator.innerHTML = `
    <span class="page-indicator">
      ${state.page}
      <small>/ ${totalPages}</small>
    </span>
  `;
}

function renderDesktopRows(rows) {
  if (!refs.desktop.listBody) return;

  if (!rows.length) {
    refs.desktop.listBody.innerHTML = `
      <div class="empty-state">
        No notes found in the current library view.
      </div>
    `;
    return;
  }

  refs.desktop.listBody.innerHTML = rows.map((row) => `
    <div class="note-table-row">
      <div class="note-title-cell">
        <span class="material-symbols-outlined">description</span>
        <a class="note-title-link" href="${noteHref(row.noteId)}">${escapeHtml(row.title)}</a>
      </div>
      <div class="note-meta">${escapeHtml(formatDate(row.dateCreated))}</div>
      <div><span class="note-tag">${escapeHtml(row.categoryLabel)}</span></div>
      <div class="row-actions">
        <button class="icon-btn" type="button" aria-label="Edit disabled">
          <span class="material-symbols-outlined">edit</span>
        </button>
        <button class="icon-btn" type="button" aria-label="More disabled">
          <span class="material-symbols-outlined">more_horiz</span>
        </button>
      </div>
    </div>
  `).join("");
}

function renderMobileCards(rows) {
  if (!refs.mobile.listWrap) return;

  if (!rows.length) {
    refs.mobile.listWrap.innerHTML = `
      <div class="empty-state">
        No notes found in the current library view.
      </div>
    `;
    return;
  }

  refs.mobile.listWrap.innerHTML = rows.map((row) => `
    <article class="note-card">
      <div class="note-card-top">
        <a class="note-card-title" href="${noteHref(row.noteId)}">${escapeHtml(row.title)}</a>
        <span class="note-tag">${escapeHtml(row.categoryLabel)}</span>
      </div>
      <div class="note-card-footer">
        <span class="note-meta">${escapeHtml(formatDate(row.dateCreated))}</span>
        <a class="note-card-link" href="${noteHref(row.noteId)}">
          View note
          <span class="material-symbols-outlined">chevron_right</span>
        </a>
      </div>
    </article>
  `).join("");
}

function syncPageSizeControls() {
  if (refs.desktop.pageSizeSelect) {
    refs.desktop.pageSizeSelect.value = String(state.pageSize);
  }

  refs.mobile.pageSizeButtons.forEach((btn) => {
    const value = Number(btn.dataset.mobilePageSize || "0");
    const active = value === state.pageSize;
    btn.classList.toggle("active", active);
  });
}

function renderPagination(totalPages) {
  const isFirst = state.page <= 1;
  const isLast = state.page >= totalPages;

  if (refs.desktop.prevBtn) refs.desktop.prevBtn.disabled = isFirst;
  if (refs.desktop.nextBtn) refs.desktop.nextBtn.disabled = isLast;
  if (refs.mobile.prevBtn) refs.mobile.prevBtn.disabled = isFirst;
  if (refs.mobile.nextBtn) refs.mobile.nextBtn.disabled = isLast;

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

function setNavOpen(open) {
  refs.appShell?.classList.toggle("nav-open", open);
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

  refs.navToggle?.addEventListener("click", () => {
    const isOpen = refs.appShell?.classList.contains("nav-open");
    setNavOpen(!isOpen);
  });

  refs.drawerBackdrop?.addEventListener("click", () => {
    setNavOpen(false);
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 980) setNavOpen(false);
  });
}

function renderLoadError(error) {
  const message = `Failed to load local notes data (${escapeHtml(error.message)}).`;
  if (refs.desktop.listBody) {
    refs.desktop.listBody.innerHTML = `<div class="error-state">${message}</div>`;
  }
  if (refs.mobile.listWrap) {
    refs.mobile.listWrap.innerHTML = `<div class="error-state">${message}</div>`;
  }
}

async function init() {
  bindEvents();

  try {
    const [collectionPayload, notePayload] = await Promise.all([
      fetchJson(LOCAL_COLLECTION_FILE),
      fetchJson(LOCAL_NOTE_FILE),
    ]);

    state.collectionId = resolveDefaultCollectionId(collectionPayload?.rows);
    state.notes = toRenderableNotes(Array.isArray(notePayload?.rows) ? notePayload.rows : []);
    state.filteredNotes = state.collectionId === null
      ? []
      : state.notes.filter((row) => row.collectionId === state.collectionId);

    render();
  } catch (error) {
    renderLoadError(error);
  }
}

init();
