(() => {
  try {
    const holdTarget = window.sessionStorage?.getItem("chochita:topbar-hold");

    if (holdTarget === "design" || holdTarget === "notes") {
      document.documentElement.dataset.topbarHold = holdTarget;
    }

    if (window.sessionStorage?.getItem("chochita:notes-return-entry") === "true") {
      document.documentElement.dataset.notesReturn = "true";
    }
  } catch {
    // Ignore storage failures; the shell should still render normally.
  }
})();
