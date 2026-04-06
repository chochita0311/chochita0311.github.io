const JAVA_COLLECTION_NOTES = [
  "CATEGORIES/Technology/JAVA/@Async & Thread Pool.md",
  "CATEGORIES/Technology/JAVA/@Data.md",
  "CATEGORIES/Technology/JAVA/@EnableJpaAuditing.md",
  "CATEGORIES/Technology/JAVA/@Modifying.md",
  "CATEGORIES/Technology/JAVA/@NotNull @Size.md",
  "CATEGORIES/Technology/JAVA/@SQLRestriction.md",
  "CATEGORIES/Technology/JAVA/@Scheduled.md",
  "CATEGORIES/Technology/JAVA/@SuperBuilder.md",
  "CATEGORIES/Technology/JAVA/@UtilityClass.md",
  "CATEGORIES/Technology/JAVA/@With.md",
  "CATEGORIES/Technology/JAVA/AOP & Self Invocation.md",
  "CATEGORIES/Technology/JAVA/Apache Poi.md",
  "CATEGORIES/Technology/JAVA/ApplicationRunner.md",
  "CATEGORIES/Technology/JAVA/abstract class DI.md",
];

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
  notes: [],
  page: 1,
  pageSize: DEFAULT_PAGE_SIZE,
  category: null,
  collection: null,
  activeNotePath: null,
  copy: DEFAULT_ARCHIVE_COPY,
};

function archiveTitle() {
  return document.getElementById("archive-title");
}

function archiveSummary() {
  return document.getElementById("archive-summary");
}

