import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import path from "node:path";

const ROOT_DIR = process.cwd();
const CATEGORIES_DIR = path.join(ROOT_DIR, "CATEGORIES");
const OUTPUT_PATH = path.join(ROOT_DIR, "assets", "generated", "archives-index.json");

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
      id:
        attributes.id ||
        `${category}-${collection}-${fallbackTitle}`.toLowerCase().replaceAll(/\s+/g, "-"),
      title: attributes.title || fallbackTitle,
      summary: attributes.summary || extractSummary(body, fallbackTitle),
      tags: Array.isArray(attributes.tags) ? attributes.tags : [],
      created: attributes.created || attributes.published || attributes.date || "",
      updated: attributes.updated || "",
      category,
      collection,
      path: relativePath,
    });
  }

  return sortNotes(notes);
}

async function main() {
  const notesIndex = await buildNotesIndex();

  await mkdir(path.dirname(OUTPUT_PATH), { recursive: true });
  await writeFile(OUTPUT_PATH, `${JSON.stringify(notesIndex, null, 2)}\n`, "utf8");

  console.log(
    `Generated ${notesIndex.length} notes in ${toPosixPath(path.relative(ROOT_DIR, OUTPUT_PATH))}`,
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
