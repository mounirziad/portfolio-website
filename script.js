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

  // YouTube iframe error handling
  const iframe = document.querySelector('.video-container iframe');
  
  // Only add event listeners if the iframe exists
  if (iframe) {
    iframe.addEventListener('load', function() {
      console.log('YouTube iframe loaded successfully');
    });
    
    iframe.addEventListener('error', function() {
      console.error('YouTube iframe failed to load');
      // Show fallback message
      const container = this.parentElement;
      container.innerHTML = `
        <div style="background: var(--bg-tertiary); padding: var(--space-xl); text-align: center; border-radius: var(--radius-md);">
          <p style="color: var(--error); margin-bottom: var(--space-md);">⚠️ Video unavailable</p>
          <a href="https://www.youtube.com/watch?v=s6VDMcdXiTk" class="btn btn-primary" target="_blank">
            Watch on YouTube
          </a>
        </div>
      `;
    });
  }

  // Copy code functionality (if you want to move this from inline script)
  document.querySelectorAll('.code-copy').forEach(button => {
    button.addEventListener('click', function() {
      const codeBlock = this.closest('.code-block').querySelector('code');
      const textArea = document.createElement('textarea');
      textArea.value = codeBlock.textContent;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      
      // Visual feedback
      const originalText = this.textContent;
      this.textContent = '✅ Copied!';
      setTimeout(() => {
        this.textContent = originalText;
      }, 2000);
    });
  });
});
