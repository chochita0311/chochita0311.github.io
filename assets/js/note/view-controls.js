(() => {
  const VIEW_PAGE_SIZES = {
    list: [5, 10, 20],
    grid: [6, 12, 18],
  };
  const DEFAULT_PAGE_SIZE_BY_VIEW = {
    list: 10,
    grid: 6,
  };
  const MOBILE_LIST_ONLY_MAX_WIDTH = 1023;

  function isMobileListOnlyViewport() {
    return window.innerWidth <= MOBILE_LIST_ONLY_MAX_WIDTH;
  }

  function normalizeArchiveViewMode(viewMode) {
    if (isMobileListOnlyViewport()) {
      return "list";
    }

    return viewMode === "grid" ? "grid" : "list";
  }

  function pageSizeOptionsForView(viewMode) {
    return VIEW_PAGE_SIZES[normalizeArchiveViewMode(viewMode)] || VIEW_PAGE_SIZES.list;
  }

  function defaultPageSizeForView(viewMode) {
    return (
      DEFAULT_PAGE_SIZE_BY_VIEW[normalizeArchiveViewMode(viewMode)] ||
      DEFAULT_PAGE_SIZE_BY_VIEW.list
    );
  }

  function setPaginationButtonState(button, isEnabled) {
    if (!button) {
      return;
    }

    if (isEnabled) {
      button.classList.add("pagination-button--primary");
      button.classList.remove("pagination-button--disabled");
      button.disabled = false;
      return;
    }

    button.classList.add("pagination-button--disabled");
    button.classList.remove("pagination-button--primary");
    button.disabled = true;
  }

  function preserveFooterAnchor(anchorElement, renderAction) {
    const beforeTop = anchorElement?.getBoundingClientRect().top;

    renderAction();

    if (typeof beforeTop !== "number") {
      return;
    }

    const nextAnchor = document.getElementById(anchorElement.id);

    if (!nextAnchor) {
      return;
    }

    const afterTop = nextAnchor.getBoundingClientRect().top;
    window.scrollBy(0, afterTop - beforeTop);
  }

  function createController({ state, elements, renderArchivePage, updateViewMode }) {
    let viewToggleBound = false;
    let pageSizeBound = false;

    function applyViewModeToList() {
      const noteList = elements.noteList();

      if (!noteList) {
        return;
      }

      noteList.dataset.viewMode = normalizeArchiveViewMode(state.viewMode);
    }

    function syncPageSizeControl() {
      const current = elements.pageSizeCurrent();
      const menu = elements.pageSizeMenu();

      if (!current || !menu) {
        return;
      }

      const options = pageSizeOptionsForView(state.viewMode);
      current.textContent = String(state.pageSize);
      menu.innerHTML = options
        .map((value) => {
          const isSelected = value === state.pageSize;
          return `<button class="archive-page-size__option${isSelected ? " archive-page-size__option--selected" : ""}" data-archive-page-size="${String(value)}" role="menuitemradio" aria-checked="${isSelected ? "true" : "false"}" type="button"><span>${String(value)}</span>${isSelected ? '<span aria-hidden="true" class="icon icon--material material-symbols-outlined archive-page-size__check">check</span>' : ""}</button>`;
        })
        .join("");
    }

    function setPageSizeMenuOpen(isOpen) {
      const root = elements.pageSizeRoot();
      const trigger = elements.pageSizeTrigger();
      const menu = elements.pageSizeMenu();

      if (!root || !trigger || !menu) {
        return;
      }

      root.dataset.open = isOpen ? "true" : "false";
      trigger.setAttribute("aria-expanded", isOpen ? "true" : "false");
      menu.hidden = !isOpen;
    }

    function syncViewToggleButtons() {
      elements.viewButtons().forEach((button) => {
        const isActive = button.dataset.archiveView === normalizeArchiveViewMode(state.viewMode);

        button.classList.toggle("archive-view-toggle__button--active", isActive);
        button.setAttribute("aria-pressed", isActive ? "true" : "false");
      });
    }

    function bindPaginationControls() {
      const prevButton = elements.prevButton();
      const nextButton = elements.nextButton();

      if (prevButton) {
        prevButton.onclick = (event) => {
          if (state.page <= 1) {
            return;
          }

          state.page -= 1;
          preserveFooterAnchor(event.currentTarget, () => {
            renderArchivePage();
          });
        };
      }

      if (nextButton) {
        nextButton.onclick = (event) => {
          const totalPages = Math.max(1, Math.ceil(state.notes.length / state.pageSize));

          if (state.page >= totalPages) {
            return;
          }

          state.page += 1;
          preserveFooterAnchor(event.currentTarget, () => {
            renderArchivePage();
          });
        };
      }
    }

    function bindPageSizeControl() {
      const root = elements.pageSizeRoot();
      const trigger = elements.pageSizeTrigger();
      const menu = elements.pageSizeMenu();

      if (!root || !trigger || !menu) {
        return;
      }

      if (root.dataset.bound !== "true") {
        trigger.addEventListener("click", () => {
          const isOpen = trigger.getAttribute("aria-expanded") === "true";
          setPageSizeMenuOpen(!isOpen);
        });

        menu.addEventListener("click", (event) => {
          const option = event.target.closest("[data-archive-page-size]");

          if (!option) {
            return;
          }

          const nextPageSize = Number.parseInt(option.dataset.archivePageSize, 10);

          if (!Number.isInteger(nextPageSize) || nextPageSize <= 0) {
            return;
          }

          state.pageSize = nextPageSize;
          state.page = 1;
          setPageSizeMenuOpen(false);
          preserveFooterAnchor(trigger, () => {
            renderArchivePage();
          });
        });

        root.dataset.bound = "true";
      }

      if (!pageSizeBound) {
        document.addEventListener("click", (event) => {
          const currentRoot = elements.pageSizeRoot();

          if (!currentRoot || currentRoot.contains(event.target)) {
            return;
          }

          setPageSizeMenuOpen(false);
        });

        document.addEventListener("keydown", (event) => {
          if (event.key === "Escape") {
            setPageSizeMenuOpen(false);
          }
        });

        pageSizeBound = true;
      }
    }

    function bindViewToggleControls() {
      if (viewToggleBound) {
        return;
      }

      elements.viewButtons().forEach((button) => {
        button.addEventListener("click", () => {
          const nextMode = button.dataset.archiveView;

          if (nextMode === state.viewMode) {
            return;
          }

          updateViewMode(nextMode);
        });
      });

      viewToggleBound = true;
    }

    return {
      applyViewModeToList,
      bindPageSizeControl,
      bindPaginationControls,
      bindViewToggleControls,
      defaultPageSizeForView,
      isMobileListOnlyViewport,
      normalizeArchiveViewMode,
      setPaginationButtonState,
      syncPageSizeControl,
      syncViewToggleButtons,
    };
  }

  window.NoteArchiveControls = {
    createController,
    defaultPageSizeForView,
    isMobileListOnlyViewport,
    normalizeArchiveViewMode,
    pageSizeOptionsForView,
  };
})();
