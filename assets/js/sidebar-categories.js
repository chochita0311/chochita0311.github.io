const CATEGORY_ARCHIVE = [
  {
    name: "Design",
    icon: "architecture",
    totalNotes: 0,
    collections: [],
  },
  {
    name: "English",
    icon: "menu_book",
    totalNotes: 20,
    collections: [
      {
        name: "Langs Studio",
        noteCount: 20,
      },
    ],
  },
  {
    name: "Technology",
    icon: "memory",
    totalNotes: 14,
    collections: [
      {
        name: "JAVA",
        noteCount: 14,
      },
    ],
  },
];

function renderSidebarCategories(categories) {
  const mount = document.getElementById("sidebar-categories");

  if (!mount) {
    return;
  }

  mount.innerHTML = categories
    .map((category, index) => {
      const hasCollections = category.collections.length > 0;
      const categoryStateClass = index === 0 ? " sidebar-link--active" : "";
      const groupStateClass = index === 0 && hasCollections ? " is-open" : "";
      const collectionMarkup = hasCollections
        ? `
<div class="sidebar-sublist">
${category.collections
  .map(
    (collection) => `
<a class="sidebar-sublist__item" href="#" data-collection-name="${collection.name}">
<span class="sidebar-sublist__name">${collection.name}</span>
<span class="sidebar-sublist__count">${collection.noteCount}</span>
</a>`,
  )
  .join("")}
</div>`
        : "";

      return `
<div class="sidebar__group${hasCollections ? " sidebar__group--has-children" : ""}${groupStateClass}" data-category-name="${category.name}">
<a class="sidebar-link${categoryStateClass}" href="#" data-category-trigger="true">
<div class="sidebar-link__content">
<span class="material-symbols-outlined sidebar-link__icon">${category.icon}</span>
<span class="sidebar-link__text">${category.name} (${String(category.totalNotes).padStart(2, "0")})</span>
</div>
</a>
${collectionMarkup}
</div>`;
    })
    .join("");

  const groups = Array.from(mount.querySelectorAll(".sidebar__group"));

  const activateGroup = (group) => {
    groups.forEach((item) => {
      const itemTrigger = item.querySelector("[data-category-trigger='true']");

      if (itemTrigger) {
        itemTrigger.classList.remove("sidebar-link--active");
      }

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
      window.dispatchEvent(
        new CustomEvent("archive:navigate", {
          detail: {
            category: group.dataset.categoryName,
            collection: null,
          },
        }),
      );
    });

    childLinks.forEach((link) => {
      link.addEventListener("click", (event) => {
        event.preventDefault();
        activateGroup(group);
        window.dispatchEvent(
          new CustomEvent("archive:navigate", {
            detail: {
              category: group.dataset.categoryName,
              collection: link.dataset.collectionName,
            },
          }),
        );
      });
    });
  });
}

renderSidebarCategories(CATEGORY_ARCHIVE);
