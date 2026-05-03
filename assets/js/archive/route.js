(() => {
  function siteRoot() {
    return "/";
  }

  function decodeSegment(segment) {
    try {
      return decodeURIComponent(segment);
    } catch {
      return segment;
    }
  }

  function encodeSegment(segment) {
    return encodeURIComponent(String(segment ?? "").trim());
  }

  function normalizePathname(pathname = window.location.pathname) {
    let path = String(pathname || "/").trim();

    if (!path.startsWith("/")) {
      path = `/${path}`;
    }

    path = path.replace(/\/index\.html$/, "/");
    path = path.replace(/\/{2,}/g, "/");

    if (path !== "/" && path.endsWith("/")) {
      path = path.slice(0, -1);
    }

    return path || "/";
  }

  function splitSegments(pathname = window.location.pathname) {
    const normalized = normalizePathname(pathname);

    if (normalized === "/") {
      return [];
    }

    return normalized.slice(1).split("/").filter(Boolean).map(decodeSegment);
  }

  function buildLandingPath() {
    return "/";
  }

  function buildArchiveHomePath() {
    return "/archive/";
  }

  function buildNoteListPath() {
    return "/archive/note/";
  }

  function buildDesignPath() {
    return "/archive/design/";
  }

  function buildNoteQueryBasePath() {
    return "/archive/note";
  }

  function appendQuery(path, params) {
    const search = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value === null || value === undefined || value === "") {
        return;
      }

      search.set(key, String(value));
    });

    const queryString = search.toString();
    return queryString ? `${path}?${queryString}` : path;
  }

  function buildCategoryPath(category, { viewMode = "list" } = {}) {
    return appendViewQuery(
      appendQuery(buildNoteQueryBasePath(), {
        category,
      }),
      viewMode,
    );
  }

  function buildCollectionPath(category, collection, { viewMode = "list" } = {}) {
    return appendViewQuery(
      appendQuery(buildNoteQueryBasePath(), {
        category,
        collection,
      }),
      viewMode,
    );
  }

  function buildNoteDetailPath(noteId) {
    return appendQuery(buildNoteQueryBasePath(), {
      id: noteId,
    });
  }

  function appendViewQuery(path, viewMode) {
    if (viewMode !== "grid") {
      return path;
    }

    const url = new URL(path, window.location.origin);
    url.searchParams.set("view", "grid");
    return `${url.pathname}${url.search}`;
  }

  function buildPathForState({
    category = null,
    collection = null,
    noteId = null,
    viewMode = "list",
    archiveHome = false,
  } = {}) {
    let path = buildArchiveHomePath();

    if (noteId !== null && noteId !== undefined && noteId !== "") {
      path = buildNoteDetailPath(noteId);
      return path;
    } else if (category && collection) {
      path = buildCollectionPath(category, collection, { viewMode });
    } else if (category) {
      path = buildCategoryPath(category, { viewMode });
    } else if (!archiveHome) {
      path = buildNoteListPath();
    }

    return appendViewQuery(path, viewMode);
  }

  function parsePathname(pathname = window.location.pathname) {
    const normalizedPath = normalizePathname(pathname);
    const segments = splitSegments(pathname);

    if (segments.length === 0) {
      return {
        type: "landing",
        normalizedPath: buildLandingPath(),
        category: null,
        collection: null,
        noteId: null,
        archiveHome: false,
        noteList: false,
      };
    }

    if (segments[0] !== "archive") {
      return {
        type: "unknown",
        normalizedPath,
        category: null,
        collection: null,
        noteId: null,
        archiveHome: false,
        noteList: false,
      };
    }

    if (segments.length === 1) {
      return {
        type: "archive-home",
        normalizedPath: buildArchiveHomePath(),
        category: null,
        collection: null,
        noteId: null,
        archiveHome: true,
        noteList: true,
      };
    }

    const archiveKind = segments[1];

    if (archiveKind !== "note") {
      return {
        type: "archive-kind",
        archiveKind,
        normalizedPath: `${normalizedPath}/`,
        category: null,
        collection: null,
        noteId: null,
        archiveHome: false,
        noteList: false,
      };
    }

    if (segments.length === 2) {
      return {
        type: "note-list",
        normalizedPath: buildNoteListPath(),
        category: null,
        collection: null,
        noteId: null,
        archiveHome: false,
        noteList: true,
      };
    }

    return {
      type: "archive-kind",
      archiveKind,
      normalizedPath: `${normalizedPath}/`,
      category: null,
      collection: null,
      noteId: null,
      archiveHome: false,
      noteList: false,
    };
  }

  function parseCurrentLocation() {
    const route = parsePathname(window.location.pathname);
    const searchParams = new URLSearchParams(window.location.search);
    const noteIdParam = searchParams.get("id");
    const category = searchParams.get("category");
    const collection = searchParams.get("collection");
    const noteId = /^\d+$/.test(String(noteIdParam || ""))
      ? Number.parseInt(noteIdParam, 10)
      : null;
    let type = route.type;

    if (route.type === "note-list") {
      if (noteId !== null) {
        type = "note-detail";
      } else if (category && collection) {
        type = "note-collection";
      } else if (category) {
        type = "note-category";
      }
    }

    return {
      ...route,
      type,
      category: route.type === "note-list" ? category : route.category,
      collection: route.type === "note-list" ? collection : route.collection,
      noteId: route.type === "note-list" ? noteId : route.noteId,
      viewMode: searchParams.get("view") === "grid" ? "grid" : "list",
    };
  }

  function canonicalUrl(path) {
    return new URL(path, window.location.origin).toString();
  }

  window.ArchiveRoutes = {
    appendViewQuery,
    buildArchiveHomePath,
    buildCategoryPath,
    buildCollectionPath,
    buildDesignPath,
    buildLandingPath,
    buildNoteDetailPath,
    buildNoteListPath,
    buildPathForState,
    canonicalUrl,
    normalizePathname,
    parseCurrentLocation,
    parsePathname,
    siteRoot,
  };
})();
