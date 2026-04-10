(() => {
  const NOTES_INDEX_PATH = "assets/generated/archives-index.json";
  const DEFAULT_PAGE_SIZE = 10;
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
    pageSize: DEFAULT_PAGE_SIZE,
    category: null,
    collection: null,
    activeNotePath: null,
    copy: DEFAULT_ARCHIVE_COPY,
  };

  let archiveRenderRequestId = 0;
  let paginationBound = false;

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

  function prettifyTag(tag) {
    return tag
      .split("-")
      .filter(Boolean)
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(" ");
  }

  function noteCardMarkup(note) {
    return `
<article class="note-card" data-note-path="${escapeHtml(note.path)}">
<a class="note-card__link" href="?category=${encodeURIComponent(note.category)}&collection=${encodeURIComponent(note.collection)}&note=${encodeURIComponent(note.path)}" data-note-link="true">
<div class="note-card__body">
<div class="note-card__meta">
<span class="note-label note-label--accent">${escapeHtml(note.category)}</span>
<span class="note-label note-label--muted">${escapeHtml(note.collection)}</span>
</div>
<h2 class="note-card__title">${escapeHtml(note.title)}</h2>
<p class="note-card__summary">${escapeHtml(note.summary)}</p>
<div class="note-card__tags">
${note.tags.map((tag) => `<span class="note-tag">${escapeHtml(prettifyTag(tag))}</span>`).join("")}
</div>
</div>
</a>
</article>`;
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
    if (paginationBound) {
      return;
    }

    archivePrevButton()?.addEventListener("click", () => {
      if (archiveState.page <= 1) {
        return;
      }

      archiveState.page -= 1;
      renderArchivePage();
    });

    archiveNextButton()?.addEventListener("click", () => {
      const totalPages = Math.max(1, Math.ceil(archiveState.notes.length / archiveState.pageSize));

      if (archiveState.page >= totalPages) {
        return;
      }

      archiveState.page += 1;
      renderArchivePage();
    });

    paginationBound = true;
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
    const count = notes.length;

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

    const totalPages = Math.max(1, Math.ceil(archiveState.notes.length / archiveState.pageSize));
    const startIndex = (archiveState.page - 1) * archiveState.pageSize;
    const visibleNotes = archiveState.notes.slice(startIndex, startIndex + archiveState.pageSize);

    archivePageLabel().textContent = `Page ${String(archiveState.page).padStart(2, "0")} / ${String(totalPages).padStart(2, "0")}`;
    archiveNoteList().innerHTML = visibleNotes.map(noteCardMarkup).join("");

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
    archiveTitle().textContent = title;
    archiveSummary().textContent = summary;
    archiveNoteList().innerHTML = `
<article class="note-card">
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
      return;
    }

    archiveTitle().textContent = title;
    archiveSummary().textContent = summary;
    renderArchivePage();
  }

  function findNoteByPath(path) {
    return archiveState.allNotes.find((note) => note.path === path) || null;
  }

  async function initializeArchiveFromLocation() {
    const params = new URLSearchParams(window.location.search);
    let category = params.get("category");
    let collection = params.get("collection");
    const note = params.get("note");
    let resolvedNote = note;

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

    renderSelection({ category, collection }).then(() => {
      updateArchiveLocation({ replace: false });
    });
  });

  window.addEventListener("popstate", () => {
    initializeArchiveFromLocation();
  });

  Promise.all([loadArchiveCopy(), loadNotesIndex()])
    .then(() => {
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
