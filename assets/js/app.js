const $ = (selector) => document.querySelector(selector);

const PAGE_SIZE = 20;
const SEARCH_DEBOUNCE_MS = 220;
const API_TIMEOUT_MS = 8000;
const LOCAL_NOTES_FILE = "notes.json";

const state = {
  sourceMode: "local",
  query: "",
  folder: "",
  offset: 0,
  limit: PAGE_SIZE,
  total: 0,
  items: [],
  selectedId: "",
  selectedNote: null,
  folderOptions: new Set(),
  localCache: null,
};

const refs = {
  focusSearchBtn: $("#focusSearchBtn"),
  searchForm: $("#searchForm"),
  queryInput: $("#queryInput"),
  folderSelect: $("#folderSelect"),
  listStatus: $("#listStatus"),
  resultsList: $("#resultsList"),
  prevBtn: $("#prevBtn"),
  nextBtn: $("#nextBtn"),
  pageInfo: $("#pageInfo"),
  detailMeta: $("#detailMeta"),
  detailContent: $("#detailContent"),
  backToResultsBtn: $("#backToResultsBtn"),
  dataSourceBadge: $("#dataSourceBadge"),
};

let searchDebounceTimer = null;
let currentSearchRequest = 0;

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
  if (!value) {
    return "unknown update time";
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return String(value);
  }
  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

async function fetchJson(url) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), API_TIMEOUT_MS);
  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: { Accept: "application/json" },
    });
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    return await response.json();
  } finally {
    clearTimeout(timeout);
  }
}

function updateDataSourceBadge() {
  if (state.sourceMode === "api") {
    refs.dataSourceBadge.textContent = "Data source: API";
    return;
  }
  if (state.sourceMode === "local") {
    refs.dataSourceBadge.textContent = "Data source: notes.json";
    return;
  }
  refs.dataSourceBadge.textContent = "Loading source...";
}

function updateUrl() {
  const params = new URLSearchParams();
  if (state.query) params.set("q", state.query);
  if (state.folder) params.set("folder", state.folder);
  if (state.offset) params.set("offset", String(state.offset));
  if (state.selectedId) params.set("id", String(state.selectedId));
  const next = params.toString() ? `?${params.toString()}` : location.pathname;
  history.replaceState(null, "", next);
}

function hydrateStateFromUrl() {
  const params = new URLSearchParams(location.search);
  state.query = params.get("q") || "";
  state.folder = params.get("folder") || "";
  state.offset = Math.max(0, Number(params.get("offset") || "0") || 0);
  state.selectedId = params.get("id") || "";

  refs.queryInput.value = state.query;
}

function setListStatus(message, isError = false) {
  refs.listStatus.textContent = message;
  refs.listStatus.classList.toggle("error", isError);
}

function setDetailMeta(message, isError = false) {
  refs.detailMeta.textContent = message;
  refs.detailMeta.classList.toggle("error", isError);
}

function setDetailPlaceholder(message, isError = false) {
  refs.detailContent.innerHTML = `<p class="placeholder${isError ? " error" : ""}">${escapeHtml(message)}</p>`;
}

function renderFolderOptions() {
  const current = state.folder;
  const options = ["", ...Array.from(state.folderOptions).sort((a, b) => a.localeCompare(b))];
  refs.folderSelect.innerHTML = options
    .map((folder) => `<option value="${escapeHtml(folder)}">${folder ? escapeHtml(folder) : "All folders"}</option>`)
    .join("");

  if (options.includes(current)) {
    refs.folderSelect.value = current;
  } else {
    refs.folderSelect.value = "";
    state.folder = "";
  }
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
    const id = String(item.id ?? item.path);
    const isActive = state.selectedId && String(state.selectedId) === id;
    return `
      <li class="result-item">
        <button class="result-button ${isActive ? "active" : ""}" type="button" data-note-id="${escapeHtml(id)}">
          <p class="result-title">${escapeHtml(item.title || "Untitled")}</p>
          <p class="result-meta">${escapeHtml(item.folder || "No folder")} · ${escapeHtml(item.path || "")}</p>
          <p class="result-snippet">${escapeHtml(item.snippet || "No snippet")}</p>
        </button>
      </li>
    `;
  }).join("");

  setResultPagination();

  refs.resultsList.querySelectorAll(".result-button").forEach((button) => {
    button.addEventListener("click", () => {
      const id = button.getAttribute("data-note-id") || "";
      loadNoteDetail(id);
    });
  });
}

