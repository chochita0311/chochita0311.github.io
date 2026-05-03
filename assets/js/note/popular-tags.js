(() => {
  function buildPopularTags(notes) {
    const tagCounts = new Map();

    notes.forEach((note) => {
      [...new Set(note.tags)].forEach((tag) => {
        tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1);
      });
    });

    return [...tagCounts.entries()]
      .filter(([, count]) => count >= 5)
      .sort((left, right) => {
        if (right[1] !== left[1]) {
          return right[1] - left[1];
        }

        return left[0].localeCompare(right[0]);
      })
      .map(([tag, count]) => ({ tag, count }));
  }

  function createController({
    clearSidebarSelection,
    dismissLandingForShellInteraction,
    escapeHtml,
    mount,
    notesForSelection,
    prettifyTag,
    renderArchivePage,
    state,
    updateArchiveLocation,
  }) {
    function renderPopularTags() {
      const mountElement = mount();

      if (!mountElement) {
        return;
      }

      const tags = buildPopularTags(state.allNotes);

      if (tags.length === 0) {
        mountElement.innerHTML =
          '<span class="note-detail__rail-empty">No repeated tags yet.</span>';
        return;
      }

      mountElement.innerHTML = tags
        .map(
          ({ tag, count }) => `
<button class="tag-chip${state.activeTag === tag ? " tag-chip--active" : ""}" type="button" data-popular-tag="${escapeHtml(tag)}">
<span>${escapeHtml(prettifyTag(tag))}</span>
<span class="tag-chip__count">${String(count)}</span>
</button>`,
        )
        .join("");

      mountElement.querySelectorAll("[data-popular-tag]").forEach((button) => {
        button.addEventListener("click", () => {
          dismissLandingForShellInteraction();
          state.activeTag = button.dataset.popularTag;
          state.category = null;
          state.collection = null;
          state.activeNotePath = null;
          state.page = 1;
          clearSidebarSelection();

          const notes = notesForSelection(null, null);
          state.notes = notes;
          renderArchivePage();
          renderPopularTags();
          updateArchiveLocation({ replace: false });
        });
      });
    }

    return {
      buildPopularTags,
      renderPopularTags,
    };
  }

  window.NoteArchivePopularTags = {
    buildPopularTags,
    createController,
  };
})();
