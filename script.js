// script.js
document.addEventListener('DOMContentLoaded', () => {
  // Select all elements that should fade in
  const fadeElements = document.querySelectorAll('.fade-on-scroll, .project-video');

  // Create the intersection observer
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.3 });

  // Observe each fade element
  fadeElements.forEach(el => observer.observe(el));
});