async function tryLoadApiNotes() {
  const params = new URLSearchParams({
    q: state.query,
    limit: String(state.limit),
    offset: String(state.offset),
  });
  if (state.folder) {
    params.set("folder", state.folder);
  }

  const data = await fetchJson(`/api/notes?${params.toString()}`);
  const items = Array.isArray(data.items) ? data.items : [];

  items.forEach((item) => {
    if (item.folder) state.folderOptions.add(item.folder);
  });

  state.items = items;
  state.total = Number(data.total || 0);
}

function includesAllTokens(query, haystack) {
  if (!query) return true;
  const tokens = query.toLowerCase().split(/\s+/).filter(Boolean);
  const normalized = haystack.toLowerCase();
  return tokens.every((token) => normalized.includes(token));
}

async function ensureLocalCache() {
  if (state.localCache) return;
  const response = await fetch(LOCAL_NOTES_FILE, { cache: "no-cache" });
  if (!response.ok) {
    throw new Error(`Cannot load ${LOCAL_NOTES_FILE}`);
  }
  const payload = await response.json();
  const items = Array.isArray(payload?.items) ? payload.items : [];
  state.localCache = items.map((item, index) => ({
    id: String(item.id ?? `local-${index + 1}`),
    title: item.title || "Untitled",
    path: item.path || "",
    folder: item.folder || "",
    snippet: item.snippet || "",
    body_raw: item.body_raw || "",
    updated_at: item.updated_at || "",
  }));

  state.localCache.forEach((item) => {
    if (item.folder) state.folderOptions.add(item.folder);
  });
}

async function tryLoadLocalNotes() {
  await ensureLocalCache();
  let results = state.localCache.filter((item) => {
    if (state.folder && item.folder !== state.folder) {
      return false;
    }
    const haystack = `${item.title} ${item.path} ${item.folder} ${item.snippet} ${item.body_raw}`;
    return includesAllTokens(state.query.trim(), haystack);
  });

  results = results.sort((a, b) => a.path.localeCompare(b.path));
  state.total = results.length;
  state.items = results.slice(state.offset, state.offset + state.limit);
}

async function searchNotes() {
  currentSearchRequest += 1;
  const requestId = currentSearchRequest;

  setListStatus("Loading search results...");

  try {
    if (state.sourceMode === "api") {
      await tryLoadApiNotes();
    } else {
      await tryLoadLocalNotes();
    }
  } catch (error) {
    if (state.sourceMode === "api") {
      state.sourceMode = "local";
      updateDataSourceBadge();
      setListStatus(`API unavailable (${error.message}). Falling back to local file mode.`);
      await tryLoadLocalNotes();
    } else {
      throw error;
    }
  }

  if (requestId !== currentSearchRequest) {
    return;
  }

  renderFolderOptions();
  renderResultsList();

  if (!state.items.length) {
    setListStatus("No results found. Try another keyword or folder.");
  } else {
    const start = state.offset + 1;
    const end = Math.min(state.offset + state.items.length, state.total);
    setListStatus(`Showing ${start}-${end} of ${state.total} results.`);
  }
}

async function loadApiDetail(id) {
  return await fetchJson(`/api/notes/${encodeURIComponent(id)}`);
}

