const { ICONS, renderIcon } = window.AppIcons;

function archiveListView() {
  return document.getElementById("archive-list-view");
}

function archiveDetailView() {
  return document.getElementById("archive-detail-view");
}

function archiveFooterPanel() {
  return document.getElementById("archive-footer-panel");
}

function archiveFooter() {
  return document.querySelector(".archive-footer");
}

function detailNavMount() {
  return document.getElementById("note-detail-nav");
}

function detailTitle() {
  return document.getElementById("note-title");
}

function detailSummary() {
  return document.getElementById("note-summary");
}

function detailPublished() {
  return document.getElementById("note-published");
}

function detailTags() {
  return document.getElementById("note-tags");
}

function detailReferences() {
  return document.getElementById("note-references");
}

function detailContent() {
  return document.getElementById("note-content");
}

function detailOutline() {
  return document.getElementById("note-outline");
}

function detailBreadcrumbs() {
  return document.querySelector(".note-detail__breadcrumbs");
}

function setArchiveMode(mode) {
  const showDetail = mode === "detail";

  archiveListView().hidden = showDetail;
  archiveDetailView().hidden = !showDetail;
}

function renderListFooterPanel() {
  archiveFooter().hidden = false;
  detailNavMount().innerHTML = "";
  archiveFooterPanel().innerHTML = `
<div class="archive-page-size" id="archive-page-size-root">
<button aria-controls="archive-page-size-menu" aria-expanded="false" aria-haspopup="menu" aria-label="Archive page size" class="archive-page-size__trigger" id="archive-page-size-trigger" type="button">
<span class="archive-page-size__current" id="archive-page-size-current">10</span>
<span aria-hidden="true" class="icon icon--material material-symbols-outlined archive-page-size__icon">expand_more</span>
</button>
<div class="archive-page-size__menu" hidden id="archive-page-size-menu"></div>
</div>
<div class="archive-footer__pagination">
<span class="archive-footer__page" id="archive-page-label">Page 01 / 14</span>
<div class="pagination-controls">
<button class="pagination-button pagination-button--disabled" id="archive-prev-button" type="button">
<span aria-hidden="true" class="icon icon--material material-symbols-outlined">chevron_left</span>
</button>
<button class="pagination-button pagination-button--primary" id="archive-next-button" type="button">
<span aria-hidden="true" class="icon icon--material material-symbols-outlined">chevron_right</span>
</button>
</div>
</div>`;
}

function renderDetailFooterPanel(previousNote, nextNote, onNavigate) {
  archiveFooter().hidden = false;
  const previousMarkup = previousNote
    ? `<a class="note-detail__nav note-detail__nav--previous" href="${window.ArchiveRoutes.buildNoteDetailPath(previousNote.id)}" data-note-nav="${String(previousNote.id)}">
<span class="note-detail__nav-label">Previous Note</span>
<span class="note-detail__nav-title">${window.NoteDetailRenderer.escapeHtml(previousNote.title)}</span>
</a>`
    : '<div class="note-detail__nav note-detail__nav--previous note-detail__nav--disabled"><span class="note-detail__nav-label">Previous Note</span><span class="note-detail__nav-title">None</span></div>';
  const nextMarkup = nextNote
    ? `<a class="note-detail__nav note-detail__nav--next" href="${window.ArchiveRoutes.buildNoteDetailPath(nextNote.id)}" data-note-nav="${String(nextNote.id)}">
<span class="note-detail__nav-label">Next Note</span>
<span class="note-detail__nav-title">${window.NoteDetailRenderer.escapeHtml(nextNote.title)}</span>
</a>`
    : '<div class="note-detail__nav note-detail__nav--next note-detail__nav--disabled"><span class="note-detail__nav-label">Next Note</span><span class="note-detail__nav-title">None</span></div>';

  detailNavMount().innerHTML = `
${previousMarkup}
${nextMarkup}`;

  archiveFooterPanel().innerHTML = "";

  detailNavMount()
    .querySelectorAll("[data-note-nav]")
    .forEach((link) => {
      link.addEventListener("click", (event) => {
        event.preventDefault();
        onNavigate(Number.parseInt(link.dataset.noteNav, 10));
      });
    });
}

function renderOutline(items) {
  if (items.length === 0) {
    detailOutline().innerHTML =
      '<p class="note-detail__rail-empty">No section headings were found in this note.</p>';
    return;
  }

  detailOutline().innerHTML = items
    .map(
      (item) =>
        `<a href="#${item.id}"${item.level === 3 ? ' class="note-detail__rail-link--child"' : ""}>${window.NoteDetailRenderer.escapeHtml(item.text)}</a>`,
    )
    .join("");
}

function updateBreadcrumbs(path) {
  const segments = path.split("/");
  const category = segments[1] || "Notes";
  const collection = segments[2] || "Notes";
  const categoryHref = window.ArchiveRoutes.buildCategoryPath(category);
  const collectionHref = window.ArchiveRoutes.buildCollectionPath(category, collection);

  detailBreadcrumbs().innerHTML = `
<a href="${categoryHref}">${window.NoteDetailRenderer.escapeHtml(category)}</a>
${renderIcon(ICONS.navigation.breadcrumb)}
<a href="${collectionHref}">${window.NoteDetailRenderer.escapeHtml(collection)}</a>`;
}

window.IndexNoteDetail = {
  renderListFooterPanel,
  renderDetailFooterPanel,
  renderOutline,
  setArchiveMode,
  updateBreadcrumbs,
  elements: {
    detailTitle,
    detailSummary,
    detailPublished,
    detailTags,
    detailReferences,
    detailContent,
  },
};
