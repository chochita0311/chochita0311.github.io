const $ = (selector) => document.querySelector(selector);

const PAGE_SIZE = 15;
const PAGE_SIZE_OPTIONS = new Set([5, 15, 30, 100]);
const SEARCH_DEBOUNCE_MS = 220;
const API_TIMEOUT_MS = 8000;
const LOCAL_DB_DIR = "docs/tables/localdb";
const LOCAL_BOARD_FILE = `${LOCAL_DB_DIR}/mst_board.json`;
const LOCAL_POST_FILE = `${LOCAL_DB_DIR}/mst_post.json`;
const LOCAL_CUSTOM_BOARD_KEY = "playtalk.customBoards.v1";

const state = {
  sourceMode: "local",
  query: "",
  offset: 0,
  limit: PAGE_SIZE,
  total: 0,
  items: [],
  selectedId: "",
  selectedPost: null,
  boards: [],
  boardId: 0,
  boardName: "My Notes",
  localCache: null,
};

const refs = {
  appShell: document.querySelector(".app-shell"),
  boardTabs: $("#boardTabs"),
  createBoardBtn: $("#createBoardBtn"),
  openBoardDrawerBtn: $("#openBoardDrawerBtn"),
  closeBoardDrawerBtn: $("#closeBoardDrawerBtn"),
  boardDrawerBackdrop: $("#boardDrawerBackdrop"),
  listView: $("#listView"),
  detailView: $("#detailView"),
  searchForm: $("#searchForm"),
  queryInput: $("#queryInput"),
  pageSizeSelect: $("#pageSizeSelect"),
  listStatus: $("#listStatus"),
  resultsList: $("#resultsList"),
  prevBtn: $("#prevBtn"),
  nextBtn: $("#nextBtn"),
  pageInfo: $("#pageInfo"),
  detailMeta: $("#detailMeta"),
  detailContent: $("#detailContent"),
  backToResultsBtn: $("#backToResultsBtn"),
};

let searchDebounceTimer = null;
let currentSearchRequest = 0;

function isMobileLayout() {
  return window.matchMedia("(max-width: 980px)").matches;
}

function setBoardDrawerOpen(open) {
  if (!refs.appShell) return;
  refs.appShell.classList.toggle("board-drawer-open", open);
  if (refs.openBoardDrawerBtn) {
    refs.openBoardDrawerBtn.setAttribute("aria-expanded", open ? "true" : "false");
  }
  if (refs.boardDrawerBackdrop) {
    refs.boardDrawerBackdrop.classList.toggle("hidden", !open);
  }
}

function closeBoardDrawer() {
  setBoardDrawerOpen(false);
}

function showListView() {
  refs.listView?.classList.remove("hidden");
  refs.detailView?.classList.add("hidden");
}

function showDetailView() {
  refs.listView?.classList.add("hidden");
  refs.detailView?.classList.remove("hidden");
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  }[char]));
}

function toKstDateTime(value) {
  if (!value) return "unknown update time";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function buildSnippet(text) {
  const compact = String(text || "").replace(/\s+/g, " ").trim();
  return compact.slice(0, 180);
}

function loadCustomBoards() {
  try {
    const raw = localStorage.getItem(LOCAL_CUSTOM_BOARD_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((row) =>
      row && typeof row === "object" && Number(row.board_id) > 0 && row.record_status !== "DELETED"
    );
  } catch {
    return [];
  }
}

function saveCustomBoards(rows) {
  localStorage.setItem(LOCAL_CUSTOM_BOARD_KEY, JSON.stringify(rows));
}

async function fetchJson(url) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), API_TIMEOUT_MS);
  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: { Accept: "application/json" },
      cache: "no-cache",
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
  } finally {
    clearTimeout(timeout);
  }
}

function updateDataSourceBadge() {
  // Intentionally no UI badge in current board-focused layout.
}

function updateUrl() {
  const params = new URLSearchParams();
  if (state.query) params.set("q", state.query);
  if (state.offset) params.set("offset", String(state.offset));
  if (state.selectedId) params.set("id", String(state.selectedId));
  const next = params.toString() ? `?${params.toString()}` : location.pathname;
  history.replaceState(null, "", next);
}

function hydrateStateFromUrl() {
  const params = new URLSearchParams(location.search);
  state.query = params.get("q") || "";
  state.limit = PAGE_SIZE;
  state.offset = Math.max(0, Number(params.get("offset") || "0") || 0);
  state.selectedId = params.get("id") || "";
  refs.queryInput.value = state.query;
  if (refs.pageSizeSelect) {
    refs.pageSizeSelect.value = String(state.limit);
  }
}

