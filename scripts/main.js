/**
 * drift-yaw site interactions
 */
(function () {
  "use strict";

  const cfg = window.DRIFT_YAW || {};

  // ── Apply brand CSS vars from config ─────────────────────
  function applyBrand() {
    if (!cfg.brand) return;
    const root = document.documentElement;
    if (cfg.brand.accent) root.style.setProperty("--accent-rgb", cfg.brand.accent);
    if (cfg.brand.accentIce) root.style.setProperty("--ice-rgb", cfg.brand.accentIce);
  }

  // ── Wire external links from config ──────────────────────
  function applyLinks() {
    const links = cfg.links || {};
    document.querySelectorAll("[data-link]").forEach((el) => {
      const key = el.getAttribute("data-link");
      if (links[key]) {
        if (el.tagName === "A") el.href = links[key];
      }
    });
  }

  // ── Render purchase panel from config ────────────────────
  function renderPricing() {
    const pricing = cfg.pricing;
    const panel = document.getElementById("buy-panel");
    if (!pricing || !panel) return;

    const currency = pricing.currency || "€";
    const price = String(pricing.price || "0");
    const name = pricing.name || "Lifetime";
    const period = pricing.period || "lifetime";
    const blurb = pricing.blurb || "";
    const cta = pricing.cta || "Purchase";
    const badge = pricing.badge || "Neverlose";
    const version = cfg.product?.version || "DEBUG 7";
    const purchaseHref = cfg.links?.purchase || "#";

    const includes = (pricing.includes || [])
      .map((group) => {
        const items = (group.items || [])
          .map((item) => `<li><span class="buy-check" aria-hidden="true"></span>${escapeHtml(item)}</li>`)
          .join("");
        return `
          <div class="buy-group">
            <h4>${escapeHtml(group.title || "")}</h4>
            <ul>${items}</ul>
          </div>`;
      })
      .join("");

    const notes = (pricing.notes || [])
      .map((n) => `<li>${escapeHtml(n)}</li>`)
      .join("");

    panel.innerHTML = `
      <div class="buy-panel__glow" aria-hidden="true"></div>
      <div class="buy-panel__main">
        <div class="buy-offer">
          <div class="buy-meta">
            <span class="buy-badge">${escapeHtml(badge)}</span>
            <span class="buy-version">${escapeHtml(version)}</span>
          </div>
          <p class="buy-plan">${escapeHtml(name)}</p>
          <div class="buy-price" data-price="lifetime">
            <span class="buy-amount"><span class="buy-currency">${escapeHtml(currency)}</span>${escapeHtml(price)}</span>
            <span class="buy-period">${escapeHtml(period)}</span>
          </div>
          <p class="buy-blurb">${escapeHtml(blurb)}</p>
          <a class="btn btn-primary buy-cta" href="${escapeAttr(purchaseHref)}" data-link="purchase">
            ${escapeHtml(cta)}
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </a>
          ${notes ? `<ul class="buy-notes">${notes}</ul>` : ""}
        </div>
        <div class="buy-includes">
          <p class="buy-includes-label">Script tabs · debug_7</p>
          <div class="buy-groups">${includes}</div>
        </div>
      </div>`;
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function escapeAttr(str) {
    return escapeHtml(str).replace(/'/g, "&#39;");
  }

  // ── Sticky nav + scroll state ────────────────────────────
  function initNav() {
    const nav = document.getElementById("nav");
    const toggle = document.getElementById("nav-toggle");
    const links = document.getElementById("nav-links");

    function onScroll() {
      if (!nav) return;
      nav.classList.toggle("scrolled", window.scrollY > 24);
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    if (toggle && links) {
      toggle.addEventListener("click", () => {
        const open = links.classList.toggle("open");
        toggle.setAttribute("aria-expanded", open ? "true" : "false");
        document.body.style.overflow = open ? "hidden" : "";
      });

      links.querySelectorAll("a").forEach((a) => {
        a.addEventListener("click", () => {
          links.classList.remove("open");
          toggle.setAttribute("aria-expanded", "false");
          document.body.style.overflow = "";
        });
      });
    }
  }

  // ── Active section highlight ─────────────────────────────
  function initSectionSpy() {
    const sections = document.querySelectorAll("section[id]");
    const navAnchors = document.querySelectorAll(".nav-links a[href^='#']");
    if (!sections.length || !navAnchors.length) return;

    const map = new Map();
    navAnchors.forEach((a) => {
      const id = a.getAttribute("href")?.slice(1);
      if (id) map.set(id, a);
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const id = entry.target.id;
          navAnchors.forEach((a) => a.classList.remove("active"));
          const link = map.get(id);
          if (link) link.classList.add("active");
        });
      },
      { rootMargin: "-40% 0px -50% 0px", threshold: 0 }
    );

    sections.forEach((s) => observer.observe(s));
  }

  // ── Builder tabs (Current State, same controls as script) ─
  function initBuilderTabs() {
    const tabs = document.querySelectorAll(".builder-tab");
    const titleEl = document.getElementById("builder-state-title");
    const tagEl = document.getElementById("builder-state-tag");

    if (!tabs.length) return;

    tabs.forEach((tab) => {
      tab.addEventListener("click", () => {
        const label = tab.getAttribute("data-label") || tab.getAttribute("data-state");

        tabs.forEach((t) => t.setAttribute("aria-selected", "false"));
        tab.setAttribute("aria-selected", "true");

        // Shared control surface for every state (matches script UI)
        if (titleEl) titleEl.textContent = label;
        if (tagEl) tagEl.textContent = "Current State";
      });
    });
  }

  // ── Feature category tabs ────────────────────────────────
  function initFeatureTabs() {
    const tabs = document.querySelectorAll(".feature-tab");
    const panels = document.querySelectorAll(".feature-panel");
    if (!tabs.length) return;

    tabs.forEach((tab) => {
      tab.addEventListener("click", () => {
        const id = tab.getAttribute("data-feature-tab");

        tabs.forEach((t) => t.setAttribute("aria-selected", "false"));
        tab.setAttribute("aria-selected", "true");

        panels.forEach((p) => {
          const match = p.getAttribute("data-feature-panel") === id;
          p.classList.toggle("active", match);
          if (match) {
            p.removeAttribute("hidden");
          } else {
            p.setAttribute("hidden", "");
          }
        });
      });
    });
  }

  // ── Scroll reveal ────────────────────────────────────────
  function initReveal() {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const els = document.querySelectorAll(".reveal");

    if (prefersReduced) {
      els.forEach((el) => el.classList.add("visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );

    els.forEach((el) => observer.observe(el));
  }

  // ── Hero screenshot carousel ─────────────────────────────
  function initHeroCarousel() {
    const root = document.getElementById("hero-carousel");
    if (!root) return;

    const stage = root.querySelector(".hero-carousel__stage");
    const slides = Array.from(root.querySelectorAll(".hero-carousel__slide"));
    const dots = Array.from(root.querySelectorAll("#hero-dots button"));
    const prev = document.getElementById("hero-prev");
    const next = document.getElementById("hero-next");
    const label = document.getElementById("hero-slide-label");
    const counter = document.getElementById("hero-counter");
    const progress = document.getElementById("hero-progress");
    const flash = document.getElementById("hero-flash");
    if (!slides.length) return;

    const labels = ["anti aim", "misc", "visuals", "config"];
    const AUTOPLAY_MS = 5200;
    const TRANSITION_MS = 600;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    root.style.setProperty("--autoplay-ms", AUTOPLAY_MS + "ms");

    let index = 0;
    let touchX = null;
    let timer = null;
    let animLock = false;

    function pad(n) {
      return String(n).padStart(2, "0");
    }

    function restartProgress() {
      if (!progress || reduceMotion) return;
      root.classList.remove("is-playing");
      void progress.offsetWidth;
      root.classList.add("is-playing");
    }

    function fireFlash() {
      if (!flash || reduceMotion) return;
      flash.classList.remove("is-on");
      void flash.offsetWidth;
      flash.classList.add("is-on");
    }

    function pulseBtn(btn) {
      if (!btn || reduceMotion) return;
      btn.classList.remove("is-press");
      void btn.offsetWidth;
      btn.classList.add("is-press");
    }

    function swapLabel(text) {
      if (!label) return;
      label.classList.remove("is-swap");
      void label.offsetWidth;
      label.textContent = text;
      if (!reduceMotion) label.classList.add("is-swap");
    }

    function tickCounter() {
      if (!counter) return;
      counter.textContent = `${pad(index + 1)} / ${pad(slides.length)}`;
      if (reduceMotion) return;
      counter.classList.remove("is-tick");
      void counter.offsetWidth;
      counter.classList.add("is-tick");
    }

    function clearSlideClasses(slide) {
      slide.classList.remove(
        "is-active",
        "is-exit-left",
        "is-exit-right",
        "is-enter-left",
        "is-enter-right"
      );
    }

    function goTo(i, dir, fromBtn) {
      if (animLock) return;
      const nextIndex = (i + slides.length) % slides.length;
      if (nextIndex === index) {
        restartProgress();
        return;
      }

      const prevIndex = index;
      const direction =
        dir != null
          ? dir
          : nextIndex > prevIndex || (prevIndex === slides.length - 1 && nextIndex === 0)
            ? 1
            : -1;

      index = nextIndex;
      animLock = !reduceMotion;

      if (fromBtn === "prev") pulseBtn(prev);
      if (fromBtn === "next") pulseBtn(next);

      if (stage && !reduceMotion) {
        stage.classList.remove("is-changing");
        void stage.offsetWidth;
        stage.classList.add("is-changing");
      }

      fireFlash();

      slides.forEach((slide, n) => {
        clearSlideClasses(slide);
        if (n === prevIndex) {
          slide.classList.add(direction > 0 ? "is-exit-left" : "is-exit-right");
          slide.setAttribute("aria-hidden", "true");
        } else if (n === index) {
          slide.classList.add(direction > 0 ? "is-enter-right" : "is-enter-left");
          slide.setAttribute("aria-hidden", "false");
        } else {
          slide.setAttribute("aria-hidden", "true");
        }
      });

      // Promote entering slide to active after animation paints
      window.setTimeout(() => {
        slides.forEach((slide, n) => {
          clearSlideClasses(slide);
          if (n === index) {
            slide.classList.add("is-active");
            slide.setAttribute("aria-hidden", "false");
          } else {
            slide.setAttribute("aria-hidden", "true");
          }
        });
        animLock = false;
        if (stage) stage.classList.remove("is-changing");
      }, reduceMotion ? 0 : TRANSITION_MS);

      dots.forEach((dot, n) => {
        const on = n === index;
        dot.classList.toggle("is-active", on);
        dot.setAttribute("aria-selected", on ? "true" : "false");
      });

      swapLabel(labels[index] || `slide ${index + 1}`);
      tickCounter();
      root.setAttribute(
        "aria-label",
        `Screenshot ${index + 1} of ${slides.length}: ${labels[index] || ""}`
      );

      restartProgress();
      resetAutoplay();
    }

    function resetAutoplay() {
      if (timer) window.clearInterval(timer);
      timer = null;
      if (reduceMotion) return;
      timer = window.setInterval(() => goTo(index + 1, 1), AUTOPLAY_MS);
    }

    function stopAutoplay() {
      if (timer) window.clearInterval(timer);
      timer = null;
      root.classList.remove("is-playing");
    }

    if (prev) prev.addEventListener("click", () => goTo(index - 1, -1, "prev"));
    if (next) next.addEventListener("click", () => goTo(index + 1, 1, "next"));

    dots.forEach((dot) => {
      dot.addEventListener("click", () => {
        const i = Number(dot.getAttribute("data-index"));
        if (Number.isNaN(i) || i === index) return;
        goTo(i, i > index ? 1 : -1);
      });
    });

    root.addEventListener("keydown", (e) => {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        goTo(index - 1, -1, "prev");
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        goTo(index + 1, 1, "next");
      }
    });

    root.tabIndex = 0;

    root.addEventListener("mouseenter", stopAutoplay);
    root.addEventListener("mouseleave", () => {
      restartProgress();
      resetAutoplay();
    });
    root.addEventListener("focusin", stopAutoplay);
    root.addEventListener("focusout", (e) => {
      if (!root.contains(e.relatedTarget)) {
        restartProgress();
        resetAutoplay();
      }
    });

    root.addEventListener(
      "touchstart",
      (e) => {
        touchX = e.changedTouches[0].clientX;
        stopAutoplay();
      },
      { passive: true }
    );

    root.addEventListener(
      "touchend",
      (e) => {
        if (touchX == null) return;
        const dx = e.changedTouches[0].clientX - touchX;
        touchX = null;
        if (Math.abs(dx) < 40) {
          restartProgress();
          resetAutoplay();
          return;
        }
        if (dx < 0) goTo(index + 1, 1);
        else goTo(index - 1, -1);
      },
      { passive: true }
    );

    slides.forEach((slide, n) => {
      clearSlideClasses(slide);
      const on = n === 0;
      slide.classList.toggle("is-active", on);
      slide.setAttribute("aria-hidden", on ? "false" : "true");
    });
    dots.forEach((dot, n) => {
      const on = n === 0;
      dot.classList.toggle("is-active", on);
      dot.setAttribute("aria-selected", on ? "true" : "false");
    });
    if (label) label.textContent = labels[0];
    if (counter) counter.textContent = `01 / ${pad(slides.length)}`;
    restartProgress();
    resetAutoplay();
  }

  // ── Version badge from config ────────────────────────────
  function applyVersion() {
    const v = cfg.product?.version || "DEBUG 7";
    document.querySelectorAll("[data-version]").forEach((el) => {
      el.textContent = v;
    });
    const short = cfg.product?.versionShort;
    if (short) {
      document.querySelectorAll("[data-version-short]").forEach((el) => {
        el.textContent = short;
      });
    }
  }

  // ── Boot ─────────────────────────────────────────────────
  function init() {
    applyBrand();
    applyVersion();
    renderPricing();
    applyLinks();
    initNav();
    initSectionSpy();
    initBuilderTabs();
    initFeatureTabs();
    initReveal();
    initHeroCarousel();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
