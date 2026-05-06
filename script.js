document.addEventListener("DOMContentLoaded", () => {

    // --- VIDEO SCRUBBING (REFACTORED) ---
    const scrollySections = [
        {
            containerId: 'hero-scrolly',
            videoId: 'hero-video',
            contentId: 'hero-text',
            startFade: 0.3,
            endFade: 0.6
        },
        {
            containerId: 'projects-scrolly',
            videoId: 'projects-video',
            contentId: 'projects-container',
            startFade: 0.1,
            endFade: 0.9 // Projects section stays visible longer
        }
    ];

    scrollySections.forEach(section => {
        const container = document.getElementById(section.containerId);
        const video = document.getElementById(section.videoId);
        const content = document.getElementById(section.contentId);

        if (container && video) {
            video.load();
            let ticking = false;

            window.addEventListener('scroll', () => {
                if (!ticking) {
                    window.requestAnimationFrame(() => {
                        const rect = container.getBoundingClientRect();
                        const viewHeight = window.innerHeight;
                        
                        // Check if section is in viewport
                        if (rect.top < viewHeight && rect.bottom > 0) {
                            const scrollPosition = -rect.top;
                            const scrollableHeight = container.offsetHeight - viewHeight;

                            let scrollFraction = scrollPosition / scrollableHeight;
                            scrollFraction = Math.max(0, Math.min(1, scrollFraction));

                            if (!isNaN(video.duration) && video.duration > 0) {
                                video.currentTime = video.duration * scrollFraction;
                            }

                            // Content fade/transform
                            if (content) {
                                // Fade in/out based on scroll fraction
                                let opacity = 1;
                                if (scrollFraction < section.startFade) {
                                    opacity = scrollFraction / section.startFade;
                                } else if (scrollFraction > section.endFade) {
                                    opacity = 1 - ((scrollFraction - section.endFade) / (1 - section.endFade));
                                }
                                
                                const transformY = -(scrollFraction * 50); // Subtle upward move
                                
                                content.style.opacity = Math.max(0, Math.min(1, opacity));
                                content.style.transform = `translateY(${transformY}px)`;
                            }
                        }

                        ticking = false;
                    });
                    ticking = true;
                }
            });
        }
    });

    // --- FADE-UP OBSERVER ---
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                obs.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
});
