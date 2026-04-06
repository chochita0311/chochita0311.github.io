function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function slugToTitleCase(value) {
  return value
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function titleFromPath(path) {
  return path.split("/").pop().replace(/\.md$/, "");
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

  return `Study note for ${fallbackTitle}.`;
}

function extractReferences(markdown) {
  const matches = markdown.match(/https?:\/\/[^\s)]+/g);

  if (!matches) {
    return [];
  }

  return [...new Set(matches)];
}

function shortenReference(url) {
  try {
    const parsed = new URL(url);
    const host = parsed.hostname.replace(/^www\./, "");
    const path = parsed.pathname.replace(/\/+$/, "");

    if (!path || path === "/") {
      return host;
    }

    const segments = path.split("/").filter(Boolean);
    const tail = segments.slice(0, 2).join("/");

    return `${host}/${tail}`;
  } catch {
    return url;
  }
}

function slugifyHeading(value) {
  return value
    .toLowerCase()
    .replaceAll(/[`"'.,/()]/g, "")
    .replaceAll(/[^a-z0-9\s-]/g, "")
    .trim()
    .replaceAll(/\s+/g, "-");
}

function applyInlineMarkdown(value) {
  let output = escapeHtml(value);

  output = output.replace(
    /`([^`]+)`/g,
    '<code class="note-detail__inline-code">$1</code>',
  );
  output = output.replace(
    /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g,
    '<a href="$2" target="_blank" rel="noreferrer">$1</a>',
  );
  output = output.replace(
    /(https?:\/\/[^\s<]+)/g,
    '<a href="$1" target="_blank" rel="noreferrer">$1</a>',
  );

  return output;
}

function renderCodeBlock(lines) {
  return `<pre class="note-detail__code"><code>${escapeHtml(lines.join("\n"))}</code></pre>`;
}

function renderList(items, ordered) {
  const tag = ordered ? "ol" : "ul";
  const orderedClass = ordered ? " note-detail__list--ordered" : "";

  return `<${tag} class="note-detail__list${orderedClass}">${items
    .map((item) => `<li>${applyInlineMarkdown(item)}</li>`)
    .join("")}</${tag}>`;
}

function renderParagraph(lines) {
  return `<p>${applyInlineMarkdown(lines.join(" "))}</p>`;
}

function renderMarkdown(markdown) {
  const lines = markdown.replaceAll("\r\n", "\n").split("\n");
  const sections = [];
  const outline = [];
  let paragraphLines = [];
  let listItems = [];
  let orderedItems = [];
  let codeLines = [];
  let inCodeBlock = false;
  let currentSectionParts = [];

  function pushBlock(html) {
    currentSectionParts.push(html);
  }

  function flushSection() {
    if (currentSectionParts.length === 0) {
      return;
    }

    sections.push(
      `<section class="note-detail__section">${currentSectionParts.join("")}</section>`,
    );
    currentSectionParts = [];
  }

  function flushParagraph() {
    if (paragraphLines.length === 0) {
      return;
    }

    pushBlock(renderParagraph(paragraphLines));
    paragraphLines = [];
  }

  function flushLists() {
    if (listItems.length > 0) {
      pushBlock(renderList(listItems, false));
      listItems = [];
    }

    if (orderedItems.length > 0) {
      pushBlock(renderList(orderedItems, true));
      orderedItems = [];
    }
  }

  lines.forEach((line) => {
    if (line.startsWith("```")) {
      flushParagraph();
      flushLists();

      if (inCodeBlock) {
        pushBlock(renderCodeBlock(codeLines));
        codeLines = [];
        inCodeBlock = false;
      } else {
        inCodeBlock = true;
      }

      return;
    }

    if (inCodeBlock) {
      codeLines.push(line);
      return;
    }

    if (!line.trim()) {
      flushParagraph();
      flushLists();
      return;
    }

    const headingMatch = line.match(/^(#{2,3})\s+(.+)$/);

    if (headingMatch) {
      flushParagraph();
      flushLists();
      flushSection();

      const level = headingMatch[1].length;
      const text = headingMatch[2].trim();
      const id = slugifyHeading(text);

      outline.push({ id, text, level });
      pushBlock(`<h${level} id="${id}">${applyInlineMarkdown(text)}</h${level}>`);
      return;
    }

    if (line.trim() === "---") {
      return;
    }

    if (line.startsWith("> ")) {
      flushParagraph();
      flushLists();
      pushBlock(
        `<blockquote class="note-detail__lead-quote"><p>${applyInlineMarkdown(
          line.replace(/^>\s+/, ""),
        )}</p></blockquote>`,
      );
      return;
    }

    if (line.match(/^\d+\.\s+/)) {
      flushParagraph();
      orderedItems.push(line.replace(/^\d+\.\s+/, ""));
      return;
    }

    if (line.startsWith("- ")) {
      flushParagraph();
      listItems.push(line.replace(/^-+\s+/, ""));
      return;
    }

    if (line.startsWith("# ")) {
      return;
    }

    paragraphLines.push(line.trim());
  });

  flushParagraph();
  flushLists();
  flushSection();

  return {
    html:
      sections.length > 0
        ? sections.join("")
        : '<p class="note-detail__empty">This note does not contain readable markdown content yet.</p>',
    outline,
  };
}

async function loadNoteData(notePath, fetchPrefix = "") {
  const response = await fetch(`${fetchPrefix}${notePath}`);

  if (!response.ok) {
    throw new Error(`Unable to load note: ${notePath}`);
  }

  const markdown = await response.text();
  const fallbackTitle = titleFromPath(notePath);
  const { attributes, body } = parseFrontmatter(markdown);

  return {
    path: notePath,
    attributes,
    body,
    title: attributes.title || fallbackTitle,
    summary: attributes.summary || extractSummary(body, fallbackTitle),
    tags:
      Array.isArray(attributes.tags) && attributes.tags.length > 0
        ? attributes.tags.map(slugToTitleCase)
        : [],
    references: extractReferences(body),
    rendered: renderMarkdown(body),
  };
}

window.NoteDetailRenderer = {
  escapeHtml,
  loadNoteData,
  shortenReference,
};
