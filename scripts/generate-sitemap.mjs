import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const ROOT_DIR = process.cwd();
const SITE_URL = "https://chochita0311.github.io/";
const ARCHIVE_INDEX_PATH = path.join(ROOT_DIR, "assets", "generated", "archives-index.json");
const OUTPUT_PATH = path.join(ROOT_DIR, "sitemap.xml");

function escapeXml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

function normalizeDate(value) {
  const normalized = String(value || "").trim();

  if (!normalized) {
    return null;
  }

  if (/^\d{4}-\d{2}-\d{2}$/.test(normalized)) {
    return normalized;
  }

  const parsed = new Date(normalized);

  if (Number.isNaN(parsed.getTime())) {
    return null;
  }

  return parsed.toISOString().slice(0, 10);
}

function latestArchiveDate(notes) {
  const dates = notes
    .map((note) => normalizeDate(note.updated || note.created || note.date))
    .filter(Boolean)
    .sort();

  return dates.at(-1) || null;
}

function encodeSegment(segment) {
  return encodeURIComponent(String(segment ?? "").trim());
}

function buildAbsoluteUrl(pathname) {
  return new URL(pathname, SITE_URL).toString();
}

function buildNoteUrl(noteId) {
  return buildAbsoluteUrl(`/archive/note?id=${encodeSegment(noteId)}`);
}

function buildCategoryUrl(category) {
  return buildAbsoluteUrl(`/archive/note?category=${encodeSegment(category)}`);
}

function buildCollectionUrl(category, collection) {
  return buildAbsoluteUrl(
    `/archive/note?category=${encodeSegment(category)}&collection=${encodeSegment(collection)}`,
  );
}

function latestDateForNotes(notes) {
  return latestArchiveDate(notes);
}

function groupedNotes(notes, keyBuilder) {
  const groups = new Map();

  for (const note of notes) {
    const key = keyBuilder(note);

    if (!groups.has(key)) {
      groups.set(key, []);
    }

    groups.get(key).push(note);
  }

  return groups;
}

function buildCategoryEntries(notes) {
  return [...groupedNotes(notes, (note) => note.category).entries()].map(([category, items]) => ({
    loc: buildCategoryUrl(category),
    lastmod: latestDateForNotes(items),
  }));
}

function buildCollectionEntries(notes) {
  return [...groupedNotes(notes, (note) => `${note.category}::${note.collection}`).entries()].map(
    ([key, items]) => {
      const [category, collection] = key.split("::");

      return {
        loc: buildCollectionUrl(category, collection),
        lastmod: latestDateForNotes(items),
      };
    },
  );
}

function dedupeEntries(entries) {
  const seen = new Set();

  return entries.filter((entry) => {
    if (seen.has(entry.loc)) {
      return false;
    }

    seen.add(entry.loc);
    return true;
  });
}

function sortEntries(entries) {
  return [...entries].sort((left, right) => left.loc.localeCompare(right.loc));
}

function buildArchiveEntries(notes) {
  return [
    {
      loc: buildAbsoluteUrl("/archive/"),
      lastmod: latestArchiveDate(notes),
    },
    {
      loc: buildAbsoluteUrl("/archive/note/"),
      lastmod: latestArchiveDate(notes),
    },
    ...buildCategoryEntries(notes),
    ...buildCollectionEntries(notes),
    ...notes.map((note) => ({
      loc: buildNoteUrl(note.id),
      lastmod: normalizeDate(note.updated || note.created || note.date),
    })),
  ];
}

function buildUrlEntry({ loc, lastmod }) {
  const lines = ["  <url>", `    <loc>${escapeXml(loc)}</loc>`];

  if (lastmod) {
    lines.push(`    <lastmod>${escapeXml(lastmod)}</lastmod>`);
  }

  lines.push("  </url>");
  return lines.join("\n");
}

async function main() {
  const rawIndex = await readFile(ARCHIVE_INDEX_PATH, "utf8");
  const notes = JSON.parse(rawIndex);
  const homeLastmod = latestArchiveDate(notes);
  const urls = sortEntries(
    dedupeEntries([
      {
        loc: SITE_URL,
        lastmod: homeLastmod,
      },
      ...buildArchiveEntries(notes),
    ]),
  );

  const sitemap = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...urls.map(buildUrlEntry),
    "</urlset>",
    "",
  ].join("\n");

  await writeFile(OUTPUT_PATH, sitemap, "utf8");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
