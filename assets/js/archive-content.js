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
const archiveState = {
  notes: [],
  page: 1,
  pageSize: DEFAULT_PAGE_SIZE,
  category: null,
  collection: null,
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

function archivePageLabel() {
  return document.getElementById("archive-page-label");
}

function archivePrevButton() {
  return document.getElementById("archive-prev-button");
}

function archiveNextButton() {
  return document.getElementById("archive-next-button");
}

function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function titleFromPath(path) {
  return path.split("/").pop().replace(/\.md$/, "");
}

function slugToTitleCase(value) {
  return value
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function parseFrontmatter(markdown) {
  if (!markdown.startsWith("---\n")) {
    return { attributes: {}, body: markdown };
  }

  const endIndex = markdown.indexOf("\n---\n", 4);

  if (endIndex === -1) {
    return { attributes: {}, body: markdown };
  }

  const rawFrontmatter = markdown.slice(4, endIndex).split("\n");
  const body = markdown.slice(endIndex + 5);
  const attributes = {};
  let currentKey = null;

  rawFrontmatter.forEach((line) => {
    if (line.startsWith("  - ") && currentKey) {
      if (!Array.isArray(attributes[currentKey])) {
        attributes[currentKey] = [];
      }

      attributes[currentKey].push(line.replace("  - ", "").trim());
      return;
    }

    const separatorIndex = line.indexOf(":");

    if (separatorIndex === -1) {
      return;
    }

    const key = line.slice(0, separatorIndex).trim();
    const value = line.slice(separatorIndex + 1).trim();

    currentKey = key;

    if (!value) {
      attributes[key] = [];
      return;
    }

    attributes[key] = value.replace(/^"(.*)"$/, "$1");
  });

  return { attributes, body };
}

function isNoiseLine(line, title) {
  const normalized = line.replace(/^-\s*/, "").trim();

  if (!normalized) {
    return true;
  }

  if (normalized === title) {
    return true;
  }

  if (normalized.startsWith("http://") || normalized.startsWith("https://")) {
    return true;
  }

  if (normalized.startsWith("[") && normalized.includes("](http")) {
    return true;
  }

  return false;
}

function extractSummary(markdown, fallbackTitle) {
  const lines = markdown
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  for (const line of lines) {
    if (line.startsWith("## ")) {
      return line.replace(/^##\s+/, "").trim();
    }
  }

  for (const line of lines) {
    if (!isNoiseLine(line, fallbackTitle)) {
      return line.replace(/^-\s*/, "").trim();
    }
  }

  return `Study note in Technology / JAVA for ${fallbackTitle}.`;
}

function noteCardMarkup(note) {
  return `
<article class="note-card" data-note-path="${escapeHtml(note.path)}">
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

function renderArchivePage() {
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
      const response = await fetch(path);
      const markdown = response.ok ? await response.text() : "";
      const fallbackTitle = titleFromPath(path);
      const { attributes, body } = parseFrontmatter(markdown);
      const title = attributes.title || fallbackTitle;
      const summary = attributes.summary || extractSummary(body, title);
      const tags =
        Array.isArray(attributes.tags) && attributes.tags.length > 0
          ? attributes.tags.map(slugToTitleCase)
          : ["Technology", "JAVA"];

      return {
        path,
        title,
        summary,
        category: "Technology",
        collection: "JAVA",
        tags,
      };
    }),
  );

  return notes;
}

function renderJavaLoadingState() {
  archiveTitle().textContent = "JAVA";
  archiveSummary().textContent =
    "Loading real notes from CATEGORIES/Technology/JAVA for the archive view.";
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

  archiveTitle().textContent = "JAVA";
  archiveSummary().textContent = `${notes.length} notes from Technology / JAVA. Showing ${Math.min(notes.length, archiveState.pageSize)} notes per page.`;
  renderArchivePage();
}

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

window.addEventListener("archive:navigate", (event) => {
  const { category, collection } = event.detail;

  if (category === "Technology" && collection === "JAVA") {
    renderJavaCollection();
  }
});
