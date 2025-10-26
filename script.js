document.addEventListener('DOMContentLoaded', () => {
  const videos = document.querySelectorAll('.project-video');

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    },
    { threshold: 0.4 }
  );

  videos.forEach(video => observer.observe(video));
});
