/* Studio Arun demo — upgraded with Awwwards-level motion.
   1. Preloader with smooth reveal
   2. Hero parallax on scroll
   3. Hero text stagger animation
   4. Scroll-triggered section reveals
   5. Gallery parallax and hover effects
   6. Custom cursor follower
   7. Smooth scroll-linked animations
   8. Counter animation for stats */

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
    document.querySelectorAll(".hero__line-inner").forEach(function(el) {
      el.style.transform = "none";
    });
    document.querySelectorAll(".hero__kicker, .hero__deck").forEach(function(el) {
      el.style.opacity = "1";
      el.style.transform = "none";
    });
    document.querySelector(".hero__scroll").style.opacity = "1";
    document.querySelectorAll(".reveal, .reveal-scale, .reveal-stagger").forEach(function(el) {
      el.classList.add("is-visible");
    });
  }

  // ─── Hero animation ──────────────────────────────────────────
  function animateHero() {
    var lines = document.querySelectorAll(".hero__line-inner");
    var kicker = document.querySelector(".hero__kicker");
    var deck = document.querySelector(".hero__deck");
    var scroll = document.querySelector(".hero__scroll");
    var heroImg = document.querySelector(".hero__img");

    // Animate hero image scale
    if (heroImg) {
      heroImg.style.transition = "transform 1.5s cubic-bezier(0.16, 1, 0.3, 1)";
      heroImg.style.transform = "scale(1)";
    }

    // Animate headline lines with stagger
    lines.forEach(function(line, i) {
      setTimeout(function() {
        line.style.transition = "transform 1s cubic-bezier(0.16, 1, 0.3, 1)";
        line.style.transform = "translateY(0)";
      }, 300 + i * 150);
    });

    // Animate kicker
    if (kicker) {
      setTimeout(function() {
        kicker.style.transition = "opacity 0.6s ease, transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)";
        kicker.style.opacity = "1";
        kicker.style.transform = "translateY(0)";
      }, 200);
    }

    // Animate deck
    if (deck) {
      setTimeout(function() {
        deck.style.transition = "opacity 0.8s ease, transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)";
        deck.style.opacity = "1";
        deck.style.transform = "translateY(0)";
      }, 800);
    }

    // Animate scroll indicator
    if (scroll) {
      setTimeout(function() {
        scroll.style.transition = "opacity 0.6s ease";
        scroll.style.opacity = "1";
      }, 1000);
    }
  }

  // ─── Hero parallax on scroll ─────────────────────────────────
  if (!isScreenshot && !prefersReducedMotion) {
    var heroImg = document.querySelector(".hero__img");
    var heroContent = document.querySelector(".hero__content");
    var heroScroll = document.querySelector(".hero__scroll");

    window.addEventListener("scroll", function() {
      var scrollY = window.pageYOffset;
      var heroHeight = window.innerHeight;
      var progress = Math.min(scrollY / heroHeight, 1);

      // Parallax on hero image
      if (heroImg) {
        heroImg.style.transform = "scale(" + (1 + progress * 0.1) + ") translateY(" + (progress * 50) + "px)";
      }

      // Fade out hero content
      if (heroContent) {
        heroContent.style.opacity = 1 - progress * 1.5;
        heroContent.style.transform = "translateY(" + (progress * -30) + "px)";
      }

      // Fade out scroll indicator
      if (heroScroll) {
        heroScroll.style.opacity = 1 - progress * 3;
      }
    }, { passive: true });
  }

  // ─── Scroll reveals ──────────────────────────────────────────
  if (!isScreenshot && !prefersReducedMotion) {
    var revealElements = document.querySelectorAll(".reveal, .reveal-scale, .reveal-stagger");

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
  }

  // ─── Gallery hover parallax ──────────────────────────────────
  if (!isScreenshot && !prefersReducedMotion) {
    var galleryItems = document.querySelectorAll(".gallery__item");

    galleryItems.forEach(function(item) {
      var img = item.querySelector("img");

      item.addEventListener("mousemove", function(e) {
        var rect = item.getBoundingClientRect();
        var x = (e.clientX - rect.left) / rect.width - 0.5;
        var y = (e.clientY - rect.top) / rect.height - 0.5;

        if (img) {
          img.style.transform = "scale(1.08) translate(" + (x * -10) + "px, " + (y * -10) + "px)";
        }
      });

      item.addEventListener("mouseleave", function() {
        if (img) {
          img.style.transition = "transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)";
          img.style.transform = "scale(1)";
          setTimeout(function() {
            img.style.transition = "transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)";
          }, 500);
        }
      });
    });
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
    var hoverTargets = document.querySelectorAll("a, button, .enquiry__input, .enquiry__select, .enquiry__textarea");
    hoverTargets.forEach(function(el) {
      el.addEventListener("mouseenter", function() {
        cursor.classList.add("is-hover");
      });
      el.addEventListener("mouseleave", function() {
        cursor.classList.remove("is-hover");
      });
    });

    // Special gallery cursor
    var galleryItems = document.querySelectorAll(".gallery__item");
    galleryItems.forEach(function(el) {
      el.addEventListener("mouseenter", function() {
        cursor.classList.add("is-gallery");
      });
      el.addEventListener("mouseleave", function() {
        cursor.classList.remove("is-gallery");
      });
    });
  }

  // ─── Stats counter animation ─────────────────────────────────
  if (!isScreenshot && !prefersReducedMotion) {
    var stats = document.querySelectorAll(".about__stat-num");
    var statsAnimated = false;

    var statsObserver = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting && !statsAnimated) {
          statsAnimated = true;
          animateStats();
          statsObserver.disconnect();
        }
      });
    }, { threshold: 0.5 });

    var statsSection = document.querySelector(".about__stats");
    if (statsSection) {
      statsObserver.observe(statsSection);
    }

    function animateStats() {
      stats.forEach(function(stat) {
        var text = stat.textContent;
        var isNumber = /^\d+/.test(text);

        if (isNumber) {
          var target = parseInt(text);
          var current = 0;
          var increment = target / 40;
          var suffix = text.replace(/^\d+/, "");

          var timer = setInterval(function() {
            current += increment;
            if (current >= target) {
              current = target;
              clearInterval(timer);
            }
            stat.textContent = Math.floor(current) + suffix;
          }, 30);
        }
      });
    }
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

  // ─── Footer parallax ─────────────────────────────────────────
  if (!isScreenshot && !prefersReducedMotion) {
    var footerGiant = document.querySelector(".foot__giant");

    window.addEventListener("scroll", function() {
      var scrollY = window.pageYOffset;
      var docHeight = document.documentElement.scrollHeight - window.innerHeight;
      var progress = Math.max(0, (scrollY - docHeight + window.innerHeight) / window.innerHeight);

      if (footerGiant) {
        footerGiant.style.transform = "translateX(" + (progress * -50) + "px)";
      }
    }, { passive: true });
  }

  // ─── Enquiry form ────────────────────────────────────────────
  var form = document.querySelector(".enquiry__form");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var btn = form.querySelector(".enquiry__btn");
      if (btn) {
        btn.textContent = "Thanks! We'll be in touch.";
        btn.style.background = "#28c840";
        setTimeout(function () {
          btn.textContent = "Send enquiry";
          btn.style.background = "";
        }, 3000);
      }
    });
  }
})();
