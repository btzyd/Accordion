// Budget explorer and BibTeX copy button.
(function () {
  // Figures from the paper: Accordion-Base 37-task overall (full_table_overall),
  // TPOT at 8K / batch 1 (tables/data/runtime.csv), Accordion-RL AIME 2024.
  var BUDGETS = [
    { name: "Low",    k: 0,  base: 46.96, tpot: 2.644, aime: 34.58 },
    { name: "Medium", k: 3,  base: 48.41, tpot: 2.925, aime: 39.79 },
    { name: "High",   k: 6,  base: 49.37, tpot: 3.239, aime: 40.83 },
    { name: "XHigh",  k: 9,  base: 49.64, tpot: 3.643, aime: 45.21 },
    { name: "Ultra",  k: 12, base: 49.61, tpot: 3.965, aime: 45.21 }
  ];
  var WINDOW_START = 7, WINDOW_END = 18, LAYERS = 24;

  var tabs = document.getElementById("budget-tabs");
  var path = document.getElementById("path");
  if (!tabs || !path) return;

  function el(tag, cls, text) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text != null) e.textContent = text;
    return e;
  }

  function signed(v, digits, unit) {
    if (Math.abs(v) < 1e-9) return "";
    return (v > 0 ? "+" : "−") + Math.abs(v).toFixed(digits) + unit;
  }

  function render(i) {
    var b = BUDGETS[i], b0 = BUDGETS[0];
    Array.prototype.forEach.call(tabs.children, function (btn, j) {
      btn.setAttribute("aria-pressed", j === i ? "true" : "false");
    });

    path.textContent = "";
    for (var l = 1; l <= LAYERS; l++) {
      var inWindow = l >= WINDOW_START && l <= WINDOW_END;
      var looped = inWindow && l < WINDOW_START + b.k;
      var col = el("div", "layer" + (inWindow ? " window" : "") + (looped ? " looped" : "") +
        (l === 1 || l === WINDOW_START || l === WINDOW_END || l === LAYERS ? " edge" : ""));
      var cells = el("div", "cells");
      if (looped) {
        cells.appendChild(el("span", "cell first"));
        cells.appendChild(el("span", "cell second"));
      } else {
        cells.appendChild(el("span", "cell"));
      }
      col.appendChild(cells);
      col.appendChild(el("span", "idx", String(l)));
      path.appendChild(col);
    }

    document.getElementById("r-exec").textContent = String(LAYERS + b.k);
    document.getElementById("d-exec").textContent = signed(b.k, 0, "");
    document.getElementById("r-base").textContent = b.base.toFixed(2);
    document.getElementById("d-base").textContent = signed(b.base - b0.base, 2, " pp");
    document.getElementById("r-tpot").textContent = b.tpot.toFixed(2);
    document.getElementById("d-tpot").textContent =
      b.k ? "+" + ((b.tpot / b0.tpot - 1) * 100).toFixed(0) + "%" : "";
    document.getElementById("r-aime").textContent = b.aime.toFixed(2);
    document.getElementById("d-aime").textContent = signed(b.aime - b0.aime, 2, " pp");
  }

  BUDGETS.forEach(function (b, i) {
    var btn = el("button", null, b.name);
    btn.type = "button";
    btn.appendChild(el("small", null, "k=" + b.k));
    btn.addEventListener("click", function () { render(i); });
    tabs.appendChild(btn);
  });
  render(2);

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
