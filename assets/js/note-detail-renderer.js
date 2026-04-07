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
    if (line.match(/^#{2,6}\s+/)) {
      return line.replace(/^#{2,6}\s+/, "").trim();
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
    .replaceAll(/[^\p{Letter}\p{Number}\s-]/gu, "")
    .trim()
    .replaceAll(/\s+/g, "-");
}

function applyInlineMarkdown(value) {
  let output = escapeHtml(value);

  output = output.replace(/\*\*\*([^*]+)\*\*\*/g, "<strong><em>$1</em></strong>");
  output = output.replace(/___([^_]+)___/g, "<strong><em>$1</em></strong>");
  output = output.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  output = output.replace(/__([^_]+)__/g, "<strong>$1</strong>");
  output = output.replace(/\*([^*\n]+)\*/g, "<em>$1</em>");
  output = output.replace(/_([^_]+)_/g, "<em>$1</em>");
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
  return `<p>${lines
    .map((line) => applyInlineMarkdown(line.trimEnd()))
    .join("<br>\n")}</p>`;
}

function parseTableCells(line) {
  return line
    .trim()
    .replace(/^\|/, "")
    .replace(/\|$/, "")
    .split("|")
    .map((cell) => cell.trim());
}

function isTableSeparatorLine(line) {
  return /^\|?(?:\s*:?-{3,}:?\s*\|)+\s*:?-{3,}:?\s*\|?$/.test(line.trim());
}

function isTableRowLine(line) {
  const trimmed = line.trim();

  return trimmed.includes("|") && trimmed.startsWith("|") && trimmed.endsWith("|");
}

function renderTable(tableLines) {
  if (tableLines.length < 2 || !isTableSeparatorLine(tableLines[1])) {
    return renderParagraph(tableLines);
  }

  const headers = parseTableCells(tableLines[0]);
  const bodyRows = tableLines.slice(2).map(parseTableCells);

  return `<div class="note-detail__table-wrap"><table class="note-detail__table"><thead><tr>${headers
    .map((header) => `<th>${applyInlineMarkdown(header)}</th>`)
    .join("")}</tr></thead><tbody>${bodyRows
    .map(
      (cells) =>
        `<tr>${cells
          .map((cell) => `<td>${applyInlineMarkdown(cell)}</td>`)
          .join("")}</tr>`,
    )
    .join("")}</tbody></table></div>`;
}

function renderHeading(text, level) {
  const id = slugifyHeading(text);

  return {
    html: `<h${level} id="${id}">${applyInlineMarkdown(text)}</h${level}>`,
    outlineItem: { id, text, level },
  };
}

function parseSetextHeading(lines, index) {
  if (index >= lines.length - 1) {
    return null;
  }

  const textLine = lines[index].replaceAll("\u200b", "");
  const markerLine = lines[index + 1].replaceAll("\u200b", "");

  if (!textLine.trim() || textLine.trim().startsWith("#")) {
    return null;
  }

  if (/^=+\s*$/.test(markerLine.trim())) {
    return {
      level: 1,
      text: textLine.trim(),
      consumedLines: 2,
    };
  }

  if (/^-+\s*$/.test(markerLine.trim())) {
    return {
      level: 2,
      text: textLine.trim(),
      consumedLines: 2,
    };
  }

  return null;
}

function renderMarkdown(markdown, options = {}) {
  const lines = markdown.replaceAll("\r\n", "\n").split("\n");
  const sections = [];
  const outline = [];
  let paragraphLines = [];
  let listItems = [];
  let orderedItems = [];
  let tableLines = [];
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

  function flushTable() {
    if (tableLines.length === 0) {
      return;
    }

    pushBlock(renderTable(tableLines));
    tableLines = [];
  }

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];
    const normalizedLine = line.replaceAll("\u200b", "");

    if (normalizedLine.startsWith("```")) {
      flushParagraph();
      flushLists();
      flushTable();

      if (inCodeBlock) {
        pushBlock(renderCodeBlock(codeLines));
        codeLines = [];
        inCodeBlock = false;
      } else {
        inCodeBlock = true;
      }

      continue;
    }

    if (inCodeBlock) {
      codeLines.push(normalizedLine);
      continue;
    }

    const setextHeading = parseSetextHeading(lines, index);

    if (setextHeading) {
      flushParagraph();
      flushLists();
      flushTable();
      flushSection();

      const renderedHeading = renderHeading(
        setextHeading.text,
        setextHeading.level,
      );

      if (
        setextHeading.level === 1 &&
        options.primaryTitle &&
        setextHeading.text === options.primaryTitle
      ) {
        index += setextHeading.consumedLines - 1;
        continue;
      }

      if (setextHeading.level >= 2) {
        outline.push(renderedHeading.outlineItem);
      }

      pushBlock(renderedHeading.html);
      index += setextHeading.consumedLines - 1;
      continue;
    }

    if (!normalizedLine.trim()) {
      flushParagraph();
      flushLists();
      flushTable();
      continue;
    }

    if (isTableRowLine(normalizedLine) || (tableLines.length > 0 && isTableSeparatorLine(normalizedLine))) {
      flushParagraph();
      flushLists();
      tableLines.push(normalizedLine);
      continue;
    }

    flushTable();

    const headingMatch = normalizedLine.match(/^(#{2,6})\s+(.+)$/);

    if (headingMatch) {
      flushParagraph();
      flushLists();
      flushTable();
      flushSection();

      const level = headingMatch[1].length;
      const text = headingMatch[2].trim();

      if (level === 1 && options.primaryTitle && text === options.primaryTitle) {
        continue;
      }

      const renderedHeading = renderHeading(text, level);

      if (level >= 2 && level <= 4) {
        outline.push(renderedHeading.outlineItem);
      }
      pushBlock(renderedHeading.html);
      continue;
    }

    const numberedBoldHeadingMatch = normalizedLine.match(
      /^(?:[0-9]+(?:\)|️⃣)?\s*)?\*\*(.+?)\*\*$/u,
    );

    if (numberedBoldHeadingMatch && !numberedBoldHeadingMatch[1].trim().startsWith("-")) {
      flushParagraph();
      flushLists();
      flushTable();
      flushSection();

      const text = numberedBoldHeadingMatch[1].trim();
      const renderedHeading = renderHeading(text, 2);

      outline.push(renderedHeading.outlineItem);
      pushBlock(renderedHeading.html);
      continue;
    }

    const boldQuestionMatch = normalizedLine.match(/^\*\*-\s*(.+?)\*\*$/u);

    if (boldQuestionMatch) {
      flushParagraph();
      flushLists();
      flushTable();
      const text = boldQuestionMatch[1].trim();
      const renderedHeading = renderHeading(text, 3);

      outline.push(renderedHeading.outlineItem);
      pushBlock(renderedHeading.html);
      continue;
    }

    const vocabHeadingMatch = normalizedLine.match(/^▪️\s*(.+)$/u);

    if (vocabHeadingMatch) {
      flushParagraph();
      flushLists();
      flushTable();
      const text = vocabHeadingMatch[1].trim();
      const renderedHeading = renderHeading(text, 3);

      outline.push(renderedHeading.outlineItem);
      pushBlock(renderedHeading.html);
      continue;
    }

    if (normalizedLine.startsWith(":")) {
      flushParagraph();
      flushLists();
      flushTable();
      pushBlock(renderParagraph([normalizedLine.replace(/^:\s*/, "").trim()]));
      continue;
    }

    if (normalizedLine.startsWith("💡")) {
      flushParagraph();
      flushLists();
      flushTable();
      pushBlock(
        `<aside class="note-detail__callout"><p>${applyInlineMarkdown(normalizedLine.trim())}</p></aside>`,
      );
      continue;
    }

    if (normalizedLine.trim() === "---") {
      continue;
    }

    if (normalizedLine.startsWith("> ")) {
      flushParagraph();
      flushLists();
      flushTable();
      pushBlock(
        `<blockquote class="note-detail__lead-quote"><p>${applyInlineMarkdown(
          normalizedLine.replace(/^>\s+/, ""),
        )}</p></blockquote>`,
      );
      continue;
    }

    if (normalizedLine.match(/^\d+\.\s+/)) {
      flushParagraph();
      orderedItems.push(normalizedLine.replace(/^\d+\.\s+/, ""));
      continue;
    }

    if (normalizedLine.match(/^[-+]\s*/)) {
      flushParagraph();
      listItems.push(normalizedLine.replace(/^[-+]\s*/, ""));
      continue;
    }

    if (normalizedLine.startsWith("# ")) {
      continue;
    }

    paragraphLines.push(normalizedLine);
  }

  flushParagraph();
  flushLists();
  flushTable();
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
  const title = attributes.title || fallbackTitle;

  return {
    path: notePath,
    attributes,
    body,
    title,
    summary: attributes.summary || extractSummary(body, fallbackTitle),
    tags:
      Array.isArray(attributes.tags) && attributes.tags.length > 0
        ? attributes.tags.map(slugToTitleCase)
        : [],
    references: extractReferences(body),
    rendered: renderMarkdown(body, { primaryTitle: title }),
  };
}

window.NoteDetailRenderer = {
  escapeHtml,
  loadNoteData,
  shortenReference,
};
