function archiveListView() {
  return document.getElementById("archive-list-view");
}

function archiveDetailView() {
  return document.getElementById("archive-detail-view");
}

function archiveFooterPanel() {
  return document.getElementById("archive-footer-panel");
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
  detailNavMount().innerHTML = "";
  archiveFooterPanel().innerHTML = `
<span class="archive-footer__page" id="archive-page-label">Page 01 / 14</span>
<div class="pagination-controls">
<button class="pagination-button pagination-button--disabled" id="archive-prev-button" type="button">
<span class="material-symbols-outlined">chevron_left</span>
</button>
<button class="pagination-button pagination-button--primary" id="archive-next-button" type="button">
<span class="material-symbols-outlined">chevron_right</span>
</button>
</div>`;
}

function renderDetailFooterPanel(previousNote, nextNote, onNavigate) {
  const previousMarkup = previousNote
    ? `<a class="note-detail__nav note-detail__nav--previous" href="#" data-note-nav="${encodeURIComponent(previousNote.path)}">
<span class="note-detail__nav-label">Previous Note</span>
<span class="note-detail__nav-title">${window.NoteDetailRenderer.escapeHtml(previousNote.title)}</span>
</a>`
    : '<div class="note-detail__nav note-detail__nav--previous note-detail__nav--disabled"><span class="note-detail__nav-label">Previous Note</span><span class="note-detail__nav-title">None</span></div>';
  const nextMarkup = nextNote
    ? `<a class="note-detail__nav note-detail__nav--next" href="#" data-note-nav="${encodeURIComponent(nextNote.path)}">
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
        onNavigate(decodeURIComponent(link.dataset.noteNav));
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
  const category = segments[1] || "Archive";
  const collection = segments[2] || "Notes";

  detailBreadcrumbs().innerHTML = `
<a href="#">${window.NoteDetailRenderer.escapeHtml(category)}</a>
<span class="material-symbols-outlined">chevron_right</span>
<span>${window.NoteDetailRenderer.escapeHtml(collection)}</span>`;
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
