import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import path from "node:path";

const ROOT_DIR = process.cwd();
const CATEGORIES_DIR = path.join(ROOT_DIR, "CATEGORIES");
const OUTPUT_PATH = path.join(ROOT_DIR, "assets", "generated", "archives-index.json");
const SEARCH_INDEX_OUTPUT_PATH = path.join(
  ROOT_DIR,
  "assets",
  "generated",
  "archives-search-index.json",
);
const SEARCH_TOKEN_PATTERN = /[a-z0-9]+|[가-힣]+/g;
const ENGLISH_STOPWORDS = new Set([
  "a",
  "an",
  "and",
  "as",
  "at",
  "by",
  "for",
  "from",
  "in",
  "is",
  "of",
  "on",
  "or",
  "the",
  "this",
  "to",
  "with",
]);

function toPosixPath(value) {
  return value.split(path.sep).join("/");
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

function titleFromPath(notePath) {
  return path.basename(notePath, ".md");
}

function parseNumericId(value, filePath) {
  const normalized = String(value || "").trim();

  if (!/^\d+$/.test(normalized)) {
    throw new Error(`Note id must be a numeric integer in ${filePath}`);
  }

  return Number.parseInt(normalized, 10);
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

function stripMarkdown(markdown) {
  return markdown
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`[^`]*`/g, " ")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/^#{1,6}\s+/gm, " ")
    .replace(/^>\s?/gm, " ")
    .replace(/^[-*+]\s+/gm, " ")
    .replace(/^\d+\.\s+/gm, " ")
    .replace(/\|/g, " ")
    .replace(/[*_~]/g, " ")
    .replace(/<[^>]+>/g, " ");
}

function normalizeSearchText(value) {
  return String(value || "")
    .normalize("NFKC")
    .toLowerCase();
}

function tokenizeText(value) {
  const normalized = normalizeSearchText(value);
  const matches = normalized.match(SEARCH_TOKEN_PATTERN);

  return matches ? [...new Set(matches)] : [];
}

function isNumericOnlyToken(token) {
  return /^\d+$/.test(token);
}

function shouldKeepSearchToken(token, { fromTag = false } = {}) {
  if (!token) {
    return false;
  }

  if (isNumericOnlyToken(token)) {
    return false;
  }

  if (!fromTag && token.length <= 1) {
    return false;
  }

  if (ENGLISH_STOPWORDS.has(token)) {
    return false;
  }

  return true;
}

function buildSearchIndex(notes) {
  const terms = new Map();

  notes.forEach((note) => {
    const addTokens = (tokens, options = {}) => {
      tokens.forEach((token) => {
        if (!shouldKeepSearchToken(token, options)) {
          return;
        }

        if (!terms.has(token)) {
          terms.set(token, new Set());
        }

        terms.get(token).add(note.id);
      });
    };

    addTokens(tokenizeText(note.title));
    note.tags.forEach((tag) => addTokens(tokenizeText(tag), { fromTag: true }));
    addTokens(tokenizeText(stripMarkdown(note.body)));
  });

  return {
    version: 1,
    generatedAt: new Date().toISOString(),
    tokenizer: {
      normalization: "NFKC lowercase",
      pattern: SEARCH_TOKEN_PATTERN.source,
      partialMatch: false,
      filters: {
        excludeNumericOnly: true,
        excludeSingleCharacter: true,
        englishStopwords: [...ENGLISH_STOPWORDS].sort(),
        shortTagException: true,
      },
    },
    fields: ["title", "tags", "body"],
    terms: Object.fromEntries(
      [...terms.entries()]
        .sort(([left], [right]) => left.localeCompare(right))
        .map(([token, noteIds]) => [token, [...noteIds].sort((left, right) => left - right)]),
    ),
  };
}

async function collectMarkdownFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const filePaths = [];

  for (const entry of entries) {
    const entryPath = path.join(directory, entry.name);

    if (entry.isDirectory()) {
      filePaths.push(...(await collectMarkdownFiles(entryPath)));
      continue;
    }

    if (entry.isFile() && entry.name.endsWith(".md")) {
      filePaths.push(entryPath);
    }
  }

  return filePaths;
}

function compareDatesDesc(left, right) {
  return (right || "").localeCompare(left || "");
}

function sortNotes(notes) {
  return [...notes].sort((left, right) => {
    const categoryCompare = left.category.localeCompare(right.category);

    if (categoryCompare !== 0) {
      return categoryCompare;
    }

    const collectionCompare = left.collection.localeCompare(right.collection);

    if (collectionCompare !== 0) {
      return collectionCompare;
    }

    const updatedCompare = compareDatesDesc(left.updated, right.updated);

    if (updatedCompare !== 0) {
      return updatedCompare;
    }

    const createdCompare = compareDatesDesc(left.created, right.created);

    if (createdCompare !== 0) {
      return createdCompare;
    }

    return left.title.localeCompare(right.title);
  });
}

async function buildNotesIndex() {
  const markdownFiles = await collectMarkdownFiles(CATEGORIES_DIR);
  const notes = [];

  for (const filePath of markdownFiles) {
    const relativePath = toPosixPath(path.relative(ROOT_DIR, filePath));
    const pathSegments = relativePath.split("/");

    if (pathSegments.length < 4) {
      continue;
    }

    const [, category, collection] = pathSegments;
    const markdown = await readFile(filePath, "utf8");
    const fallbackTitle = titleFromPath(filePath);
    const { attributes, body } = parseFrontmatter(markdown);

    notes.push({
      id: parseNumericId(attributes.id, relativePath),
      title: attributes.title || fallbackTitle,
      summary: attributes.summary || extractSummary(body, fallbackTitle),
      tags: Array.isArray(attributes.tags) ? attributes.tags : [],
      created: attributes.created || attributes.published || attributes.date || "",
      updated: attributes.updated || "",
      category,
      collection,
      path: relativePath,
      body,
    });
  }

  return sortNotes(notes);
}

async function main() {
  const notesIndex = await buildNotesIndex();
  const searchIndex = buildSearchIndex(notesIndex);
  const runtimeNotesIndex = notesIndex.map(({ body: _body, ...note }) => note);

  await mkdir(path.dirname(OUTPUT_PATH), { recursive: true });
  await writeFile(OUTPUT_PATH, `${JSON.stringify(runtimeNotesIndex, null, 2)}\n`, "utf8");
  await writeFile(SEARCH_INDEX_OUTPUT_PATH, `${JSON.stringify(searchIndex, null, 2)}\n`, "utf8");

  console.log(
    `Generated ${notesIndex.length} notes in ${toPosixPath(path.relative(ROOT_DIR, OUTPUT_PATH))}`,
  );
  console.log(
    `Generated search index in ${toPosixPath(path.relative(ROOT_DIR, SEARCH_INDEX_OUTPUT_PATH))}`,
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
