(() => {
  const PREVIEW_IMAGE = "/assets/og-cheetah.jpg";
  const TOTAL_CARDS = 20;
  const WHEEL_DELAY_MS = 420;
  const DRAG_THRESHOLD_PX = 44;

  const cards = Array.from({ length: TOTAL_CARDS }, (_, index) => {
    const number = index + 1;
    const padded = String(number).padStart(2, "0");
    const categories = ["Spatial UI", "Editorial System", "Interaction", "Archive Pattern"];
    const stages = ["Specimen", "Draft", "Review", "Prototype"];
    const complexities = ["Foundational", "Intermediate", "Advanced", "Focused"];

    return {
      id: `design-specimen-${padded}`,
      title: `Ambient Interface Matrix ${padded}`,
      summary:
        "An exploration into dissolving boundaries between application windows and the reading environment through depth, tonal layering, and measured motion.",
      category: categories[index % categories.length],
      updated: `2026.${String((index % 12) + 1).padStart(2, "0")}`,
      stage: stages[index % stages.length],
      complexity: complexities[index % complexities.length],
      previewSrc: PREVIEW_IMAGE,
      previewAlt: `Abstract dark editorial preview for design specimen ${padded}`,
      tags: ["golden reel", "orbit slide", `node ${padded}`],
    };
  });

  const positions = {
    "-3": {
      state: "secondary",
      x: "-42%",
      y: "-34%",
      scale: "0.58",
      rotate: "-9deg",
      opacity: "0.22",
      z: "12",
      blur: "0.6",
    },
    "-2": {
      state: "secondary",
      x: "-55%",
      y: "-13%",
      scale: "0.68",
      rotate: "-7deg",
      opacity: "0.42",
      z: "20",
      blur: "0.2",
    },
    "-1": {
      state: "adjacent",
      x: "-43%",
      y: "8%",
      scale: "0.82",
      rotate: "-4deg",
      opacity: "0.72",
      z: "34",
      blur: "0",
    },
    0: {
      state: "active",
      x: "0%",
      y: "0%",
      scale: "1",
      rotate: "0deg",
      opacity: "1",
      z: "50",
      blur: "0",
    },
    1: {
      state: "adjacent",
      x: "43%",
      y: "-7%",
      scale: "0.82",
      rotate: "4deg",
      opacity: "0.72",
      z: "34",
      blur: "0",
    },
    2: {
      state: "secondary",
      x: "56%",
      y: "-27%",
      scale: "0.68",
      rotate: "7deg",
      opacity: "0.42",
      z: "20",
      blur: "0.2",
    },
    3: {
      state: "secondary",
      x: "38%",
      y: "-44%",
      scale: "0.58",
      rotate: "9deg",
      opacity: "0.22",
      z: "12",
      blur: "0.6",
    },
  };

  const hiddenPosition = {
    state: "offstage",
    x: "0%",
    y: "0%",
    scale: "0.5",
    rotate: "0deg",
    opacity: "0",
    z: "0",
    blur: "1",
  };

  const root = document.querySelector("[data-design-browser]");

  if (!root) {
    return;
  }

  const cardRoot = root.querySelector("[data-design-cards]");
  const stage = root.querySelector("[data-design-stage]");
  const previousButton = root.querySelector("[data-design-previous]");
  const nextButton = root.querySelector("[data-design-next]");
  const indexLabel = root.querySelector("[data-design-index]");
  const status = root.querySelector("[data-design-status]");
  const rail = root.querySelector("[data-design-rail]");
  let activeIndex = 0;
  let lastWheelTime = 0;
  let dragStartX = null;
  let pointerId = null;

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function cardMarkup(card, index) {
    const tags = card.tags
      .map((tag) => `<span class="design-card__tag">${escapeHtml(tag)}</span>`)
      .join("");

    return `
<article class="design-card" data-card-index="${String(index)}" aria-hidden="true">
  <div class="design-card__media">
    <img alt="${escapeHtml(card.previewAlt)}" src="${escapeHtml(card.previewSrc)}" />
    <div class="design-card__badge">
      <span class="design-card__badge-dot"></span>
      <span class="design-card__badge-text">${escapeHtml(card.stage)}</span>
    </div>
  </div>
  <div class="design-card__body">
    <div class="design-card__meta">
      <span>${escapeHtml(card.category)}</span>
      <span aria-hidden="true">/</span>
      <span>${escapeHtml(card.updated)}</span>
    </div>
    <h2 class="design-card__title">${escapeHtml(card.title)}</h2>
    <p class="design-card__summary">${escapeHtml(card.summary)}</p>
    <div class="design-card__facts" aria-label="Design card facts">
      <div class="design-card__fact">
        <span class="design-card__fact-label">Stage</span>
        <span class="design-card__fact-value">${escapeHtml(card.stage)}</span>
      </div>
      <div class="design-card__fact">
        <span class="design-card__fact-label">Complexity</span>
        <span class="design-card__fact-value">${escapeHtml(card.complexity)}</span>
      </div>
      <div class="design-card__fact">
        <span class="design-card__fact-label">Node</span>
        <span class="design-card__fact-value">${escapeHtml(String(index + 1).padStart(2, "0"))}</span>
      </div>
    </div>
    <div class="design-card__tags" aria-label="Design card tags">${tags}</div>
  </div>
</article>`;
  }

  function railMarkup() {
    return cards
      .map(
        (_, index) =>
          `<span class="design-position-rail__dot" data-rail-index="${String(index)}"></span>`,
      )
      .join("");
  }

  function clampIndex(index) {
    return Math.min(Math.max(index, 0), cards.length - 1);
  }

  function positionFor(relativeIndex) {
    return positions[String(relativeIndex)] || hiddenPosition;
  }

  function applyCardPosition(element, relativeIndex) {
    const position = positionFor(relativeIndex);
    element.dataset.state = position.state;
    element.style.setProperty("--design-card-x", position.x);
    element.style.setProperty("--design-card-y", position.y);
    element.style.setProperty("--design-card-scale", position.scale);
    element.style.setProperty("--design-card-rotate", position.rotate);
    element.style.setProperty("--design-card-opacity", position.opacity);
    element.style.setProperty("--design-card-z", position.z);
    element.style.setProperty("--design-card-blur", position.blur);
    element.setAttribute("aria-hidden", relativeIndex === 0 ? "false" : "true");
  }

  function updateControls() {
    previousButton.disabled = activeIndex === 0;
    nextButton.disabled = activeIndex === cards.length - 1;
    indexLabel.textContent = `${String(activeIndex + 1).padStart(2, "0")} / ${String(cards.length).padStart(2, "0")}`;
    status.textContent = `Showing design specimen ${String(activeIndex + 1)} of ${String(cards.length)}.`;
    rail.querySelectorAll("[data-rail-index]").forEach((dot, index) => {
      dot.classList.toggle("design-position-rail__dot--active", index === activeIndex);
    });
  }

  function renderState() {
    cardRoot.querySelectorAll("[data-card-index]").forEach((element) => {
      const cardIndex = Number.parseInt(element.dataset.cardIndex, 10);
      applyCardPosition(element, cardIndex - activeIndex);
    });
    updateControls();
  }

  function goTo(index) {
    const nextIndex = clampIndex(index);

    if (nextIndex === activeIndex) {
      return;
    }

    activeIndex = nextIndex;
    renderState();
  }

  function goNext() {
    goTo(activeIndex + 1);
  }

  function goPrevious() {
    goTo(activeIndex - 1);
  }

  function resetBrowser() {
    goTo(0);
    stage.focus({ preventScroll: true });
  }

  function handleWheel(event) {
    if (Math.abs(event.deltaY) < 16 && Math.abs(event.deltaX) < 16) {
      return;
    }

    const now = Date.now();

    if (now - lastWheelTime < WHEEL_DELAY_MS) {
      event.preventDefault();
      return;
    }

    lastWheelTime = now;
    event.preventDefault();

    if (event.deltaY > 0 || event.deltaX > 0) {
      goNext();
    } else {
      goPrevious();
    }
  }

  function handlePointerDown(event) {
    dragStartX = event.clientX;
    pointerId = event.pointerId;
    stage.setPointerCapture?.(pointerId);
  }

  function handlePointerUp(event) {
    if (dragStartX === null) {
      return;
    }

    const deltaX = event.clientX - dragStartX;
    dragStartX = null;

    if (pointerId !== null) {
      stage.releasePointerCapture?.(pointerId);
      pointerId = null;
    }

    if (Math.abs(deltaX) < DRAG_THRESHOLD_PX) {
      return;
    }

    if (deltaX < 0) {
      goNext();
    } else {
      goPrevious();
    }
  }

  cardRoot.innerHTML = cards.map(cardMarkup).join("");
  rail.innerHTML = railMarkup();
  renderState();

  previousButton.addEventListener("click", goPrevious);
  nextButton.addEventListener("click", goNext);
  stage.addEventListener("wheel", handleWheel, { passive: false });
  stage.addEventListener("pointerdown", handlePointerDown);
  stage.addEventListener("pointerup", handlePointerUp);
  stage.addEventListener("pointercancel", () => {
    dragStartX = null;
    pointerId = null;
  });
  stage.addEventListener("keydown", (event) => {
    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      event.preventDefault();
      goNext();
    } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      event.preventDefault();
      goPrevious();
    }
  });
  window.addEventListener("design:reset", resetBrowser);
})();
