(() => {
  const root = document.querySelector("[data-design-archive]");

  if (!root) {
    return;
  }

  const collections = [
    {
      id: "andromeda",
      title: "Andromeda Archive",
      titleLines: ["Andromeda", "Archive"],
      summary:
        "디자인 실험들을 별자리 노드처럼 배치한 탐색형 아카이브입니다. 드래그로 이동하고, 휠로 확대해서 각 specimen을 관측하세요.",
      meta: "Constellation map",
      status: "Active",
      stats: [
        [String(root.querySelectorAll(".archive-card").length), "Specimens"],
        [String(root.querySelectorAll(".star-node").length), "Primary nodes"],
        ["∞", "Paths"],
      ],
    },
    {
      id: "orion",
      title: "Orion Studies",
      titleLines: ["Orion", "Studies"],
      summary: "레이아웃, 밀도, 방향성을 비교하는 design study collection 예정 영역입니다.",
      meta: "Collection slot",
      status: "Planned",
      disabled: true,
      stats: [
        ["0", "Specimens"],
        ["0", "Primary nodes"],
        ["-", "Paths"],
      ],
    },
    {
      id: "lyra",
      title: "Lyra Motion",
      titleLines: ["Lyra", "Motion"],
      summary: "전환, 초점 이동, hover 반응을 따로 모으는 motion collection 예정 영역입니다.",
      meta: "Collection slot",
      status: "Planned",
      disabled: true,
      stats: [
        ["0", "Specimens"],
        ["0", "Primary nodes"],
        ["-", "Paths"],
      ],
    },
  ];

  const collectionList = root.querySelector("[data-design-collection-list]");
  const collectionTitle = root.querySelector("[data-design-collection-title]");
  const collectionSummary = root.querySelector("[data-design-collection-summary]");
  const collectionStats = root.querySelector("[data-design-collection-stats]");
  let activeCollectionId = "andromeda";

  function escapeHtml(value) {
    return String(value).replace(
      /[&<>'"]/g,
      (ch) =>
        ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          "'": "&#39;",
          '"': "&quot;",
        })[ch],
    );
  }

  function collectionById(collectionId) {
    return collections.find((collection) => collection.id === collectionId) || collections[0];
  }

  function renderCollectionList() {
    if (!collectionList) {
      return;
    }

    collectionList.innerHTML = collections
      .map((collection) => {
        const isActive = collection.id === activeCollectionId;
        const disabled = collection.disabled ? "disabled" : "";
        const current = isActive ? 'aria-current="page"' : "";

        return `
          <button
            class="collection-list__item"
            data-design-collection-id="${escapeHtml(collection.id)}"
            type="button"
            ${disabled}
            ${current}
          >
            <span class="collection-list__name">${escapeHtml(collection.title)}</span>
            <span class="collection-list__meta">
              <span>${escapeHtml(collection.meta)}</span>
              <span>${escapeHtml(collection.status)}</span>
            </span>
          </button>
        `;
      })
      .join("");
  }

  function renderCollectionHeader(collection) {
    if (collectionTitle) {
      collectionTitle.innerHTML = collection.titleLines.map(escapeHtml).join("<br />");
    }

    if (collectionSummary) {
      collectionSummary.textContent = collection.summary;
    }

    if (collectionStats) {
      collectionStats.innerHTML = collection.stats
        .map(
          ([value, label]) =>
            `<div class="stat"><strong>${escapeHtml(value)}</strong><span>${escapeHtml(label)}</span></div>`,
        )
        .join("");
    }
  }

  function selectCollection(collectionId) {
    const collection = collectionById(collectionId);

    if (collection.disabled) {
      return;
    }

    activeCollectionId = collection.id;
    renderCollectionHeader(collection);
    renderCollectionList();
    window.dispatchEvent(
      new CustomEvent("design:collection-change", {
        detail: {
          collectionId: collection.id,
        },
      }),
    );
    window.dispatchEvent(new CustomEvent("design:reset"));
  }

  collectionList?.addEventListener("click", (event) => {
    const item = event.target.closest("[data-design-collection-id]");

    if (!item) {
      return;
    }

    selectCollection(item.dataset.designCollectionId);
  });

  selectCollection(activeCollectionId);

  window.DesignArchiveController = {
    collections: () => collections.map((collection) => ({ ...collection })),
    selectCollection,
  };
})();