function setListStatus(message, isError = false) {
  const shouldShow = isError && Boolean(message);
  refs.listStatus.textContent = shouldShow ? message : "";
  refs.listStatus.classList.toggle("error", shouldShow);
  refs.listStatus.classList.toggle("hidden", !shouldShow);
}

function setDetailMeta(message, isError = false) {
  refs.detailMeta.textContent = message;
  refs.detailMeta.classList.toggle("error", isError);
}

function setDetailPlaceholder(message, isError = false) {
  refs.detailContent.innerHTML = `<p class="placeholder${isError ? " error" : ""}">${escapeHtml(message)}</p>`;
}

function renderBoardTabs() {
  if (!refs.boardTabs) return;
  if (!state.boards.length) {
    refs.boardTabs.innerHTML = "";
    return;
  }

  refs.boardTabs.innerHTML = state.boards.map((board) => {
    const id = Number(board.board_id);
    const isActive = id === state.boardId;
    return `
      <button
        type="button"
        class="board-tab ${isActive ? "active" : ""}"
        data-board-id="${id}"
      >
        ${escapeHtml(board.display_name || `Board ${id}`)}
      </button>
    `;
  }).join("");

  refs.boardTabs.querySelectorAll(".board-tab").forEach((button) => {
    button.addEventListener("click", async () => {
      const boardId = Number(button.getAttribute("data-board-id") || "0");
      if (!boardId) return;
      if (isMobileLayout()) {
        closeBoardDrawer();
      }
      if (boardId === state.boardId) {
        state.selectedId = "";
        updateUrl();
        resetDetailIfMissingSelection();
        return;
      }
      const found = state.boards.find((row) => Number(row.board_id) === boardId);
      state.boardId = boardId;
      state.boardName = found?.display_name || `Board ${boardId}`;
      state.offset = 0;
      state.selectedId = "";
      updateUrl();
      resetDetailIfMissingSelection();
      renderBoardTabs();
      await searchPosts();
    });
  });
}

function setResultPagination() {
  const page = Math.floor(state.offset / state.limit) + 1;
  const totalPages = Math.max(1, Math.ceil(state.total / state.limit));
  refs.pageInfo.textContent = `Page ${page} / ${totalPages}`;
  refs.prevBtn.disabled = state.offset <= 0;
  refs.nextBtn.disabled = state.offset + state.limit >= state.total;
}

function renderResultsList() {
  if (!state.items.length) {
    refs.resultsList.innerHTML = "";
    setResultPagination();
    return;
  }

  refs.resultsList.innerHTML = state.items.map((item) => {
    const id = String(item.post_id);
    const isActive = state.selectedId && String(state.selectedId) === id;
    const when = item.published_at || item.upd_dt || "";
    return `
      <li class="result-item">
        <button class="result-button ${isActive ? "active" : ""}" type="button" data-post-id="${escapeHtml(id)}">
          <p class="result-title">${escapeHtml(item.title || "Untitled")}</p>
          <p class="result-meta">${escapeHtml(item.source_folder || "No folder")} · ${escapeHtml(toKstDateTime(when))}</p>
        </button>
      </li>
    `;
  }).join("");

  setResultPagination();

  refs.resultsList.querySelectorAll(".result-button").forEach((button) => {
    button.addEventListener("click", () => {
      const id = button.getAttribute("data-post-id") || "";
      loadPostDetail(id);
    });
  });
}

function includesAllTokens(query, haystack) {
  if (!query) return true;
  const tokens = query.toLowerCase().split(/\s+/).filter(Boolean);
  const normalized = haystack.toLowerCase();
  return tokens.every((token) => normalized.includes(token));
}

async function ensureLocalCache() {
  if (state.localCache) return;

  const [boardPayload, postPayload] = await Promise.all([
    fetchJson(LOCAL_BOARD_FILE),
    fetchJson(LOCAL_POST_FILE),
  ]);

  const boards = Array.isArray(boardPayload?.rows) ? boardPayload.rows : [];
  const posts = Array.isArray(postPayload?.rows) ? postPayload.rows : [];

  const activeBoards = boards
    .filter((row) => row.record_status !== "DELETED")
    .sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));
  const customBoards = loadCustomBoards();
  const mergedBoards = [...activeBoards, ...customBoards].sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));

  if (!mergedBoards.length) {
    throw new Error("No active board found in mst_board.json");
  }

  state.boards = mergedBoards;
  const board = mergedBoards[0];
  state.boardId = Number(board.board_id);
  state.boardName = board.display_name || "My Notes";

  state.localCache = posts
    .map((row) => ({
      post_id: Number(row.post_id),
      board_id: Number(row.board_id),
      title: row.title || "Untitled",
      body_md: row.body_md || "",
      post_status: row.post_status || "published",
      source_origin: row.source_origin || "imported_file",
      source_folder: row.source_folder || "",
      source_path: row.source_path || "",
      source_mtime: row.source_mtime || 0,
      published_at: row.published_at || "",
      reg_dt: row.reg_dt || "",
      upd_dt: row.upd_dt || "",
      snippet: buildSnippet(row.body_md),
    }));

}

