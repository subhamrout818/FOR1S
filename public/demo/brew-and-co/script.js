/* Brew & Co. demo — upgraded with Awwwards-level motion.
   1. Preloader with smooth reveal
   2. Hero text stagger animation
   3. Scroll-triggered section reveals
   4. Parallax effects
   5. Interactive badge following mouse
   6. Custom cursor follower
   7. Magnetic booking pill
   8. Menu row hover effects */

(function () {
  "use strict";

  var isScreenshot = document.documentElement.classList.contains("no-loader");
  var prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // ─── Preloader ───────────────────────────────────────────────
  var preloader = document.getElementById("preloader");

  function hidePreloader() {
    document.body.classList.remove("no-scroll");
    if (!preloader) return;
    preloader.classList.add("is-done");
    setTimeout(function () {
      if (preloader.parentNode) preloader.remove();
      if (!isScreenshot && !prefersReducedMotion) {
        animateHero();
      }
    }, 900);
  }

  if (!isScreenshot) {
    document.body.classList.add("no-scroll");
    setTimeout(hidePreloader, 2200);
  } else if (preloader) {
    preloader.remove();
    // In screenshot mode, make everything visible immediately
    document.querySelectorAll(".line__inner").forEach(function(el) {
      el.style.transform = "none";
    });
    document.querySelectorAll(".headline-img").forEach(function(el) {
      el.style.opacity = "1";
      el.style.transform = "none";
    });
    document.querySelectorAll(".kicker, .deck, .open-now").forEach(function(el) {
      el.style.opacity = "1";
      el.style.transform = "none";
    });
  }

  // ─── Hero animation ──────────────────────────────────────────
  function animateHero() {
    var lines = document.querySelectorAll(".line__inner");
    var headlineImg = document.querySelector(".headline-img");
    var kicker = document.querySelector(".kicker");
    var kickerLine = kicker ? kicker.querySelector("::before") : null;
    var deck = document.querySelector(".deck");
    var openNow = document.querySelector(".open-now");

    // Animate headline lines with stagger
    lines.forEach(function(line, i) {
      setTimeout(function() {
        line.style.transition = "transform 1s cubic-bezier(0.16, 1, 0.3, 1)";
        line.style.transform = "translateY(0)";
      }, i * 150);
    });

    // Animate the circular image
    if (headlineImg) {
      setTimeout(function() {
        headlineImg.style.transition = "opacity 0.8s ease, transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)";
        headlineImg.style.opacity = "1";
        headlineImg.style.transform = "scale(1) rotate(0deg)";
      }, 400);
    }

    // Animate kicker
    if (kicker) {
      setTimeout(function() {
        kicker.style.transition = "opacity 0.6s ease, transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)";
        kicker.style.opacity = "1";
        kicker.style.transform = "translateY(0)";
        // Animate the kicker line
        kicker.style.setProperty("--kicker-line", "1");
      }, 200);
    }

    // Animate deck
    if (deck) {
      setTimeout(function() {
        deck.style.transition = "opacity 0.8s ease, transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)";
        deck.style.opacity = "1";
        deck.style.transform = "translateY(0)";
      }, 600);
    }

    // Animate open now
    if (openNow) {
      setTimeout(function() {
        openNow.style.transition = "opacity 0.6s ease, transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)";
        openNow.style.opacity = "1";
        openNow.style.transform = "translateY(0)";
      }, 800);
    }
  }

  // ─── Scroll reveals ──────────────────────────────────────────
  if (!isScreenshot && !prefersReducedMotion) {
    var revealElements = document.querySelectorAll(".reveal, .reveal-stagger");

    var observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.15,
      rootMargin: "0px 0px -50px 0px"
    });

    revealElements.forEach(function(el) {
      observer.observe(el);
    });
  } else {
    // In screenshot mode, make all reveals visible
    document.querySelectorAll(".reveal, .reveal-stagger").forEach(function(el) {
      el.classList.add("is-visible");
    });
  }

  // ─── Parallax on hero elements ───────────────────────────────
  if (!isScreenshot && !prefersReducedMotion) {
    var hero = document.querySelector(".hero");
    var heroGlow = hero ? hero.querySelector("::before") : null;
    var badge = document.querySelector(".badge");

    window.addEventListener("scroll", function() {
      var scrollY = window.pageYOffset;
      var heroHeight = hero ? hero.offsetHeight : 800;
      var progress = Math.min(scrollY / heroHeight, 1);

      // Parallax on badge
      if (badge) {
        badge.style.transform = "rotate(" + (progress * 360) + "deg) translateY(" + (progress * 30) + "px)";
      }
    }, { passive: true });
  }

  // ─── Interactive badge following mouse ────────────────────────
  if (!isScreenshot && !prefersReducedMotion) {
    var badge = document.querySelector(".badge");
    var hero = document.querySelector(".hero");

    if (badge && hero) {
      hero.addEventListener("mousemove", function(e) {
        var rect = hero.getBoundingClientRect();
        var x = (e.clientX - rect.left) / rect.width - 0.5;
        var y = (e.clientY - rect.top) / rect.height - 0.5;

        badge.style.transform = "translate(" + (x * 20) + "px, " + (y * 20) + "px)";
      });

      hero.addEventListener("mouseleave", function() {
        badge.style.transition = "transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)";
        badge.style.transform = "translate(0, 0)";
        setTimeout(function() {
          badge.style.transition = "";
        }, 500);
      });
    }
  }

  // ─── Custom cursor follower ──────────────────────────────────
  if (!isScreenshot && !prefersReducedMotion && window.innerWidth > 768) {
    var cursor = document.getElementById("cursor");
    var mouseX = 0, mouseY = 0;
    var cursorX = 0, cursorY = 0;

    document.addEventListener("mousemove", function(e) {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursor.classList.add("is-visible");
    });

    document.addEventListener("mouseleave", function() {
      cursor.classList.remove("is-visible");
    });

    // Smooth cursor follow with lerp
    function updateCursor() {
      cursorX += (mouseX - cursorX) * 0.12;
      cursorY += (mouseY - cursorY) * 0.12;
      cursor.style.left = cursorX + "px";
      cursor.style.top = cursorY + "px";
      requestAnimationFrame(updateCursor);
    }
    updateCursor();

    // Hover effect on interactive elements
    var hoverTargets = document.querySelectorAll("a, button, .menu__row, .roast__card, .visit__photo");
    hoverTargets.forEach(function(el) {
      el.addEventListener("mouseenter", function() {
        cursor.classList.add("is-hover");
      });
      el.addEventListener("mouseleave", function() {
        cursor.classList.remove("is-hover");
      });
    });
  }

  // ─── Magnetic booking pill ───────────────────────────────────
  if (!isScreenshot && !prefersReducedMotion) {
    var book = document.getElementById("book");
    if (book) {
      book.addEventListener("mousemove", function(e) {
        var rect = book.getBoundingClientRect();
        var x = e.clientX - rect.left - rect.width / 2;
        var y = e.clientY - rect.top - rect.height / 2;
        book.style.transform = "translate(" + (x * 0.3) + "px, " + (y * 0.3) + "px)";
      });

      book.addEventListener("mouseleave", function() {
        book.style.transition = "transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)";
        book.style.transform = "translate(0, 0)";
        setTimeout(function() {
          book.style.transition = "";
        }, 400);
      });
    }
  }

  // ─── Toast ───────────────────────────────────────────────────
  var book = document.getElementById("book");
  var toast = document.getElementById("toast");
  var toastTimer = null;

  if (book && toast) {
    book.addEventListener("click", function (e) {
      e.preventDefault();
      book.classList.remove("is-shaking");
      void book.offsetWidth;
      book.classList.add("is-shaking");
      toast.classList.add("is-visible");
      clearTimeout(toastTimer);
      toastTimer = setTimeout(function () {
        toast.classList.remove("is-visible");
      }, 2600);
    });
  }

  // ─── Smooth scroll (requestAnimationFrame lerp) ─────────────
  if (!isScreenshot && !prefersReducedMotion) {
    var docHeight = document.documentElement.scrollHeight - window.innerHeight;
    var targetScroll = window.pageYOffset;
    var currentScroll = window.pageYOffset;
    var isScrolling = false;
    var ease = 0.08;

    document.documentElement.classList.add("has-smooth");

    function smoothScrollLoop() {
      currentScroll += (targetScroll - currentScroll) * ease;
      if (Math.abs(targetScroll - currentScroll) < 0.5) {
        currentScroll = targetScroll;
        isScrolling = false;
      }
      window.scrollTo(0, currentScroll);
      if (isScrolling) requestAnimationFrame(smoothScrollLoop);
    }

    window.addEventListener("wheel", function(e) {
      e.preventDefault();
      targetScroll = Math.max(0, Math.min(targetScroll + e.deltaY, docHeight));
      if (!isScrolling) {
        isScrolling = true;
        requestAnimationFrame(smoothScrollLoop);
      }
    }, { passive: false });

    // Touch support
    var touchStartY = 0;
    window.addEventListener("touchstart", function(e) {
      touchStartY = e.touches[0].clientY;
    }, { passive: true });
    window.addEventListener("touchmove", function(e) {
      e.preventDefault();
      var deltaY = touchStartY - e.touches[0].clientY;
      touchStartY = e.touches[0].clientY;
      targetScroll = Math.max(0, Math.min(targetScroll + deltaY, docHeight));
      if (!isScrolling) {
        isScrolling = true;
        requestAnimationFrame(smoothScrollLoop);
      }
    }, { passive: false });

    // Update targetScroll on native scroll (keyboard, scrollbar drag)
    window.addEventListener("scroll", function() {
      if (!isScrolling) {
        targetScroll = window.pageYOffset;
        currentScroll = window.pageYOffset;
      }
    }, { passive: true });

    // Recalculate doc height on resize
    window.addEventListener("resize", function() {
      docHeight = document.documentElement.scrollHeight - window.innerHeight;
    }, { passive: true });
  }

  // ─── Smooth scroll for nav links ─────────────────────────────
  document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
    anchor.addEventListener("click", function(e) {
      var target = document.querySelector(this.getAttribute("href"));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({
          behavior: prefersReducedMotion ? "auto" : "smooth",
          block: "start"
        });
      }
    });
  });
})();
