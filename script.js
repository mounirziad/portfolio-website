// script.js
document.addEventListener('DOMContentLoaded', () => {
  // Scroll animations
  const fadeElements = document.querySelectorAll('.fade-on-scroll, .project-video');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.3 });

  fadeElements.forEach(el => observer.observe(el));

  // YouTube error handling with timeout fallback
  const youtubeContainer = document.getElementById('youtube-container');
  const fallbackLink = document.getElementById('youtube-fallback-link');
  
  if (youtubeContainer) {
    // Create iframe dynamically
    const iframe = document.createElement('iframe');
    iframe.width = '560';
    iframe.height = '315';
    iframe.src = 'https://www.youtube.com/embed/s6VDMcdXiTk';
    iframe.title = 'Tetris Reimagined Gameplay';
    iframe.frameBorder = '0';
    iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
    iframe.allowFullscreen = true;
    iframe.loading = 'lazy';
    
    // Replace fallback with iframe
    youtubeContainer.innerHTML = '';
    youtubeContainer.appendChild(iframe);
    
    // Set timeout to show fallback if iframe doesn't load properly
    const youtubeTimeout = setTimeout(() => {
      console.log('YouTube embed timeout - showing fallback');
      youtubeContainer.innerHTML = `
        <div style="background: var(--bg-tertiary); padding: var(--space-xxl); text-align: center; border-radius: var(--radius-md);">
          <div style="font-size: 3rem; margin-bottom: var(--space-md);">⚠️</div>
          <h3>Video Unavailable</h3>
          <p style="color: var(--text-secondary); margin-bottom: var(--space-lg);">The embedded video could not be loaded</p>
          <a href="https://www.youtube.com/watch?v=s6VDMcdXiTk" class="btn btn-primary" target="_blank">
            Watch on YouTube
          </a>
        </div>
      `;
    }, 4000); // 4 second timeout
    
    // Clear timeout if iframe loads successfully
    iframe.addEventListener('load', () => {
      console.log('YouTube iframe loaded successfully');
      clearTimeout(youtubeTimeout);
    });
    
    iframe.addEventListener('error', () => {
      console.error('YouTube iframe failed to load');
      clearTimeout(youtubeTimeout);
      youtubeContainer.innerHTML = `
        <div style="background: var(--bg-tertiary); padding: var(--space-xxl); text-align: center; border-radius: var(--radius-md);">
          <div style="font-size: 3rem; margin-bottom: var(--space-md);">⚠️</div>
          <h3>Video Unavailable</h3>
          <p style="color: var(--text-secondary); margin-bottom: var(--space-lg);">The embedded video could not be loaded</p>
          <a href="https://www.youtube.com/watch?v=s6VDMcdXiTk" class="btn btn-primary" target="_blank">
            Watch on YouTube
          </a>
        </div>
      `;
    });
  }
});
