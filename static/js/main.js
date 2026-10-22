// BibTeX copy button.
(function () {
  var copy = document.getElementById("copy-bib");
  if (copy && navigator.clipboard) {
    copy.addEventListener("click", function () {
      var text = document.getElementById("bib-text").textContent;
      navigator.clipboard.writeText(text).then(function () {
        copy.textContent = "Copied";
        setTimeout(function () { copy.textContent = "Copy"; }, 1500);
      });
    });
  } else if (copy) {
    copy.hidden = true;
  }
})();
