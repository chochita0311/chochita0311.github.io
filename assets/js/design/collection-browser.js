(() => {
  const root = document.querySelector("[data-design-collection-browser]");

  if (!root) {
    return;
  }

  const getById = (id) => root.querySelector(`#${id}`);

  const WORLD_W = 3000;
  const WORLD_H = 1800;
  const MIN_SCALE = 0.36;
  const MAX_SCALE = 1.88;
  const TRAVEL_MIN_DURATION_MS = 880;
  const TRAVEL_MAX_DURATION_MS = 2600;
  const TRAVEL_MS_PER_WORLD_PIXEL = 0.88;
  const TRAVEL_FOCUS_ANCHOR = { centerX: 0.62, centerY: 0.52 };
  const ROUTE_TRACE_TAIL_MIN = 420;
  const ROUTE_TRACE_TAIL_MAX = 920;
  const ROUTE_TRACE_TAIL_RATIO = 0.58;
  const ROUTE_TRACE_DURATION_MULTIPLIER = 1.6;
  const ROUTE_TRACE_CLEAR_DELAY_MS = 180;

  const nodes = [
    {
      id: "mirach",
      star: "Mirach",
      node: "01",
      x: 1520,
      y: 835,
      cardX: 1705,
      cardY: 785,
      code: "SPATIAL UI / 2026.01",
      title: "Ambient Interface Matrix 01",
      desc: "어플리케이션 창과 읽기 환경 사이의 경계를 depth, tonal layering, measured motion으로 흐리게 만드는 실험.",
      stage: "Specimen",
      complexity: "Foundational",
      tags: ["Golden reel", "Orbit slide", "Node 01"],
      thumb:
        "radial-gradient(circle at 64% 36%, rgba(255,217,117,.72), transparent 13%), radial-gradient(ellipse at 56% 58%, rgba(255,196,79,.7), transparent 22%), linear-gradient(135deg, rgba(150,120,72,.72), rgba(31,42,57,.86) 48%, rgba(9,13,22,.96))",
    },
    {
      id: "alpheratz",
      star: "Alpheratz",
      node: "02",
      x: 1090,
      y: 850,
      cardX: 870,
      cardY: 770,
      code: "VIZ-02 / 2025.09",
      title: "Data Galaxy 02",
      desc: "관계형 데이터를 궤도와 성단 구조로 시각화하는 archive visualization study.",
      stage: "Prototype",
      complexity: "Intermediate",
      tags: ["Data", "Map", "Systems"],
      thumb:
        "radial-gradient(circle at 54% 48%, rgba(255,206,121,.86), transparent 5%), radial-gradient(ellipse at 48% 50%, rgba(93,131,211,.40), transparent 16%), conic-gradient(from 55deg at 50% 50%, rgba(255,214,139,.0), rgba(255,214,139,.45), rgba(72,104,180,.24), rgba(255,214,139,.0)), linear-gradient(135deg, #1a2338, #090d16)",
    },
    {
      id: "almach",
      star: "Almach",
      node: "03",
      x: 1830,
      y: 590,
      cardX: 1990,
      cardY: 520,
      code: "MIN-03 / 2025.02",
      title: "Minimal Surface 03",
      desc: "여백, 타이포그래피, 톤만으로 인터페이스 표면을 정리하는 미니멀 스터디.",
      stage: "Review",
      complexity: "Low",
      tags: ["Minimal", "Space", "Type"],
      thumb:
        "linear-gradient(160deg, rgba(233,238,250,.38), transparent 19%), radial-gradient(circle at 72% 20%, rgba(255,224,166,.32), transparent 18%), linear-gradient(135deg, #252b37, #07101f 70%)",
    },
    {
      id: "delta",
      star: "Delta",
      node: "04",
      x: 1660,
      y: 1190,
      cardX: 1700,
      cardY: 1430,
      code: "TON-01 / 2025.07",
      title: "Tonal Study 01",
      desc: "하나의 색상군 안에서 레이어, 대비, 흐림을 통해 깊이를 만드는 실험.",
      stage: "Specimen",
      complexity: "Foundational",
      tags: ["Color", "Depth", "Mood"],
      thumb:
        "linear-gradient(15deg, rgba(255,210,116,.25), transparent 35%), radial-gradient(ellipse at 65% 44%, rgba(255,220,150,.28), transparent 22%), linear-gradient(160deg, #4a4a39, #071120 62%, #05080f)",
    },
    {
      id: "tau",
      star: "Tau",
      node: "05",
      x: 2160,
      y: 430,
      cardX: 2175,
      cardY: 350,
      code: "TYPO-05 / 2025.12",
      title: "Typographic Orbit 05",
      desc: "텍스트 블록을 회전 좌표계에 놓고 시선 흐름을 비교하는 typography motion study.",
      stage: "Draft",
      complexity: "High",
      tags: ["Type", "Orbit", "Layout"],
      thumb:
        "repeating-linear-gradient(120deg, rgba(255,255,255,.16) 0 2px, transparent 2px 17px), radial-gradient(circle at 62% 38%, rgba(255,205,97,.38), transparent 18%), linear-gradient(135deg, #19253a, #060a12)",
    },
    {
      id: "upsilon",
      star: "Upsilon",
      node: "06",
      x: 2450,
      y: 700,
      cardX: 2570,
      cardY: 695,
      code: "INT-04 / 2026.02",
      title: "Interaction Flow 04",
      desc: "사용자 여정을 직선 플로우가 아닌 branching constellation으로 표현하는 interaction sketch.",
      stage: "Prototype",
      complexity: "Intermediate",
      tags: ["Flow", "UX", "Journey"],
      thumb:
        "radial-gradient(circle at 30% 36%, rgba(255,215,111,.55), transparent 9%), radial-gradient(circle at 70% 62%, rgba(151,188,255,.35), transparent 11%), linear-gradient(135deg, #233552, #070d18)",
    },
    {
      id: "iota",
      star: "Iota",
      node: "07",
      x: 2280,
      y: 1040,
      cardX: 2380,
      cardY: 1260,
      code: "GLASS-07 / 2025.10",
      title: "Glass Layer 07",
      desc: "투명 패널과 배경 흐림을 사용해 카드를 공간 위에 띄우는 glass interface study.",
      stage: "Specimen",
      complexity: "Intermediate",
      tags: ["Glass", "Blur", "Layer"],
      thumb:
        "linear-gradient(135deg, rgba(255,255,255,.18), transparent 22%), radial-gradient(circle at 68% 38%, rgba(255,222,152,.34), transparent 18%), linear-gradient(145deg, #193052, #060a12)",
    },
    {
      id: "kappa",
      star: "Kappa",
      node: "08",
      x: 1990,
      y: 1200,
      cardX: 2090,
      cardY: 1425,
      code: "GRID-08 / 2025.03",
      title: "Flexible Grid 08",
      desc: "콘텐츠 밀도에 따라 변형되는 카드형 그리드와 focal area를 테스트한 레이아웃 실험.",
      stage: "Draft",
      complexity: "Foundational",
      tags: ["Grid", "Cards", "Responsive"],
      thumb:
        "linear-gradient(90deg, rgba(255,255,255,.10) 1px, transparent 1px), linear-gradient(0deg, rgba(255,255,255,.10) 1px, transparent 1px), linear-gradient(135deg, #1b2c45, #080d16)",
    },
    {
      id: "mu",
      star: "Mu",
      node: "09",
      x: 1300,
      y: 1150,
      cardX: 1125,
      cardY: 1375,
      code: "MOD-01 / 2025.06",
      title: "Module System 01",
      desc: "반복 가능한 UI 모듈을 설계하고 조합 규칙을 아카이브화하는 시스템 작업.",
      stage: "System",
      complexity: "High",
      tags: ["System", "Module", "Rule"],
      thumb:
        "radial-gradient(circle at 28% 68%, rgba(255,214,107,.45), transparent 11%), linear-gradient(90deg, rgba(220,235,255,.14) 1px, transparent 1px), linear-gradient(135deg, #1a273d, #060b14)",
    },
    {
      id: "nu",
      star: "Nu",
      node: "10",
      x: 980,
      y: 1280,
      cardX: 820,
      cardY: 1510,
      code: "NOISE-10 / 2025.05",
      title: "Noise Texture 10",
      desc: "플랫한 다크 UI에 미세한 질감과 필름 그레인을 얹어 깊이를 조절하는 연구.",
      stage: "Specimen",
      complexity: "Low",
      tags: ["Texture", "Depth", "Mood"],
      thumb:
        "radial-gradient(circle at 42% 50%, rgba(255,217,128,.28), transparent 17%), repeating-radial-gradient(circle, rgba(255,255,255,.10) 0 1px, transparent 1px 7px), linear-gradient(135deg, #16243a, #050911)",
    },
    {
      id: "xi",
      star: "Xi",
      node: "11",
      x: 730,
      y: 1040,
      cardX: 680,
      cardY: 1230,
      code: "BIO-01 / 2025.11",
      title: "Biomimicry Patterns 01",
      desc: "자연의 패턴과 표면 구조를 인터페이스 그리드에 적용해보는 시각 실험.",
      stage: "Study",
      complexity: "Intermediate",
      tags: ["Pattern", "Nature", "Grid"],
      thumb:
        "repeating-linear-gradient(100deg, rgba(235,240,255,.35) 0 4px, transparent 4px 16px), radial-gradient(circle at 70% 22%, rgba(255,214,107,.24), transparent 15%), linear-gradient(135deg, #33404e, #07101d)",
    },
    {
      id: "zeta",
      star: "Zeta",
      node: "12",
      x: 700,
      y: 690,
      cardX: 620,
      cardY: 630,
      code: "PANEL-12 / 2025.01",
      title: "Floating Panel 12",
      desc: "고정 패널과 이동 가능한 맵 캔버스 사이의 레이어 충돌을 줄이는 UI 스터디.",
      stage: "Prototype",
      complexity: "Intermediate",
      tags: ["Panel", "Map", "Layer"],
      thumb:
        "linear-gradient(135deg, rgba(255,255,255,.18), transparent 24%), radial-gradient(circle at 50% 50%, rgba(146,188,255,.28), transparent 28%), linear-gradient(135deg, #1a2941, #060a12)",
    },
    {
      id: "eta",
      star: "Eta",
      node: "13",
      x: 990,
      y: 510,
      cardX: 1035,
      cardY: 420,
      code: "REEL-13 / 2025.08",
      title: "Golden Reel 13",
      desc: "황금비율에 가까운 focal card와 주변 preview card의 거리감을 조절한 carousel study.",
      stage: "Specimen",
      complexity: "Foundational",
      tags: ["Golden", "Reel", "Ratio"],
      thumb:
        "radial-gradient(circle at 62% 38%, rgba(255,214,107,.58), transparent 16%), conic-gradient(from 130deg at 48% 54%, rgba(255,214,107,.20), transparent, rgba(130,170,255,.18), transparent), linear-gradient(135deg, #26344c, #060a13)",
    },
    {
      id: "pi",
      star: "Pi",
      node: "14",
      x: 1320,
      y: 430,
      cardX: 1430,
      cardY: 330,
      code: "MOTION-14 / 2026.03",
      title: "Measured Motion 14",
      desc: "카드가 hover/focus될 때 과하지 않게 반응하도록 scale, glow, delay 값을 찾는 모션 테스트.",
      stage: "Motion",
      complexity: "High",
      tags: ["Motion", "Hover", "Focus"],
      thumb:
        "radial-gradient(circle at 62% 44%, rgba(255,214,107,.54), transparent 14%), linear-gradient(75deg, transparent 0 42%, rgba(255,255,255,.14) 42% 44%, transparent 44% 100%), linear-gradient(135deg, #18253b, #050913)",
    },
    {
      id: "rho",
      star: "Rho",
      node: "15",
      x: 1600,
      y: 300,
      cardX: 1740,
      cardY: 245,
      code: "ARCH-15 / 2024.12",
      title: "Archive Index 15",
      desc: "각 specimen의 메타데이터를 지도, 목록, 검색 인덱스로 동시에 다루는 구조 스케치.",
      stage: "System",
      complexity: "Intermediate",
      tags: ["Archive", "Index", "Meta"],
      thumb:
        "linear-gradient(90deg, rgba(255,255,255,.14) 1px, transparent 1px), radial-gradient(circle at 72% 44%, rgba(255,214,107,.38), transparent 17%), linear-gradient(135deg, #192a43, #060b14)",
    },
    {
      id: "sigma",
      star: "Sigma",
      node: "16",
      x: 2060,
      y: 280,
      cardX: 2220,
      cardY: 215,
      code: "OBS-16 / 2026.04",
      title: "Observation Mode 16",
      desc: "선택된 카드만 밝게 남기고 주변 노드의 정보량을 낮춰 관측감을 주는 상태 디자인.",
      stage: "Review",
      complexity: "Foundational",
      tags: ["Observe", "Focus", "Glow"],
      thumb:
        "radial-gradient(circle at 52% 50%, rgba(255,214,107,.56), transparent 11%), radial-gradient(circle at 52% 50%, rgba(255,214,107,.18), transparent 34%), linear-gradient(135deg, #1b2a40, #050912)",
    },
  ];

  const edges = [
    ["zeta", "eta"],
    ["eta", "pi"],
    ["pi", "rho"],
    ["rho", "sigma"],
    ["eta", "alpheratz"],
    ["zeta", "alpheratz"],
    ["alpheratz", "mirach"],
    ["mirach", "almach"],
    ["almach", "tau"],
    ["tau", "sigma"],
    ["tau", "upsilon"],
    ["upsilon", "iota"],
    ["iota", "kappa"],
    ["kappa", "delta"],
    ["delta", "mu"],
    ["mu", "nu"],
    ["nu", "xi"],
    ["xi", "alpheratz"],
    ["delta", "mirach"],
    ["mu", "alpheratz"],
  ];

  const viewport = getById("viewport");
  const world = getById("world");
  const svg = getById("constellationSvg");
  const nodesLayer = getById("nodesLayer");
  const cardsLayer = getById("cardsLayer");
  const zoomReadout = getById("zoomReadout");
  const cursorTip = getById("cursorTip");
  const selectedTitle = getById("selectedTitle");
  const selectedDesc = getById("selectedDesc");
  const selectedNode = getById("selectedNode");
  const uploadBgBtn = getById("uploadBgBtn");
  const bgFile = getById("bgFile");

  const byId = Object.fromEntries(nodes.map((node) => [node.id, node]));
  const neighborsById = edges.reduce((map, [a, b]) => {
    map[a] = [...(map[a] || []), b];
    map[b] = [...(map[b] || []), a];
    return map;
  }, {});
  let state = { x: 0, y: 0, scale: 0.78 };
  let activeId = "mirach";
  let lockedId = "mirach";
  let dragging = false;
  let dragStart = null;
  let travelFrame = null;
  let travelCleanupTimer = null;

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

  function render() {
    renderConstellation();
    renderNodes();
    renderCards();
    setFocus(activeId, { preserveLock: true });
    fitInitialView();
  }

  function renderConstellation() {
    svg.innerHTML = "";
    const defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
    const filter = document.createElementNS("http://www.w3.org/2000/svg", "filter");
    filter.setAttribute("id", "lineGlow");
    filter.innerHTML = `<feGaussianBlur stdDeviation="3.2" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>`;
    defs.appendChild(filter);
    svg.appendChild(defs);

    edges.forEach(([a, b]) => {
      const na = byId[a];
      const nb = byId[b];
      const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
      line.setAttribute("x1", na.x);
      line.setAttribute("y1", na.y);
      line.setAttribute("x2", nb.x);
      line.setAttribute("y2", nb.y);
      line.dataset.a = a;
      line.dataset.b = b;
      line.classList.add("constellation-line");
      svg.appendChild(line);
    });

    const routeTrace = document.createElementNS("http://www.w3.org/2000/svg", "path");
    routeTrace.setAttribute("id", "routeTrace");
    routeTrace.classList.add("route-trace");
    svg.appendChild(routeTrace);

    const activeConnector = document.createElementNS("http://www.w3.org/2000/svg", "line");
    activeConnector.setAttribute("id", "activeConnector");
    activeConnector.classList.add("active-connector");
    svg.appendChild(activeConnector);
  }

  function renderNodes() {
    nodesLayer.innerHTML = nodes
      .map(
        (node) => `
          <button class="star-node" data-id="${node.id}" style="left:${node.x}px; top:${node.y}px" aria-label="Focus ${escapeHtml(node.title)}">
            <span class="star-label">${escapeHtml(node.star)}</span>
          </button>
        `,
      )
      .join("");
  }

  function renderCards() {
    cardsLayer.innerHTML = nodes
      .map((node, index) => {
        const tags = node.tags.map((tag) => `<span class="tag">${escapeHtml(tag)}</span>`).join("");
        const count = `${String(index + 1).padStart(2, "0")} / ${String(nodes.length).padStart(2, "0")}`;
        return `
            <article class="archive-card" data-id="${node.id}" style="left:${node.cardX}px; top:${node.cardY}px; --thumb:${node.thumb}" tabindex="0" aria-label="${escapeHtml(node.title)}">
              <div class="card-media"><span class="badge">SPECIMEN</span></div>
              <div class="card-body">
                <div class="meta-row"><span>${escapeHtml(node.code)}</span><span>${escapeHtml(count)}</span></div>
                <h3 class="card-title">${escapeHtml(node.title)}</h3>
                <p class="card-desc">${escapeHtml(node.desc)}</p>
                <div class="card-details" aria-hidden="true">
                  <div><span class="detail-label">Stage</span><span class="detail-value">${escapeHtml(node.stage)}</span></div>
                  <div><span class="detail-label">Complexity</span><span class="detail-value">${escapeHtml(node.complexity)}</span></div>
                  <div><span class="detail-label">Node</span><span class="detail-value">${escapeHtml(node.node)}</span></div>
                </div>
                <div class="tag-list">${tags}</div>
              </div>
            </article>
          `;
      })
      .join("");
  }

  function updateWorldTransform() {
    state = clampView(state);
    world.style.transform = `translate(${state.x}px, ${state.y}px) scale(${state.scale})`;
    zoomReadout.textContent = `ZOOM ${Math.round(state.scale * 100)}%`;
  }

  function prefersReducedMotion() {
    return window.matchMedia?.("(prefers-reduced-motion: reduce)").matches === true;
  }

  function lerp(start, end, amount) {
    return start + (end - start) * amount;
  }

  function easeInOutSmooth(amount) {
    return amount * amount * amount * (amount * (amount * 6 - 15) + 10);
  }

  function interpolateView(from, to, amount) {
    return {
      x: lerp(from.x, to.x, amount),
      y: lerp(from.y, to.y, amount),
      scale: lerp(from.scale, to.scale, amount),
    };
  }

  function applyView(view) {
    state = clampView(view);
    updateWorldTransform();
  }

  function viewForPoint(point, scale, { centerX = 0.58, centerY = 0.5 } = {}) {
    const r = viewport.getBoundingClientRect();
    return clampView({
      scale,
      x: r.width * centerX - point.x * scale,
      y: r.height * centerY - point.y * scale,
    });
  }

  function viewForNode(id, scale = Math.max(state.scale, 0.78)) {
    const node = byId[id];
    if (!node) return null;
    return viewForPoint(node, clampScale(scale), TRAVEL_FOCUS_ANCHOR);
  }

  function distanceBetweenPoints(a, b) {
    return Math.hypot(a.x - b.x, a.y - b.y);
  }

  function findShortestNodePath(fromId, toId) {
    if (!byId[fromId] || !byId[toId]) return [];
    if (fromId === toId) return [fromId];

    const unvisited = new Set(nodes.map((node) => node.id));
    const distances = Object.fromEntries(nodes.map((node) => [node.id, Infinity]));
    const previous = {};

    distances[fromId] = 0;

    while (unvisited.size > 0) {
      let current = null;

      unvisited.forEach((id) => {
        if (current === null || distances[id] < distances[current]) {
          current = id;
        }
      });

      if (current === null || distances[current] === Infinity) break;
      if (current === toId) break;

      unvisited.delete(current);

      (neighborsById[current] || []).forEach((next) => {
        if (!unvisited.has(next)) return;

        const nextDistance = distances[current] + distanceBetweenPoints(byId[current], byId[next]);

        if (nextDistance < distances[next]) {
          distances[next] = nextDistance;
          previous[next] = current;
        }
      });
    }

    if (!previous[toId]) {
      return [fromId, toId];
    }

    const path = [toId];
    let cursor = toId;

    while (cursor !== fromId) {
      cursor = previous[cursor];

      if (!cursor) {
        return [fromId, toId];
      }

      path.unshift(cursor);
    }

    return path;
  }

  function routeDistance(route) {
    return route.slice(1).reduce((distance, id, index) => {
      const previous = byId[route[index]];
      const current = byId[id];

      if (!previous || !current) {
        return distance;
      }

      return distance + distanceBetweenPoints(previous, current);
    }, 0);
  }

  function travelDurationForRoute(distance) {
    return Math.min(
      TRAVEL_MAX_DURATION_MS,
      Math.max(TRAVEL_MIN_DURATION_MS, distance * TRAVEL_MS_PER_WORLD_PIXEL),
    );
  }

  function edgeKey(a, b) {
    return [a, b].sort().join("::");
  }

  function routeEdgeKeys(route) {
    return new Set(route.slice(0, -1).map((id, index) => edgeKey(id, route[index + 1])));
  }

  function routePathData(route) {
    return route
      .map((id, index) => {
        const node = byId[id];

        if (!node) {
          return "";
        }

        return `${index === 0 ? "M" : "L"} ${node.x} ${node.y}`;
      })
      .filter(Boolean)
      .join(" ");
  }

  function routeTraceTailLength(distance) {
    return Math.min(
      ROUTE_TRACE_TAIL_MAX,
      Math.max(ROUTE_TRACE_TAIL_MIN, distance * ROUTE_TRACE_TAIL_RATIO),
    );
  }

  function clearTravelVisuals() {
    root.classList.remove("is-map-traveling");
    root.style.removeProperty("--route-travel-duration");
    const routeTrace = getById("routeTrace");

    routeTrace?.classList.remove("is-running");
    routeTrace?.removeAttribute("d");
    routeTrace?.style.removeProperty("--route-dash-end");
    routeTrace?.style.removeProperty("--route-dash-start");
    routeTrace?.style.removeProperty("--route-length");
    routeTrace?.style.removeProperty("--route-tail-length");
    root.querySelectorAll(".is-route, .is-travel-origin, .is-travel-target").forEach((element) => {
      element.classList.remove("is-route", "is-travel-origin", "is-travel-target");
    });
  }

  function markTravelVisuals(fromId, toId, route, traceDuration) {
    const routeKeys = routeEdgeKeys(route);
    const routeTrace = getById("routeTrace");
    const routeLength = routeDistance(route);
    const tailLength = routeTraceTailLength(routeLength);

    root.classList.add("is-map-traveling");
    root.style.setProperty("--route-travel-duration", `${Math.round(traceDuration)}ms`);
    root.querySelectorAll(".constellation-line").forEach((line) => {
      const key = edgeKey(line.dataset.a, line.dataset.b);
      line.classList.toggle("is-route", routeKeys.has(key));
    });
    routeTrace?.setAttribute("d", routePathData(route));
    routeTrace?.style.setProperty("--route-length", String(Math.max(1, routeLength)));
    routeTrace?.style.setProperty("--route-tail-length", String(Math.round(tailLength)));
    routeTrace?.style.setProperty("--route-dash-start", String(Math.round(tailLength)));
    routeTrace?.style.setProperty("--route-dash-end", String(-Math.round(routeLength)));
    routeTrace?.classList.add("is-running");

    root.querySelectorAll(".star-node, .archive-card").forEach((element) => {
      element.classList.toggle("is-travel-origin", element.dataset.id === fromId);
      element.classList.toggle("is-travel-target", element.dataset.id === toId);
    });
  }

  function cancelTravel() {
    if (travelFrame !== null) {
      window.cancelAnimationFrame(travelFrame);
      travelFrame = null;
    }

    if (travelCleanupTimer !== null) {
      window.clearTimeout(travelCleanupTimer);
      travelCleanupTimer = null;
    }

    clearTravelVisuals();
  }

  function setFocus(id, options = {}) {
    if (!byId[id]) return;
    activeId = id;
    const active = byId[id];
    root.querySelectorAll(".star-node").forEach((el) => {
      el.classList.toggle("is-active", el.dataset.id === id);
    });
    root.querySelectorAll(".archive-card").forEach((el) => {
      el.classList.toggle("is-active", el.dataset.id === id);
    });
    root.querySelectorAll(".constellation-line").forEach((line) => {
      const lit = line.dataset.a === id || line.dataset.b === id;
      line.classList.toggle("is-active", lit);
    });
    const connector = getById("activeConnector");
    if (connector) {
      connector.setAttribute("x1", active.x);
      connector.setAttribute("y1", active.y);
      connector.setAttribute("x2", active.cardX);
      connector.setAttribute("y2", active.cardY - (id === "mirach" ? 300 : 155));
    }
    selectedTitle.textContent = active.title;
    selectedDesc.textContent = active.desc;
    selectedNode.textContent = `${active.star} · Node ${active.node}`;
    if (!options.preserveLock) lockedId = id;
  }

  function fitInitialView() {
    const r = viewport.getBoundingClientRect();
    const scale = Math.min(Math.max(r.width / 2280, r.height / 1250), 0.84);
    state.scale = clampScale(scale);
    state.x = r.width * 0.58 - byId[lockedId].x * state.scale;
    state.y = r.height * 0.5 - byId[lockedId].y * state.scale;
    updateWorldTransform();
  }

  function travelToNode(id, targetScale = Math.max(state.scale, 0.86), { fromId = lockedId } = {}) {
    const targetView = viewForNode(id, targetScale);

    if (!targetView) return;

    cancelTravel();

    if (prefersReducedMotion()) {
      applyView(targetView);
      return;
    }

    const fromView = { ...state };
    const route = findShortestNodePath(fromId, id);
    const totalDistance = routeDistance(route);
    const cameraDuration = travelDurationForRoute(totalDistance);
    const traceDuration = cameraDuration * ROUTE_TRACE_DURATION_MULTIPLIER;
    const startedAt = performance.now();

    markTravelVisuals(fromId, id, route, traceDuration);

    const tick = (now) => {
      const elapsed = Math.min((now - startedAt) / cameraDuration, 1);
      const travelProgress = easeInOutSmooth(elapsed);

      applyView(interpolateView(fromView, targetView, travelProgress));

      if (elapsed < 1) {
        travelFrame = window.requestAnimationFrame(tick);
        return;
      }

      travelFrame = null;
      applyView(targetView);
      travelCleanupTimer = window.setTimeout(
        () => {
          travelCleanupTimer = null;
          clearTravelVisuals();
        },
        Math.max(
          ROUTE_TRACE_CLEAR_DELAY_MS,
          traceDuration - cameraDuration + ROUTE_TRACE_CLEAR_DELAY_MS,
        ),
      );
    };

    travelFrame = window.requestAnimationFrame(tick);
  }

  function clampScale(value) {
    return Math.min(MAX_SCALE, Math.max(minScaleForViewport(), value));
  }

  function minScaleForViewport() {
    const rect = viewport.getBoundingClientRect();

    return Math.max(MIN_SCALE, rect.width / WORLD_W, rect.height / WORLD_H);
  }

  function clampView(view) {
    const rect = viewport.getBoundingClientRect();
    const scale = clampScale(view.scale);
    const scaledWidth = WORLD_W * scale;
    const scaledHeight = WORLD_H * scale;
    const minX = Math.min(0, rect.width - scaledWidth);
    const minY = Math.min(0, rect.height - scaledHeight);
    const maxX = 0;
    const maxY = 0;

    return {
      scale,
      x: Math.min(maxX, Math.max(minX, view.x)),
      y: Math.min(maxY, Math.max(minY, view.y)),
    };
  }

  function zoomAt(clientX, clientY, factor) {
    const r = viewport.getBoundingClientRect();
    const mx = clientX - r.left;
    const my = clientY - r.top;
    const worldX = (mx - state.x) / state.scale;
    const worldY = (my - state.y) / state.scale;
    const nextScale = clampScale(state.scale * factor);
    state.x = mx - worldX * nextScale;
    state.y = my - worldY * nextScale;
    state.scale = nextScale;
    updateWorldTransform();
  }

  function centerZoom(factor) {
    cancelTravel();
    const r = viewport.getBoundingClientRect();
    zoomAt(r.left + r.width / 2, r.top + r.height / 2, factor);
  }

  function isInteractiveTarget(target) {
    return Boolean(target.closest(".archive-card, .star-node, .controls, .panel-actions"));
  }

  viewport.addEventListener("pointerdown", (event) => {
    if (isInteractiveTarget(event.target)) return;
    cancelTravel();
    dragging = true;
    dragStart = { clientX: event.clientX, clientY: event.clientY, x: state.x, y: state.y };
    try {
      viewport.setPointerCapture(event.pointerId);
    } catch {
      // Synthetic pointer events and cancelled drags may not have an active capture target.
    }
  });

  viewport.addEventListener("pointermove", (event) => {
    if (!dragging) return;
    const dx = event.clientX - dragStart.clientX;
    const dy = event.clientY - dragStart.clientY;
    state.x = dragStart.x + dx;
    state.y = dragStart.y + dy;
    updateWorldTransform();
  });

  viewport.addEventListener("pointerup", (event) => {
    dragging = false;
    try {
      viewport.releasePointerCapture(event.pointerId);
    } catch {
      // Pointer capture may already be released after a cancelled drag.
    }
  });

  viewport.addEventListener("pointercancel", () => {
    dragging = false;
  });

  viewport.addEventListener(
    "wheel",
    (event) => {
      event.preventDefault();
      cancelTravel();
      const factor = Math.exp(-event.deltaY * 0.0012);
      zoomAt(event.clientX, event.clientY, factor);
    },
    { passive: false },
  );

  nodesLayer.addEventListener(
    "mouseenter",
    (event) => {
      const node = event.target.closest(".star-node");
      if (!node) return;
      if (root.classList.contains("is-map-traveling")) return;
      setFocus(node.dataset.id, { preserveLock: true });
      showTip(event.clientX, event.clientY, "click to lock focus");
    },
    true,
  );

  cardsLayer.addEventListener(
    "mouseenter",
    (event) => {
      const card = event.target.closest(".archive-card");
      if (!card) return;
      if (root.classList.contains("is-map-traveling")) return;
      setFocus(card.dataset.id, { preserveLock: true });
      showTip(event.clientX, event.clientY, "click to open / lock");
    },
    true,
  );

  [nodesLayer, cardsLayer].forEach((layer) => {
    layer.addEventListener("mousemove", (event) => {
      if (cursorTip.classList.contains("is-visible")) {
        cursorTip.style.left = `${event.clientX}px`;
        cursorTip.style.top = `${event.clientY}px`;
      }
    });
    layer.addEventListener("mouseleave", () => {
      if (root.classList.contains("is-map-traveling")) return;
      hideTip();
      setFocus(lockedId, { preserveLock: true });
    });
  });

  function onSelectNode(id) {
    const fromId = lockedId;
    lockedId = id;
    setFocus(id, { preserveLock: true });
    travelToNode(id, Math.max(state.scale, 0.86), { fromId });
  }

  function resetMap() {
    cancelTravel();
    lockedId = "mirach";
    setFocus(lockedId, { preserveLock: true });
    fitInitialView();
  }

  nodesLayer.addEventListener("click", (event) => {
    const node = event.target.closest(".star-node");
    if (!node) return;
    onSelectNode(node.dataset.id);
  });

  cardsLayer.addEventListener("click", (event) => {
    const card = event.target.closest(".archive-card");
    if (!card) return;
    onSelectNode(card.dataset.id);
    // 실제 사이트에서는 여기에서 location.href = `/archive/design/${card.dataset.id}/`; 같은 식으로 연결하면 됩니다.
  });

  cardsLayer.addEventListener("keydown", (event) => {
    if (event.key !== "Enter" && event.key !== " ") return;
    const card = event.target.closest(".archive-card");
    if (!card) return;
    event.preventDefault();
    onSelectNode(card.dataset.id);
  });

  function showTip(x, y, text) {
    cursorTip.textContent = text;
    cursorTip.style.left = `${x}px`;
    cursorTip.style.top = `${y}px`;
    cursorTip.classList.add("is-visible");
  }

  function hideTip() {
    cursorTip.classList.remove("is-visible");
  }

  getById("zoomInBtn").addEventListener("click", () => centerZoom(1.18));
  getById("zoomOutBtn").addEventListener("click", () => centerZoom(1 / 1.18));
  getById("resetBtn").addEventListener("click", resetMap);
  getById("resetBtn2").addEventListener("click", resetMap);
  getById("tourBtn").addEventListener("click", () => travelToNode(activeId, 0.96));

  if (uploadBgBtn && bgFile) {
    uploadBgBtn.addEventListener("click", () => bgFile.click());
    bgFile.addEventListener("change", () => {
      const file = bgFile.files && bgFile.files[0];
      if (!file) return;
      const url = URL.createObjectURL(file);
      world.style.setProperty("--bg-image", `url("${url}")`);
    });
  }

  window.addEventListener("resize", () => {
    updateWorldTransform();
  });
  window.addEventListener("design:reset", resetMap);

  render();
})();
