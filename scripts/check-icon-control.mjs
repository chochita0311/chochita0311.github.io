import { readFileSync, readdirSync, statSync } from "node:fs";
import path from "node:path";

const repoRoot = process.cwd();
const runtimeRoots = [
  "index.html",
  "pages",
  "assets/js",
];
const rawIconOwners = new Set([
  "assets/js/icons.js",
  "index.html",
  "pages/note/index.html",
]);

function walk(targetPath) {
  const absolutePath = path.join(repoRoot, targetPath);
  const stats = statSync(absolutePath);

  if (stats.isFile()) {
    return [targetPath];
  }

  return readdirSync(absolutePath, { withFileTypes: true }).flatMap((entry) => {
    const relativePath = path.join(targetPath, entry.name);

    if (entry.isDirectory()) {
      return walk(relativePath);
    }

    return [relativePath];
  });
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function collectRegistryIcons(filePath) {
  const source = readFileSync(path.join(repoRoot, filePath), "utf8");
  const matches = [...source.matchAll(/:\s*"([a-z0-9_]+)"/g)];

  return [...new Set(matches.map((match) => match[1]))].sort();
}

function collectRuntimeFiles() {
  return runtimeRoots
    .flatMap((targetPath) => walk(targetPath))
    .filter((filePath) => /\.(html|js)$/.test(filePath))
    .sort();
}

function reportFailures(failures) {
  console.error("Icon control check failed.\n");

  failures.forEach((failure) => {
    console.error(`- ${failure}`);
  });

  process.exit(1);
}

const registryFile = "assets/js/icons.js";
const iconNames = collectRegistryIcons(registryFile);
const runtimeFiles = collectRuntimeFiles();
const failures = [];

runtimeFiles.forEach((filePath) => {
  const source = readFileSync(path.join(repoRoot, filePath), "utf8");

  if (!rawIconOwners.has(filePath)) {
    const rawIconMatches = iconNames.filter((iconName) => {
      const quotedPattern = new RegExp(
        `["'\`]${escapeRegExp(iconName)}["'\`]`,
        "g",
      );

      return quotedPattern.test(source);
    });

    if (rawIconMatches.length > 0) {
      failures.push(
        `${filePath} contains raw icon names outside approved owners: ${[...new Set(rawIconMatches)].join(", ")}`,
      );
    }
  }

  if (filePath.endsWith(".html")) {
    const materialSpanMatches = [
      ...source.matchAll(/<span[^>]*class="([^"]*material-symbols-outlined[^"]*)"[^>]*>/g),
    ];

    materialSpanMatches.forEach((match) => {
      const classValue = match[1];

      if (!classValue.includes("icon ") && !classValue.startsWith("icon")) {
        failures.push(
          `${filePath} has a Material Symbols span without the shared icon class pattern: ${classValue}`,
        );
      }

      if (!classValue.includes("icon--material")) {
        failures.push(
          `${filePath} has a Material Symbols span without icon--material: ${classValue}`,
        );
      }
    });

    const actionButtons = [
      ...source.matchAll(/<button([^>]*)class="[^"]*note-detail__action[^"]*"([^>]*)>/g),
    ];

    actionButtons.forEach((match) => {
      const attributes = `${match[1]} ${match[2]}`;

      if (!/\baria-label="/.test(attributes)) {
        failures.push(`${filePath} has a note action button without aria-label.`);
      }
    });
  }
});

if (failures.length > 0) {
  reportFailures(failures);
}

console.log("Icon control check passed.");
