(() => {
  "use strict";

  // ---- Mobile menu ----
  const toggle = document.getElementById("menuToggle");
  const nav = document.getElementById("navLinks");

  const setOpen = (open) => {
    nav.classList.toggle("open", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.textContent = open ? "Stäng" : "Meny";
  };

  toggle.addEventListener("click", () => setOpen(!nav.classList.contains("open")));
  nav.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => setOpen(false)));

  // ---- Footer year ----
  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();

  // ---- Contact form (Formspree) ----
  const form = document.getElementById("contactForm");
  const status = document.getElementById("formStatus");
  const button = form.querySelector('button[type="submit"]');

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    button.disabled = true;
    button.textContent = "Skickar…";
    status.textContent = "";

    try {
      const res = await fetch(form.action, {
        method: "POST",
        body: new FormData(form),
        headers: { Accept: "application/json" },
      });
      if (!res.ok) throw new Error("Status " + res.status);
      form.reset();
      status.textContent = "Tack! Maja hör av sig så snart hon kan.";
    } catch {
      status.textContent = "Det gick inte att skicka. Försök igen eller ring 0704-356 410.";
    } finally {
      button.disabled = false;
      button.textContent = "Skicka förfrågan";
    }
  });
})();
