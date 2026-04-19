(() => {
  let entryBound = false;
  let progress = 0;
  let exitTimer = null;
  let dismissed = false;
  let titleTimer = null;

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
    return window.location.pathname === "/" || window.location.pathname.endsWith("/index.html");
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

  function renderLandingTitleText(title, text, { showPrompt = false, animateLastChar = false } = {}) {
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

    if (animateLastChar && text.length > 1) {
      title.append(document.createTextNode(text.slice(0, -1)));
      const lastChar = document.createElement("span");
      lastChar.className = "landing-entry__title-char landing-entry__title-char--fresh";
      lastChar.textContent = text.slice(-1);
      title.append(lastChar);
    } else {
      title.append(document.createTextNode(text));
    }

    if (showPrompt) {
      const prompt = document.createElement("span");
      prompt.className = "landing-entry__title-prompt";
      prompt.textContent = "_";
      title.append(prompt);
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
    titleTimer = null;

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
        }, 1760);
      }, 700);
    };

    tick();
  }

  function isBypassRequested(url = currentArchiveUrl()) {
    return url.searchParams.get("entry") === "archive";
  }

  function isViewportEligible() {
    return window.innerWidth >= 1024;
  }

  function shouldShow(url = currentArchiveUrl()) {
    if (!isRootArchivePath()) {
      return false;
    }

    if (!isViewportEligible()) {
      return false;
    }

    if (dismissed || isBypassRequested(url)) {
      return false;
    }

    const blockingParams = ["category", "collection", "note", "view"];
    return blockingParams.every((key) => !url.searchParams.has(key));
  }

  function setProgress(nextProgress) {
    const section = landingEntrySection();
    const video = landingEntryVideo();

    progress = Math.max(0, Math.min(1, nextProgress));

    if (!section || section.hidden) {
      return;
    }

    const fadeProgress = Math.max(0, (progress - 0.7) / 0.3);
    const contentOpacity = Math.max(0, 1 - fadeProgress * 1.12);
    const contentShift = `${Math.min(30, fadeProgress * 30)}px`;

    section.style.setProperty("--landing-entry-fade", String(0.18 + fadeProgress * 0.82));
    section.style.setProperty("--landing-entry-content-opacity", String(contentOpacity));
    section.style.setProperty("--landing-entry-content-shift", contentShift);

    if (Number.isFinite(video?.duration) && video.duration > 0) {
      video.currentTime = video.duration * progress;
    }
  }

  function syncScrollProgress() {
    const section = landingEntrySection();

    if (!section || section.hidden) {
      return;
    }

    setProgress(progress);
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

    const url = new URL(window.location.href);
    url.searchParams.set("entry", "archive");
    window.history.replaceState({}, "", url);
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

    const url = new URL(window.location.href);
    url.searchParams.set("entry", "archive");
    window.history.replaceState({}, "", url);
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
      progress = 0;
      syncScrollProgress();
      stopLandingTitleAnimation();
      startLandingTitleAnimation();
      emitStateChange();
      return;
    }

    stopLandingTitleAnimation({ revealFullText: true });
    section.style.removeProperty("--landing-entry-fade");
    section.style.removeProperty("--landing-entry-content-opacity");
    section.style.removeProperty("--landing-entry-content-shift");
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
      video.addEventListener("loadedmetadata", syncScrollProgress);
    }

    window.addEventListener(
      "wheel",
      (event) => {
        if (!document.body.classList.contains("has-landing-entry")) {
          return;
        }

        event.preventDefault();
        setProgress(progress + event.deltaY / 420);

        if (progress >= 1) {
          complete();
        }
      },
      { passive: false },
    );

    window.addEventListener("resize", () => {
      if (!isViewportEligible() && document.body.classList.contains("has-landing-entry")) {
        complete();
        return;
      }

      syncScrollProgress();
    });

    entryBound = true;
  }

  window.MainLanding = {
    bindControls,
    complete,
    dismissImmediately,
    isBypassRequested,
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
