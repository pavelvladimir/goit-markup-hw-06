const pageRegions = document.querySelectorAll("body > header, body > main, body > footer");
const menuButton = document.querySelector(".menu-toggle");
let activeOverlay = null;
let opener = null;

function openOverlay(trigger) {
  activeOverlay = document.getElementById(trigger.dataset.open);
  opener = trigger;
  activeOverlay.classList.add("is-open");
  document.body.classList.add("overlay-open");
  for (const region of pageRegions) region.inert = true;
  if (trigger === menuButton) menuButton.setAttribute("aria-expanded", "true");
  const firstControl = activeOverlay.querySelector(".field-input") || activeOverlay.querySelector("[data-close]");
  firstControl.focus();
}

function closeOverlay(focusTarget = opener) {
  if (!activeOverlay) return;
  activeOverlay.classList.remove("is-open");
  activeOverlay = null;
  opener = null;
  menuButton.setAttribute("aria-expanded", "false");
  document.body.classList.remove("overlay-open");
  for (const region of pageRegions) region.inert = false;
  focusTarget?.focus({ preventScroll: true });
}

for (const trigger of document.querySelectorAll("[data-open]")) {
  trigger.addEventListener("click", () => openOverlay(trigger));
}
for (const button of document.querySelectorAll("[data-close]")) {
  button.addEventListener("click", () => closeOverlay());
}
document.querySelector(".backdrop").addEventListener("click", (event) => {
  if (event.target === event.currentTarget) closeOverlay();
});
document.addEventListener("keydown", (event) => {
  if (!activeOverlay) return;
  if (event.key === "Escape") closeOverlay();
  if (event.key !== "Tab") return;
  const controls = [...activeOverlay.querySelectorAll("a[href], button, input, textarea")];
  const first = controls[0];
  const last = controls.at(-1);
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
});

const navigation = document.querySelectorAll(".nav-link, .menu-link");
function updateNavigation() {
  const current = location.hash || "#features";
  for (const link of navigation) {
    const selected = current === link.hash;
    link.classList.toggle("is-active", selected);
    if (selected) link.setAttribute("aria-current", "location");
    else link.removeAttribute("aria-current");
  }
}
for (const link of document.querySelectorAll(".menu-link")) {
  link.addEventListener("click", () => closeOverlay(document.querySelector(link.hash)));
}
window.addEventListener("hashchange", updateNavigation);
updateNavigation();
matchMedia("(min-width: 768px)").addEventListener("change", (event) => {
  if (event.matches && activeOverlay?.id === "mobile-menu") closeOverlay(document.querySelector(".header .logo"));
});

const privacyNote = document.querySelector("#privacy-note");
document.querySelector(".privacy-link").addEventListener("click", (event) => {
  event.preventDefault();
  privacyNote.hidden = false;
  privacyNote.focus();
});

// The coursework has no submission endpoint. Keep valid entries on the page.
for (const form of document.forms) {
  const status = form.parentElement.querySelector('[role="status"]');
  form.addEventListener("input", () => {
    status.textContent = "";
  });
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    status.textContent = "Demo form validated. No information has been sent.";
  });
}
