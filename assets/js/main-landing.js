(() => {
  const TITLE_REPEAT_INTERVAL_MS = 20000;
  const TITLE_PROMPT_BLINK_CYCLES = 3;
  const TITLE_PROMPT_BLINK_DURATION_MS = 840 * TITLE_PROMPT_BLINK_CYCLES;

  let entryBound = false;
  let exitTimer = null;
  let dismissed = false;
  let titleTimer = null;
  let titleCycleTimer = null;

  function emitStateChange() {
    window.dispatchEvent(
      new CustomEvent("archive:landing-state", {
        detail: {
          active: document.body.classList.contains("has-landing-entry"),
          dismissed,
        },
      }),
    );
  }

  function currentArchiveUrl() {
    return new URL(window.location.href);
  }

  function isRootArchivePath() {
    return window.ArchiveRoutes.parseCurrentLocation().type === "landing";
  }

  function landingEntrySection() {
    return document.getElementById("landing-entry");
  }

  function landingEntryVideo() {
    return document.getElementById("landing-entry-video");
  }

  function landingEntryTitle() {
    return document.querySelector(".landing-entry__title");
  }

  function landingSearchInput() {
    return document.querySelector(".landing-entry__search-input");
  }

  function landingSearchField() {
    return document.querySelector(".landing-entry__search-field");
  }

  function landingSearchSubmit() {
    return document.querySelector(".landing-entry__search-submit");
  }

  function renderLandingTitleText(
    title,
    text,
    { showPrompt = false, animateLastChar = false } = {},
  ) {
    if (!title) {
      return;
    }

    title.textContent = "";

    if (!text && showPrompt) {
      const prompt = document.createElement("span");
      prompt.className = "landing-entry__title-prompt";
      prompt.textContent = "_";
      title.append(prompt);
      return;
    }

    if (!text) {
      return;
    }

    if (animateLastChar && text.length > 1 && !showPrompt) {
      title.append(document.createTextNode(text.slice(0, -1)));
      const lastChar = document.createElement("span");
      lastChar.className = "landing-entry__title-char landing-entry__title-char--fresh";
      lastChar.textContent = text.slice(-1);
      title.append(lastChar);
    } else {
      title.append(document.createTextNode(text.slice(0, -1)));
      const promptGroup = document.createElement("span");
      promptGroup.className = "landing-entry__title-prompt-group";
      const lastChar = document.createElement("span");
      lastChar.className = "landing-entry__title-char";
      lastChar.textContent = text.slice(-1);
      promptGroup.append(lastChar);

      if (showPrompt) {
        const prompt = document.createElement("span");
        prompt.className = "landing-entry__title-prompt";
        prompt.textContent = "_";
        promptGroup.append(prompt);
      }

      title.append(promptGroup);
    }
  }

  function blinkLandingTitlePrompt(title, text, pauseDuration, resume) {
    renderLandingTitleText(title, text, { showPrompt: true });

    const blinkOutDelay = 120;
    const blinkRestoreDelay = 250;
    const remainingDelay = Math.max(0, pauseDuration - blinkRestoreDelay);

    titleTimer = window.setTimeout(() => {
      renderLandingTitleText(title, text, { showPrompt: false });
      titleTimer = window.setTimeout(() => {
        renderLandingTitleText(title, text, { showPrompt: true });
        titleTimer = window.setTimeout(resume, remainingDelay);
      }, blinkRestoreDelay - blinkOutDelay);
    }, blinkOutDelay);
  }

  function stopLandingTitleAnimation({ revealFullText = false } = {}) {
    const title = landingEntryTitle();

    window.clearTimeout(titleTimer);
    window.clearTimeout(titleCycleTimer);
    titleTimer = null;
    titleCycleTimer = null;

    if (!title) {
      return;
    }

    const fullText = title.dataset.fullText || title.textContent || "";
    title.classList.remove("landing-entry__title--typing");
    title.classList.remove("landing-entry__title--prompt");

    if (revealFullText && fullText) {
      renderLandingTitleText(title, fullText);
    }
  }

  function startLandingTitleAnimation() {
    const title = landingEntryTitle();

    if (!title) {
      return;
    }

    const fullText = title.dataset.fullText || title.textContent || "";

    if (!fullText) {
      return;
    }

    title.dataset.fullText = fullText;
    renderLandingTitleText(title, "", { showPrompt: true });
    title.classList.add("landing-entry__title--typing");
    window.clearTimeout(titleCycleTimer);
    titleCycleTimer = window.setTimeout(() => {
      if (!document.body.classList.contains("has-landing-entry")) {
        return;
      }

      stopLandingTitleAnimation();
      startLandingTitleAnimation();
    }, TITLE_REPEAT_INTERVAL_MS);

    let index = 0;
    const pauseMap = new Map([
      [3, 380],
      [6, 520],
      [fullText.length, 0],
    ]);

    const tick = () => {
      index += 1;
      const currentText = fullText.slice(0, index);

      renderLandingTitleText(title, currentText, {
        showPrompt: true,
        animateLastChar: true,
      });

      if (index < fullText.length) {
        const delay = pauseMap.get(index) ?? 125;

        if (pauseMap.has(index)) {
          blinkLandingTitlePrompt(title, currentText, delay, tick);
          return;
        }

        titleTimer = window.setTimeout(tick, delay);
        return;
      }

      renderLandingTitleText(title, fullText);
      titleTimer = window.setTimeout(() => {
        renderLandingTitleText(title, fullText, { showPrompt: true });
        title.classList.remove("landing-entry__title--typing");
        title.classList.add("landing-entry__title--prompt");
        titleTimer = window.setTimeout(() => {
          renderLandingTitleText(title, fullText);
          title.classList.remove("landing-entry__title--prompt");
        }, TITLE_PROMPT_BLINK_DURATION_MS);
      }, 700);
    };

    tick();
  }

  function isViewportEligible() {
    return window.innerWidth >= 1024;
  }

  function shouldShow() {
    if (!isRootArchivePath()) {
      return false;
    }

    if (!isViewportEligible()) {
      return false;
    }

    if (dismissed) {
      return false;
    }

    return true;
  }

  function playLandingVideo({ reset = false } = {}) {
    const video = landingEntryVideo();

    if (!video) {
      return;
    }

    video.playbackRate = 0.8;

    if (reset) {
      video.currentTime = 0;
    }

    const playPromise = video.play();
    if (playPromise && typeof playPromise.catch === "function") {
      playPromise.catch(() => {});
    }
  }

  function setSearchActive(isActive) {
    landingSearchField()?.classList.toggle("landing-entry__search-field--active", isActive);
  }

  function setSearchPending(isPending, { defaultPlaceholder, pendingPlaceholder }) {
    const field = landingSearchField();
    const input = landingSearchInput();

    field?.classList.toggle("landing-entry__search-field--searching", isPending);

    if (!input) {
      return;
    }

    input.placeholder = isPending ? pendingPlaceholder : defaultPlaceholder;
  }

  function complete() {
    const section = landingEntrySection();

    if (!section || section.hidden) {
      return;
    }

    window.history.replaceState({}, "", window.ArchiveRoutes.buildArchiveHomePath());
    dismissed = true;
    stopLandingTitleAnimation({ revealFullText: true });

    window.clearTimeout(exitTimer);
    document.body.classList.add("landing-entry-exit");
    exitTimer = window.setTimeout(() => {
      section.hidden = true;
      document.body.classList.remove("has-landing-entry", "landing-entry-exit");
      document.body.style.removeProperty("overflow");
      window.scrollTo({ top: 0, behavior: "auto" });
      emitStateChange();
    }, 90);
  }

  function dismissImmediately() {
    const section = landingEntrySection();

    if (!section) {
      return;
    }

    window.history.replaceState({}, "", window.ArchiveRoutes.buildArchiveHomePath());
    dismissed = true;

    window.clearTimeout(exitTimer);
    stopLandingTitleAnimation({ revealFullText: true });
    section.hidden = true;
    document.body.classList.remove("has-landing-entry", "landing-entry-exit");
    document.body.style.removeProperty("overflow");
    emitStateChange();
  }

  function syncVisibility(mode = "list") {
    const section = landingEntrySection();

    if (!section) {
      return;
    }

    section.hidden = !shouldShow() || mode !== "list";
    document.body.classList.toggle("has-landing-entry", !section.hidden);

    if (!section.hidden) {
      document.body.classList.remove("landing-entry-exit");
      window.clearTimeout(exitTimer);
      stopLandingTitleAnimation();
      startLandingTitleAnimation();
      playLandingVideo({ reset: true });
      emitStateChange();
      return;
    }

    landingEntryVideo()?.pause();
    stopLandingTitleAnimation({ revealFullText: true });
    document.body.classList.remove("landing-entry-exit");
    document.body.style.removeProperty("overflow");
    emitStateChange();
  }

  function bindControls() {
    if (entryBound) {
      return;
    }

    document.querySelector("[data-scroll-to-archive='true']")?.addEventListener("click", () => {
      complete();
    });

    const video = landingEntryVideo();
    if (video) {
      video.addEventListener("loadedmetadata", () => {
        if (document.body.classList.contains("has-landing-entry")) {
          playLandingVideo({ reset: true });
        }
      });
    }

    window.addEventListener("resize", () => {
      if (!isViewportEligible() && document.body.classList.contains("has-landing-entry")) {
        complete();
        return;
      }
    });

    entryBound = true;
  }

  window.MainLanding = {
    bindControls,
    complete,
    dismissImmediately,
    isDismissed: () => dismissed,
    isViewportEligible,
    setDismissed(value) {
      dismissed = Boolean(value);
    },
    setSearchActive,
    setSearchPending,
    syncVisibility,
    elements: {
      searchField: landingSearchField,
      searchInput: landingSearchInput,
      searchSubmit: landingSearchSubmit,
      section: landingEntrySection,
      title: landingEntryTitle,
      video: landingEntryVideo,
    },
  };
})();
