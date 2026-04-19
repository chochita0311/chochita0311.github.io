(() => {
  const NOTES_INDEX_PATH = "/assets/generated/archives-index.json";
  const SEARCH_INDEX_PATH = "/assets/generated/archives-search-index.json";
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
  const mainLanding = window.MainLanding;
  const archiveSearchApi = window.ArchiveSearch;
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
  let archiveBootstrapPromise = null;
  let archiveRuntimeReady = false;
  const LANDING_SEARCH_PLACEHOLDER_DEFAULT = "노트, 프로젝트, 디자인 기록을 검색해보세요";
  const LANDING_SEARCH_PLACEHOLDER_PENDING = "찾는 중...";
  let archiveSearch = null;

  function archiveNoteList() {
    return document.getElementById("archive-note-list");
  }

  function archiveListView() {
    return document.getElementById("archive-list-view");
  }

  function setArchiveListInteractive(isInteractive) {
    const listView = archiveListView();

    if (!listView) {
      return;
    }

    if (isInteractive) {
      listView.removeAttribute("inert");
      listView.removeAttribute("aria-hidden");
      return;
    }

    listView.setAttribute("inert", "");
    listView.setAttribute("aria-hidden", "true");
  }

  function archivePageLabel() {
    return document.getElementById("archive-page-label");
  }

  function archivePageSizeRoot() {
    return document.getElementById("archive-page-size-root");
  }

  function archivePageSizeTrigger() {
    return document.getElementById("archive-page-size-trigger");
  }

  function archivePageSizeCurrent() {
    return document.getElementById("archive-page-size-current");
  }

  function archivePageSizeMenu() {
    return document.getElementById("archive-page-size-menu");
  }

  function archiveViewButtons() {
    return document.querySelectorAll("[data-archive-view]");
  }

  function archiveSearchInput() {
    return document.getElementById("archive-search-input");
  }

  function landingSearchInput() {
    return mainLanding?.elements.searchInput() || null;
  }

  function landingSearchField() {
    return mainLanding?.elements.searchField() || null;
  }

  function landingSearchSubmit() {
    return mainLanding?.elements.searchSubmit() || null;
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

  function canonicalLinkElement() {
    return document.querySelector("link[rel='canonical']");
  }

  function syncCanonicalLink(path) {
    const canonicalLink = canonicalLinkElement();

    if (!canonicalLink) {
      return;
    }

    canonicalLink.href = window.ArchiveRoutes.canonicalUrl(path);
  }

  function setLandingSearchActive(isActive) {
    mainLanding?.setSearchActive(isActive);
  }

  function setLandingSearchPending(isPending) {
    mainLanding?.setSearchPending(isPending, {
      defaultPlaceholder: LANDING_SEARCH_PLACEHOLDER_DEFAULT,
      pendingPlaceholder: LANDING_SEARCH_PLACEHOLDER_PENDING,
    });
  }

  function syncLandingVisibility(mode = archiveState.activeNotePath ? "detail" : "list") {
    mainLanding?.syncVisibility(mode);
    setArchiveListInteractive(
      !(mode === "list" && document.body.classList.contains("has-landing-entry")),
    );
  }

  function dismissLandingForShellInteraction() {
    if (!document.body.classList.contains("has-landing-entry")) {
      return;
    }

    mainLanding?.dismissImmediately();
  }

  function initializeLandingShellState() {
    const route = window.ArchiveRoutes.parseCurrentLocation();

    if (mainLanding) {
      mainLanding.setDismissed(route.type !== "landing");
      mainLanding.bindControls();
    }

    syncViewToggleButtons();
    syncPageSizeControl();
    syncLandingVisibility(route.type === "note-detail" ? "detail" : "list");
  }

  function shouldInitializeArchiveOnBoot() {
    const route = window.ArchiveRoutes.parseCurrentLocation();

    if (route.type !== "landing") {
      return true;
    }

    return window.innerWidth < 1024;
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
    return window.ArchiveRoutes.buildNoteDetailPath(note.id);
  }

  function activeTagSummary(noteCount) {
    return `${noteCount} notes tagged ${prettifyTag(archiveState.activeTag)} across the archive.`;
  }

  function tagMarkup(tags, { compact = false } = {}) {
    const visibleTags = compact ? tags.slice(0, 2) : tags;
    const hiddenTagCount = compact ? Math.max(0, tags.length - visibleTags.length) : 0;
    const hiddenTags = compact ? tags.slice(2).map(prettifyTag) : [];
    const chips = visibleTags.map((tag) => {
      const prettyTag = prettifyTag(tag);
      return `<span class="note-tag" title="${escapeHtml(prettyTag)}">${escapeHtml(prettyTag)}</span>`;
    });

    if (hiddenTagCount > 0) {
      chips.push(
        `<span class="note-tag note-tag--more" tabindex="0">+${String(hiddenTagCount)}<span class="note-tag__tooltip" role="tooltip">${hiddenTags.map((tag) => `<span class="note-tag__tooltip-chip">${escapeHtml(tag)}</span>`).join("")}</span></span>`,
      );
    }

    return chips.join("");
  }

  function noteCardMarkup(note) {
    const dateLabel = formatArchiveDate(note);
    const isGrid = archiveState.viewMode === "grid";
    const secondaryMeta = isGrid ? dateLabel || note.collection : note.collection;
    const tagsMarkup = tagMarkup(note.tags, { compact: isGrid });
    const cardClass = isGrid ? "note-card note-card--grid" : "note-card note-card--list";
    const footerMarkup = isGrid
      ? `<div class="note-card__footer">
<div class="note-card__tags">
${tagsMarkup}
</div>
<p class="note-card__collection">${escapeHtml(note.collection)}</p>
</div>`
      : `<div class="note-card__footer">
<div class="note-card__tags">
${tagsMarkup}
</div>
</div>`;

    return `
<article class="${cardClass}" data-note-id="${String(note.id)}">
<div class="note-card__body">
<div class="note-card__meta">
<span class="note-label note-label--accent">${escapeHtml(note.category)}</span>
<span class="note-label note-label--muted">${escapeHtml(secondaryMeta)}</span>
</div>
<a class="note-card__link" href="${buildNoteHref(note)}" data-note-link="true">
<h2 class="note-card__title">${escapeHtml(note.title)}</h2>
<p class="note-card__summary">${escapeHtml(note.summary)}</p>
</a>
${footerMarkup}
</div>
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
    const current = archivePageSizeCurrent();
    const menu = archivePageSizeMenu();

    if (!current || !menu) {
      return;
    }

    const options = pageSizeOptionsForView(archiveState.viewMode);
    current.textContent = String(archiveState.pageSize);
    menu.innerHTML = options
      .map((value) => {
        const isSelected = value === archiveState.pageSize;
        return `<button class="archive-page-size__option${isSelected ? " archive-page-size__option--selected" : ""}" data-archive-page-size="${String(value)}" role="menuitemradio" aria-checked="${isSelected ? "true" : "false"}" type="button"><span>${String(value)}</span>${isSelected ? '<span aria-hidden="true" class="icon icon--material material-symbols-outlined archive-page-size__check">check</span>' : ""}</button>`;
      })
      .join("");
  }

  function setPageSizeMenuOpen(isOpen) {
    const root = archivePageSizeRoot();
    const trigger = archivePageSizeTrigger();
    const menu = archivePageSizeMenu();

    if (!root || !trigger || !menu) {
      return;
    }

    root.dataset.open = isOpen ? "true" : "false";
    trigger.setAttribute("aria-expanded", isOpen ? "true" : "false");
    menu.hidden = !isOpen;
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

  function preserveFooterAnchor(anchorElement, renderAction) {
    const beforeTop = anchorElement?.getBoundingClientRect().top;

    renderAction();

    if (typeof beforeTop !== "number") {
      return;
    }

    const nextAnchor = document.getElementById(anchorElement.id);

    if (!nextAnchor) {
      return;
    }

    const afterTop = nextAnchor.getBoundingClientRect().top;
    window.scrollBy(0, afterTop - beforeTop);
  }

  function bindPaginationControls() {
    const prevButton = archivePrevButton();
    const nextButton = archiveNextButton();

    if (prevButton) {
      prevButton.onclick = (event) => {
        if (archiveState.page <= 1) {
          return;
        }

        archiveState.page -= 1;
        preserveFooterAnchor(event.currentTarget, () => {
          renderArchivePage();
        });
      };
    }

    if (nextButton) {
      nextButton.onclick = (event) => {
        const totalPages = Math.max(
          1,
          Math.ceil(archiveState.notes.length / archiveState.pageSize),
        );

        if (archiveState.page >= totalPages) {
          return;
        }

        archiveState.page += 1;
        preserveFooterAnchor(event.currentTarget, () => {
          renderArchivePage();
        });
      };
    }
  }

  function bindPageSizeControl() {
    const root = archivePageSizeRoot();
    const trigger = archivePageSizeTrigger();
    const menu = archivePageSizeMenu();

    if (!root || !trigger || !menu) {
      return;
    }

    if (root.dataset.bound !== "true") {
      trigger.addEventListener("click", () => {
        const isOpen = trigger.getAttribute("aria-expanded") === "true";
        setPageSizeMenuOpen(!isOpen);
      });

      menu.addEventListener("click", (event) => {
        const option = event.target.closest("[data-archive-page-size]");

        if (!option) {
          return;
        }

        const nextPageSize = Number.parseInt(option.dataset.archivePageSize, 10);

        if (!Number.isInteger(nextPageSize) || nextPageSize <= 0) {
          return;
        }

        archiveState.pageSize = nextPageSize;
        archiveState.page = 1;
        setPageSizeMenuOpen(false);
        preserveFooterAnchor(trigger, () => {
          renderArchivePage();
        });
      });

      root.dataset.bound = "true";
    }

    if (!pageSizeBound) {
      document.addEventListener("click", (event) => {
        const currentRoot = archivePageSizeRoot();

        if (!currentRoot || currentRoot.contains(event.target)) {
          return;
        }

        setPageSizeMenuOpen(false);
      });

      document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
          setPageSizeMenuOpen(false);
        }
      });

      pageSizeBound = true;
    }
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
        archiveSearch.renderSearchResults(archiveState.searchQuery).then(() => {
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

  function bindSearchControl() {
    archiveSearch?.bindControls();
  }

  function createArchiveSearchController() {
    if (archiveSearch) {
      return archiveSearch;
    }

    archiveSearch = archiveSearchApi?.createController({
      beginRenderRequest() {
        archiveRenderRequestId += 1;
        return archiveRenderRequestId;
      },
      clearActiveTag,
      clearSidebarSelection,
      completeLanding: () => mainLanding?.complete(),
      dismissLandingImmediately: () => mainLanding?.dismissImmediately(),
      ensureArchiveReady: ensureArchiveRuntimeReady,
      fallbackSearchFilters: FALLBACK_SEARCH_FILTERS,
      fallbackSearchPattern: FALLBACK_SEARCH_PATTERN,
      getArchiveState() {
        archiveState.__renderRequestId = () => archiveRenderRequestId;
        return archiveState;
      },
      getLandingInput: landingSearchInput,
      getLandingSubmit: landingSearchSubmit,
      getTopbarInput: archiveSearchInput,
      isLandingActive: () => document.body.classList.contains("has-landing-entry"),
      onLandingSearchActive: setLandingSearchActive,
      onLandingSearchPending: setLandingSearchPending,
      renderArchiveEmptyState,
      renderArchivePage,
      renderPopularTags,
      renderSelection,
      scopeLabel: searchScopeLabel,
      sortNotes,
      updateArchiveLocation,
    });

    archiveSearch?.bindControls();
    return archiveSearch;
  }

  async function ensureArchiveRuntimeReady() {
    if (archiveRuntimeReady) {
      return;
    }

    if (!archiveBootstrapPromise) {
      archiveBootstrapPromise = Promise.all([loadNotesIndex(), loadSearchIndex()])
        .then(() => {
          archiveRuntimeReady = true;
          renderPopularTags();
        })
        .catch((error) => {
          archiveBootstrapPromise = null;
          throw error;
        });
    }

    await archiveBootstrapPromise;
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
    syncLandingVisibility("list");
    window.IndexNoteDetail.renderListFooterPanel();
    bindPaginationControls();
    bindPageSizeControl();
    bindViewToggleControls();
    bindSearchControl();

    const totalPages = Math.max(1, Math.ceil(archiveState.notes.length / archiveState.pageSize));
    archiveState.page = Math.min(archiveState.page, totalPages);
    const startIndex = (archiveState.page - 1) * archiveState.pageSize;
    const visibleNotes = archiveState.notes.slice(startIndex, startIndex + archiveState.pageSize);

    archiveListView().hidden = false;
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
    syncLandingVisibility("list");
    window.IndexNoteDetail.renderListFooterPanel();
    bindPageSizeControl();
    bindViewToggleControls();
    bindSearchControl();
    applyViewModeToList();
    syncPageSizeControl();
    syncViewToggleButtons();
    archiveListView().hidden = false;
    archiveNoteList().innerHTML = `
<article class="note-card ${archiveState.viewMode === "grid" ? "note-card--grid" : "note-card--list"} note-card--empty">
<div class="note-card__body">
<div class="note-card__meta">
<span class="note-label note-label--accent">${escapeHtml(title)}</span>
<span class="note-label note-label--muted">${escapeHtml(metaLabel)}</span>
</div>
<h2 class="note-card__title">No notes yet</h2>
<p class="note-card__summary">${escapeHtml(summary || "This area is ready for content, but there are no notes to render for the current selection.")}</p>
</div>
    </article>`;
    archivePageLabel().textContent = "Page 00 / 00";
    setPaginationButtonState(archivePrevButton(), false);
    setPaginationButtonState(archiveNextButton(), false);
  }

  function updateArchiveLocation({
    notePath = null,
    noteId = null,
    replace = false,
    archiveHome = null,
  } = {}) {
    let resolvedNoteId = noteId;

    if (resolvedNoteId === null && notePath) {
      resolvedNoteId = findNoteByPath(notePath)?.id ?? null;
    }

    const nextUrl = window.ArchiveRoutes.buildPathForState({
      category: resolvedNoteId ? null : archiveState.category,
      collection: resolvedNoteId ? null : archiveState.collection,
      noteId: resolvedNoteId,
      viewMode: archiveState.viewMode,
      archiveHome:
        archiveHome ??
        (resolvedNoteId === null &&
          !archiveState.category &&
          !archiveState.collection &&
          !archiveState.activeTag &&
          !archiveState.searchQuery),
    });

    if (replace) {
      syncCanonicalLink(nextUrl);
      window.history.replaceState({}, "", nextUrl);
      return;
    }

    syncCanonicalLink(nextUrl);
    window.history.pushState({}, "", nextUrl);
  }

  function findNoteById(noteId) {
    const normalizedId = Number.parseInt(String(noteId), 10);

    if (!Number.isInteger(normalizedId)) {
      return null;
    }

    return archiveState.allNotes.find((note) => note.id === normalizedId) || null;
  }

  function resolveNoteRecord(noteInput) {
    if (typeof noteInput === "number" || /^\d+$/.test(String(noteInput || ""))) {
      return findNoteById(noteInput);
    }

    return findNoteByPath(noteInput);
  }

  async function renderNoteDetail(noteInput, options = {}) {
    archiveListView().hidden = true;
    const noteRecord = resolveNoteRecord(noteInput);

    if (!noteRecord) {
      renderArchiveEmptyState(
        "Note unavailable",
        "The requested note could not be resolved from the archive index.",
        "Note",
      );
      return;
    }

    const normalizedPath = window.NoteDetailRenderer.normalizeNotePath(noteRecord.path);
    const noteData = await window.NoteDetailRenderer.loadNoteData(normalizedPath);
    const currentIndex = archiveState.notes.findIndex((note) => note.path === normalizedPath);
    const previousNote = currentIndex > 0 ? archiveState.notes[currentIndex - 1] : null;
    const nextNote =
      currentIndex >= 0 && currentIndex < archiveState.notes.length - 1
        ? archiveState.notes[currentIndex + 1]
        : null;

    archiveState.activeNotePath = normalizedPath;
    document.title = `${noteData.title} | Chochita Archive`;
    window.IndexNoteDetail.setArchiveMode("detail");
    syncLandingVisibility("detail");
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
    window.IndexNoteDetail.updateBreadcrumbs(normalizedPath);
    window.IndexNoteDetail.renderDetailFooterPanel(previousNote, nextNote, (nextNoteId) => {
      renderNoteDetail(nextNoteId);
      updateArchiveLocation({ noteId: nextNoteId });
    });

    if (!options.skipHistory) {
      updateArchiveLocation({ noteId: noteRecord.id });
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

    const title = collection || category || "Archive";
    const summary = fallbackSummary(category, collection, notes);

    if (notes.length === 0) {
      renderArchiveEmptyState(
        title,
        summary,
        collection ? "Collection" : category ? "Category" : "Archive",
      );
      renderPopularTags();
      return;
    }

    renderArchivePage();
    renderPopularTags();
  }

  function findNoteByPath(path) {
    const normalizedPath = window.NoteDetailRenderer.normalizeNotePath(path);
    return archiveState.allNotes.find((note) => note.path === normalizedPath) || null;
  }

  function buildPopularTags(notes) {
    const tagCounts = new Map();

    notes.forEach((note) => {
      [...new Set(note.tags)].forEach((tag) => {
        tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1);
      });
    });

    return [...tagCounts.entries()]
      .filter(([, count]) => count >= 5)
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
        dismissLandingForShellInteraction();
        archiveState.activeTag = button.dataset.popularTag;
        archiveState.category = null;
        archiveState.collection = null;
        archiveState.activeNotePath = null;
        archiveState.page = 1;
        clearSidebarSelection();

        const notes = notesForSelection(null, null);
        archiveState.notes = notes;
        renderArchivePage();
        renderPopularTags();
        updateArchiveLocation({ replace: false });
      });
    });
  }

  function bindBrandResetLinks() {
    document.querySelectorAll(".brand-title").forEach((link) => {
      link.addEventListener("click", async (event) => {
        event.preventDefault();
        window.history.pushState({}, "", window.ArchiveRoutes.buildArchiveHomePath());
        await ensureArchiveRuntimeReady();
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
          updateArchiveLocation({ replace: true, archiveHome: true });
          window.scrollTo({ top: 0, behavior: "auto" });
        });
      });
    });
  }

  async function initializeArchiveFromLocation() {
    await ensureArchiveRuntimeReady();

    const route = window.ArchiveRoutes.parseCurrentLocation();
    let category = route.category;
    let collection = route.collection;
    let resolvedNote = null;

    archiveState.viewMode = route.viewMode;
    archiveState.pageSize = defaultPageSizeForView(archiveState.viewMode);
    syncViewToggleButtons();
    syncPageSizeControl();
    syncLandingVisibility(route.type === "note-detail" ? "detail" : "list");

    if (route.type === "note-detail") {
      const matchedNote = findNoteById(route.noteId);

      if (matchedNote) {
        category = matchedNote.category;
        collection = matchedNote.collection;
        resolvedNote = window.NoteDetailRenderer.normalizeNotePath(matchedNote.path);
      }
    }

    await renderSelection({ category, collection });
    if (route.type !== "landing") {
      updateArchiveLocation({
        notePath: resolvedNote,
        replace: true,
        archiveHome: route.type === "archive-home",
      });
    }

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
    renderNoteDetail(link.closest(".note-card").dataset.noteId);
  });

  window.addEventListener("archive:navigate", async (event) => {
    const { category, collection } = event.detail;

    dismissLandingForShellInteraction();
    await ensureArchiveRuntimeReady();

    if (archiveSearchInput()) {
      archiveSearchInput().value = "";
    }
    renderSelection({ category, collection }).then(() => {
      renderPopularTags();
      updateArchiveLocation({ replace: false });
    });
  });

  window.addEventListener("popstate", () => {
    void initializeArchiveFromLocation();
  });

  window.addEventListener("archive:landing-state", () => {
    setArchiveListInteractive(!document.body.classList.contains("has-landing-entry"));
  });

  initializeLandingShellState();
  bindBrandResetLinks();
  createArchiveSearchController();
  void ensureArchiveRuntimeReady();

  if (shouldInitializeArchiveOnBoot()) {
    void initializeArchiveFromLocation().catch(() => {
      renderArchiveEmptyState(
        "Archive unavailable",
        "Generate the notes index to browse Markdown content from the static archive.",
        "Runtime",
      );
    });
  }
})();
