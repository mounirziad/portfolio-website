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

  // YouTube error handling with enhanced detection
  const youtubeContainer = document.getElementById('youtube-container');
  const videoStatus = document.getElementById('video-status');
  const fallbackLink = document.getElementById('youtube-fallback-link');
  
  if (youtubeContainer) {
    let fallbackShown = false;
    
    const showFallback = () => {
      if (fallbackShown) return;
      fallbackShown = true;
      
      console.log('Showing YouTube fallback');
      youtubeContainer.innerHTML = `
        <div style="background: var(--bg-tertiary); padding: var(--space-xxl); text-align: center; border-radius: var(--radius-md);">
          <div style="font-size: 3rem; margin-bottom: var(--space-md);">⚠️</div>
          <h3>Video Unavailable</h3>
          <p style="color: var(--text-secondary); margin-bottom: var(--space-lg);">The embedded video could not be loaded due to privacy restrictions.</p>
          <a href="https://www.youtube.com/watch?v=s6VDMcdXiTk" class="btn btn-primary" target="_blank">
            Watch on YouTube
          </a>
        </div>
      `;
    };

    // Method 1: Try to detect YouTube errors by checking iframe dimensions
    const checkYouTubeError = () => {
      const iframe = youtubeContainer.querySelector('iframe');
      if (iframe) {
        // If iframe has very small dimensions, it's likely showing an error
        const rect = iframe.getBoundingClientRect();
        if (rect.height < 100 || rect.width < 100) {
          console.log('YouTube iframe appears to have error dimensions');
          showFallback();
        }
      }
    };

    // Create iframe
    const iframe = document.createElement('iframe');
    iframe.width = '560';
    iframe.height = '315';
    iframe.src = 'https://www.youtube.com/embed/s6VDMcdXiTk';
    iframe.title = 'Tetris Reimagined Gameplay';
    iframe.frameBorder = '0';
    iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
    iframe.allowFullscreen = true;
    iframe.loading = 'lazy';
    
    // Replace placeholder with iframe
    youtubeContainer.innerHTML = '';
    youtubeContainer.appendChild(iframe);
    
    // Method 2: Timeout fallback (primary method)
    const youtubeTimeout = setTimeout(() => {
      console.log('YouTube embed timeout - showing fallback');
      showFallback();
    }, 3000); // 3 second timeout
    
    // Method 3: Periodic check for error state
    const errorCheckInterval = setInterval(() => {
      if (fallbackShown) {
        clearInterval(errorCheckInterval);
        return;
      }
      checkYouTubeError();
    }, 1000);
    
    // Clear intervals if iframe loads successfully
    iframe.addEventListener('load', () => {
      console.log('YouTube iframe load event fired');
      clearTimeout(youtubeTimeout);
      clearInterval(errorCheckInterval);
      
      // Double-check after a moment if the iframe is actually working
      setTimeout(() => {
        if (!fallbackShown) {
          checkYouTubeError();
        }
      }, 2000);
    });
    
    // Standard error event (may not fire for YouTube errors)
    iframe.addEventListener('error', () => {
      console.error('YouTube iframe standard error event');
      clearTimeout(youtubeTimeout);
      clearInterval(errorCheckInterval);
      showFallback();
    });

    // Method 4: MutationObserver to detect YouTube error messages
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (!fallbackShown && youtubeContainer.textContent.includes('error') || 
            youtubeContainer.textContent.includes('unavailable') ||
            youtubeContainer.textContent.includes('153')) {
          console.log('Detected YouTube error text in container');
          showFallback();
        }
      });
    });
    
    observer.observe(youtubeContainer, {
      childList: true,
      subtree: true,
      characterData: true
    });
  }

  // Copy code functionality (if you want it here instead of inline)
  document.querySelectorAll('.code-copy').forEach(button => {
    button.addEventListener('click', function() {
      const codeBlock = this.closest('.code-block').querySelector('code');
      const textArea = document.createElement('textarea');
      textArea.value = codeBlock.textContent;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      
      const originalText = this.textContent;
      this.textContent = '✅ Copied!';
      setTimeout(() => {
        this.textContent = originalText;
      }, 2000);
    });
  });
});
