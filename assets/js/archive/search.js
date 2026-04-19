(() => {
  const DEFAULT_SEARCH_DEBOUNCE_MS = 250;

  function normalizeSearchText(value) {
    return String(value || "")
      .normalize("NFKC")
      .toLowerCase();
  }

  function createController({
    beginRenderRequest,
    clearActiveTag,
    clearSidebarSelection,
    completeLanding,
    dismissLandingImmediately,
    fallbackSearchFilters,
    fallbackSearchPattern,
    getArchiveState,
    getLandingInput,
    getLandingSubmit,
    getTopbarInput,
    isLandingActive,
    onLandingSearchActive,
    onLandingSearchPending,
    renderArchiveEmptyState,
    renderArchivePage,
    renderPopularTags,
    renderSelection,
    scopeLabel,
    sortNotes,
    updateArchiveLocation,
  }) {
    let controlBound = false;
    let debounceTimer = null;

    function searchPattern() {
      const archiveState = getArchiveState();
      return archiveState.searchIndex.tokenizer?.pattern || fallbackSearchPattern;
    }

    function tokenizeSearchQuery(value) {
      const archiveState = getArchiveState();
      const normalized = normalizeSearchText(value);
      const matches = normalized.match(searchPattern()) || [];
      const filters = archiveState.searchIndex.tokenizer?.filters || fallbackSearchFilters;
      const stopwords = new Set(filters.englishStopwords || []);

      return [...new Set(matches)].filter((token) => {
        if (filters.excludeNumericOnly && /^\d+$/.test(token)) {
          return false;
        }

        if (filters.excludeSingleCharacter && token.length <= 1) {
          return false;
        }

        if (stopwords.has(token)) {
          return false;
        }

        return true;
      });
    }

    function matchingNoteIdsForQuery(query) {
      const archiveState = getArchiveState();
      const tokens = tokenizeSearchQuery(query);
      const matchedIds = new Set();

      tokens.forEach((token) => {
        const noteIds = archiveState.searchIndex.terms[token] || [];

        noteIds.forEach((noteId) => {
          matchedIds.add(noteId);
        });
      });

      return {
        matchedIds,
        tokens,
      };
    }

    function searchNotesForSelection(query, category, collection) {
      const archiveState = getArchiveState();
      const { matchedIds, tokens } = matchingNoteIdsForQuery(query);

      if (tokens.length === 0) {
        return {
          notes: [],
          tokens,
        };
      }

      return {
        notes: sortNotes(
          archiveState.allNotes.filter((note) => {
            if (!matchedIds.has(note.id)) {
              return false;
            }

            if (category && note.category !== category) {
              return false;
            }

            if (collection && note.collection !== collection) {
              return false;
            }

            return true;
          }),
        ),
        tokens,
      };
    }

    function searchSummary(query, count, category, collection) {
      return `${count} results for "${query}" in ${scopeLabel(category, collection)}.`;
    }

    async function renderSearchResults(query) {
      const archiveState = getArchiveState();
      const trimmedQuery = query.trim();
      const requestId = beginRenderRequest();

      archiveState.searchQuery = trimmedQuery;
      archiveState.activeTag = null;
      renderPopularTags();

      if (archiveState.searchIndexUnavailable) {
        renderArchiveEmptyState(
          "Search unavailable",
          "The generated search index is unavailable, so archive search cannot run right now.",
          "Search",
        );
        return;
      }

      const { notes } = searchNotesForSelection(
        trimmedQuery,
        archiveState.category,
        archiveState.collection,
      );

      if (requestId !== archiveState.__renderRequestId()) {
        return;
      }

      archiveState.notes = notes;
      archiveState.page = 1;
      archiveState.activeNotePath = null;

      const title = "Search Results";
      const summary = searchSummary(
        trimmedQuery,
        notes.length,
        archiveState.category,
        archiveState.collection,
      );

      if (notes.length === 0) {
        renderArchiveEmptyState(title, summary, "Search");
        renderPopularTags();
        return;
      }

      renderArchivePage();
      renderPopularTags();
    }

    function applySearchInputValue(value) {
      const archiveState = getArchiveState();
      const nextQuery = value.trim();

      if (!nextQuery) {
        archiveState.searchQuery = "";
        renderSelection({
          category: archiveState.category,
          collection: archiveState.collection,
        }).then(() => {
          updateArchiveLocation({ replace: false });
        });
        return;
      }

      if (archiveState.activeTag) {
        clearSidebarSelection();
        archiveState.category = null;
        archiveState.collection = null;
        clearActiveTag();
      }

      renderSearchResults(nextQuery).then(() => {
        updateArchiveLocation({ replace: false });
      });
    }

    function submitSearchValue(value, { fromLanding = false, fromTopbar = false } = {}) {
      window.clearTimeout(debounceTimer);
      const nextQuery = value.trim();

      if (fromLanding) {
        onLandingSearchPending(Boolean(nextQuery));
      }

      if (fromTopbar && nextQuery && isLandingActive()) {
        dismissLandingImmediately();
      } else if (fromLanding && nextQuery && isLandingActive()) {
        completeLanding();
      }

      applySearchInputValue(value);
    }

    function bindControls() {
      if (controlBound) {
        return;
      }

      getTopbarInput()?.addEventListener("input", (event) => {
        window.clearTimeout(debounceTimer);
        const nextValue = event.target.value;
        debounceTimer = window.setTimeout(() => {
          submitSearchValue(nextValue, { fromTopbar: true });
        }, DEFAULT_SEARCH_DEBOUNCE_MS);
      });

      getLandingInput()?.addEventListener("input", (event) => {
        const nextValue = event.target.value;

        window.clearTimeout(debounceTimer);
        onLandingSearchActive(Boolean(nextValue.trim()));
        onLandingSearchPending(false);
      });

      getLandingInput()?.addEventListener("keydown", (event) => {
        if (event.key !== "Enter") {
          return;
        }

        submitSearchValue(event.currentTarget.value, { fromLanding: true });
      });

      getLandingSubmit()?.addEventListener("click", () => {
        submitSearchValue(getLandingInput()?.value || "", { fromLanding: true });
      });

      controlBound = true;
    }

    return {
      bindControls,
      renderSearchResults,
    };
  }

  window.ArchiveSearch = {
    createController,
  };
})();