async function tryLoadApiPosts() {
  const params = new URLSearchParams({
    q: state.query,
    boardId: String(state.boardId || 1),
    limit: String(state.limit),
    offset: String(state.offset),
  });

  const data = await fetchJson(`/api/posts?${params.toString()}`);
  const items = Array.isArray(data.items) ? data.items : [];

  state.items = items.map((item) => ({
    ...item,
    snippet: item.snippet || buildSnippet(item.body_md || item.body_raw || ""),
  }));
  state.total = Number(data.total || 0);

}

async function tryLoadLocalPosts() {
  await ensureLocalCache();

  const query = state.query.trim();

  let results = state.localCache.filter((item) => {
    if (Number(item.board_id) !== Number(state.boardId)) return false;
    if (item.post_status === "deleted" || item.post_status === "DELETED") return false;
    const haystack = `${item.title} ${item.source_path} ${item.source_folder} ${item.snippet} ${item.body_md}`;
    return includesAllTokens(query, haystack);
  });

  results = results.sort((a, b) => {
    const aTs = new Date(a.published_at || a.upd_dt || 0).getTime() || 0;
    const bTs = new Date(b.published_at || b.upd_dt || 0).getTime() || 0;
    if (aTs !== bTs) return bTs - aTs;
    return b.post_id - a.post_id;
  });

  state.total = results.length;
  state.items = results.slice(state.offset, state.offset + state.limit);
}

async function searchPosts() {
  currentSearchRequest += 1;
  const requestId = currentSearchRequest;
  setListStatus("");

  try {
    if (state.sourceMode === "api") {
      await tryLoadApiPosts();
    } else {
      await tryLoadLocalPosts();
    }
  } catch (error) {
    if (state.sourceMode === "api") {
      state.sourceMode = "local";
      updateDataSourceBadge();
      setListStatus(`API unavailable (${error.message}). Falling back to localdb mode.`, true);
      await tryLoadLocalPosts();
    } else {
      throw error;
    }
  }

  if (requestId !== currentSearchRequest) return;

  renderBoardTabs();
  renderResultsList();

  setListStatus("");
}

async function loadApiDetail(postId) {
  return await fetchJson(`/api/posts/${encodeURIComponent(postId)}`);
}

async function loadLocalDetail(postId) {
  await ensureLocalCache();
  const item = state.localCache?.find((entry) =>
    String(entry.post_id) === String(postId) && Number(entry.board_id) === Number(state.boardId)
  );
  if (!item) throw new Error("Post not found in docs/tables/localdb/mst_post.json");

  return {
    post_id: item.post_id,
    title: item.title,
    source_folder: item.source_folder,
    source_path: item.source_path,
    published_at: item.published_at,
    upd_dt: item.upd_dt,
    body_md: item.body_md,
  };
}

function renderDetail(post) {
  state.selectedPost = post;
  const title = post.title || "Untitled";
  const folder = post.source_folder || "No folder";
  const path = post.source_path || "No path";
  const at = post.published_at || post.upd_dt;

  setDetailMeta(`${folder} · ${path} · ${toKstDateTime(at)}`);

  if (post.body_html && post.sanitized === true) {
    refs.detailContent.innerHTML = post.body_html;
    showDetailView();
    return;
  }

  refs.detailContent.innerHTML = `<h3>${escapeHtml(title)}</h3><pre>${escapeHtml(post.body_md || "")}</pre>`;
  showDetailView();
}

async function loadPostDetail(postId) {
  if (!postId) return;
  state.selectedId = String(postId);
  updateUrl();

  setDetailMeta("Loading post...");
  setDetailPlaceholder("Loading post...");

  try {
    const detail = state.sourceMode === "api"
      ? await loadApiDetail(postId)
      : await loadLocalDetail(postId);

    renderDetail(detail);
    renderResultsList();
  } catch (error) {
    setDetailMeta(`Failed to load detail (${error.message})`, true);
    setDetailPlaceholder("Unable to load post detail.", true);
    showDetailView();
  }
}

function resetDetailIfMissingSelection() {
  if (state.selectedId) return;
  state.selectedPost = null;
  setDetailMeta("Select a post to read details.");
  setDetailPlaceholder("No post selected.");
  showListView();
}

