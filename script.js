const menuButton = document.querySelector(".menu-toggle");
const navigation = document.querySelector(".primary-navigation");
const navigationLinks = [...document.querySelectorAll(".primary-navigation a[href^='#']")];

function setMenuOpen(isOpen) {
  menuButton?.setAttribute("aria-expanded", String(isOpen));
  navigation?.classList.toggle("is-open", isOpen);
}

menuButton?.addEventListener("click", () => {
  const isOpen = menuButton.getAttribute("aria-expanded") === "true";
  setMenuOpen(!isOpen);
});

navigationLinks.forEach((link) => {
  link.addEventListener("click", () => setMenuOpen(false));
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && menuButton?.getAttribute("aria-expanded") === "true") {
    setMenuOpen(false);
    menuButton.focus();
  }
});

document.addEventListener("click", (event) => {
  if (
    menuButton?.getAttribute("aria-expanded") === "true" &&
    !navigation?.contains(event.target) &&
    !menuButton.contains(event.target)
  ) {
    setMenuOpen(false);
  }
});

const observedSections = navigationLinks
  .map((link) => document.querySelector(link.getAttribute("href")))
  .filter(Boolean);

if ("IntersectionObserver" in window) {
  const sectionObserver = new IntersectionObserver(
    (entries) => {
      const visibleSections = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

      if (!visibleSections.length) return;

      const activeId = visibleSections[0].target.id;
      navigationLinks.forEach((link) => {
        if (link.getAttribute("href") === `#${activeId}`) {
          link.setAttribute("aria-current", "location");
        } else {
          link.removeAttribute("aria-current");
        }
      });
    },
    { rootMargin: "-18% 0px -68% 0px", threshold: [0, 0.1, 0.4] }
  );

  observedSections.forEach((section) => sectionObserver.observe(section));
}

const year = document.querySelector("#copyright-year");
if (year) year.textContent = String(new Date().getFullYear());
