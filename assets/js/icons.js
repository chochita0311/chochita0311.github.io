(function attachAppIcons(global) {
  const ICONS = {
    navigation: {
      expand: "expand_more",
      next: "chevron_right",
      previous: "chevron_left",
      breadcrumb: "chevron_right",
      search: "search",
    },
    actions: {
      copy: "content_copy",
      share: "ios_share",
      bookmark: "bookmark",
      more: "more_horiz",
      tags: "sell",
    },
    categories: {
      english: "menu_book",
      technology: "memory",
      fallback: "folder",
    },
  };

  function escapeAttribute(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/"/g, "&quot;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  function renderIcon(name, options = {}) {
    const classes = ["icon", "icon--material", "material-symbols-outlined"];

    if (options.className) {
      classes.push(options.className);
    }

    const attributes = [`class="${classes.join(" ")}"`];

    if (options.decorative !== false) {
      attributes.push('aria-hidden="true"');
    }

    return `<span ${attributes.join(" ")}>${escapeAttribute(name)}</span>`;
  }

  global.AppIcons = {
    ICONS,
    renderIcon,
  };
})(window);
