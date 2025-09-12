/*****
 *  Function to include HTML content from external files
 */

function includeHTML(id, file) {
  fetch(file)
    .then((response) => response.text())
    .then((data) => {
      const element = document.getElementById(id);
      if (element) {
        element.innerHTML = data;
        // Notify listeners that an include fragment finished loading
        document.dispatchEvent(
          new CustomEvent("include:loaded", { detail: { id, file } })
        );
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

/*****
 * Number Animation Function
 */

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
  initNavbarDropdownHover();
});

// --- Dropdown Hover Logic for Multi-level Menus (desktop only) ---
function initNavbarDropdownHover() {
  // Remove any previously attached handlers by cloning nodes (simple reset)
  // Only activate on desktop widths
  if (window.innerWidth < 992) {
    // Ensure menus are closed on smaller screens
    document
      .querySelectorAll(".navbar-nav .dropdown-menu.show")
      .forEach((m) => m.classList.remove("show"));
    document
      .querySelectorAll(
        ".navbar-nav .dropdown-toggle, .navbar-nav .nav-link.dropdown-toggle"
      )
      .forEach((t) => t.setAttribute("aria-expanded", "false"));
    return;
  }

  // Helper to show/hide a menu and maintain aria-expanded
  const showMenu = (menu) => {
    if (!menu) return;
    menu.classList.add("show");
    const toggle = menu.parentElement.querySelector(
      ".dropdown-toggle, .nav-link.dropdown-toggle"
    );
    if (toggle) toggle.setAttribute("aria-expanded", "true");
  };
  const hideMenu = (menu) => {
    if (!menu) return;
    menu.classList.remove("show");
    const toggle = menu.parentElement.querySelector(
      ".dropdown-toggle, .nav-link.dropdown-toggle"
    );
    if (toggle) toggle.setAttribute("aria-expanded", "false");
    // Close any descendant menus
    menu.querySelectorAll(".dropdown-menu.show").forEach((child) => {
      child.classList.remove("show");
      const childToggle = child.parentElement.querySelector(
        ".dropdown-toggle, .nav-link.dropdown-toggle"
      );
      if (childToggle) childToggle.setAttribute("aria-expanded", "false");
    });
  };

  // Attach hover handlers to each dropdown/dropend item
  document
    .querySelectorAll(".navbar-nav .dropdown, .navbar-nav .dropend")
    .forEach((item) => {
      const menu = item.querySelector(":scope > .dropdown-menu");
      if (!menu) return;

      let hideTimer;
      const onEnter = () => {
        clearTimeout(hideTimer);
        showMenu(menu);
      };
      const onLeave = () => {
        hideTimer = setTimeout(() => {
          if (!item.matches(":hover")) hideMenu(menu);
        }, 120);
      };

      // Avoid duplicate listeners: remove old, then add
      item.removeEventListener("mouseenter", onEnter);
      item.removeEventListener("mouseleave", onLeave);
      item.addEventListener("mouseenter", onEnter);
      item.addEventListener("mouseleave", onLeave);

      // Handle immediate children with dropend (right-side submenus)
      menu.querySelectorAll(":scope > .dropend").forEach((child) => {
        const childMenu = child.querySelector(":scope > .dropdown-menu");
        if (!childMenu) return;
        let childTimer;
        const childEnter = () => {
          clearTimeout(childTimer);
          showMenu(childMenu);
        };
        const childLeave = () => {
          childTimer = setTimeout(() => {
            if (!child.matches(":hover")) hideMenu(childMenu);
          }, 120);
        };
        child.removeEventListener("mouseenter", childEnter);
        child.removeEventListener("mouseleave", childLeave);
        child.addEventListener("mouseenter", childEnter);
        child.addEventListener("mouseleave", childLeave);
      });
    });
}

// Re-init after header include completes
document.addEventListener("include:loaded", (e) => {
  if (e.detail && e.detail.id === "header") {
    initNavbarDropdownHover();
  }
});

// Re-init on resize (to switch behaviors when crossing desktop threshold)
window.addEventListener("resize", () => initNavbarDropdownHover());

// <!-- Swiper Init Script -->
var swiper = new Swiper(".trusted-swiper", {
  slidesPerView: 2, // mobile default
  spaceBetween: 20,
  loop: true,
  autoplay: {
    delay: 0, // continuous scroll
    disableOnInteraction: false,
    pauseOnMouseEnter: true,
  },
  freeMode: {
    enabled: true,
    momentum: false,
  },
  speed: 16000, // control scroll speed
  breakpoints: {
    576: {
      slidesPerView: 3,
    },
    768: {
      slidesPerView: 4,
    },
    992: {
      slidesPerView: 5,
    },
    1200: {
      slidesPerView: 6,
    },
  },
});
