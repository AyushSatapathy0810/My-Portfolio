const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");

const contactMenu = document.querySelector(".contact-menu");
const contactMenuButton = document.querySelector(".contact-menu-button");

const profileCard = document.querySelector("#profile-card");
const flipButtons = document.querySelectorAll(".flip-trigger");

const welcomePopup = document.querySelector("#welcome-popup");
const welcomeClose = document.querySelector(".welcome-close");
const welcomeButton = document.querySelector(".welcome-button");

const rotatingRole = document.querySelector("#rotating-role");
const contactForm = document.querySelector("#contact-form");

/* Mobile navigation */
menuToggle.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("open");

  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
});

/* Close the mobile menu after choosing a section */
navLinks.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open menu");
  });
});

/* Header contact dropdown */
contactMenuButton.addEventListener("click", () => {
  const isOpen = contactMenu.classList.toggle("open");
  contactMenuButton.setAttribute("aria-expanded", String(isOpen));
});

document.addEventListener("click", (event) => {
  if (!contactMenu.contains(event.target)) {
    contactMenu.classList.remove("open");
    contactMenuButton.setAttribute("aria-expanded", "false");
  }
});

contactMenu.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    contactMenu.classList.remove("open");
    contactMenuButton.setAttribute("aria-expanded", "false");
  });
});

/* Photo card: automatic flip with manual controls */
const profileFront = profileCard.querySelector(".profile-front");
const profileBack = profileCard.querySelector(".profile-back");
const prefersReducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
).matches;

let isProfileFlipped = false;
let profileFlipTimer;

function setProfileFlipped(flipped) {
  isProfileFlipped = flipped;
  profileCard.classList.toggle("is-flipped", flipped);

  profileFront.setAttribute("aria-hidden", String(flipped));
  profileBack.setAttribute("aria-hidden", String(!flipped));

  flipButtons.forEach((button) => {
    button.setAttribute("aria-pressed", String(flipped));
  });
}

function startAutoFlip() {
  window.clearTimeout(profileFlipTimer);

  if (prefersReducedMotion) return;

  profileFlipTimer = window.setTimeout(() => {
    setProfileFlipped(!isProfileFlipped);
    startAutoFlip();
  }, 2000);
}

function pauseAutoFlip() {
  window.clearTimeout(profileFlipTimer);
}

flipButtons.forEach((button) => {
  button.addEventListener("click", () => {
    setProfileFlipped(!isProfileFlipped);
    startAutoFlip();
  });
});

profileCard.addEventListener("pointerenter", pauseAutoFlip);
profileCard.addEventListener("pointerleave", startAutoFlip);
profileCard.addEventListener("focusin", pauseAutoFlip);
profileCard.addEventListener("focusout", (event) => {
  if (!profileCard.contains(event.relatedTarget)) {
    startAutoFlip();
  }
});

/* Start on the photo side and begin automatic flipping. */
setProfileFlipped(false);
startAutoFlip();

/* Project filters */
document.querySelectorAll(".filter").forEach((button) => {
  button.addEventListener("click", () => {
    const filter = button.dataset.filter;

    document.querySelectorAll(".filter").forEach((item) => {
      item.classList.toggle("active", item === button);
    });

    document.querySelectorAll(".project-card").forEach((card) => {
      card.hidden = filter !== "all" && card.dataset.category !== filter;
    });
  });
});

/* Welcome popup: appears once per browser tab session */
function closeWelcomePopup() {
  welcomePopup.hidden = true;
  document.body.classList.remove("popup-open");
  sessionStorage.setItem("portfolio-welcome-seen", "true");
}

if (!sessionStorage.getItem("portfolio-welcome-seen")) {
  welcomePopup.hidden = false;
  document.body.classList.add("popup-open");
}

welcomeClose.addEventListener("click", closeWelcomePopup);
welcomeButton.addEventListener("click", closeWelcomePopup);

welcomePopup.addEventListener("click", (event) => {
  if (event.target === welcomePopup) {
    closeWelcomePopup();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !welcomePopup.hidden) {
    closeWelcomePopup();
  }
});

/* Rotate through recruiter-focused roles */
const roles = [
  "Software Developer",
  "Full-Stack Developer",
  "Web Developer",
  "Manual QA Tester",
  "Automation Test Engineer",
  "IT Service Desk Engineer",
  "Java Developer",
  "Business Development Associate"
];

let currentRole = 0;

if (
  rotatingRole &&
  !window.matchMedia("(prefers-reduced-motion: reduce)").matches
) {
  window.setInterval(() => {
    currentRole = (currentRole + 1) % roles.length;
    rotatingRole.textContent = roles[currentRole];
  }, 2400);
}

/* Contact form opens an email draft */
contactForm.addEventListener("submit", (event) => {
  event.preventDefault();

  if (!contactForm.reportValidity()) {
    return;
  }

  const name = contactForm.elements.name.value.trim();
  const email = contactForm.elements.email.value.trim();
  const message = contactForm.elements.message.value.trim();

  const subject = encodeURIComponent(`Portfolio inquiry from ${name}`);
  const body = encodeURIComponent(`${message}\n\nFrom: ${name}\nEmail: ${email}`);

  document.querySelector("#form-note").textContent = "Opening your email app…";

  window.location.href =
    `mailto:ayushsatapathy13@gmail.com?subject=${subject}&body=${body}`;
});