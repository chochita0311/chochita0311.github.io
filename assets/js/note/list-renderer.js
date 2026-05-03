(() => {
  function createRenderer({
    beginRenderRequest,
    controls,
    defaultDocumentTitle,
    detailRenderer,
    elements,
    routes,
    state,
    syncLandingVisibility,
    bindSearchControl,
  }) {
    function escapeHtml(value) {
      return detailRenderer.escapeHtml(String(value));
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
      return routes.buildNoteDetailPath(note.id);
    }

    function activeTagSummary(noteCount) {
      return `${noteCount} notes tagged ${prettifyTag(state.activeTag)} across the archive.`;
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
      const isGrid = state.viewMode === "grid";
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

    function prepareListShell() {
      state.viewMode = controls.normalizeArchiveViewMode(state.viewMode);
      document.title = defaultDocumentTitle;
      window.IndexNoteDetail.setArchiveMode("list");
      syncLandingVisibility("list");
      window.IndexNoteDetail.renderListFooterPanel();
      controls.bindPaginationControls();
      controls.bindPageSizeControl();
      controls.bindViewToggleControls();
      bindSearchControl();
    }

    function renderArchivePage() {
      prepareListShell();

      const totalPages = Math.max(1, Math.ceil(state.notes.length / state.pageSize));
      state.page = Math.min(state.page, totalPages);
      const startIndex = (state.page - 1) * state.pageSize;
      const visibleNotes = state.notes.slice(startIndex, startIndex + state.pageSize);

      elements.listView().hidden = false;
      elements.pageLabel().textContent = `Page ${String(state.page).padStart(2, "0")} / ${String(totalPages).padStart(2, "0")}`;
      controls.applyViewModeToList();
      elements.noteList().innerHTML = visibleNotes.map(noteCardMarkup).join("");
      controls.syncPageSizeControl();
      controls.syncViewToggleButtons();
      controls.setPaginationButtonState(elements.prevButton(), state.page > 1);
      controls.setPaginationButtonState(elements.nextButton(), state.page < totalPages);
    }

    function renderArchiveEmptyState(title, summary, metaLabel = "Archive") {
      beginRenderRequest();
      state.viewMode = controls.normalizeArchiveViewMode(state.viewMode);
      state.notes = [];
      state.page = 1;
      state.activeNotePath = null;
      document.title = defaultDocumentTitle;
      window.IndexNoteDetail.setArchiveMode("list");
      syncLandingVisibility("list");
      window.IndexNoteDetail.renderListFooterPanel();
      controls.bindPageSizeControl();
      controls.bindViewToggleControls();
      bindSearchControl();
      controls.applyViewModeToList();
      controls.syncPageSizeControl();
      controls.syncViewToggleButtons();
      elements.listView().hidden = false;
      elements.noteList().innerHTML = `
<article class="note-card ${state.viewMode === "grid" ? "note-card--grid" : "note-card--list"} note-card--empty">
<div class="note-card__body">
<div class="note-card__meta">
<span class="note-label note-label--accent">${escapeHtml(title)}</span>
<span class="note-label note-label--muted">${escapeHtml(metaLabel)}</span>
</div>
<h2 class="note-card__title">No notes yet</h2>
<p class="note-card__summary">${escapeHtml(summary || "This area is ready for content, but there are no notes to render for the current selection.")}</p>
</div>
    </article>`;
      elements.pageLabel().textContent = "Page 00 / 00";
      controls.setPaginationButtonState(elements.prevButton(), false);
      controls.setPaginationButtonState(elements.nextButton(), false);
    }

    return {
      activeTagSummary,
      escapeHtml,
      formatArchiveDate,
      noteCardMarkup,
      prettifyTag,
      renderArchiveEmptyState,
      renderArchivePage,
    };
  }

  window.NoteArchiveListRenderer = {
    createRenderer,
  };
})();
