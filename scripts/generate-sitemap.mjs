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

function buildNoteUrl(notePath) {
  const url = new URL("/pages/note/", SITE_URL);
  url.search = new URLSearchParams({ note: notePath }).toString();
  return url.toString();
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
  const urls = [
    {
      loc: SITE_URL,
      lastmod: homeLastmod,
    },
    ...notes.map((note) => ({
      loc: buildNoteUrl(note.path),
      lastmod: normalizeDate(note.updated || note.created || note.date),
    })),
  ];

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
