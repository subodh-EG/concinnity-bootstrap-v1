function includeHTML(id, file) {
  fetch(file)
    .then((response) => response.text())
    .then((data) => {
      const element = document.getElementById(id);
      if (element) {
        element.innerHTML = data;
      } else {
        console.error(`Element with id "${id}" not found.`);
      }
    })
    .catch((error) =>
      console.error(
        `Error loading file "${file}" for element id "${id}":`,
        error
      )
    );
}

// Number animation function
function animateNumber(
  elementId,
  finalValue,
  suffix = "",
  prefix = "",
  duration = 2000
) {
  const element = document.getElementById(elementId);
  if (!element) return;

  const startValue = 0;
  const startTime = Date.now();

  function updateNumber() {
    const currentTime = Date.now();
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);

    // Easing function for smooth animation
    const easeOutCubic = 1 - Math.pow(1 - progress, 3);
    const currentValue = Math.floor(
      startValue + (finalValue - startValue) * easeOutCubic
    );

    element.textContent = prefix + currentValue + suffix;

    if (progress < 1) {
      requestAnimationFrame(updateNumber);
    } else {
      // Ensure final value is exact
      element.textContent = prefix + finalValue + suffix;
    }
  }

  updateNumber();
}

// Intersection Observer for triggering animations when section comes into view
function initStatsAnimation() {
  const statsSection = document.querySelector(".success-metrics-section");
  if (!statsSection) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // Trigger animations with slight delays for better effect
          setTimeout(() => animateNumber("stat-1", 120, "%", "+", 1500), 200);
          setTimeout(() => animateNumber("stat-2", 400, "+", "", 1800), 400);
          setTimeout(() => animateNumber("stat-3", 60, "%", "", 1600), 600);

          // Unobserve after animation starts
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.5, // Trigger when 50% of the section is visible
      rootMargin: "-50px", // Start animation a bit before the section is fully visible
    }
  );

  observer.observe(statsSection);
}

// Initialize stats animation when DOM is loaded
document.addEventListener("DOMContentLoaded", function () {
  // Small delay to ensure all elements are rendered
  setTimeout(initStatsAnimation, 100);
});

// Dropdown submenu functionality
document.addEventListener("DOMContentLoaded", function () {
  // Toggle second-level submenus (desktop + mobile)
  document.querySelectorAll(".dropdown-submenu > a").forEach((trigger) => {
    trigger.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();

      const submenu = this.nextElementSibling; // the nested .dropdown-menu
      if (!submenu) return;

      // close other open submenus at the same level
      const siblings =
        this.closest(".dropdown-menu")?.querySelectorAll(
          ".dropdown-menu.show"
        ) || [];
      siblings.forEach((m) => {
        if (m !== submenu) m.classList.remove("show");
      });

      submenu.classList.toggle("show");
    });
  });

  // When the parent dropdown fully closes, hide any open submenus
  document.querySelectorAll(".dropdown").forEach((dd) => {
    dd.addEventListener("hidden.bs.dropdown", () => {
      dd.querySelectorAll(".dropdown-menu.show").forEach((m) =>
        m.classList.remove("show")
      );
    });
  });
});
