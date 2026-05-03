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

  function topbar() {
    return document.querySelector(".topbar");
  }

  function shouldDeferNotesDropdown() {
    return (
      document.documentElement.dataset.notesReturn === "true" ||
      document.body.classList.contains("is-notes-return")
    );
  }

  function setTopbarHold(holdTarget) {
    const topbarElement = topbar();

    document.documentElement.dataset.topbarHold = holdTarget;

    if (topbarElement) {
      topbarElement.dataset.topbarHold = holdTarget;
    }
  }

  function clearTopbarHold(holdTarget) {
    const topbarElement = topbar();

    if (document.documentElement.dataset.topbarHold === holdTarget) {
      delete document.documentElement.dataset.topbarHold;
    }

    if (topbarElement?.dataset.topbarHold === holdTarget) {
      delete topbarElement.dataset.topbarHold;
    }
  }

  function topbarHoldElement(holdTarget) {
    if (holdTarget === "design") {
      return document.querySelector("[data-design-route]");
    }

    if (holdTarget === "notes") {
      return topbarCategoriesTrigger();
    }

    return null;
  }

  function canHoldStateInherit(holdTarget) {
    const holdElement = topbarHoldElement(holdTarget);

    return Boolean(
      holdElement &&
      (holdElement.matches(":hover") || holdElement.contains(document.activeElement)),
    );
  }

  function releaseTopbarCategoriesHandoff({ blurTrigger = false, forceOpen = false } = {}) {
    const root = topbarCategoriesRoot();
    const trigger = topbarCategoriesTrigger();
    const panel = topbarCategoriesPanel();

    if (!root || !trigger || !panel) {
      return;
    }

    if (blurTrigger) {
      trigger.blur();
    }

    const canOpenDropdown =
      !document.body.classList.contains("design-page") &&
      root.dataset.taxonomyReady === "true" &&
      !shouldDeferNotesDropdown();
    const shouldStayOpen =
      canOpenDropdown &&
      (forceOpen || root.matches(":hover") || root.contains(document.activeElement));

    delete root.dataset.handoffOpen;
    delete root.dataset.lockedClosed;
    trigger.setAttribute("aria-expanded", shouldStayOpen ? "true" : "false");
    panel.hidden = !shouldStayOpen;
  }

  function releaseTopbarHold(holdTarget, { blurElement = false } = {}) {
    const holdElement = topbarHoldElement(holdTarget);

    clearTopbarHold(holdTarget);

    if (holdTarget === "notes") {
      releaseTopbarCategoriesHandoff({ blurTrigger: blurElement });
      return;
    }

    if (blurElement) {
      holdElement?.blur?.();
    }
  }

  function dispatchTopbarArchiveSelection(category, collection = null) {
    window.dispatchEvent(
      new CustomEvent("topbar:archive-selection", {
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

    if (!root || !trigger || !panel || root.dataset.hoverBound === "true") {
      return;
    }

    root.dataset.hoverBound = "true";

    const setExpandedState = (isExpanded) => {
      if (!isExpanded && root.dataset.handoffOpen === "true") {
        return;
      }

      const canOpenDropdown =
        !document.body.classList.contains("design-page") &&
        root.dataset.taxonomyReady === "true" &&
        !shouldDeferNotesDropdown();
      const shouldExpand = canOpenDropdown && isExpanded;

      trigger.setAttribute("aria-expanded", shouldExpand ? "true" : "false");
      panel.hidden = !shouldExpand;
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
    delete root.dataset.handoffOpen;
    trigger.setAttribute("aria-expanded", "false");
    panel.hidden = true;
    trigger.blur();
  }

  function renderTopbarCategories(categories) {
    const root = topbarCategoriesRoot();
    const trigger = topbarCategoriesTrigger();
    const panel = topbarCategoriesPanel();

    if (!root || !trigger || !panel) {
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

    root.dataset.taxonomyReady = "true";

    const shouldKeepPanelOpen =
      !document.body.classList.contains("design-page") &&
      root.dataset.taxonomyReady === "true" &&
      !shouldDeferNotesDropdown() &&
      (root.dataset.handoffOpen === "true" ||
        root.matches(":hover") ||
        root.contains(document.activeElement));

    trigger.setAttribute("aria-expanded", shouldKeepPanelOpen ? "true" : "false");
    panel.hidden = !shouldKeepPanelOpen;
    panel.innerHTML = `<div class="nav-menu">${categoryMarkup}</div>`;

    panel.querySelectorAll("[data-topbar-category]").forEach((button) => {
      button.addEventListener("click", () => {
        closeTopbarCategories();
        dispatchTopbarArchiveSelection(button.dataset.topbarCategory, null);
      });
    });

    panel.querySelectorAll("[data-topbar-collection]").forEach((button) => {
      button.addEventListener("click", () => {
        closeTopbarCategories();
        dispatchTopbarArchiveSelection(
          button.dataset.topbarCategoryParent,
          button.dataset.topbarCollection,
        );
      });
    });

    bindTopbarHoverState(root);
  }

  async function initializeTopbarTaxonomy() {
    const root = topbarCategoriesRoot();
    const panel = topbarCategoriesPanel();

    if (!panel || !window.ArchiveTaxonomy) {
      return;
    }

    if (root) {
      delete root.dataset.taxonomyReady;
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
      if (root) {
        root.dataset.taxonomyReady = "true";
        bindTopbarHoverState(root);
      }

      panel.innerHTML =
        '<div class="nav-menu"><span class="nav-menu__empty">Notes are unavailable.</span></div>';
    }
  }

  window.TopbarController = {
    canHoldStateInherit,
    getCategoriesRoot: topbarCategoriesRoot,
    getCategoriesTrigger: topbarCategoriesTrigger,
    getHoldElement: topbarHoldElement,
    isNotesDropdownDeferred: shouldDeferNotesDropdown,
    releaseCategoriesHandoff: releaseTopbarCategoriesHandoff,
    releaseHold: releaseTopbarHold,
    setHold: setTopbarHold,
  };

  initializeTopbarTaxonomy();
})();
