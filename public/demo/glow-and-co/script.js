/* Glow & Co. — Salon & Spa demo.
   5-page IIFE: smooth scroll, preloader, cursor, reveals,
   horizontal gallery, booking stepper, FAQ accordion.
   Every feature null-guards its DOM — absent pages are no-ops. */

(function () {
  "use strict";

  /* ── Top gates ──────────────────────────────────────────────────── */
  var isScreenshot = document.documentElement.classList.contains("no-loader");
  var prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var canAnimate = !isScreenshot && !prefersReducedMotion;

  /* ── Preloader ──────────────────────────────────────────────────── */
  var preloader = document.getElementById("preloader");

  function hidePreloader() {
    document.body.classList.remove("no-scroll");
    if (!preloader) return;
    preloader.classList.add("is-done");
    setTimeout(function () {
      if (preloader.parentNode) preloader.remove();
      document.body.classList.add("is-loaded");
    }, 900);
  }

  if (!isScreenshot) {
    document.body.classList.add("no-scroll");
    setTimeout(hidePreloader, 2200);
  } else if (preloader) {
    preloader.remove();
    document.body.classList.add("is-loaded");
  }

  /* ── Smooth scroll (rAF lerp) ──────────────────────────────────── */
  var docHeight = 0;
  var targetScroll = 0;
  var currentScroll = 0;
  var isScrolling = false;
  var ease = 0.08;
  var lockScroll = false;
  var STRIP_H = 72;

  function recalcHeight() {
    docHeight = document.documentElement.scrollHeight - window.innerHeight;
  }

  if (canAnimate) {
    recalcHeight();
    targetScroll = window.pageYOffset;
    currentScroll = window.pageYOffset;
    document.documentElement.classList.add("has-smooth");

    function smoothLoop() {
      currentScroll += (targetScroll - currentScroll) * ease;
      if (Math.abs(targetScroll - currentScroll) < 0.5) {
        currentScroll = targetScroll;
        isScrolling = false;
      }
      window.scrollTo(0, currentScroll);
      updateScrollEffects();
      if (isScrolling) requestAnimationFrame(smoothLoop);
    }

    window.addEventListener("wheel", function (e) {
      if (lockScroll) return;
      e.preventDefault();
      recalcHeight();
      targetScroll = Math.max(0, Math.min(targetScroll + e.deltaY, docHeight));
      if (!isScrolling) {
        isScrolling = true;
        requestAnimationFrame(smoothLoop);
      }
    }, { passive: false });

    var touchStartY = 0;
    window.addEventListener("touchstart", function (e) {
      touchStartY = e.touches[0].clientY;
    }, { passive: true });
    window.addEventListener("touchmove", function (e) {
      if (lockScroll) return;
      e.preventDefault();
      var dy = touchStartY - e.touches[0].clientY;
      touchStartY = e.touches[0].clientY;
      recalcHeight();
      targetScroll = Math.max(0, Math.min(targetScroll + dy, docHeight));
      if (!isScrolling) {
        isScrolling = true;
        requestAnimationFrame(smoothLoop);
      }
    }, { passive: false });

    window.addEventListener("scroll", function () {
      if (!isScrolling) {
        targetScroll = window.pageYOffset;
        currentScroll = window.pageYOffset;
        updateScrollEffects();
      }
    }, { passive: true });

    window.addEventListener("resize", function () {
      recalcHeight();
      cacheGallery();
    }, { passive: true });

    /* unified rAF driver for scroll-linked effects */
    function updateScrollEffects() {
      updateGallery();
      updateParallax();
    }
  } else {
    /* Reduced-motion / screenshot: wire effects to passive scroll */
    window.addEventListener("scroll", function () {
      currentScroll = window.pageYOffset;
      updateGallery();
      updateParallax();
    }, { passive: true });
    window.addEventListener("resize", function () {
      recalcHeight();
      cacheGallery();
    }, { passive: true });
    recalcHeight();
    currentScroll = window.pageYOffset;
  }

  /* ── Anchor nav via targetScroll ────────────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener("click", function (e) {
      var id = this.getAttribute("href");
      if (id === "#") return;
      var el = document.querySelector(id);
      if (!el) return; /* cross-page hash — let default proceed */
      e.preventDefault();
      closeMenu();
      var top = el.getBoundingClientRect().top + window.pageYOffset - STRIP_H;
      if (canAnimate) {
        recalcHeight();
        targetScroll = Math.max(0, Math.min(top, docHeight));
        if (!isScrolling) {
          isScrolling = true;
          requestAnimationFrame(smoothLoop);
        }
      } else {
        window.scrollTo(0, top);
      }
    });
  });

  /* ── Overlay menu ───────────────────────────────────────────────── */
  var menuBtn = document.querySelector(".menu__btn");
  var menuClose = document.querySelector(".menu__close");

  function openMenu() {
    document.body.classList.add("menu-open");
    lockScroll = true;
  }
  function closeMenu() {
    document.body.classList.remove("menu-open");
    lockScroll = false;
  }

  if (menuBtn) menuBtn.addEventListener("click", openMenu);
  if (menuClose) menuClose.addEventListener("click", closeMenu);

  document.querySelectorAll(".menu__link").forEach(function (link) {
    link.addEventListener("click", function () {
      var href = this.getAttribute("href");
      closeMenu();
      if (href.startsWith("#")) {
        var el = document.querySelector(href);
        if (el) {
          var top = el.getBoundingClientRect().top + window.pageYOffset - STRIP_H;
          if (canAnimate) {
            recalcHeight();
            targetScroll = Math.max(0, Math.min(top, docHeight));
            if (!isScrolling) {
              isScrolling = true;
              requestAnimationFrame(smoothLoop);
            }
          } else {
            window.scrollTo(0, top);
          }
        }
      }
      /* cross-page links navigate naturally after menu close */
    });
  });

  /* mark current page in menu */
  var currentPage = location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".menu__link").forEach(function (link) {
    var href = link.getAttribute("href");
    if (href === currentPage || (currentPage === "" && href === "index.html")) {
      link.classList.add("is-current");
    }
  });

  /* ── Custom cursor ──────────────────────────────────────────────── */
  if (canAnimate && window.innerWidth > 768) {
    var cursor = document.getElementById("cursor");
    if (cursor) {
      var mx = 0, my = 0, cx = 0, cy = 0;

      document.addEventListener("mousemove", function (e) {
        mx = e.clientX;
        my = e.clientY;
        cursor.classList.add("is-visible");
      });
      document.addEventListener("mouseleave", function () {
        cursor.classList.remove("is-visible");
      });

      function updateCursor() {
        cx += (mx - cx) * 0.12;
        cy += (my - cy) * 0.12;
        cursor.style.left = cx + "px";
        cursor.style.top = cy + "px";
        requestAnimationFrame(updateCursor);
      }
      updateCursor();

      /* hover states */
      document.querySelectorAll("a, button, input, textarea, select").forEach(function (el) {
        el.addEventListener("mouseenter", function () { cursor.classList.add("is-hover"); });
        el.addEventListener("mouseleave", function () { cursor.classList.remove("is-hover"); });
      });

      document.querySelectorAll(".gallery-card, .svc__row").forEach(function (el) {
        el.addEventListener("mouseenter", function () { cursor.classList.add("is-gallery"); });
        el.addEventListener("mouseleave", function () { cursor.classList.remove("is-gallery"); });
      });
    }
  }

  /* ── Scroll reveals ─────────────────────────────────────────────── */
  if (canAnimate) {
    var revealEls = document.querySelectorAll(".reveal, .reveal-scale, .reveal-stagger");
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: "0px 0px -50px 0px" });
    revealEls.forEach(function (el) { observer.observe(el); });
  } else {
    document.querySelectorAll(".reveal, .reveal-scale, .reveal-stagger").forEach(function (el) {
      el.classList.add("is-visible");
    });
  }

  /* ── Counter animation ──────────────────────────────────────────── */
  if (canAnimate) {
    var counterEls = document.querySelectorAll("[data-count]");
    if (counterEls.length) {
      var countersAnimated = false;
      var cObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting && !countersAnimated) {
            countersAnimated = true;
            counterEls.forEach(function (el) {
              var raw = el.getAttribute("data-count");
              var suffix = raw.replace(/[0-9]/g, "");
              var target = parseInt(raw, 10);
              var current = 0;
              var inc = target / 50;
              var timer = setInterval(function () {
                current += inc;
                if (current >= target) { current = target; clearInterval(timer); }
                el.textContent = Math.floor(current) + suffix;
              }, 28);
            });
            cObserver.disconnect();
          }
        });
      }, { threshold: 0.5 });
      var statsSection = document.querySelector(".stats");
      if (statsSection) cObserver.observe(statsSection);
    }
  }

  /* ── Horizontal gallery ─────────────────────────────────────────── */
  var galleryStage = document.querySelector(".gallery-stage");
  var galleryTrack = document.querySelector(".gallery-track");
  var galleryOffset = 0;
  var galleryRange = 0;
  var galleryTrackWidth = 0;

  function cacheGallery() {
    if (!galleryStage || !galleryTrack) return;
    galleryOffset = galleryStage.offsetTop;
    galleryTrackWidth = galleryTrack.scrollWidth;
    var viewportW = window.innerWidth;
    galleryRange = galleryTrackWidth - viewportW + 80;
  }
  cacheGallery();
  if (canAnimate) {
    window.addEventListener("resize", cacheGallery, { passive: true });
  }

  function updateGallery() {
    if (!galleryStage || !galleryTrack) return;
    var y = canAnimate ? currentScroll : window.pageYOffset;
    var stageH = galleryStage.offsetHeight;
    var viewH = window.innerHeight;
    var p = Math.max(0, Math.min((y - galleryOffset) / (stageH - viewH), 1));
    galleryTrack.style.transform = "translate3d(" + (-p * galleryRange) + "px,0,0)";
  }

  /* ── Parallax (hero portrait, footer giant) ─────────────────────── */
  var heroPortrait = document.querySelector(".hero__portrait-wrap");
  var footerGiant = document.querySelector(".foot__giant");

  function updateParallax() {
    var y = canAnimate ? currentScroll : window.pageYOffset;
    var vh = window.innerHeight;
    if (heroPortrait) {
      var hp = Math.min(y / vh, 1);
      heroPortrait.style.transform = "translateY(" + (hp * 40) + "px) scale(" + (1 + hp * 0.04) + ")";
    }
    if (footerGiant) {
      var docH = document.documentElement.scrollHeight;
      var fp = Math.max(0, (y + vh - docH + vh) / vh);
      footerGiant.style.transform = "translateX(" + (fp * -60) + "px)";
    }
  }

  /* ── Service page hover image preview ───────────────────────────── */
  var svcRowImg = document.querySelector(".svc__row-img");
  if (svcRowImg) {
    var svcImgInner = svcRowImg.querySelector("img");
    document.querySelectorAll(".svc__row[data-img]").forEach(function (row) {
      row.addEventListener("mouseenter", function (e) {
        svcImgInner.src = this.getAttribute("data-img");
        svcRowImg.classList.add("is-visible");
        positionSvcImg(e);
      });
      row.addEventListener("mousemove", positionSvcImg);
      row.addEventListener("mouseleave", function () {
        svcRowImg.classList.remove("is-visible");
      });
    });
    function positionSvcImg(e) {
      svcRowImg.style.left = (e.clientX + 20) + "px";
      svcRowImg.style.top = (e.clientY - 70) + "px";
    }
  }

  /* ── Home featured services hover preview ───────────────────────── */
  var featImg = document.querySelector(".feat__img-preview");
  if (featImg) {
    var featImgInner = featImg.querySelector("img");
    document.querySelectorAll(".feat__row[data-img]").forEach(function (row) {
      row.addEventListener("mouseenter", function (e) {
        featImgInner.src = this.getAttribute("data-img");
        featImg.classList.add("is-visible");
        positionFeatImg(e);
      });
      row.addEventListener("mousemove", positionFeatImg);
      row.addEventListener("mouseleave", function () {
        featImg.classList.remove("is-visible");
      });
    });
    function positionFeatImg(e) {
      featImg.style.left = (e.clientX + 20) + "px";
      featImg.style.top = (e.clientY - 80) + "px";
    }
  }

  /* ── Booking stepper (book.html) ────────────────────────────────── */
  var bookSteps = document.querySelectorAll(".book__step");
  var bookProg = document.querySelectorAll(".book__prog-step");
  var bookNextBtns = document.querySelectorAll(".book__next");
  var bookBackBtns = document.querySelectorAll(".book__back");
  var bookConfirmBtn = document.querySelector(".book__confirm");
  var bookDone = document.querySelector(".book__done");
  var currentStep = 0;

  function showStep(idx) {
    bookSteps.forEach(function (s, i) {
      s.classList.toggle("is-active", i === idx);
    });
    bookProg.forEach(function (p, i) {
      p.classList.toggle("is-done", i < idx);
      p.classList.toggle("is-active", i === idx);
    });
    currentStep = idx;
    window.scrollTo(0, 0);
  }

  function validateStep(idx) {
    var step = bookSteps[idx];
    if (!step) return true;
    var required = step.querySelectorAll("[data-required]");
    var valid = true;
    required.forEach(function (field) {
      var err = field.parentElement ? field.parentElement.querySelector(".book__error") : null;
      if (!field.value || field.value === "") {
        valid = false;
        if (err) err.classList.add("is-visible");
      } else {
        if (err) err.classList.remove("is-visible");
      }
    });
    return valid;
  }

  bookNextBtns.forEach(function (btn) {
    btn.addEventListener("click", function () {
      if (validateStep(currentStep)) {
        showStep(currentStep + 1);
        buildSummary();
      }
    });
  });

  bookBackBtns.forEach(function (btn) {
    btn.addEventListener("click", function () {
      showStep(currentStep - 1);
    });
  });

  if (bookConfirmBtn) {
    bookConfirmBtn.addEventListener("click", function () {
      document.querySelectorAll(".book__step").forEach(function (s) { s.classList.remove("is-active"); });
      bookProg.forEach(function (p) { p.classList.add("is-done"); p.classList.remove("is-active"); });
      if (bookDone) bookDone.classList.add("is-active");
      window.scrollTo(0, 0);
    });
  }

  /* booking card selection */
  document.querySelectorAll(".book__card[data-group]").forEach(function (card) {
    card.addEventListener("click", function () {
      var group = this.getAttribute("data-group");
      document.querySelectorAll('.book__card[data-group="' + group + '"]').forEach(function (c) {
        c.classList.remove("is-selected");
      });
      this.classList.add("is-selected");
    });
  });

  /* populate summary */
  function buildSummary() {
    var summary = document.querySelector(".book__summary");
    if (!summary) return;
    var selected = document.querySelectorAll(".book__card.is-selected .book__card-title");
    var dateInput = document.querySelector(".book__input[type='date']");
    var timeInput = document.querySelector(".book__select");
    var nameInput = document.querySelector(".book__input[placeholder*='name']");

    var rows = summary.querySelectorAll(".book__summary-row");
    if (rows.length >= 4) {
      if (selected[0]) rows[0].querySelector("span").textContent = selected[0].textContent;
      if (selected[1]) rows[1].querySelector("span").textContent = selected[1].textContent;
      if (dateInput && dateInput.value) rows[2].querySelector("span").textContent = dateInput.value;
      if (nameInput && nameInput.value) rows[3].querySelector("span").textContent = nameInput.value;
    }
  }

  /* ── FAQ accordion (contact.html) ───────────────────────────────── */
  document.querySelectorAll(".faq__q").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var item = this.closest(".faq__item");
      var wasOpen = item.classList.contains("is-open");
      /* close all */
      document.querySelectorAll(".faq__item").forEach(function (fi) { fi.classList.remove("is-open"); });
      /* toggle clicked */
      if (!wasOpen) item.classList.add("is-open");
    });
  });

  /* ── Contact form + toast ───────────────────────────────────────── */
  var contactForm = document.querySelector(".contact__form");
  var toast = document.getElementById("toast");
  var toastTimer = null;

  if (contactForm && toast) {
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();
      toast.classList.add("is-visible");
      contactForm.reset();
      clearTimeout(toastTimer);
      toastTimer = setTimeout(function () {
        toast.classList.remove("is-visible");
      }, 3000);
    });
  }

})();