async function loadLocalDetail(id) {
  await ensureLocalCache();
  const item = state.localCache?.find((entry) => String(entry.id) === String(id));
  if (!item) {
    throw new Error("Note not found in notes.json");
  }

  return {
    id: item.id,
    title: item?.title || "Untitled",
    folder: item?.folder || "",
    path: item?.path || "",
    updated_at: item?.updated_at || "",
    body_raw: item.body_raw || "",
  };
}

function renderDetail(note) {
  state.selectedNote = note;
  const title = note.title || "Untitled";
  const folder = note.folder || "No folder";
  const path = note.path || "No path";

  setDetailMeta(`${folder} · ${path} · ${toKstDateTime(note.updated_at)}`);

  if (note.body_html && note.sanitized === true) {
    refs.detailContent.innerHTML = note.body_html;
    return;
  }

  refs.detailContent.innerHTML = `<h3>${escapeHtml(title)}</h3><pre>${escapeHtml(note.body_raw || "")}</pre>`;
}

async function loadNoteDetail(id) {
  if (!id) return;
  state.selectedId = String(id);
  updateUrl();

  setDetailMeta("Loading note...");
  setDetailPlaceholder("Loading note...");

  try {
    const detail = state.sourceMode === "api"
      ? await loadApiDetail(id)
      : await loadLocalDetail(id);
    renderDetail(detail);
    renderResultsList();
  } catch (error) {
    setDetailMeta(`Failed to load detail (${error.message})`, true);
    setDetailPlaceholder("Unable to load note detail.", true);
  }
}

function resetDetailIfMissingSelection() {
  if (state.selectedId) return;
  state.selectedNote = null;
  setDetailMeta("Select a note to read details.");
  setDetailPlaceholder("No note selected.");
}

function bindEvents() {
  refs.focusSearchBtn.addEventListener("click", () => {
    refs.queryInput.focus();
  });

  refs.searchForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    state.query = refs.queryInput.value.trim();
    state.folder = refs.folderSelect.value;
    state.offset = 0;
    state.selectedId = "";
    updateUrl();
    resetDetailIfMissingSelection();
    await searchNotes();
  });

  refs.queryInput.addEventListener("input", () => {
    clearTimeout(searchDebounceTimer);
    searchDebounceTimer = setTimeout(async () => {
      state.query = refs.queryInput.value.trim();
      state.offset = 0;
      state.selectedId = "";
      updateUrl();
      resetDetailIfMissingSelection();
      await searchNotes();
    }, SEARCH_DEBOUNCE_MS);
  });

  refs.folderSelect.addEventListener("change", async () => {
    state.folder = refs.folderSelect.value;
    state.offset = 0;
    state.selectedId = "";
    updateUrl();
    resetDetailIfMissingSelection();
    await searchNotes();
  });

  refs.prevBtn.addEventListener("click", async () => {
    if (state.offset <= 0) return;
    state.offset = Math.max(0, state.offset - state.limit);
    state.selectedId = "";
    updateUrl();
    resetDetailIfMissingSelection();
    await searchNotes();
  });

  refs.nextBtn.addEventListener("click", async () => {
    if (state.offset + state.limit >= state.total) return;
    state.offset = state.offset + state.limit;
    state.selectedId = "";
    updateUrl();
    resetDetailIfMissingSelection();
    await searchNotes();
  });

  refs.backToResultsBtn.addEventListener("click", () => {
    state.selectedId = "";
    updateUrl();
    resetDetailIfMissingSelection();
    const firstResultButton = refs.resultsList.querySelector(".result-button");
    if (firstResultButton) {
      firstResultButton.focus();
    }
  });
}

async function bootstrap() {
  hydrateStateFromUrl();
  bindEvents();

  state.sourceMode = "local";
  updateDataSourceBadge();

  try {
    await searchNotes();
  } catch (error) {
    setListStatus(`Search initialization failed: ${error.message}`, true);
  }

  if (state.selectedId) {
    await loadNoteDetail(state.selectedId);
  } else {
    resetDetailIfMissingSelection();
  }
}

bootstrap();
