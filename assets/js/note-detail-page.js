function renderOutline(items) {
  if (items.length === 0) {
    noteOutline().innerHTML =
      '<p class="note-detail__rail-empty">No section headings were found in this note.</p>';
    return;
  }

  noteOutline().innerHTML = items
    .map(
      (item) =>
        `<a href="#${item.id}"${item.level === 3 ? ' class="note-detail__rail-link note-detail__rail-link--child"' : ""}>${escapeHtml(item.text)}</a>`,
    )
    .join("");
}

function updateBreadcrumbs(path) {
  const segments = path.split("/");
  const category = segments[1] || "Archive";
  const collection = segments[2] || "Notes";
  const mount = noteBreadcrumbs();

  if (!mount) {
    return;
  }

  mount.innerHTML = `
<a href="../../index.html">Archive</a>
<span class="material-symbols-outlined">chevron_right</span>
<a href="../../index.html">${escapeHtml(category)}</a>
<span class="material-symbols-outlined">chevron_right</span>
<span>${escapeHtml(collection)}</span>`;
}

async function loadNotePage() {
  const notePath = new URLSearchParams(window.location.search).get("note");

  if (!notePath) {
    noteTitle().textContent = "No note selected";
    noteSummary().textContent =
      "Open this page from a note in the archive so the target Markdown file can be loaded.";
    noteContent().innerHTML =
      '<p class="note-detail__empty">Add a `note` query parameter that points to a Markdown file under `CATEGORIES/`.</p>';
    return;
  }

  let noteData;

  try {
    noteData = await window.NoteDetailRenderer.loadNoteData(notePath, "../../");
  } catch {
    noteTitle().textContent = "Unable to load note";
    noteSummary().textContent =
      "The requested Markdown file could not be read from the repository.";
    notePublished().textContent = "Not available";
    noteContent().innerHTML =
      '<p class="note-detail__empty">Check that the note path is correct and that the file exists.</p>';
    return;
  }

  document.title = `${noteData.title} | Chochita Archive`;
  noteTitle().textContent = noteData.title;
  noteSummary().textContent = noteData.summary;
  notePublished().textContent =
    noteData.attributes.published || noteData.attributes.date || "Not set";
  noteTags().innerHTML =
    noteData.tags.length > 0
      ? noteData.tags
          .map(
            (tag) =>
              `<span class="note-tag">${window.NoteDetailRenderer.escapeHtml(tag)}</span>`,
          )
          .join("")
      : '<span class="note-detail__rail-empty">No tags</span>';
  noteReferences().innerHTML =
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
  noteContent().innerHTML = noteData.rendered.html;
  renderOutline(noteData.rendered.outline);
  updateBreadcrumbs(notePath);
}

loadNotePage();
