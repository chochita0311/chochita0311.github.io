(() => {
const { ICONS, renderIcon } = window.AppIcons;
const CATEGORY_ICONS = {
  English: ICONS.categories.english,
  Technology: ICONS.categories.technology,
};

function notesIndexPath() {
  return window.location.pathname.includes("/pages/note/")
    ? "../../assets/generated/archives-index.json"
    : "assets/generated/archives-index.json";
}

function categorySelectionFromLocation() {
  const params = new URLSearchParams(window.location.search);

  return {
    category: params.get("category"),
    collection: params.get("collection"),
  };
}

function buildCategoryArchive(notes) {
  const categories = new Map();

  notes.forEach((note) => {
    if (!note.category || !note.collection) {
      return;
    }

    if (!categories.has(note.category)) {
      categories.set(note.category, {
        name: note.category,
        icon: CATEGORY_ICONS[note.category] || ICONS.categories.fallback,
        totalNotes: 0,
        collections: new Map(),
      });
    }

    const category = categories.get(note.category);
    category.totalNotes += 1;

    if (!category.collections.has(note.collection)) {
      category.collections.set(note.collection, {
        name: note.collection,
        noteCount: 0,
      });
    }

    category.collections.get(note.collection).noteCount += 1;
  });

  return [...categories.values()]
    .sort((left, right) => left.name.localeCompare(right.name))
    .map((category) => ({
      ...category,
      collections: [...category.collections.values()].sort((left, right) =>
        left.name.localeCompare(right.name),
      ),
    }));
}

function renderSidebarCategories(categories) {
  const mount = document.getElementById("sidebar-categories");

  if (!mount) {
    return;
  }

  const selection = categorySelectionFromLocation();

  mount.innerHTML = categories
    .map((category) => {
      const hasCollections = category.collections.length > 0;
      const isSelectedCategory =
        selection.category === category.name;
      const categoryStateClass = isSelectedCategory
        ? " sidebar-link--active"
        : "";
      const groupStateClass =
        isSelectedCategory && hasCollections ? " is-open" : "";
      const collectionMarkup = hasCollections
        ? `
<div class="sidebar-sublist">
${category.collections
  .map((collection) => {
    const isSelectedCollection =
      selection.category === category.name &&
      selection.collection === collection.name;

    return `
<a class="sidebar-sublist__item${isSelectedCollection ? " sidebar-sublist__item--active" : ""}" href="#" data-collection-name="${collection.name}">
<span class="sidebar-sublist__name">${collection.name}</span>
<span class="sidebar-sublist__count">${collection.noteCount}</span>
</a>`;
  })
  .join("")}
</div>`
        : "";

      return `
<div class="sidebar__group${hasCollections ? " sidebar__group--has-children" : ""}${groupStateClass}" data-category-name="${category.name}">
<a class="sidebar-link${categoryStateClass}" href="#" data-category-trigger="true">
<div class="sidebar-link__content">
${renderIcon(category.icon, { className: "sidebar-link__icon" })}
<span class="sidebar-link__text">${category.name} (${String(category.totalNotes).padStart(2, "0")})</span>
</div>
</a>
${collectionMarkup}
</div>`;
    })
    .join("");

  const groups = Array.from(mount.querySelectorAll(".sidebar__group"));
  const isNotePage = window.location.pathname.includes("/pages/note/");

  const navigateArchive = ({ category, collection }) => {
    if (isNotePage) {
      const archiveUrl = new URL("../../index.html", window.location.href);

      if (category) {
        archiveUrl.searchParams.set("category", category);
      }

      if (collection) {
        archiveUrl.searchParams.set("collection", collection);
      }

      window.location.href = archiveUrl.toString();
      return;
    }

    window.dispatchEvent(
      new CustomEvent("archive:navigate", {
        detail: {
          category,
          collection,
        },
      }),
    );
  };

  const activateGroup = (group) => {
    groups.forEach((item) => {
      const itemTrigger = item.querySelector("[data-category-trigger='true']");
      const childLinks = Array.from(
        item.querySelectorAll(".sidebar-sublist__item"),
      );

      if (itemTrigger) {
        itemTrigger.classList.remove("sidebar-link--active");
      }

      childLinks.forEach((link) => {
        link.classList.remove("sidebar-sublist__item--active");
      });

      item.classList.remove("is-open");
    });

    const trigger = group.querySelector("[data-category-trigger='true']");

    if (trigger) {
      trigger.classList.add("sidebar-link--active");
    }

    if (group.classList.contains("sidebar__group--has-children")) {
      group.classList.add("is-open");
    }
  };

  groups.forEach((group) => {
    const trigger = group.querySelector("[data-category-trigger='true']");
    const childLinks = Array.from(group.querySelectorAll(".sidebar-sublist__item"));

    if (!trigger) {
      return;
    }

    trigger.addEventListener("click", (event) => {
      event.preventDefault();
      activateGroup(group);
      navigateArchive({
        category: group.dataset.categoryName,
        collection: null,
      });
    });

    childLinks.forEach((link) => {
      link.addEventListener("click", (event) => {
        event.preventDefault();
        activateGroup(group);
        link.classList.add("sidebar-sublist__item--active");
        navigateArchive({
          category: group.dataset.categoryName,
          collection: link.dataset.collectionName,
        });
      });
    });
  });
}

async function initializeSidebarCategories() {
  const mount = document.getElementById("sidebar-categories");

  if (!mount) {
    return;
  }

  try {
    const response = await fetch(notesIndexPath());

    if (!response.ok) {
      throw new Error("Unable to load notes index.");
    }

    const notes = await response.json();
    renderSidebarCategories(buildCategoryArchive(notes));
  } catch {
    mount.innerHTML =
      '<p class="note-detail__rail-empty">Categories are unavailable until the notes index is generated.</p>';
  }
}

initializeSidebarCategories();
})();
