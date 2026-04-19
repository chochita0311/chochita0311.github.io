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

function detailRail() {
  return document.querySelector(".note-detail__rail");
}

function detailBreadcrumbs() {
  return document.querySelector(".note-detail__breadcrumbs");
}

function detailUtility() {
  return document.querySelector(".note-detail__utility");
}

function detailActionButtons() {
  return document.querySelectorAll("[data-note-action]");
}

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

async function writeClipboardText(text) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }

  const fallback = document.createElement("textarea");
  fallback.value = text;
  fallback.setAttribute("readonly", "");
  fallback.style.position = "fixed";
  fallback.style.top = "0";
  fallback.style.left = "0";
  fallback.style.opacity = "0";
  document.body.append(fallback);
  fallback.select();
  document.execCommand("copy");
  fallback.remove();
}

function noteDetailScrollOffset() {
  const utilityBottom = detailUtility()?.getBoundingClientRect()?.bottom || 0;
  return utilityBottom + 8;
}

function syncNoteDetailScrollOffset() {
  document.documentElement.style.setProperty(
    "--note-detail-scroll-offset",
    `${String(noteDetailScrollOffset())}px`,
  );
}

let noteDetailScrollOffsetBound = false;

function bindNoteDetailScrollOffsetSync() {
  if (noteDetailScrollOffsetBound) {
    syncNoteDetailScrollOffset();
    return;
  }

  noteDetailScrollOffsetBound = true;
  syncNoteDetailScrollOffset();
  window.addEventListener("resize", syncNoteDetailScrollOffset);
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
<span class="note-detail__nav-label">Previous</span>
<span class="note-detail__nav-title">${window.NoteDetailRenderer.escapeHtml(previousNote.title)}</span>
</a>`
    : '<div class="note-detail__nav note-detail__nav--previous note-detail__nav--disabled"><span class="note-detail__nav-label">Previous</span><span class="note-detail__nav-title">None</span></div>';
  const nextMarkup = nextNote
    ? `<a class="note-detail__nav note-detail__nav--next" href="${window.ArchiveRoutes.buildNoteDetailPath(nextNote.id)}" data-note-nav="${String(nextNote.id)}">
<span class="note-detail__nav-label">Next</span>
<span class="note-detail__nav-title">${window.NoteDetailRenderer.escapeHtml(nextNote.title)}</span>
</a>`
    : '<div class="note-detail__nav note-detail__nav--next note-detail__nav--disabled"><span class="note-detail__nav-label">Next</span><span class="note-detail__nav-title">None</span></div>';

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
        `<button type="button" data-note-outline-target="${window.NoteDetailRenderer.escapeHtml(item.id)}" data-note-outline-level="${String(item.level)}">${window.NoteDetailRenderer.escapeHtml(item.text)}</button>`,
    )
    .join("");

  detailOutline()
    .querySelectorAll("[data-note-outline-target]")
    .forEach((button) => {
      button.addEventListener("click", () => {
        const target = document.getElementById(button.dataset.noteOutlineTarget);

        if (!target) {
          return;
        }

        syncNoteDetailScrollOffset();
        target.setAttribute("tabindex", "-1");
        target.scrollIntoView({
          behavior: prefersReducedMotion() ? "auto" : "smooth",
          block: "start",
        });
        window.setTimeout(() => {
          target.focus({ preventScroll: true });
        }, prefersReducedMotion() ? 0 : 180);
      });
    });
}

function updateBreadcrumbs(path) {
  const segments = path.split("/");
  const category = segments[1] || "Notes";
  const collection = segments[2] || "Notes";
  const categoryHref = window.ArchiveRoutes.buildCategoryPath(category);
  const collectionHref = window.ArchiveRoutes.buildCollectionPath(category, collection);

  detailBreadcrumbs().innerHTML = `
<a href="${categoryHref}" data-note-breadcrumb="category" data-category="${window.NoteDetailRenderer.escapeHtml(category)}">${window.NoteDetailRenderer.escapeHtml(category)}</a>
${renderIcon(ICONS.navigation.breadcrumb)}
<a href="${collectionHref}" data-note-breadcrumb="collection" data-category="${window.NoteDetailRenderer.escapeHtml(category)}" data-collection="${window.NoteDetailRenderer.escapeHtml(collection)}">${window.NoteDetailRenderer.escapeHtml(collection)}</a>`;
}

function bindBreadcrumbs(onNavigate) {
  detailBreadcrumbs()
    .querySelectorAll("[data-note-breadcrumb]")
    .forEach((link) => {
      link.addEventListener("click", (event) => {
        if (typeof onNavigate !== "function") {
          return;
        }

        event.preventDefault();
        onNavigate({
          type: link.dataset.noteBreadcrumb,
          category: link.dataset.category || null,
          collection: link.dataset.collection || null,
        });
      });
    });
}

function bindCopyAction(getText) {
  detailActionButtons().forEach((button) => {
    if (button.dataset.noteAction !== "copy") {
      return;
    }

    const icon = button.querySelector(".material-symbols-outlined");

    function resetCopyState() {
      button.dataset.copyState = "idle";

      if (icon) {
        icon.textContent = "content_copy";
      }
    }

    button.addEventListener("mouseleave", () => {
      if (button.dataset.copyState === "copied") {
        resetCopyState();
      }
    });

    button.addEventListener("blur", () => {
      if (button.dataset.copyState === "copied") {
        resetCopyState();
      }
    });

    button.onclick = async () => {
      const text = typeof getText === "function" ? getText() : "";

      if (!text) {
        return;
      }

      const originalLabel = button.getAttribute("aria-label") || "Copy note body";

      try {
        await writeClipboardText(text);
        button.setAttribute("aria-label", "Copied note body");

        if (icon) {
          icon.textContent = "check";
        }

        button.dataset.copyState = "copied";
      } catch {
        button.setAttribute("aria-label", "Copy note body failed");
        resetCopyState();
      }

      window.setTimeout(() => {
        button.setAttribute("aria-label", originalLabel);
      }, 1500);
    };
  });
}

window.IndexNoteDetail = {
  renderListFooterPanel,
  renderDetailFooterPanel,
  renderOutline,
  setArchiveMode,
  updateBreadcrumbs,
  bindBreadcrumbs,
  bindCopyAction,
  bindNoteDetailScrollOffsetSync,
  elements: {
    detailTitle,
    detailSummary,
    detailPublished,
    detailTags,
    detailReferences,
    detailContent,
  },
};
