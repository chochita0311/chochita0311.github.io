const LOCAL_DB_DIR = "../../../docs/tables/localdb";
const LOCAL_POST_FILE = `${LOCAL_DB_DIR}/mst_post.json`;

const refs = {
  title: document.getElementById("detail-title"),
  date: document.getElementById("detail-date"),
  body: document.getElementById("detail-body"),
  breadcrumbTitle: document.getElementById("detail-breadcrumb-title"),
  breadcrumbFolder: document.getElementById("detail-breadcrumb-folder"),
};

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  }[char]));
}

function formatDate(value) {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return new Intl.DateTimeFormat("en-US", { year: "numeric", month: "short", day: "2-digit" }).format(date);
}

async function fetchJson(url) {
  const response = await fetch(url, { headers: { Accept: "application/json" }, cache: "no-cache" });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return response.json();
}

function setDetail(post) {
  const title = post.title || "Untitled";
  const date = post.reg_dt || post.published_at || post.upd_dt || "";
  const body = post.body_md || "";

  document.title = `Play-Talk | ${title}`;
  if (refs.title) refs.title.textContent = title;
  if (refs.breadcrumbTitle) refs.breadcrumbTitle.textContent = title;
  if (refs.date) refs.date.textContent = formatDate(date);
  if (refs.breadcrumbFolder) refs.breadcrumbFolder.textContent = "My Notes";
  if (refs.body) refs.body.textContent = body;
}

function setError(message) {
  if (refs.title) refs.title.textContent = "Note Detail";
  if (refs.date) refs.date.textContent = "-";
  if (refs.body) refs.body.textContent = message;
}

async function init() {
  const params = new URLSearchParams(location.search);
  const postId = params.get("post_id") || params.get("id");

  try {
    const payload = await fetchJson(LOCAL_POST_FILE);
    const rows = Array.isArray(payload?.rows) ? payload.rows : [];
    let post = null;

    if (postId) {
      post = rows.find((row) => String(row.post_id) === String(postId));
    }

    if (!post) {
      post = rows.find((row) => Number(row.board_id) === 2 && String(row.post_status || "").toUpperCase() !== "DELETED");
    }

    if (!post) {
      throw new Error("Post not found");
    }

    setDetail(post);
  } catch (error) {
    setError(`Failed to load note (${error.message})`);
  }
}

init();
