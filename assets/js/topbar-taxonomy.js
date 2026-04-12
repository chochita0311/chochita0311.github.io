(() => {
  function topbarCategoriesRoot() {
    return document.getElementById("topbar-categories");
  }

  function topbarCategoriesTrigger() {
    return document.getElementById("topbar-categories-trigger");
  }

  function topbarCategoriesPanel() {
    return document.getElementById("topbar-categories-panel");
  }

  function dispatchArchiveNavigate(category, collection = null) {
    window.dispatchEvent(
      new CustomEvent("archive:navigate", {
        detail: {
          category,
          collection,
        },
      }),
    );
  }

  function bindTopbarHoverState(root) {
    const trigger = topbarCategoriesTrigger();
    const panel = topbarCategoriesPanel();

    if (!root || !trigger || !panel) {
      return;
    }

    const setExpandedState = (isExpanded) => {
      trigger.setAttribute("aria-expanded", isExpanded ? "true" : "false");
      panel.hidden = !isExpanded;
    };

    const unlockClosedState = () => {
      delete root.dataset.lockedClosed;
    };

    root.addEventListener("mouseenter", () => {
      unlockClosedState();
      setExpandedState(true);
    });

    root.addEventListener("mouseleave", () => {
      unlockClosedState();
      setExpandedState(false);
    });

    root.addEventListener("focusin", () => {
      unlockClosedState();
      setExpandedState(true);
    });

    root.addEventListener("focusout", (event) => {
      if (root.contains(event.relatedTarget)) {
        return;
      }

      setExpandedState(false);
    });
  }

  function closeTopbarCategories() {
    const root = topbarCategoriesRoot();
    const trigger = topbarCategoriesTrigger();
    const panel = topbarCategoriesPanel();

    if (!root || !trigger || !panel) {
      return;
    }

    root.dataset.lockedClosed = "true";
    trigger.setAttribute("aria-expanded", "false");
    panel.hidden = true;
    trigger.blur();
  }

  function renderTopbarCategories(categories) {
    const root = topbarCategoriesRoot();
    const panel = topbarCategoriesPanel();

    if (!root || !panel) {
      return;
    }

    const categoryMarkup = categories
      .map((category) => {
        const collectionMarkup = category.collections.length
          ? `
<div class="nav-dropdown__panel nav-dropdown__panel--level-2">
  <div class="nav-menu nav-menu--narrow">
    ${category.collections
      .map(
        (collection) => `
    <button
      class="nav-menu__link nav-menu__link--button"
      data-topbar-collection="${collection.name}"
      data-topbar-category-parent="${category.name}"
      type="button"
    >
      ${collection.name}
    </button>`,
      )
      .join("")}
  </div>
</div>`
          : "";

        return `
<div class="nav-menu__item nav-menu__item--branch">
  <button class="nav-menu__button" data-topbar-category="${category.name}" type="button">
    ${category.name}
    <span
      aria-hidden="true"
      class="icon icon--material material-symbols-outlined nav-menu__icon"
      >chevron_right</span
    >
  </button>
  ${collectionMarkup}
</div>`;
      })
      .join("");

    panel.hidden = true;
    panel.innerHTML = `<div class="nav-menu">${categoryMarkup}</div>`;

    panel.querySelectorAll("[data-topbar-category]").forEach((button) => {
      button.addEventListener("click", () => {
        closeTopbarCategories();
        dispatchArchiveNavigate(button.dataset.topbarCategory, null);
      });
    });

    panel.querySelectorAll("[data-topbar-collection]").forEach((button) => {
      button.addEventListener("click", () => {
        closeTopbarCategories();
        dispatchArchiveNavigate(
          button.dataset.topbarCategoryParent,
          button.dataset.topbarCollection,
        );
      });
    });

    bindTopbarHoverState(root);
  }

  async function initializeTopbarTaxonomy() {
    const panel = topbarCategoriesPanel();

    if (!panel || !window.ArchiveTaxonomy) {
      return;
    }

    try {
      const response = await fetch(window.ArchiveTaxonomy.notesIndexPath());

      if (!response.ok) {
        throw new Error("Unable to load notes index.");
      }

      const notes = await response.json();
      const categories = window.ArchiveTaxonomy.buildCategoryArchive(notes);

      renderTopbarCategories(categories);
    } catch {
      panel.innerHTML =
        '<div class="nav-menu"><span class="nav-menu__empty">Categories are unavailable.</span></div>';
    }
  }

  initializeTopbarTaxonomy();
})();
