(function () {
  "use strict";

  // ---------- 刷新时回到顶部 ----------
  if ("scrollRestoration" in history) history.scrollRestoration = "manual";
  if (window.location.hash) {
    history.replaceState(null, "", window.location.pathname + window.location.search);
  }
  window.scrollTo({ top: 0, left: 0, behavior: "instant" });

  // ---------- 主题切换 ----------
  const root = document.documentElement;
  const themeToggle = document.getElementById("themeToggle");
  const STORAGE_KEY = "fuyou-theme";
  const mq = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)");

  function applyTheme(theme, save) {
    root.setAttribute("data-theme", theme);
    if (save) { try { localStorage.setItem(STORAGE_KEY, theme); } catch (e) {} }
  }

  const saved = (function () {
    try { return localStorage.getItem(STORAGE_KEY); } catch (e) { return null; }
  })();
  // 跟随系统；若用户手动切换过，则尊重其选择
  applyTheme(saved || (mq && mq.matches ? "dark" : "light"), false);

  themeToggle.addEventListener("click", function () {
    const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
    applyTheme(next, true);
  });

  // 无手动选择时，跟随系统实时变化
  if (mq && mq.addEventListener) {
    mq.addEventListener("change", function (e) {
      let s = null;
      try { s = localStorage.getItem(STORAGE_KEY); } catch (err) {}
      if (!s) applyTheme(e.matches ? "dark" : "light", false);
    });
  }

  // ---------- 移动端菜单 ----------
  const navToggle = document.getElementById("navToggle");
  const siteNav = document.getElementById("siteNav");
  if (navToggle && siteNav) {
    navToggle.addEventListener("click", function () {
      const open = siteNav.classList.toggle("open");
      navToggle.setAttribute("aria-expanded", String(open));
      navToggle.setAttribute("aria-label", open ? "关闭菜单" : "打开菜单");
    });
    siteNav.addEventListener("click", function (e) {
      if (e.target.tagName === "A") {
        siteNav.classList.remove("open");
        navToggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  // ---------- 滚动显现（双向：滚入显现，滚出收回） ----------
  const revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        entry.target.classList.toggle("in", entry.isIntersecting);
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("in"); });
  }

  // ---------- 此刻时间 ----------
  const nowTime = document.getElementById("nowTime");
  function tick() {
    if (!nowTime) return;
    const d = new Date();
    const pad = function (n) { return String(n).padStart(2, "0"); };
    nowTime.textContent = pad(d.getHours()) + ":" + pad(d.getMinutes()) + ":" + pad(d.getSeconds());
  }
  tick();
  setInterval(tick, 1000);

  // ---------- 蜉蝣 · 萤火粒子 ----------
  const canvas = document.getElementById("fireflies");
  if (canvas && canvas.getContext) {
    const reduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!reduced) {
      const ctx = canvas.getContext("2d");
      let width = 0, height = 0, raf = null, running = false;
      const particles = [];

      function resize() {
        const rect = canvas.parentElement.getBoundingClientRect();
        width = rect.width;
        height = rect.height;
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        canvas.style.width = width + "px";
        canvas.style.height = height + "px";
      }

      function makeParticle() {
        return {
          x: Math.random() * width,
          y: height * (0.55 + Math.random() * 0.45),
          r: 0.6 + Math.random() * 1.8,
          vx: (Math.random() - 0.5) * 0.16,
          vy: -(0.08 + Math.random() * 0.28),
          a: 0.25 + Math.random() * 0.55,
          phase: Math.random() * Math.PI * 2,
          warm: Math.random() < 0.7
        };
      }

      function seed() {
        const count = Math.min(42, Math.max(18, Math.round(width / 28)));
        particles.length = 0;
        for (let i = 0; i < count; i++) {
          const p = makeParticle();
          p.y = Math.random() * height;
          particles.push(p);
        }
      }

      function readVar(name, fallback) {
        return getComputedStyle(document.documentElement).getPropertyValue(name).trim() || fallback;
      }
      let warm = readVar("--firefly-warm", "#e6b96a");
      let cool = readVar("--firefly-cool", "#74c0d6");
      const themeObserver = new MutationObserver(function () {
        warm = readVar("--firefly-warm", "#e6b96a");
        cool = readVar("--firefly-cool", "#74c0d6");
      });
      themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });

      function draw(now) {
        ctx.clearRect(0, 0, width, height);
        for (let i = 0; i < particles.length; i++) {
          const p = particles[i];
          p.x += p.vx + Math.sin(now / 1400 + p.phase) * 0.12;
          p.y += p.vy;
          if (p.y < -10 || p.x < -10 || p.x > width + 10) {
            particles[i] = makeParticle();
            particles[i].y = height + 10;
            continue;
          }
          const tw = 0.7 + 0.3 * Math.sin(now / 500 + p.phase);
          const col = p.warm ? warm : cool;
          const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 5);
          g.addColorStop(0, col);
          g.addColorStop(1, "rgba(0,0,0,0)");
          ctx.globalAlpha = p.a * tw;
          ctx.fillStyle = g;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r * 5, 0, Math.PI * 2);
          ctx.fill();
          ctx.globalAlpha = p.a * tw;
          ctx.fillStyle = col;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.globalAlpha = 1;
        raf = requestAnimationFrame(draw);
      }

      function start() {
        if (running) return;
        running = true;
        raf = requestAnimationFrame(draw);
      }
      function stop() {
        running = false;
        if (raf) cancelAnimationFrame(raf);
      }

      resize();
      seed();
      start();

      window.addEventListener("resize", function () {
        resize();
        seed();
      });
      document.addEventListener("visibilitychange", function () {
        if (document.hidden) stop(); else start();
      });
    }
  }

  // ---------- 随笔 · coverflow 轮播 ----------
  const carousel = document.getElementById("essayCarousel");
  const track = carousel ? carousel.querySelector(".carousel-track") : null;
  if (track && track.querySelectorAll(".carousel-card").length) {
    const cards = Array.prototype.slice.call(track.querySelectorAll(".carousel-card"));
    let active = Math.floor(cards.length / 2);

    function render() {
      const cw = cards[0] ? cards[0].offsetWidth : 300;
      const sp = cw + 18;
      cards.forEach(function (c, i) {
        const off = i - active;
        const x = off * sp;
        const scale = Math.max(0.82, 1 - Math.abs(off) * 0.08);
        const op = Math.max(0.2, 1 - Math.abs(off) * 0.32);
        c.style.transform = "translateX(" + x + "px) scale(" + scale + ")";
        c.style.opacity = String(op);
        c.style.zIndex = String(10 - Math.abs(off));
        c.style.pointerEvents = off === 0 ? "auto" : "none";
        c.classList.toggle("is-active", off === 0);
      });
    }

    function go(dir) {
      const next = Math.max(0, Math.min(cards.length - 1, active + dir));
      if (next !== active) { active = next; render(); }
    }

    const prev = document.getElementById("carouselPrev");
    const next = document.getElementById("carouselNext");
    if (prev) prev.addEventListener("click", function () { go(-1); });
    if (next) next.addEventListener("click", function () { go(1); });

    // 滚轮：竖向滚动 → 横向切换；到尽头则让页面继续竖向滚动
    carousel.addEventListener("wheel", function (e) {
      if (Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return;
      const dir = e.deltaY > 0 ? 1 : -1;
      const atEnd = (dir > 0 && active === cards.length - 1) || (dir < 0 && active === 0);
      if (!atEnd) { e.preventDefault(); go(dir); }
    }, { passive: false });

    // 鼠标 / 触控拖拽
    let startX = null;
    carousel.addEventListener("pointerdown", function (e) {
      // 点在按钮或链接上时，不启动拖拽（保证点击可用）
      if (e.target.closest && (e.target.closest(".carousel-btn") || e.target.closest("a"))) return;
      startX = e.clientX;
      try { carousel.setPointerCapture(e.pointerId); } catch (err) {}
    });
    carousel.addEventListener("pointermove", function (e) {
      if (startX === null) return;
      const dx = e.clientX - startX;
      if (Math.abs(dx) > 40) {
        go(dx < 0 ? 1 : -1);
        startX = e.clientX;
      }
    });
    carousel.addEventListener("pointerup", function () { startX = null; });
    carousel.addEventListener("pointercancel", function () { startX = null; });

    window.addEventListener("resize", render);
    render();
  }

  // ---------- 荣誉 · 查看更多/收起 ----------
  document.querySelectorAll(".award-more-btn").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var col = btn.closest(".award-col");
      var expanded = col.classList.toggle("expanded");
      var n = col.querySelectorAll(".more-item").length;
      btn.textContent = expanded ? "收起 ↑" : "查看更多（+" + n + "）";
    });
  });
})();