function bindEvents() {
  refs.searchForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    state.query = refs.queryInput.value.trim();
    const nextLimit = Number(refs.pageSizeSelect.value || PAGE_SIZE);
    state.limit = PAGE_SIZE_OPTIONS.has(nextLimit) ? nextLimit : PAGE_SIZE;
    state.offset = 0;
    state.selectedId = "";
    updateUrl();
    resetDetailIfMissingSelection();
    await searchPosts();
  });

  refs.queryInput.addEventListener("input", () => {
    clearTimeout(searchDebounceTimer);
    searchDebounceTimer = setTimeout(async () => {
      state.query = refs.queryInput.value.trim();
      state.offset = 0;
      state.selectedId = "";
      updateUrl();
      resetDetailIfMissingSelection();
      await searchPosts();
    }, SEARCH_DEBOUNCE_MS);
  });

  refs.pageSizeSelect.addEventListener("change", async () => {
    const nextLimit = Number(refs.pageSizeSelect.value || PAGE_SIZE);
    state.limit = PAGE_SIZE_OPTIONS.has(nextLimit) ? nextLimit : PAGE_SIZE;
    state.offset = 0;
    state.selectedId = "";
    updateUrl();
    resetDetailIfMissingSelection();
    await searchPosts();
  });

  refs.prevBtn.addEventListener("click", async () => {
    if (state.offset <= 0) return;
    state.offset = Math.max(0, state.offset - state.limit);
    state.selectedId = "";
    updateUrl();
    resetDetailIfMissingSelection();
    await searchPosts();
  });

  refs.nextBtn.addEventListener("click", async () => {
    if (state.offset + state.limit >= state.total) return;
    state.offset += state.limit;
    state.selectedId = "";
    updateUrl();
    resetDetailIfMissingSelection();
    await searchPosts();
  });

  refs.backToResultsBtn.addEventListener("click", () => {
    state.selectedId = "";
    updateUrl();
    resetDetailIfMissingSelection();
    const firstResultButton = refs.resultsList.querySelector(".result-button");
    if (firstResultButton) firstResultButton.focus();
  });

  if (refs.createBoardBtn) {
    refs.createBoardBtn.addEventListener("click", async () => {
      await ensureLocalCache();
      const name = prompt("Board name");
      if (name === null) return;
      const displayName = name.trim();
      if (!displayName) return;

      const maxId = state.boards.reduce((max, row) => Math.max(max, Number(row.board_id) || 0), 0);
      const maxSort = state.boards.reduce((max, row) => Math.max(max, Number(row.sort_order) || 0), 0);
      const now = new Date().toISOString();
      const newBoard = {
        board_id: maxId + 1,
        display_name: displayName,
        sort_order: maxSort + 100,
        record_status: "ACTIVE",
        reg_id: "local-user",
        reg_dt: now,
        upd_id: "local-user",
        upd_dt: now,
      };

      const customBoards = loadCustomBoards();
      customBoards.push(newBoard);
      saveCustomBoards(customBoards);

      state.boards = [...state.boards, newBoard].sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));
      state.boardId = Number(newBoard.board_id);
      state.boardName = newBoard.display_name || `Board ${newBoard.board_id}`;
      state.offset = 0;
      state.selectedId = "";
      renderBoardTabs();
      updateUrl();
      resetDetailIfMissingSelection();
      if (isMobileLayout()) {
        closeBoardDrawer();
      }
      await searchPosts();
    });
  }

  if (refs.openBoardDrawerBtn) {
    refs.openBoardDrawerBtn.addEventListener("click", () => {
      setBoardDrawerOpen(true);
    });
  }

  // Draft for mobile transplantation:
  // Add left-edge swipe gesture to open/close drawer in a follow-up task.

  if (refs.closeBoardDrawerBtn) {
    refs.closeBoardDrawerBtn.addEventListener("click", closeBoardDrawer);
  }

  if (refs.boardDrawerBackdrop) {
    refs.boardDrawerBackdrop.addEventListener("click", closeBoardDrawer);
  }

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeBoardDrawer();
  });

  window.addEventListener("resize", () => {
    if (!isMobileLayout()) {
      closeBoardDrawer();
    }
  });
}

async function bootstrap() {
  hydrateStateFromUrl();
  bindEvents();

  state.sourceMode = "local";
  updateDataSourceBadge();

  try {
    await searchPosts();
  } catch (error) {
    setListStatus(`Search initialization failed: ${error.message}`, true);
  }

  if (state.selectedId) {
    await loadPostDetail(state.selectedId);
  } else {
    resetDetailIfMissingSelection();
  }
}

bootstrap();
