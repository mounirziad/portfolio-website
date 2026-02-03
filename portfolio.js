document.addEventListener('DOMContentLoaded', () => {
    // 1. Mouse Spotlight Effect for Project Cards
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

    // 2. Scroll Reveal Observer
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.reveal-on-scroll').forEach(el => observer.observe(el));

    // 3. Header Scroll Styling
    window.addEventListener('scroll', () => {
        const header = document.getElementById('main-header');
        if (window.scrollY > 50) {
            header.classList.add('header-scrolled');
        } else {
            header.classList.remove('header-scrolled');
        }
    });
});