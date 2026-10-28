/* Corner Shelf — everything on the pages is generated from js/data.js */
(function () {
  "use strict";

  var S = window.SITE;
  var P = (window.PRODUCTS || []).slice();
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var byId = function (id) { return P.filter(function (p) { return p.id === id; })[0]; };
  var esc = function (s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  };
  var pad = function (n, w) { n = String(n); while (n.length < (w || 2)) n = "0" + n; return n; };
  var money = function (n) { return S.currency + new Intl.NumberFormat(S.locale).format(n); };
  // "/images/x.jpg" and "images/x.jpg" both work, also when the site is opened as a local file
  var src = function (path) { return String(path).replace(/^\/+/, ""); };

  /* Numbering and defaults are derived, so the data file stays simple. */
  var NUM_W = Math.max(2, String(P.length).length);
  P.forEach(function (p, i) {
    p.no = pad(i + 1, NUM_W);
    p.images = Array.isArray(p.images) ? p.images.filter(Boolean) : [];
    p.category = p.category || "";
  });
  var total = function (p) { return Math.max(1, p.images.length); };

  var categories = [];
  P.forEach(function (p) { if (p.category && categories.indexOf(p.category) < 0) categories.push(p.category); });

  /* ---------- WhatsApp enquiry ---------- */

  function waUrl(msg) { return "https://wa.me/" + S.whatsapp + "?text=" + encodeURIComponent(msg); }

  function orderUrl(p) {
    return waUrl("Hi! I'm interested in the " + p.name + " priced at " + S.currency + p.price +
      ". Could you please share more details?");
  }

  var ICON = '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">' +
    '<path d="M4 20l1.3-4.2A8 8 0 1 1 8.3 18.8L4 20z"/>' +
    '<path d="M9.3 9c.2 2.4 2.5 4.6 4.8 5"/></svg>';

  function orderBtn(p, extra) {
    return '<a class="btn btn--order' + (extra || "") + '" href="' + orderUrl(p) +
      '" target="_blank" rel="noopener noreferrer" aria-label="ORDER NOW: ' + esc(p.name) +
      ' (opens WhatsApp in a new tab)">' + ICON + '<span>ORDER NOW</span></a>';
  }

  /* ---------- Photo slot ----------
     A labelled placeholder sits underneath. The photo covers it when the file
     exists; if the file is missing the <img> removes itself and the placeholder
     stays, so there is never a broken-image icon. */
  function plate(p, ratio, i, badge) {
    i = i || 0;
    var n = total(p), file = p.images[i];
    return '<div class="plate" style="--tone:' + (p.tone || "#DCD3C1") + ';--ratio:' + ratio + '">' +
      '<div class="ph" aria-hidden="true"><span>No. ' + p.no + '</span><span>Photo to come' +
      (n > 1 ? '<br>' + pad(i + 1) + ' / ' + pad(n) : '') + '</span></div>' +
      (file ? '<img src="' + esc(src(file)) + '" alt="' + esc(p.name) + (n > 1 ? " — photo " + (i + 1) + " of " + n : "") +
        '" loading="lazy" decoding="async" onerror="this.remove()">' : '') +
      (badge && n > 1 ? '<span class="count">' + pad(n) + ' photos</span>' : '') +
      '</div>';
  }

  /* ---------- Product details modal with gallery ---------- */

  var dlg, cur = null, idx = 0, opener = null;

  function buildModal() {
    dlg = document.createElement("dialog");
    dlg.className = "pm";
    document.body.appendChild(dlg);

    dlg.addEventListener("click", function (e) {
      if (e.target === dlg) { dlg.close(); return; }
      var t = e.target.closest("[data-pm-close],[data-pm-prev],[data-pm-next],[data-pm-thumb]");
      if (!t) return;
      if (t.hasAttribute("data-pm-close")) dlg.close();
      else if (t.hasAttribute("data-pm-prev")) show(idx - 1);
      else if (t.hasAttribute("data-pm-next")) show(idx + 1);
      else show(parseInt(t.getAttribute("data-pm-thumb"), 10));
    });

    dlg.addEventListener("keydown", function (e) {
      if (!cur || total(cur) < 2) return;
      if (e.key === "ArrowLeft") { e.preventDefault(); show(idx - 1); }
      else if (e.key === "ArrowRight") { e.preventDefault(); show(idx + 1); }
    });

    // swipe on the main photo
    var x0 = null;
    dlg.addEventListener("touchstart", function (e) {
      x0 = e.target.closest(".pm-stage") && e.touches.length === 1 ? e.touches[0].clientX : null;
    }, { passive: true });
    dlg.addEventListener("touchend", function (e) {
      if (x0 === null || !cur || total(cur) < 2) return;
      var dx = e.changedTouches[0].clientX - x0; x0 = null;
      if (Math.abs(dx) > 45) show(idx + (dx < 0 ? 1 : -1));
    }, { passive: true });

    dlg.addEventListener("close", function () {
      document.body.classList.remove("no-scroll");
      cur = null;
      if (opener && opener.focus && document.contains(opener)) opener.focus();
      opener = null;
    });
  }

  function show(i) {
    if (!cur) return;
    var n = total(cur);
    idx = ((i % n) + n) % n;
    $("#pm-main").innerHTML = plate(cur, "var(--pm-ratio)", idx).replace('loading="lazy"', 'loading="eager"');
    var c = $("#pm-count");
    if (c) c.textContent = pad(idx + 1) + " / " + pad(n);
    $$("[data-pm-thumb]", dlg).forEach(function (b, k) {
      var on = k === idx;
      b.classList.toggle("is-on", on);
      if (on) { b.setAttribute("aria-current", "true"); } else { b.removeAttribute("aria-current"); }
    });
    var strip = $("#pm-thumbs"), act = $('[data-pm-thumb="' + idx + '"]', dlg);
    if (strip && act) strip.scrollLeft = act.offsetLeft - (strip.clientWidth - act.offsetWidth) / 2;
  }

  function openModal(id, trigger) {
    var p = byId(id);
    if (!p || typeof dlg.showModal !== "function") return false;
    cur = p; idx = 0; opener = trigger || document.activeElement;
    var n = total(p), multi = n > 1, thumbs = "";
    if (multi) {
      for (var k = 0; k < n; k++) {
        thumbs += '<button type="button" class="pm-thumb" data-pm-thumb="' + k + '" aria-label="Show photo ' + (k + 1) + ' of ' + n + '">' +
          '<span class="pm-thumb-n" aria-hidden="true">' + pad(k + 1) + '</span>' +
          (p.images[k] ? '<img src="' + esc(src(p.images[k])) + '" alt="" loading="lazy" decoding="async" onerror="this.remove()">' : '') +
          '</button>';
      }
    }
    dlg.setAttribute("aria-label", p.name);
    dlg.innerHTML =
      '<div class="pm-bar"><span class="label">No. ' + p.no + (p.category ? ' · ' + esc(p.category) : '') + '</span>' +
      '<button type="button" class="textlink" data-pm-close>Close</button></div>' +
      '<div class="pm-grid">' +
        '<div class="pm-gallery">' +
          '<div class="pm-stage"><div id="pm-main"></div>' +
            (multi ? '<button type="button" class="pm-nav pm-prev" data-pm-prev aria-label="Previous photo"><span aria-hidden="true">←</span></button>' +
              '<button type="button" class="pm-nav pm-next" data-pm-next aria-label="Next photo"><span aria-hidden="true">→</span></button>' +
              '<span class="pm-count" id="pm-count" aria-live="polite"></span>' : '') +
          '</div>' +
          (multi ? '<div class="pm-thumbs" id="pm-thumbs" role="group" aria-label="Photos of ' + esc(p.name) + '">' + thumbs + '</div>' : '') +
        '</div>' +
        '<div class="pm-text">' +
          '<div><h2>' + esc(p.name) + '</h2>' +
          '<p class="pm-price">' + money(p.price) + '</p>' +
          '<p class="desc">' + esc(p.description || "") + '</p></div>' +
          '<div class="pm-buy">' + orderBtn(p, " btn--block") + '</div>' +
        '</div>' +
      '</div>';
    show(0);
    document.body.classList.add("no-scroll");
    dlg.showModal();
    dlg.scrollTop = 0;
    var cb = $("[data-pm-close]", dlg);
    if (cb) cb.focus();
    return true;
  }

  document.addEventListener("click", function (e) {
    var v = e.target.closest("[data-view]");
    if (!v || e.metaKey || e.ctrlKey || e.shiftKey || e.button) return;
    if (openModal(v.getAttribute("data-view"), v)) e.preventDefault();
  });

  /* ---------- Shared pieces ---------- */

  function card(p, ratio, extraClass) {
    return '<article class="' + extraClass + '" id="' + esc(p.id) + '">' +
      '<div class="top label"><span>No. ' + p.no + '</span><span>' + esc(p.category) + '</span></div>' +
      '<a class="view" href="#' + esc(p.id) + '" data-view="' + esc(p.id) + '" aria-label="View details: ' + esc(p.name) + '">' +
        plate(p, ratio, 0, true) + '</a>' +
      '<div class="body"><h2><a href="#' + esc(p.id) + '" data-view="' + esc(p.id) + '">' + esc(p.name) + '</a></h2>' +
      '<p class="desc">' + esc(p.description || "") + '</p>' +
      '<button type="button" class="textlink more" data-view="' + esc(p.id) + '">View details</button>' +
      '<div class="buy"><span class="price">' + money(p.price) + '</span>' + orderBtn(p) + '</div></div></article>';
  }

  /* ---------- Pages ---------- */

  function home() {
    var feat = P.filter(function (p) { return p.featured; });
    if (!feat.length) feat = P.slice(0, 5);
    var lead = feat[0], rest = feat.slice(1, 5);

    var fig = $("#hero-fig");
    if (lead) {
      fig.innerHTML =
        '<a class="view" href="shop.html#' + esc(lead.id) + '" data-view="' + esc(lead.id) + '" aria-label="View details: ' + esc(lead.name) + '">' +
          plate(lead, "4 / 5", 0, true) + '</a>' +
        '<div class="figcap"><span class="label">No. ' + lead.no + (lead.category ? ' · ' + esc(lead.category) : '') + '</span>' +
        '<div class="cap-row"><a class="nm" href="shop.html#' + esc(lead.id) + '" data-view="' + esc(lead.id) + '">' + esc(lead.name) + '</a>' +
        '<span class="price">' + money(lead.price) + '</span></div>' + orderBtn(lead, " btn--block") + '</div>';
    } else { fig.hidden = true; }

    // categories come from the data
    var cl = $("#cat-list");
    if (categories.length) {
      cl.innerHTML = categories.map(function (c, i) {
        var n = P.filter(function (p) { return p.category === c; }).length;
        return '<li><a href="shop.html?category=' + encodeURIComponent(c) + '"><span class="no">' + pad(i + 1) + '</span>' +
          '<span class="nm">' + esc(c) + '</span><span class="pr">' + pad(n) + '</span></a></li>';
      }).join("");
    } else { $("#cat-wrap").hidden = true; }

    var sec = $("#shelf-sec");
    if (!rest.length) { sec.hidden = true; return; }
    $("#shelf").innerHTML = rest.map(function (p, i) {
      return '<article class="shelf-item s' + (i + 1) + '">' +
        '<a class="view" href="shop.html#' + esc(p.id) + '" data-view="' + esc(p.id) + '" aria-label="View details: ' + esc(p.name) + '">' +
          plate(p, ["4 / 5", "1 / 1", "4 / 3", "3 / 4"][i], 0, true) + '</a>' +
        '<div class="shelf-cap"><span class="label">No. ' + p.no + (p.category ? ' · ' + esc(p.category) : '') + '</span>' +
        '<h3><a href="shop.html#' + esc(p.id) + '" data-view="' + esc(p.id) + '">' + esc(p.name) + '</a></h3>' +
        '<p>' + esc(p.description || "") + '</p>' +
        '<div class="buy"><span class="price">' + money(p.price) + '</span>' + orderBtn(p) + '</div></div></article>';
    }).join("");
  }

  function shop() {
    var fbar = $("#filters"), grid = $("#catalogue"), count = $("#shop-count");
    var active = "";
    try { active = new URLSearchParams(location.search).get("category") || ""; } catch (e) {}
    if (categories.indexOf(active) < 0) active = "";

    function draw() {
      var list = P.filter(function (p) { return !active || p.category === active; });
      grid.innerHTML = list.map(function (p) { return card(p, "4 / 5", "item"); }).join("");
      count.textContent = pad(list.length, NUM_W) + (list.length === 1 ? " product" : " products");
      $$("button[data-cat]", fbar).forEach(function (b) {
        b.setAttribute("aria-pressed", b.getAttribute("data-cat") === active ? "true" : "false");
      });
    }

    if (categories.length > 1) {
      fbar.innerHTML = '<span class="label">Show</span>' +
        ["All"].concat(categories).map(function (c) {
          var v = c === "All" ? "" : c;
          return '<button type="button" data-cat="' + esc(v) + '" aria-pressed="false">' + esc(c) + '</button>';
        }).join("");
      fbar.addEventListener("click", function (e) {
        var b = e.target.closest("button[data-cat]");
        if (!b) return;
        active = b.getAttribute("data-cat");
        try {
          history.replaceState(null, "", active ? "?category=" + encodeURIComponent(active) : location.pathname);
        } catch (err) {}
        draw();
      });
    } else { fbar.hidden = true; }

    draw();
    if (location.hash.length > 1) {
      var t = document.getElementById(decodeURIComponent(location.hash.slice(1)));
      if (t) t.scrollIntoView();
    }
  }

  function about() {
    var n = String(S.whatsapp), pretty = "+" + n.slice(0, 2) + " " + n.slice(2, 7) + " " + n.slice(7);
    var rows = [["WhatsApp", '<a href="https://wa.me/' + n + '" target="_blank" rel="noopener noreferrer">' + pretty + '</a>']];
    if (S.email) rows.push(["Email", '<a href="mailto:' + esc(S.email) + '">' + esc(S.email) + '</a>']);
    if (S.instagram) rows.push(["Instagram", '<a href="' + esc(S.instagram) + '">' + esc(S.instagram.replace(/^https?:\/\/(www\.)?/, "")) + '</a>']);
    $("#contact-list").innerHTML = rows.map(function (r) {
      return "<dt>" + r[0] + '</dt><dd style="margin:0">' + r[1] + "</dd>";
    }).join("");
  }

  document.addEventListener("DOMContentLoaded", function () {
    buildModal();
    var page = document.body.getAttribute("data-page");
    if (page === "home") home();
    if (page === "shop") shop();
    if (page === "about") about();
    $$("[data-year]").forEach(function (el) { el.textContent = "© " + new Date().getFullYear() + " " + S.name; });
    $$("[data-wa]").forEach(function (el) {
      el.href = waUrl("Hi! I'd like to know more about " + S.name + ".");
      el.target = "_blank"; el.rel = "noopener noreferrer";
    });
  });
})();
