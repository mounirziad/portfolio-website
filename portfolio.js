document.addEventListener('DOMContentLoaded', () => {
    
    // --- ROBUST PRELOADER LOGIC ---
    const preloader = document.getElementById('preloader');
    const videos = document.querySelectorAll('video');
    const loadingText = document.querySelector('.loader-text');
    
    // Helper to remove preloader smoothly
    const removePreloader = () => {
        if (preloader && !preloader.classList.contains('fade-out')) {
            preloader.classList.add('fade-out');
            setTimeout(() => preloader.style.display = 'none', 500);
        }
    };

    // 1. Force every video to start playing immediately
    // This wakes up the browser's video decoder
    videos.forEach(video => {
        video.play().catch(() => {
            // If autoplay is blocked (rare on muted), we just proceed
            console.log("Autoplay blocked or waiting for interaction");
        });
    });

    // 2. Create a strict promise for every video
    const videoPromises = Array.from(videos).map(video => {
        return new Promise(resolve => {
            // A. If video is already playing and visible
            if (video.currentTime > 0 && !video.paused && video.readyState >= 3) {
                resolve();
                return;
            }

            // B. Wait for the 'playing' event (This confirms the first frame is rendering)
            const playHandler = () => {
                video.removeEventListener('playing', playHandler);
                resolve();
            };
            
            // C. Fallback for cached videos that might not fire 'playing' again
            const timeUpdateHandler = () => {
                if(video.currentTime > 0) {
                    video.removeEventListener('timeupdate', timeUpdateHandler);
                    resolve();
                }
            }

            video.addEventListener('playing', playHandler);
            video.addEventListener('timeupdate', timeUpdateHandler);
            
            // D. Safety valve: If it errors, don't block the site
            video.addEventListener('error', resolve, { once: true });
        });
    });

    // 3. Wait for ALL videos + Window Load
    Promise.all([
        ...videoPromises,
        new Promise(resolve => window.addEventListener('load', resolve, { once: true }))
    ]).then(() => {
        // slight buffer to ensure rendering pipeline is clear
        setTimeout(removePreloader, 100); 
    });

    // 4. Maximum Wait Time (Safety Net)
    // If connection is too slow, show site after 4 seconds anyway
    setTimeout(() => {
        if (loadingText) loadingText.innerText = "STARTING...";
        removePreloader();
    }, 4000);


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