(() => {
  const DESIGN_HANDOFF_DELAY_MS = 520;
  const NOTES_HANDOFF_DELAY_MS = 680;
  const NOTES_RETURN_ENTRY_MS = 620;
  const NOTES_RETURN_STORAGE_KEY = "chochita:notes-return-entry";
  const TOPBAR_HOLD_STORAGE_KEY = "chochita:topbar-hold";

  function topbarController() {
    return window.TopbarController;
  }

  function prefersReducedMotion() {
    return window.matchMedia?.("(prefers-reduced-motion: reduce)").matches === true;
  }

  function navigateTo(url, { replace = false } = {}) {
    if (replace) {
      window.location.replace(url);
      return;
    }

    window.location.href = url;
  }

  function isSamePath(url) {
    if (!url) {
      return false;
    }

    const target = new URL(url, window.location.origin);
    const currentPath = window.ArchiveRoutes
      ? window.ArchiveRoutes.normalizePathname(window.location.pathname)
      : window.location.pathname.replace(/\/$/, "");
    const targetPath = window.ArchiveRoutes
      ? window.ArchiveRoutes.normalizePathname(target.pathname)
      : target.pathname.replace(/\/$/, "");

    return target.origin === window.location.origin && targetPath === currentPath;
  }

  function isValidTopbarHoldTarget(holdTarget) {
    return holdTarget === "design" || holdTarget === "notes";
  }

  function shouldWaitForPointerRelease() {
    return window.matchMedia?.("(hover: hover) and (pointer: fine)").matches === true;
  }

  function shouldDeferNotesDropdown() {
    return (
      document.documentElement.dataset.notesReturn === "true" ||
      document.body.classList.contains("is-notes-return")
    );
  }

  function safeSessionStorageSet(key, value) {
    try {
      window.sessionStorage?.setItem(key, value);
    } catch {
      // Ignore storage failures; navigation should still work.
    }
  }

  function safeSessionStorageTake(key) {
    try {
      const value = window.sessionStorage?.getItem(key);

      if (value !== null && value !== undefined) {
        window.sessionStorage.removeItem(key);
      }

      return value;
    } catch {
      return null;
    }
  }

  function safeSessionStorageRemove(key, expectedValue = null) {
    try {
      if (expectedValue === null || window.sessionStorage?.getItem(key) === expectedValue) {
        window.sessionStorage?.removeItem(key);
      }
    } catch {
      // Ignore storage failures; navigation should still work.
    }
  }

  function clearStoredTopbarHold(holdTarget) {
    safeSessionStorageRemove(TOPBAR_HOLD_STORAGE_KEY, holdTarget);
  }

  function releaseTopbarHold(holdTarget, { blurElement = false } = {}) {
    topbarController()?.releaseHold?.(holdTarget, { blurElement });
    clearStoredTopbarHold(holdTarget);
  }

  function bindTopbarHoldPointerCancel(holdTarget, { blurOnCancel = false } = {}) {
    if (!shouldWaitForPointerRelease()) {
      return () => {};
    }

    const holdElement = topbarController()?.getHoldElement?.(holdTarget);

    if (!holdElement) {
      return () => {};
    }

    let released = false;

    const cleanup = () => {
      holdElement.removeEventListener("pointerleave", releaseIfAway);
      document.removeEventListener("pointermove", releaseIfAway);
      window.removeEventListener("pagehide", cleanup);
    };

    const release = () => {
      if (released) {
        return;
      }

      released = true;
      cleanup();
      releaseTopbarHold(holdTarget, { blurElement: blurOnCancel });
    };

    function releaseIfAway() {
      window.requestAnimationFrame(() => {
        if (!released && !holdElement.matches(":hover")) {
          release();
        }
      });
    }

    holdElement.addEventListener("pointerleave", releaseIfAway, {
      passive: true,
    });
    document.addEventListener("pointermove", releaseIfAway, {
      passive: true,
    });
    window.addEventListener("pagehide", cleanup, { once: true });

    releaseIfAway();

    return cleanup;
  }

  function topbarHoldEntryReleaseDelay(holdTarget) {
    if (holdTarget === "notes" && shouldDeferNotesDropdown()) {
      return NOTES_RETURN_ENTRY_MS + 80;
    }

    return 0;
  }

  function resetDesignSurface() {
    window.dispatchEvent(new CustomEvent("design:reset"));

    const canonicalPath = window.ArchiveRoutes?.buildDesignPath?.() || "/archive/design/";
    const currentPath = `${window.location.pathname}${window.location.search}${window.location.hash}`;

    if (currentPath !== canonicalPath) {
      window.history.replaceState(null, "", canonicalPath);
    }
  }

  function beginDesignHandoff(url, { pointerInitiated = false } = {}) {
    const sidebar = document.querySelector(".sidebar");
    const hasSidebar = Boolean(sidebar);

    safeSessionStorageSet(TOPBAR_HOLD_STORAGE_KEY, "design");
    topbarController()?.setHold?.("design");

    if (pointerInitiated) {
      bindTopbarHoldPointerCancel("design", { blurOnCancel: true });
    }

    if (!hasSidebar || prefersReducedMotion()) {
      navigateTo(url);
      return;
    }

    sidebar.setAttribute("aria-hidden", "true");
    sidebar.inert = true;
    document.body.classList.add("is-design-handoff");

    window.setTimeout(() => {
      navigateTo(url);
    }, DESIGN_HANDOFF_DELAY_MS);
  }

  function beginNotesHandoff(url, { pointerInitiated = false } = {}) {
    const designMain = document.querySelector(".design-main");
    const isDesignSurface = document.body.classList.contains("design-page");

    if (isDesignSurface) {
      safeSessionStorageSet(TOPBAR_HOLD_STORAGE_KEY, "notes");
      topbarController()?.setHold?.("notes");

      if (pointerInitiated) {
        bindTopbarHoldPointerCancel("notes", { blurOnCancel: true });
      }
    }

    if (!isDesignSurface || !designMain || prefersReducedMotion()) {
      navigateTo(url);
      return;
    }

    safeSessionStorageSet(NOTES_RETURN_STORAGE_KEY, "true");
    document.body.classList.add("is-notes-handoff");

    window.setTimeout(() => {
      navigateTo(url);
    }, NOTES_HANDOFF_DELAY_MS);
  }

  function applyTopbarHoldEntry() {
    const holdTarget =
      safeSessionStorageTake(TOPBAR_HOLD_STORAGE_KEY) ||
      document.documentElement.dataset.topbarHold;

    if (!isValidTopbarHoldTarget(holdTarget)) {
      delete document.documentElement.dataset.topbarHold;
      return;
    }

    topbarController()?.setHold?.(holdTarget);

    const cleanupPointerCancel = bindTopbarHoldPointerCancel(holdTarget, {
      blurOnCancel: true,
    });

    const releaseHold = () => {
      cleanupPointerCancel();
      releaseTopbarHold(holdTarget);
    };

    window.requestAnimationFrame(() => {
      if (
        !shouldWaitForPointerRelease() ||
        !topbarController()?.canHoldStateInherit?.(holdTarget)
      ) {
        releaseHold();
        return;
      }

      window.setTimeout(() => {
        releaseHold();
      }, topbarHoldEntryReleaseDelay(holdTarget));
    });
  }

  function applyNotesReturnEntry() {
    if (prefersReducedMotion()) {
      safeSessionStorageTake(NOTES_RETURN_STORAGE_KEY);
      return;
    }

    if (safeSessionStorageTake(NOTES_RETURN_STORAGE_KEY) !== "true") {
      return;
    }

    document.body.classList.add("is-notes-return");
    delete document.documentElement.dataset.notesReturn;

    window.setTimeout(() => {
      document.body.classList.remove("is-notes-return");
      topbarController()?.releaseCategoriesHandoff?.();
    }, NOTES_RETURN_ENTRY_MS);
  }

  function isArchiveShellReady() {
    return Boolean(document.getElementById("archive-list-view"));
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

  function navigateArchiveSelection(category, collection = null) {
    const archiveListView = document.getElementById("archive-list-view");

    if (archiveListView) {
      dispatchArchiveNavigate(category, collection);
      return;
    }

    if (window.ArchiveRoutes) {
      const path = collection
        ? window.ArchiveRoutes.buildCollectionPath(category, collection)
        : window.ArchiveRoutes.buildCategoryPath(category);

      beginNotesHandoff(path);
      return;
    }

    beginNotesHandoff("/archive/note/");
  }

  function bindArchiveKindRoutes() {
    document.querySelectorAll("[data-design-route]").forEach((link) => {
      link.addEventListener("click", (event) => {
        const targetUrl = link.getAttribute("href");

        if (!targetUrl || targetUrl === "#") {
          return;
        }

        event.preventDefault();

        if (isSamePath(targetUrl) && document.body.classList.contains("design-page")) {
          resetDesignSurface();
          return;
        }

        beginDesignHandoff(targetUrl, { pointerInitiated: event.detail > 0 });
      });
    });

    const notesTrigger = topbarController()?.getCategoriesTrigger?.();

    if (notesTrigger?.dataset.notesRoute) {
      notesTrigger.addEventListener("click", (event) => {
        const targetUrl = notesTrigger.dataset.notesRoute;

        if (isSamePath(targetUrl) && isArchiveShellReady()) {
          event.preventDefault();
          topbarController()?.releaseCategoriesHandoff?.({
            blurTrigger: event.detail > 0,
            forceOpen:
              event.detail > 0 &&
              (notesTrigger.matches(":hover") ||
                topbarController()?.getCategoriesRoot?.()?.matches(":hover")),
          });

          return;
        }

        beginNotesHandoff(targetUrl, { pointerInitiated: event.detail > 0 });
      });
    }
  }

  function bindTopbarArchiveSelection() {
    window.addEventListener("topbar:archive-selection", (event) => {
      navigateArchiveSelection(event.detail?.category || null, event.detail?.collection || null);
    });
  }

  window.ShellHandoff = {
    beginDesignHandoff,
    beginNotesHandoff,
    resetDesignSurface,
  };

  applyTopbarHoldEntry();
  applyNotesReturnEntry();
  bindArchiveKindRoutes();
  bindTopbarArchiveSelection();
})();
