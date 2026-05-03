(() => {
  const NOTES_INDEX_PATH = "/assets/generated/archives-index.json";
  const SEARCH_INDEX_PATH = "/assets/generated/archives-search-index.json";
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
  const DEFAULT_DOCUMENT_TITLE = document.title;
  const mainLanding = window.MainLanding;
  const noteSearchApi = window.NoteSearch || window.ArchiveSearch;
  const noteControlsApi = window.NoteArchiveControls;
  const archiveState = {
    allNotes: [],
    notes: [],
    page: 1,
    pageSize: noteControlsApi.defaultPageSizeForView("list"),
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
  let archiveBootstrapPromise = null;
  let archiveRuntimeReady = false;
  let archiveLocationInitializing = false;
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

  const archiveElements = {
    listView: archiveListView,
    nextButton: archiveNextButton,
    noteList: archiveNoteList,
    pageLabel: archivePageLabel,
    pageSizeCurrent: archivePageSizeCurrent,
    pageSizeMenu: archivePageSizeMenu,
    pageSizeRoot: archivePageSizeRoot,
    pageSizeTrigger: archivePageSizeTrigger,
    prevButton: archivePrevButton,
    viewButtons: archiveViewButtons,
  };

  const noteControls = noteControlsApi.createController({
    state: archiveState,
    elements: archiveElements,
    renderArchivePage,
    updateViewMode,
  });

  const noteListRenderer = window.NoteArchiveListRenderer.createRenderer({
    beginRenderRequest: beginArchiveRenderRequest,
    bindSearchControl,
    controls: noteControls,
    defaultDocumentTitle: DEFAULT_DOCUMENT_TITLE,
    detailRenderer: window.NoteDetailRenderer,
    elements: archiveElements,
    routes: window.ArchiveRoutes,
    state: archiveState,
    syncLandingVisibility,
  });

  const popularTagController = window.NoteArchivePopularTags.createController({
    clearSidebarSelection,
    dismissLandingForShellInteraction,
    escapeHtml: noteListRenderer.escapeHtml,
    mount: popularTagsMount,
    notesForSelection,
    prettifyTag: noteListRenderer.prettifyTag,
    renderArchivePage,
    state: archiveState,
    updateArchiveLocation,
  });

  function beginArchiveRenderRequest() {
    archiveRenderRequestId += 1;
    return archiveRenderRequestId;
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
    mainLanding?.setDismissed(true);

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

  function defaultPageSizeForView(viewMode) {
    return noteControls.defaultPageSizeForView(viewMode);
  }

  function isMobileListOnlyViewport() {
    return noteControls.isMobileListOnlyViewport();
  }

  function normalizeArchiveViewMode(viewMode) {
    return noteControls.normalizeArchiveViewMode(viewMode);
  }

  function activeTagSummary(noteCount) {
    return noteListRenderer.activeTagSummary(noteCount);
  }

  function syncPageSizeControl() {
    noteControls.syncPageSizeControl();
  }

  function syncViewToggleButtons() {
    noteControls.syncViewToggleButtons();
  }

  function renderArchivePage() {
    noteListRenderer.renderArchivePage();
  }

  function renderArchiveEmptyState(title, summary, metaLabel = "Archive") {
    noteListRenderer.renderArchiveEmptyState(title, summary, metaLabel);
  }

  function renderPopularTags() {
    popularTagController.renderPopularTags();
  }

  function updateViewMode(mode, { replaceHistory = false } = {}) {
    const normalizedMode = normalizeArchiveViewMode(mode);

    if (normalizedMode !== "list" && normalizedMode !== "grid") {
      return;
    }

    archiveState.viewMode = normalizedMode;
    archiveState.pageSize = defaultPageSizeForView(normalizedMode);
    archiveState.page = 1;
    syncViewToggleButtons();
    syncPageSizeControl();
    renderArchivePage();
    updateArchiveLocation({
      notePath: archiveState.activeNotePath,
      replace: replaceHistory,
    });
  }

  function clearSidebarSelection() {
    window.dispatchEvent(new CustomEvent("sidebar:clear-selection"));
  }

  function setSidebarSelection({ category = null, collection = null } = {}) {
    window.dispatchEvent(
      new CustomEvent("sidebar:set-selection", {
        detail: {
          category,
          collection,
        },
      }),
    );
  }

  function scrollArchiveListToTop() {
    window.requestAnimationFrame(() => {
      const listView = archiveListView();
      const top = listView
        ? Math.max(0, listView.getBoundingClientRect().top + window.scrollY - 8)
        : 0;

      window.scrollTo({
        top,
        behavior: "auto",
      });
    });
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

    archiveSearch = noteSearchApi?.createController({
      beginRenderRequest: beginArchiveRenderRequest,
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

  function scrollNoteDetailToTop() {
    window.scrollTo({
      top: 0,
      behavior: "auto",
    });
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
    setSidebarSelection({
      category: noteRecord.category,
      collection: noteRecord.collection,
    });
    document.title = `${noteData.title} | Chochita Archive`;
    window.IndexNoteDetail.setArchiveMode("detail");
    window.IndexNoteDetail.bindNoteDetailScrollOffsetSync();
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
    window.IndexNoteDetail.bindBreadcrumbs(({ type, category, collection }) => {
      if (type === "category" && category) {
        renderSelection({ category, collection: null });
        updateArchiveLocation({ category });
        return;
      }

      if (type === "collection" && category && collection) {
        renderSelection({ category, collection });
        updateArchiveLocation({ category, collection });
      }
    });
    window.IndexNoteDetail.bindCopyAction(() => noteData.body.replace(/^\s+/, ""));
    window.IndexNoteDetail.renderDetailFooterPanel(previousNote, nextNote, (nextNoteId) => {
      renderNoteDetail(nextNoteId, { scrollToTop: true });
    });

    if (!options.skipHistory) {
      updateArchiveLocation({ noteId: noteRecord.id });
    }

    if (options.scrollToTop) {
      window.requestAnimationFrame(() => {
        scrollNoteDetailToTop();
      });
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
    setSidebarSelection({ category, collection });

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
    if (archiveLocationInitializing) {
      return;
    }

    archiveLocationInitializing = true;

    try {
      await ensureArchiveRuntimeReady();

      const route = window.ArchiveRoutes.parseCurrentLocation();
      let category = route.category;
      let collection = route.collection;
      let resolvedNote = null;

      archiveState.viewMode = normalizeArchiveViewMode(route.viewMode);
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
    } finally {
      archiveLocationInitializing = false;
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
      scrollArchiveListToTop();
    });
  });

  window.addEventListener("popstate", () => {
    void initializeArchiveFromLocation();
  });

  window.addEventListener("resize", () => {
    if (!isMobileListOnlyViewport() || archiveState.viewMode === "list") {
      return;
    }

    updateViewMode("list", { replaceHistory: true });
  });

  window.addEventListener("archive:landing-state", () => {
    const isLandingActive = document.body.classList.contains("has-landing-entry");

    setArchiveListInteractive(!isLandingActive);

    if (isLandingActive || archiveLocationInitializing || archiveNoteList()?.children.length) {
      return;
    }

    const route = window.ArchiveRoutes.parseCurrentLocation();

    if (!["archive-home", "note-list", "landing"].includes(route.type)) {
      return;
    }

    void initializeArchiveFromLocation().catch(() => {
      renderArchiveEmptyState(
        "Archive unavailable",
        "Generate the notes index to browse Markdown content from the static archive.",
        "Runtime",
      );
    });
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