function archiveNoteList() {
  return document.getElementById("archive-note-list");
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

function escapeHtml(value) {
  return window.NoteDetailRenderer.escapeHtml(value);
}

function archiveCopyForSelection(category, collection) {
  const collectionKey =
    category && collection ? `${category}/${collection}` : null;

  if (collectionKey && archiveState.copy.collections[collectionKey]) {
    return archiveState.copy.collections[collectionKey];
  }

  if (category && archiveState.copy.categories[category]) {
    return archiveState.copy.categories[category];
  }

  return archiveState.copy.default;
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
${note.tags
  .map((tag) => `<span class="note-tag">${escapeHtml(tag)}</span>`)
  .join("")}
</div>
</div>
</a>
</article>`;
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
  archivePrevButton()?.addEventListener("click", () => {
    if (archiveState.page <= 1) {
      return;
    }

    archiveState.page -= 1;
    renderArchivePage();
  });

  archiveNextButton()?.addEventListener("click", () => {
    const totalPages = Math.max(
      1,
      Math.ceil(archiveState.notes.length / archiveState.pageSize),
    );

    if (archiveState.page >= totalPages) {
      return;
    }

    archiveState.page += 1;
    renderArchivePage();
  });
}

function renderArchivePage() {
  document.title = DEFAULT_DOCUMENT_TITLE;
  window.IndexNoteDetail.setArchiveMode("list");
  window.IndexNoteDetail.renderListFooterPanel();
  bindPaginationControls();

  const totalPages = Math.max(
    1,
    Math.ceil(archiveState.notes.length / archiveState.pageSize),
  );
  const startIndex = (archiveState.page - 1) * archiveState.pageSize;
  const visibleNotes = archiveState.notes.slice(
    startIndex,
    startIndex + archiveState.pageSize,
  );

  archivePageLabel().textContent = `Page ${String(archiveState.page).padStart(2, "0")} / ${String(totalPages).padStart(2, "0")}`;
  archiveNoteList().innerHTML = visibleNotes.map(noteCardMarkup).join("");

  setPaginationButtonState(archivePrevButton(), archiveState.page > 1);
  setPaginationButtonState(archiveNextButton(), archiveState.page < totalPages);
}

async function loadJavaCollectionNotes() {
  const notes = await Promise.all(
    JAVA_COLLECTION_NOTES.map(async (path) => {
      const noteData = await window.NoteDetailRenderer.loadNoteData(path);
      const tags =
        noteData.tags.length > 0 ? noteData.tags : ["Technology", "JAVA"];

      return {
        path,
        title: noteData.title,
        summary: noteData.summary,
        category: "Technology",
        collection: "JAVA",
        tags,
      };
    }),
  );

  return notes;
}

function renderJavaLoadingState() {
  window.IndexNoteDetail.setArchiveMode("list");
  window.IndexNoteDetail.renderListFooterPanel();
  const copy = archiveCopyForSelection("Technology", "JAVA");

  archiveTitle().textContent = copy.title;
  archiveSummary().textContent = "Loading real notes from CATEGORIES/Technology/JAVA for the archive view.";
  archivePageLabel().textContent = "Page 01 / --";
  archiveNoteList().innerHTML = `
<article class="note-card">
<div class="note-card__body">
<div class="note-card__meta">
<span class="note-label note-label--accent">Technology</span>
<span class="note-label note-label--muted">JAVA</span>
</div>
<h2 class="note-card__title">Loading JAVA notes...</h2>
<p class="note-card__summary">Reading the current Markdown files and preparing the collection list.</p>
</div>
</article>`;
}

async function renderJavaCollection() {
  renderJavaLoadingState();

  const notes = await loadJavaCollectionNotes();
  archiveState.notes = notes;
  archiveState.page = 1;
  archiveState.category = "Technology";
  archiveState.collection = "JAVA";
  archiveState.activeNotePath = null;

  const copy = archiveCopyForSelection("Technology", "JAVA");

  archiveTitle().textContent = copy.title;
  archiveSummary().textContent =
    copy.summary || `${notes.length} notes from Technology / JAVA. Showing ${Math.min(notes.length, archiveState.pageSize)} notes per page.`;
  renderArchivePage();
}

function renderArchiveEmptyState(title, summary, metaLabel = "Archive") {
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
  archiveTitle().textContent = archiveState.collection || "Archive";
  archiveSummary().textContent = `${archiveState.notes.length} notes from ${archiveState.category} / ${archiveState.collection}.`;
  window.IndexNoteDetail.setArchiveMode("detail");
  window.IndexNoteDetail.elements.detailTitle().textContent = noteData.title;
  window.IndexNoteDetail.elements.detailSummary().textContent = noteData.summary;
  window.IndexNoteDetail.elements.detailPublished().textContent =
    noteData.attributes.published || noteData.attributes.date || "Not set";
  window.IndexNoteDetail.elements.detailTags().innerHTML =
    noteData.tags.length > 0
      ? noteData.tags
          .map(
            (tag) =>
              `<span class="note-tag">${window.NoteDetailRenderer.escapeHtml(tag)}</span>`,
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

archiveNoteList()?.addEventListener("click", (event) => {
  const link = event.target.closest("[data-note-link='true']");

  if (!link) {
    return;
  }

  event.preventDefault();
  renderNoteDetail(decodeURIComponent(link.closest(".note-card").dataset.notePath));
});

function initializeArchiveFromLocation() {
  const params = new URLSearchParams(window.location.search);
  const category = params.get("category");
  const collection = params.get("collection");
  const note = params.get("note");

  if (category === "Technology" && collection === "JAVA") {
    renderJavaCollection().then(() => {
      updateArchiveLocation({ notePath: note, replace: true });

      if (note) {
        renderNoteDetail(note, { skipHistory: true });
      }
    });
    return;
  }

  if (category === "Technology" && !collection) {
    archiveState.category = "Technology";
    archiveState.collection = null;
    const copy = archiveCopyForSelection(category, null);
    renderArchiveEmptyState(
      copy.title,
      copy.summary,
      "Category",
    );
    updateArchiveLocation({ replace: true });
    return;
  }

  if (category === "English" || category === "Design") {
    archiveState.category = category;
    archiveState.collection = collection;
    const copy = archiveCopyForSelection(category, collection);
    renderArchiveEmptyState(
      copy.title,
      copy.summary,
      collection ? "Collection" : "Category",
    );
    updateArchiveLocation({ replace: true });
    return;
  }

  const defaultCopy = archiveCopyForSelection(null, null);
  archiveTitle().textContent = defaultCopy.title;
  archiveSummary().textContent = defaultCopy.summary;
  renderArchivePage();
}

window.addEventListener("archive:navigate", (event) => {
  const { category, collection } = event.detail;

  if (category === "Technology" && collection === "JAVA") {
    renderJavaCollection().then(() => {
      updateArchiveLocation({ replace: false });
    });
    return;
  }

  archiveState.category = category;
  archiveState.collection = collection;
  const copy = archiveCopyForSelection(category, collection);
  renderArchiveEmptyState(
    copy.title,
    copy.summary,
    collection ? "Collection" : "Category",
  );
  updateArchiveLocation({ replace: false });
});

window.addEventListener("popstate", () => {
  initializeArchiveFromLocation();
});

loadArchiveCopy().finally(() => {
  initializeArchiveFromLocation();
});
