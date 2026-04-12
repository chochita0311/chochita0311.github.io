(() => {
  const NOTES_INDEX_PATH = "assets/generated/archives-index.json";
  const SEARCH_INDEX_PATH = "assets/generated/archives-search-index.json";
  const SEARCH_DEBOUNCE_MS = 250;
  const FALLBACK_SEARCH_PATTERN = "[a-z0-9]+|[가-힣]+";
  const FALLBACK_SEARCH_FILTERS = {
    excludeNumericOnly: true,
    excludeSingleCharacter: true,
    englishStopwords: [
      "a",
      "an",
      "and",
      "as",
      "at",
      "by",
      "for",
      "from",
      "in",
      "is",
      "of",
      "on",
      "or",
      "the",
      "this",
      "to",
      "with",
    ],
    shortTagException: true,
  };
  const VIEW_PAGE_SIZES = {
    list: [5, 10, 20],
    grid: [6, 12, 18],
  };
  const DEFAULT_PAGE_SIZE_BY_VIEW = {
    list: 10,
    grid: 6,
  };
  const DEFAULT_DOCUMENT_TITLE = document.title;
  const DEFAULT_ARCHIVE_COPY = {
    default: {
      title: "Recent Archives",
      summary:
        "Exploring the intersection of humanistic philosophy and digital infrastructure. A curated collection of long-form thought pieces.",
    },
    categories: {},
    collections: {},
  };

  const archiveState = {
    allNotes: [],
    notes: [],
    page: 1,
    pageSize: DEFAULT_PAGE_SIZE_BY_VIEW.list,
    viewMode: "list",
    category: null,
    collection: null,
    searchQuery: "",
    activeTag: null,
    activeNotePath: null,
    copy: DEFAULT_ARCHIVE_COPY,
    searchIndex: {
      terms: {},
      tokenizer: {
        pattern: FALLBACK_SEARCH_PATTERN,
        filters: FALLBACK_SEARCH_FILTERS,
      },
    },
    searchIndexUnavailable: false,
  };

  let archiveRenderRequestId = 0;
  let viewToggleBound = false;
  let pageSizeBound = false;
  let searchControlBound = false;
  let searchDebounceTimer = null;

  function archiveTitle() {
    return document.getElementById("archive-title");
  }

  function archiveSummary() {
    return document.getElementById("archive-summary");
  }

  function archiveNoteList() {
    return document.getElementById("archive-note-list");
  }

  function archivePageLabel() {
    return document.getElementById("archive-page-label");
  }

  function archivePageSizeSelect() {
    return document.getElementById("archive-page-size");
  }

  function archiveViewButtons() {
    return document.querySelectorAll("[data-archive-view]");
  }

  function archiveSearchInput() {
    return document.getElementById("archive-search-input");
  }

  function popularTagsMount() {
    return document.getElementById("popular-tags");
  }

  function archivePrevButton() {
    return document.getElementById("archive-prev-button");
  }

  function archiveNextButton() {
    return document.getElementById("archive-next-button");
  }

  async function loadArchiveCopy() {
    try {
      const response = await fetch("assets/config/archive-descriptions.json");

      if (!response.ok) {
        return;
      }

      archiveState.copy = {
        ...DEFAULT_ARCHIVE_COPY,
        ...(await response.json()),
      };
    } catch {
      archiveState.copy = DEFAULT_ARCHIVE_COPY;
    }
  }

  async function loadNotesIndex() {
    const response = await fetch(NOTES_INDEX_PATH);

    if (!response.ok) {
      throw new Error("Unable to load notes index.");
    }

    const notes = await response.json();

    archiveState.allNotes = notes.map((note) => ({
      ...note,
      tags: Array.isArray(note.tags) ? note.tags : [],
      created: note.created || note.date || "",
      updated: note.updated || "",
    }));
  }

  async function loadSearchIndex() {
    try {
      const response = await fetch(SEARCH_INDEX_PATH);

      if (!response.ok) {
        throw new Error("Unable to load search index.");
      }

      const searchIndex = await response.json();
      archiveState.searchIndex = {
        terms: searchIndex.terms || {},
        tokenizer: {
          pattern: searchIndex.tokenizer?.pattern || FALLBACK_SEARCH_PATTERN,
          filters: searchIndex.tokenizer?.filters || FALLBACK_SEARCH_FILTERS,
        },
      };
      archiveState.searchIndexUnavailable = false;
    } catch {
      archiveState.searchIndexUnavailable = true;
    }
  }

  function escapeHtml(value) {
    return window.NoteDetailRenderer.escapeHtml(String(value));
  }

  function archiveCopyForSelection(category, collection) {
    const collectionKey = category && collection ? `${category}/${collection}` : null;

    if (collectionKey && archiveState.copy.collections[collectionKey]) {
      return archiveState.copy.collections[collectionKey];
    }

    if (category && archiveState.copy.categories[category]) {
      return archiveState.copy.categories[category];
    }

    return archiveState.copy.default;
  }

  function pageSizeOptionsForView(viewMode) {
    return VIEW_PAGE_SIZES[viewMode] || VIEW_PAGE_SIZES.list;
  }

  function defaultPageSizeForView(viewMode) {
    return DEFAULT_PAGE_SIZE_BY_VIEW[viewMode] || DEFAULT_PAGE_SIZE_BY_VIEW.list;
  }

  function prettifyTag(tag) {
    return tag
      .split("-")
      .filter(Boolean)
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(" ");
  }

  function formatArchiveDate(note) {
    const rawDate = note.updated || note.created || "";

    if (!rawDate) {
      return "";
    }

    const parsed = new Date(rawDate);

    if (Number.isNaN(parsed.getTime())) {
      return rawDate;
    }

    return new Intl.DateTimeFormat("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(parsed);
  }

  function buildNoteHref(note) {
    const url = new URLSearchParams({
      category: note.category,
      collection: note.collection,
      note: note.path,
    });

    if (archiveState.viewMode === "grid") {
      url.set("view", "grid");
    }

    return `?${url.toString()}`;
  }

  function activeTagTitle() {
    return `Tag: ${prettifyTag(archiveState.activeTag)}`;
  }

  function activeTagSummary(noteCount) {
    return `${noteCount} notes tagged ${prettifyTag(archiveState.activeTag)} across the archive.`;
  }

  function noteCardMarkup(note) {
    const dateLabel = formatArchiveDate(note);
    const isGrid = archiveState.viewMode === "grid";
    const secondaryMeta = isGrid ? dateLabel || note.collection : note.collection;
    const tagMarkup = note.tags
      .map((tag) => `<span class="note-tag">${escapeHtml(prettifyTag(tag))}</span>`)
      .join("");
    const cardClass = isGrid ? "note-card note-card--grid" : "note-card note-card--list";
    const footerMarkup = isGrid
      ? `<div class="note-card__footer">
<div class="note-card__tags">
${tagMarkup}
</div>
<p class="note-card__collection">${escapeHtml(note.collection)}</p>
</div>`
      : `<div class="note-card__footer">
<div class="note-card__tags">
${tagMarkup}
</div>
</div>`;

    return `
<article class="${cardClass}" data-note-path="${escapeHtml(note.path)}">
<a class="note-card__link" href="${buildNoteHref(note)}" data-note-link="true">
<div class="note-card__body">
<div class="note-card__meta">
<span class="note-label note-label--accent">${escapeHtml(note.category)}</span>
<span class="note-label note-label--muted">${escapeHtml(secondaryMeta)}</span>
</div>
<h2 class="note-card__title">${escapeHtml(note.title)}</h2>
<p class="note-card__summary">${escapeHtml(note.summary)}</p>
${footerMarkup}
</div>
</a>
</article>`;
  }

  function applyViewModeToList() {
    const noteList = archiveNoteList();

    if (!noteList) {
      return;
    }

    noteList.dataset.viewMode = archiveState.viewMode;
  }

  function syncPageSizeControl() {
    const select = archivePageSizeSelect();

    if (!select) {
      return;
    }

    const options = pageSizeOptionsForView(archiveState.viewMode);

    select.innerHTML = options
      .map(
        (value) =>
          `<option value="${String(value)}"${value === archiveState.pageSize ? " selected" : ""}>${String(value)}</option>`,
      )
      .join("");
    select.value = String(archiveState.pageSize);
  }

  function syncViewToggleButtons() {
    archiveViewButtons().forEach((button) => {
      const isActive = button.dataset.archiveView === archiveState.viewMode;

      button.classList.toggle("archive-view-toggle__button--active", isActive);
      button.setAttribute("aria-pressed", isActive ? "true" : "false");
    });
  }

  function updateViewMode(mode, { replaceHistory = false } = {}) {
    if (mode !== "list" && mode !== "grid") {
      return;
    }

    archiveState.viewMode = mode;
    archiveState.pageSize = defaultPageSizeForView(mode);
    archiveState.page = 1;
    syncViewToggleButtons();
    syncPageSizeControl();
    renderArchivePage();
    updateArchiveLocation({
      notePath: archiveState.activeNotePath,
      replace: replaceHistory,
    });
  }

  function setPaginationButtonState(button, isEnabled) {
    if (!button) {
      return;
    }

    if (isEnabled) {
      button.classList.add("pagination-button--primary");
      button.classList.remove("pagination-button--disabled");
      button.disabled = false;
      return;
    }

    button.classList.add("pagination-button--disabled");
    button.classList.remove("pagination-button--primary");
    button.disabled = true;
  }

  function bindPaginationControls() {
    const prevButton = archivePrevButton();
    const nextButton = archiveNextButton();

    if (prevButton) {
      prevButton.onclick = () => {
        if (archiveState.page <= 1) {
          return;
        }

        archiveState.page -= 1;
        renderArchivePage();
      };
    }

    if (nextButton) {
      nextButton.onclick = () => {
        const totalPages = Math.max(
          1,
          Math.ceil(archiveState.notes.length / archiveState.pageSize),
        );

        if (archiveState.page >= totalPages) {
          return;
        }

        archiveState.page += 1;
        renderArchivePage();
      };
    }
  }

  function bindPageSizeControl() {
    if (pageSizeBound) {
      return;
    }

    archivePageSizeSelect()?.addEventListener("change", (event) => {
      const nextPageSize = Number.parseInt(event.target.value, 10);

      if (!Number.isInteger(nextPageSize) || nextPageSize <= 0) {
        return;
      }

      archiveState.pageSize = nextPageSize;
      archiveState.page = 1;
      renderArchivePage();
    });

    pageSizeBound = true;
  }

  function bindViewToggleControls() {
    if (viewToggleBound) {
      return;
    }

    archiveViewButtons().forEach((button) => {
      button.addEventListener("click", () => {
        const nextMode = button.dataset.archiveView;

        if (nextMode === archiveState.viewMode) {
          return;
        }

        updateViewMode(nextMode);
      });
    });

    viewToggleBound = true;
  }

  function clearSidebarSelection() {
    window.dispatchEvent(new CustomEvent("sidebar:clear-selection"));
  }

  function clearActiveTag({ rerender = false } = {}) {
    if (!archiveState.activeTag) {
      return;
    }

    archiveState.activeTag = null;
    renderPopularTags();

    if (rerender) {
      if (archiveState.searchQuery) {
        renderSearchResults(archiveState.searchQuery).then(() => {
          updateArchiveLocation({ replace: false });
        });
      } else {
        renderSelection({
          category: archiveState.category,
          collection: archiveState.collection,
        }).then(() => {
          updateArchiveLocation({ replace: false });
        });
      }
    }
  }

  function searchScopeLabel(category, collection) {
    if (category && collection) {
      return `${category} / ${collection}`;
    }

    if (category) {
      return category;
    }

    return "the archive";
  }

  function searchPattern() {
    const source = archiveState.searchIndex.tokenizer?.pattern || FALLBACK_SEARCH_PATTERN;

    return new RegExp(source, "g");
  }

  function normalizeSearchText(value) {
    return String(value || "")
      .normalize("NFKC")
      .toLowerCase();
  }

  function tokenizeSearchQuery(value) {
    const normalized = normalizeSearchText(value);
    const matches = normalized.match(searchPattern()) || [];
    const filters = archiveState.searchIndex.tokenizer?.filters || FALLBACK_SEARCH_FILTERS;
    const stopwords = new Set(filters.englishStopwords || []);

    return [...new Set(matches)].filter((token) => {
      if (filters.excludeNumericOnly && /^\d+$/.test(token)) {
        return false;
      }

      if (filters.excludeSingleCharacter && token.length <= 1) {
        return false;
      }

      if (stopwords.has(token)) {
        return false;
      }

      return true;
    });
  }

  function matchingNoteIdsForQuery(query) {
    const tokens = tokenizeSearchQuery(query);
    const matchedIds = new Set();

    tokens.forEach((token) => {
      const noteIds = archiveState.searchIndex.terms[token] || [];

      noteIds.forEach((noteId) => {
        matchedIds.add(noteId);
      });
    });

    return {
      matchedIds,
      tokens,
    };
  }

  function searchNotesForSelection(query, category, collection) {
    const { matchedIds, tokens } = matchingNoteIdsForQuery(query);

    if (tokens.length === 0) {
      return {
        notes: [],
        tokens,
      };
    }

    return {
      notes: sortNotes(
        archiveState.allNotes.filter((note) => {
          if (!matchedIds.has(note.id)) {
            return false;
          }

          if (category && note.category !== category) {
            return false;
          }

          if (collection && note.collection !== collection) {
            return false;
          }

          return true;
        }),
      ),
      tokens,
    };
  }

  function searchSummary(query, count, category, collection) {
    return `${count} results for "${query}" in ${searchScopeLabel(category, collection)}.`;
  }

  async function renderSearchResults(query) {
    const trimmedQuery = query.trim();
    const requestId = ++archiveRenderRequestId;

    archiveState.searchQuery = trimmedQuery;
    archiveState.activeTag = null;
    renderPopularTags();

    if (archiveState.searchIndexUnavailable) {
      renderArchiveEmptyState(
        "Search unavailable",
        "The generated search index is unavailable, so archive search cannot run right now.",
        "Search",
      );
      return;
    }

    const { notes } = searchNotesForSelection(
      trimmedQuery,
      archiveState.category,
      archiveState.collection,
    );

    if (requestId !== archiveRenderRequestId) {
      return;
    }

    archiveState.notes = notes;
    archiveState.page = 1;
    archiveState.activeNotePath = null;

    const title = "Search Results";
    const summary = searchSummary(
      trimmedQuery,
      notes.length,
      archiveState.category,
      archiveState.collection,
    );

    if (notes.length === 0) {
      renderArchiveEmptyState(title, summary, "Search");
      renderPopularTags();
      return;
    }

    archiveTitle().textContent = title;
    archiveSummary().textContent = summary;
    renderArchivePage();
    renderPopularTags();
  }

  function applySearchInputValue(value) {
    const nextQuery = value.trim();

    if (!nextQuery) {
      archiveState.searchQuery = "";
      renderSelection({
        category: archiveState.category,
        collection: archiveState.collection,
      }).then(() => {
        updateArchiveLocation({ replace: false });
      });
      return;
    }

    if (archiveState.activeTag) {
      clearSidebarSelection();
      archiveState.category = null;
      archiveState.collection = null;
      clearActiveTag();
    }

    renderSearchResults(nextQuery).then(() => {
      updateArchiveLocation({ replace: false });
    });
  }

  function bindSearchControl() {
    if (searchControlBound) {
      return;
    }

    archiveSearchInput()?.addEventListener("input", (event) => {
      window.clearTimeout(searchDebounceTimer);
      searchDebounceTimer = window.setTimeout(() => {
        applySearchInputValue(event.target.value);
      }, SEARCH_DEBOUNCE_MS);
    });

    searchControlBound = true;
  }

  function compareDatesDesc(left, right) {
    const leftDate = left || "";
    const rightDate = right || "";

    return rightDate.localeCompare(leftDate);
  }

  function sortNotes(notes) {
    return [...notes].sort((left, right) => {
      const updatedCompare = compareDatesDesc(left.updated, right.updated);

      if (updatedCompare !== 0) {
        return updatedCompare;
      }

      const createdCompare = compareDatesDesc(left.created, right.created);

      if (createdCompare !== 0) {
        return createdCompare;
      }

      const categoryCompare = left.category.localeCompare(right.category);

      if (categoryCompare !== 0) {
        return categoryCompare;
      }

      const collectionCompare = left.collection.localeCompare(right.collection);

      if (collectionCompare !== 0) {
        return collectionCompare;
      }

      return left.title.localeCompare(right.title);
    });
  }

  function notesForSelection(category, collection) {
    return sortNotes(
      archiveState.allNotes.filter((note) => {
        if (archiveState.activeTag && !note.tags.includes(archiveState.activeTag)) {
          return false;
        }

        if (category && note.category !== category) {
          return false;
        }

        if (collection && note.collection !== collection) {
          return false;
        }

        return true;
      }),
    );
  }

  function fallbackSummary(category, collection, notes) {
    const count = Array.isArray(notes) ? notes.length : notes;

    if (archiveState.activeTag) {
      return activeTagSummary(count);
    }

    if (category && collection) {
      return `${count} notes from ${category} / ${collection}.`;
    }

    if (category) {
      return `${count} notes from ${category}.`;
    }

    return `${count} notes across the archive.`;
  }

  function renderArchivePage() {
    document.title = DEFAULT_DOCUMENT_TITLE;
    window.IndexNoteDetail.setArchiveMode("list");
    window.IndexNoteDetail.renderListFooterPanel();
    bindPaginationControls();
    bindPageSizeControl();
    bindViewToggleControls();
    bindSearchControl();

    const totalPages = Math.max(1, Math.ceil(archiveState.notes.length / archiveState.pageSize));
    archiveState.page = Math.min(archiveState.page, totalPages);
    const startIndex = (archiveState.page - 1) * archiveState.pageSize;
    const visibleNotes = archiveState.notes.slice(startIndex, startIndex + archiveState.pageSize);

    archivePageLabel().textContent = `Page ${String(archiveState.page).padStart(2, "0")} / ${String(totalPages).padStart(2, "0")}`;
    applyViewModeToList();
    archiveNoteList().innerHTML = visibleNotes.map(noteCardMarkup).join("");
    syncPageSizeControl();
    syncViewToggleButtons();

    setPaginationButtonState(archivePrevButton(), archiveState.page > 1);
    setPaginationButtonState(archiveNextButton(), archiveState.page < totalPages);
  }

  function renderArchiveEmptyState(title, summary, metaLabel = "Archive") {
    archiveRenderRequestId += 1;
    archiveState.notes = [];
    archiveState.page = 1;
    archiveState.activeNotePath = null;
    document.title = DEFAULT_DOCUMENT_TITLE;
    window.IndexNoteDetail.setArchiveMode("list");
    window.IndexNoteDetail.renderListFooterPanel();
    bindPageSizeControl();
    bindViewToggleControls();
    bindSearchControl();
    archiveTitle().textContent = title;
    archiveSummary().textContent = summary;
    applyViewModeToList();
    syncPageSizeControl();
    syncViewToggleButtons();
    archiveNoteList().innerHTML = `
<article class="note-card ${archiveState.viewMode === "grid" ? "note-card--grid" : "note-card--list"} note-card--empty">
<div class="note-card__body">
<div class="note-card__meta">
<span class="note-label note-label--accent">${escapeHtml(title)}</span>
<span class="note-label note-label--muted">${escapeHtml(metaLabel)}</span>
</div>
<h2 class="note-card__title">No notes yet</h2>
<p class="note-card__summary">This area is ready for content, but there are no notes to render for the current selection.</p>
</div>
</article>`;
    archivePageLabel().textContent = "Page 00 / 00";
    setPaginationButtonState(archivePrevButton(), false);
    setPaginationButtonState(archiveNextButton(), false);
  }

  function updateArchiveLocation({ notePath = null, replace = false } = {}) {
    const url = new URL(window.location.href);

    if (archiveState.category) {
      url.searchParams.set("category", archiveState.category);
    } else {
      url.searchParams.delete("category");
    }

    if (archiveState.collection) {
      url.searchParams.set("collection", archiveState.collection);
    } else {
      url.searchParams.delete("collection");
    }

    if (notePath) {
      url.searchParams.set("note", notePath);
    } else {
      url.searchParams.delete("note");
    }

    if (archiveState.viewMode === "grid") {
      url.searchParams.set("view", "grid");
    } else {
      url.searchParams.delete("view");
    }

    if (replace) {
      window.history.replaceState({}, "", url);
      return;
    }

    window.history.pushState({}, "", url);
  }

  async function renderNoteDetail(notePath, options = {}) {
    const noteData = await window.NoteDetailRenderer.loadNoteData(notePath);
    const currentIndex = archiveState.notes.findIndex((note) => note.path === notePath);
    const previousNote = currentIndex > 0 ? archiveState.notes[currentIndex - 1] : null;
    const nextNote =
      currentIndex >= 0 && currentIndex < archiveState.notes.length - 1
        ? archiveState.notes[currentIndex + 1]
        : null;

    archiveState.activeNotePath = notePath;
    document.title = `${noteData.title} | Chochita Archive`;
    archiveTitle().textContent = archiveState.collection || archiveState.category || "Archive";
    archiveSummary().textContent = fallbackSummary(
      archiveState.category,
      archiveState.collection,
      archiveState.notes.length,
    );
    window.IndexNoteDetail.setArchiveMode("detail");
    window.IndexNoteDetail.elements.detailTitle().textContent = noteData.title;
    window.IndexNoteDetail.elements.detailSummary().textContent = noteData.summary;
    window.IndexNoteDetail.elements.detailPublished().textContent =
      noteData.attributes.created ||
      noteData.attributes.published ||
      noteData.attributes.date ||
      "Not set";
    window.IndexNoteDetail.elements.detailTags().innerHTML =
      noteData.tags.length > 0
        ? noteData.tags
            .map(
              (tag) => `<span class="note-tag">${window.NoteDetailRenderer.escapeHtml(tag)}</span>`,
            )
            .join("")
        : '<span class="note-detail__rail-empty">No tags</span>';
    window.IndexNoteDetail.elements.detailReferences().innerHTML =
      noteData.references.length > 0
        ? noteData.references
            .slice(0, 3)
            .map(
              (reference) =>
                `<a class="note-detail__reference-link" href="${reference}" target="_blank" rel="noreferrer">${window.NoteDetailRenderer.escapeHtml(window.NoteDetailRenderer.shortenReference(reference))}</a>`,
            )
            .join("") +
          (noteData.references.length > 3
            ? `<span class="note-detail__rail-empty">+${noteData.references.length - 3} more</span>`
            : "")
        : '<span class="note-detail__rail-empty">No references</span>';
    window.IndexNoteDetail.elements.detailContent().innerHTML = noteData.rendered.html;
    window.IndexNoteDetail.renderOutline(noteData.rendered.outline);
    window.IndexNoteDetail.updateBreadcrumbs(notePath);
    window.IndexNoteDetail.renderDetailFooterPanel(previousNote, nextNote, (path) => {
      renderNoteDetail(path);
      updateArchiveLocation({ notePath: path });
    });

    if (!options.skipHistory) {
      updateArchiveLocation({ notePath });
    }
  }

  async function renderSelection({ category = null, collection = null }) {
    const requestId = ++archiveRenderRequestId;
    archiveState.activeTag = null;
    archiveState.searchQuery = "";
    const notes = notesForSelection(category, collection);

    if (requestId !== archiveRenderRequestId) {
      return;
    }

    archiveState.notes = notes;
    archiveState.page = 1;
    archiveState.category = category;
    archiveState.collection = collection;
    archiveState.activeNotePath = null;

    const copy = archiveCopyForSelection(category, collection);
    const title = copy.title || collection || category || DEFAULT_ARCHIVE_COPY.default.title;
    const summary = copy.summary || fallbackSummary(category, collection, notes);

    if (notes.length === 0) {
      renderArchiveEmptyState(
        title,
        summary,
        collection ? "Collection" : category ? "Category" : "Archive",
      );
      renderPopularTags();
      return;
    }

    archiveTitle().textContent = title;
    archiveSummary().textContent = summary;
    renderArchivePage();
    renderPopularTags();
  }

  function findNoteByPath(path) {
    return archiveState.allNotes.find((note) => note.path === path) || null;
  }

  function buildPopularTags(notes) {
    const tagCounts = new Map();

    notes.forEach((note) => {
      [...new Set(note.tags)].forEach((tag) => {
        tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1);
      });
    });

    return [...tagCounts.entries()]
      .filter(([, count]) => count >= 2)
      .sort((left, right) => {
        if (right[1] !== left[1]) {
          return right[1] - left[1];
        }

        return left[0].localeCompare(right[0]);
      })
      .map(([tag, count]) => ({ tag, count }));
  }

  function renderPopularTags() {
    const mount = popularTagsMount();

    if (!mount) {
      return;
    }

    const tags = buildPopularTags(archiveState.allNotes);

    if (tags.length === 0) {
      mount.innerHTML = '<span class="note-detail__rail-empty">No repeated tags yet.</span>';
      return;
    }

    mount.innerHTML = tags
      .map(
        ({ tag, count }) => `
<button class="tag-chip${archiveState.activeTag === tag ? " tag-chip--active" : ""}" type="button" data-popular-tag="${escapeHtml(tag)}">
<span>${escapeHtml(prettifyTag(tag))}</span>
<span class="tag-chip__count">${String(count)}</span>
</button>`,
      )
      .join("");

    mount.querySelectorAll("[data-popular-tag]").forEach((button) => {
      button.addEventListener("click", () => {
        archiveState.activeTag = button.dataset.popularTag;
        archiveState.category = null;
        archiveState.collection = null;
        archiveState.activeNotePath = null;
        archiveState.page = 1;
        clearSidebarSelection();

        const notes = notesForSelection(null, null);
        archiveState.notes = notes;
        archiveTitle().textContent = activeTagTitle();
        archiveSummary().textContent = activeTagSummary(notes.length);
        renderArchivePage();
        renderPopularTags();
        updateArchiveLocation({ replace: false });
      });
    });
  }

  function bindBrandResetLinks() {
    document.querySelectorAll(".brand-title").forEach((link) => {
      link.addEventListener("click", (event) => {
        if (!window.location.pathname.endsWith("/index.html") && window.location.pathname !== "/") {
          return;
        }

        event.preventDefault();
        archiveState.viewMode = "list";
        archiveState.pageSize = defaultPageSizeForView("list");
        archiveState.page = 1;
        archiveState.category = null;
        archiveState.collection = null;
        archiveState.searchQuery = "";
        archiveState.activeTag = null;
        archiveState.activeNotePath = null;
        if (archiveSearchInput()) {
          archiveSearchInput().value = "";
        }
        clearSidebarSelection();
        renderSelection({ category: null, collection: null }).then(() => {
          updateArchiveLocation({ replace: false });
        });
      });
    });
  }

  async function initializeArchiveFromLocation() {
    const params = new URLSearchParams(window.location.search);
    let category = params.get("category");
    let collection = params.get("collection");
    const note = params.get("note");
    const view = params.get("view");
    let resolvedNote = note;

    archiveState.viewMode = view === "grid" ? "grid" : "list";
    archiveState.pageSize = defaultPageSizeForView(archiveState.viewMode);
    syncViewToggleButtons();
    syncPageSizeControl();

    if (note && (!category || !collection)) {
      const matchedNote = findNoteByPath(note);

      if (matchedNote) {
        category = matchedNote.category;
        collection = matchedNote.collection;
      } else {
        resolvedNote = null;
      }
    }

    await renderSelection({ category, collection });
    updateArchiveLocation({ notePath: resolvedNote, replace: true });

    if (resolvedNote && findNoteByPath(resolvedNote)) {
      await renderNoteDetail(resolvedNote, { skipHistory: true });
    }
  }

  archiveNoteList()?.addEventListener("click", (event) => {
    const link = event.target.closest("[data-note-link='true']");

    if (!link) {
      return;
    }

    event.preventDefault();
    renderNoteDetail(decodeURIComponent(link.closest(".note-card").dataset.notePath));
  });

  window.addEventListener("archive:navigate", (event) => {
    const { category, collection } = event.detail;

    if (archiveSearchInput()) {
      archiveSearchInput().value = "";
    }
    renderSelection({ category, collection }).then(() => {
      renderPopularTags();
      updateArchiveLocation({ replace: false });
    });
  });

  window.addEventListener("popstate", () => {
    initializeArchiveFromLocation();
  });

  Promise.all([loadArchiveCopy(), loadNotesIndex(), loadSearchIndex()])
    .then(() => {
      renderPopularTags();
      bindBrandResetLinks();
      initializeArchiveFromLocation();
    })
    .catch(() => {
      renderArchiveEmptyState(
        "Archive unavailable",
        "Generate the notes index to browse Markdown content from the static archive.",
        "Runtime",
      );
    });
})();
