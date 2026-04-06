function renderPageFooter(mount) {
  mount.innerHTML = `
<div class="page-watermark">
<p class="archive-footer__credit page-watermark__credit">Curated by CHOCHEETAH © 2026</p>
</div>`;
}

function initializePageFooters() {
  const mounts = document.querySelectorAll("[data-page-footer]");

  mounts.forEach(renderPageFooter);
}

initializePageFooters();
