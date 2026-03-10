(() => {
  "use strict";

  lucide.createIcons();

  // ---- Scroll-reveal via IntersectionObserver ----
  const revealEls = document.querySelectorAll(".reveal, .reveal-left, .reveal-right");

  if ("IntersectionObserver" in window) {
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
    revealEls.forEach((el) => observer.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("visible"));
  }

  // ---- Header scroll effect ----
  const header = document.getElementById("header");
  let lastScroll = 0;

  const onScroll = () => {
    const y = window.scrollY;
    header.classList.toggle("scrolled", y > 20);
    lastScroll = y;
  };

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // ---- Mobile menu ----
  const toggle = document.getElementById("mobileToggle");
  const navLinks = document.getElementById("navLinks");

  toggle.addEventListener("click", () => {
    toggle.classList.toggle("active");
    navLinks.classList.toggle("open");
    document.body.style.overflow = navLinks.classList.contains("open") ? "hidden" : "";
  });

  navLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      toggle.classList.remove("active");
      navLinks.classList.remove("open");
      document.body.style.overflow = "";
    });
  });

  // ---- Smooth active nav highlighting ----
  const sections = document.querySelectorAll("section[id]");
  const navItems = document.querySelectorAll(".nav-links a:not(.nav-cta)");

  const highlightNav = () => {
    const scrollY = window.scrollY + 120;
    sections.forEach((section) => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute("id");
      if (scrollY >= top && scrollY < top + height) {
        navItems.forEach((a) => {
          a.style.color = "";
          if (a.getAttribute("href") === "#" + id) {
            a.style.color = "var(--navy)";
          }
        });
      }
    });
  };

  window.addEventListener("scroll", highlightNav, { passive: true });

  // ---- Contact form feedback ----
  const form = document.getElementById("contactForm");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    const originalHTML = btn.innerHTML;

    btn.innerHTML = `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="animation:spin 0.8s linear infinite"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
      Skickar...
    `;
    btn.disabled = true;

    try {
      const res = await fetch(form.action, {
        method: "POST",
        body: new FormData(form),
        headers: { Accept: "application/json" },
      });

      if (res.ok) {
        btn.innerHTML = `
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
          Tack! Vi hör av oss snart.
        `;
        btn.style.background = "var(--green)";
        form.reset();
        setTimeout(() => {
          btn.innerHTML = originalHTML;
          btn.style.background = "";
          btn.disabled = false;
        }, 4000);
      } else {
        throw new Error("Server responded with " + res.status);
      }
    } catch {
      btn.innerHTML = `Något gick fel — försök igen`;
      btn.style.background = "var(--pink-dark)";
      setTimeout(() => {
        btn.innerHTML = originalHTML;
        btn.style.background = "";
        btn.disabled = false;
      }, 3000);
    }
  });

  // ---- Stat counter animation ----
  const counters = document.querySelectorAll(".stat-number");

  const animateCounter = (el) => {
    const text = el.textContent.trim();
    const match = text.match(/^(\d+)/);
    if (!match) return;

    const target = parseInt(match[1], 10);
    const suffix = text.replace(match[1], "");
    const duration = 1200;
    const start = performance.now();

    const step = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(target * eased) + suffix;
      if (progress < 1) requestAnimationFrame(step);
    };

    requestAnimationFrame(step);
  };

  if ("IntersectionObserver" in window) {
    const counterObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            counterObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );
    counters.forEach((c) => counterObserver.observe(c));
  }
})();
