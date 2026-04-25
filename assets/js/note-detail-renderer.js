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
  const linkPlaceholders = [];

  function renderExternalLink(url, label = url) {
    return `<a href="${url}" target="_blank" rel="noreferrer">${label}</a>`;
  }

  function stashLink(html) {
    const placeholder = `__NOTE_DETAIL_LINK_${linkPlaceholders.length}__`;
    linkPlaceholders.push({ placeholder, html });
    return placeholder;
  }

  output = output.replace(/\*\*\*([^*]+)\*\*\*/g, "<strong><em>$1</em></strong>");
  output = output.replace(/___([^_]+)___/g, "<strong><em>$1</em></strong>");
  output = output.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  output = output.replace(/__([^_]+)__/g, "<strong>$1</strong>");
  output = output.replace(/\*([^*\n]+)\*/g, "<em>$1</em>");
  output = output.replace(/_([^_]+)_/g, "<em>$1</em>");
  output = output.replace(/`([^`]+)`/g, '<code class="note-detail__inline-code">$1</code>');
  output = output.replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, (_, label, url) =>
    stashLink(renderExternalLink(url, label)),
  );
  output = output.replace(/(https?:\/\/[^\s<]+)/g, (url) => {
    const trailingPunctuation = url.match(/[.,;:!?]+$/)?.[0] || "";
    const cleanUrl = trailingPunctuation ? url.slice(0, -trailingPunctuation.length) : url;

    return `${renderExternalLink(cleanUrl)}${trailingPunctuation}`;
  });

  return linkPlaceholders.reduce(
    (currentOutput, link) => currentOutput.replaceAll(link.placeholder, link.html),
    output,
  );
}

function normalizeCodeFenceLabel(rawLabel) {
  if (!rawLabel) {
    return "";
  }

  return rawLabel.trim().toLowerCase();
}

function getCodeBlockPresentation(label) {
  const normalized = normalizeCodeFenceLabel(label);

  if (["bash", "sh", "zsh", "shell", "console", "terminal"].includes(normalized)) {
    return {
      label: "Terminal",
      variantClass: " note-detail__code-block--terminal",
    };
  }

  if (!normalized) {
    return {
      label: "Code",
      variantClass: "",
    };
  }

  return {
    label: normalized === "md" ? "Markdown" : normalized.toUpperCase(),
    variantClass: "",
  };
}

function wrapCodeToken(className, value) {
  return `<span class="${className}">${value}</span>`;
}

function applyTokenPlaceholders(value, matchers) {
  const placeholders = [];
  let output = value;

  matchers.forEach(({ pattern, className }) => {
    output = output.replace(pattern, (match) => {
      const placeholder = `__CODE_TOKEN_${placeholders.length}__`;
      placeholders.push({
        placeholder,
        html: wrapCodeToken(className, match),
      });
      return placeholder;
    });
  });

  return { output, placeholders };
}

function restoreTokenPlaceholders(value, placeholders) {
  return placeholders.reduce(
    (output, token) => output.replaceAll(token.placeholder, token.html),
    value,
  );
}

function highlightJavaCode(escapedCode) {
  const { output, placeholders } = applyTokenPlaceholders(escapedCode, [
    {
      pattern: /\/\*[\s\S]*?\*\//g,
      className: "note-detail__code-comment",
    },
    {
      pattern: /\/\/.*$/gm,
      className: "note-detail__code-comment",
    },
    {
      pattern: /&quot;(?:\\.|[^&])*?&quot;/g,
      className: "note-detail__code-string",
    },
    {
      pattern: /&#39;(?:\\.|[^&])*?&#39;/g,
      className: "note-detail__code-string",
    },
  ]);

  let highlighted = output;

  highlighted = highlighted.replace(
    /\b(package|import|class|interface|enum|record|public|protected|private|static|final|abstract|extends|implements|new|return|void|if|else|switch|case|default|for|while|do|try|catch|finally|throw|throws|this|super|instanceof|break|continue|null|true|false)\b/g,
    '<span class="note-detail__code-keyword">$1</span>',
  );
  highlighted = highlighted.replace(
    /\b(\d[\d_]*(?:\.\d+)?)\b/g,
    '<span class="note-detail__code-number">$1</span>',
  );
  highlighted = highlighted.replace(
    /(@[A-Za-z_]\w*)/g,
    '<span class="note-detail__code-annotation">$1</span>',
  );

  return restoreTokenPlaceholders(highlighted, placeholders);
}

function highlightBashCode(escapedCode) {
  const { output, placeholders } = applyTokenPlaceholders(escapedCode, [
    {
      pattern: /#.*$/gm,
      className: "note-detail__code-comment",
    },
    {
      pattern: /&quot;(?:\\.|[^&])*?&quot;/g,
      className: "note-detail__code-string",
    },
    {
      pattern: /&#39;(?:\\.|[^&])*?&#39;/g,
      className: "note-detail__code-string",
    },
  ]);

  let highlighted = output;

  highlighted = highlighted.replace(
    /\b(if|then|else|fi|for|in|do|done|case|esac|while|function|export|local|unset|return|source)\b/g,
    '<span class="note-detail__code-keyword">$1</span>',
  );
  highlighted = highlighted.replace(
    /(^|\s)(--?[a-zA-Z0-9-]+)/gm,
    '$1<span class="note-detail__code-attr">$2</span>',
  );
  highlighted = highlighted.replace(
    /(\$\w+|\$\{[^}]+\})/g,
    '<span class="note-detail__code-variable">$1</span>',
  );

  return restoreTokenPlaceholders(highlighted, placeholders);
}

function highlightJsonCode(escapedCode) {
  let highlighted = escapedCode.replace(
    /(&quot;(?:\\.|[^&])*?&quot;)(\s*:)/g,
    '<span class="note-detail__code-attr">$1</span>$2',
  );

  highlighted = highlighted.replace(
    /(:\s*)(&quot;(?:\\.|[^&])*?&quot;)/g,
    '$1<span class="note-detail__code-string">$2</span>',
  );
  highlighted = highlighted.replace(
    /\b(-?\d[\d_]*(?:\.\d+)?)\b/g,
    '<span class="note-detail__code-number">$1</span>',
  );
  highlighted = highlighted.replace(
    /\b(true|false|null)\b/g,
    '<span class="note-detail__code-keyword">$1</span>',
  );

  return highlighted;
}

function highlightYamlCode(escapedCode) {
  const { output, placeholders } = applyTokenPlaceholders(escapedCode, [
    {
      pattern: /#.*$/gm,
      className: "note-detail__code-comment",
    },
    {
      pattern: /&quot;(?:\\.|[^&])*?&quot;/g,
      className: "note-detail__code-string",
    },
    {
      pattern: /&#39;(?:\\.|[^&])*?&#39;/g,
      className: "note-detail__code-string",
    },
  ]);

  let highlighted = output;

  highlighted = highlighted.replace(
    /^(\s*[\w.-]+)(\s*:)/gm,
    '<span class="note-detail__code-attr">$1</span>$2',
  );
  highlighted = highlighted.replace(
    /\b(true|false|null|yes|no|on|off)\b/g,
    '<span class="note-detail__code-keyword">$1</span>',
  );
  highlighted = highlighted.replace(
    /\b(-?\d[\d_]*(?:\.\d+)?)\b/g,
    '<span class="note-detail__code-number">$1</span>',
  );

  return restoreTokenPlaceholders(highlighted, placeholders);
}

function highlightSqlCode(escapedCode) {
  const { output, placeholders } = applyTokenPlaceholders(escapedCode, [
    {
      pattern: /--.*$/gm,
      className: "note-detail__code-comment",
    },
    {
      pattern: /\/\*[\s\S]*?\*\//g,
      className: "note-detail__code-comment",
    },
    {
      pattern: /&#39;(?:\\.|[^&])*?&#39;/g,
      className: "note-detail__code-string",
    },
  ]);

  let highlighted = output;

  highlighted = highlighted.replace(
    /\b(SELECT|FROM|WHERE|GROUP|BY|ORDER|HAVING|LIMIT|INSERT|INTO|VALUES|UPDATE|SET|DELETE|JOIN|LEFT|RIGHT|INNER|OUTER|ON|AS|AND|OR|NOT|NULL|IS|IN|LIKE|EXISTS|DISTINCT|CREATE|ALTER|DROP|TABLE|INDEX|VIEW|UNION|ALL)\b/gi,
    '<span class="note-detail__code-keyword">$1</span>',
  );
  highlighted = highlighted.replace(
    /\b(\d[\d_]*(?:\.\d+)?)\b/g,
    '<span class="note-detail__code-number">$1</span>',
  );

  return restoreTokenPlaceholders(highlighted, placeholders);
}

function highlightDiffCode(escapedCode) {
  return escapedCode
    .replace(/^(\+.*)$/gm, '<span class="note-detail__code-diff-add">$1</span>')
    .replace(/^(-.*)$/gm, '<span class="note-detail__code-diff-remove">$1</span>')
    .replace(/^(@@.*)$/gm, '<span class="note-detail__code-diff-meta">$1</span>');
}

function highlightCode(escapedCode, label) {
  const normalized = normalizeCodeFenceLabel(label);

  if (["bash", "sh", "zsh", "shell", "console", "terminal"].includes(normalized)) {
    return highlightBashCode(escapedCode);
  }

  if (normalized === "java") {
    return highlightJavaCode(escapedCode);
  }

  if (normalized === "json") {
    return highlightJsonCode(escapedCode);
  }

  if (["yml", "yaml"].includes(normalized)) {
    return highlightYamlCode(escapedCode);
  }

  if (normalized === "sql") {
    return highlightSqlCode(escapedCode);
  }

  if (normalized === "diff") {
    return highlightDiffCode(escapedCode);
  }

  return escapedCode;
}

function renderCodeBlock(lines, label = "") {
  const presentation = getCodeBlockPresentation(label);
  const escapedLabel = escapeHtml(presentation.label);
  const escapedCode = escapeHtml(lines.join("\n"));
  const highlightedCode = highlightCode(escapedCode, label);

  return `
    <figure class="note-detail__code-block${presentation.variantClass}">
      <figcaption class="note-detail__code-header">
        <span class="note-detail__code-dots" aria-hidden="true">
          <span></span><span></span><span></span>
        </span>
        <span class="note-detail__code-label">${escapedLabel}</span>
      </figcaption>
      <pre class="note-detail__code"><code>${highlightedCode}</code></pre>
    </figure>
  `;
}

function renderList(items, ordered) {
  const tag = ordered ? "ol" : "ul";
  const orderedClass = ordered ? " note-detail__list--ordered" : "";

  return `<${tag} class="note-detail__list${orderedClass}">${items
    .map((item) => `<li>${applyInlineMarkdown(item)}</li>`)
    .join("")}</${tag}>`;
}

function renderParagraph(lines) {
  return `<p>${lines.map((line) => applyInlineMarkdown(line.trimEnd())).join("<br>\n")}</p>`;
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
        `<tr>${cells.map((cell) => `<td>${applyInlineMarkdown(cell)}</td>`).join("")}</tr>`,
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
  let codeFenceLabel = "";
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
        pushBlock(renderCodeBlock(codeLines, codeFenceLabel));
        codeLines = [];
        inCodeBlock = false;
        codeFenceLabel = "";
      } else {
        inCodeBlock = true;
        codeFenceLabel = normalizedLine.slice(3).trim();
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

      const renderedHeading = renderHeading(setextHeading.text, setextHeading.level);

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

    if (
      isTableRowLine(normalizedLine) ||
      (tableLines.length > 0 && isTableSeparatorLine(normalizedLine))
    ) {
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

function normalizeNotePath(notePath) {
  return String(notePath || "").replace(/^CATEGORIES\//, "NOTES/");
}

async function loadNoteData(notePath, fetchPrefix = "") {
  const normalizedNotePath = normalizeNotePath(notePath);
  const resolvedPath = /^(?:[a-z]+:)?\//i.test(normalizedNotePath)
    ? normalizedNotePath
    : `${fetchPrefix || window.ArchiveRoutes?.siteRoot?.() || ""}${normalizedNotePath}`;
  const response = await fetch(resolvedPath);

  if (!response.ok) {
    throw new Error(`Unable to load note: ${normalizedNotePath}`);
  }

  const markdown = await response.text();
  const fallbackTitle = titleFromPath(normalizedNotePath);
  const { attributes, body } = parseFrontmatter(markdown);
  const title = attributes.title || fallbackTitle;

  return {
    path: normalizedNotePath,
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
  normalizeNotePath,
  shortenReference,
};
