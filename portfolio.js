document.addEventListener('DOMContentLoaded', () => {
    
    // --- PRELOADER LOGIC ---
    const preloader = document.getElementById('preloader');
    const videos = document.querySelectorAll('video');
    
    // Helper to remove preloader
    const removePreloader = () => {
        if (preloader) {
            preloader.classList.add('fade-out');
            setTimeout(() => preloader.style.display = 'none', 500);
        }
    };

    // 1. Create a promise for every video
    const videoPromises = Array.from(videos).map(video => {
        return new Promise(resolve => {
            if (video.readyState >= 3) {
                resolve();
            } else {
                video.addEventListener('canplay', resolve, { once: true });
                video.addEventListener('error', resolve, { once: true });
            }
        });
    });

    // 2. Wait for videos + window load
    Promise.all([
        ...videoPromises,
        new Promise(resolve => window.addEventListener('load', resolve, { once: true }))
    ]).then(() => {
        removePreloader();
    });

    // 3. Fallback safety (5 seconds)
    setTimeout(removePreloader, 5000);


    // --- MOUSE SPOTLIGHT ---
    const handleMouseMove = e => {
        const { currentTarget: target } = e;
        const rect = target.getBoundingClientRect(),
              x = e.clientX - rect.left,
              y = e.clientY - rect.top;

        target.style.setProperty("--mouse-x", `${x}px`);
        target.style.setProperty("--mouse-y", `${y}px`);
    }

    document.querySelectorAll(".project-card").forEach(card => {
        card.onmousemove = e => handleMouseMove(e);
    });

    // --- SCROLL REVEAL ---
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.reveal-on-scroll').forEach(el => observer.observe(el));

    // --- HEADER SCROLL ---
    const header = document.getElementById('main-header');
    const updateHeader = () => {
        if (window.scrollY > 50) {
            header.classList.add('header-scrolled');
        } else {
            header.classList.remove('header-scrolled');
        }
    };
    window.addEventListener('scroll', updateHeader);
});