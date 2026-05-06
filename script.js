document.addEventListener("DOMContentLoaded", () => {

    // --- VIDEO SCRUBBING (OPTIMIZED) ---
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
            endFade: 0.9 
        }
    ];

    scrollySections.forEach(section => {
        const container = document.getElementById(section.containerId);
        const video = document.getElementById(section.videoId);
        const content = document.getElementById(section.contentId);

        if (container && video) {
            // Ensure video plays smoothly
            video.setAttribute('muted', '');
            video.setAttribute('playsinline', '');
            
            let ticking = false;

            const updateScrub = () => {
                const rect = container.getBoundingClientRect();
                const viewHeight = window.innerHeight;
                
                if (rect.top < viewHeight && rect.bottom > 0) {
                    const scrollPosition = -rect.top;
                    const scrollableHeight = container.offsetHeight - viewHeight;

                    let scrollFraction = scrollPosition / scrollableHeight;
                    scrollFraction = Math.max(0, Math.min(1, scrollFraction));

                    if (video.readyState >= 1) { // METADATA_LOADED
                        video.currentTime = video.duration * scrollFraction;
                    }

                    if (content) {
                        let opacity = 1;
                        if (scrollFraction < section.startFade) {
                            opacity = scrollFraction / section.startFade;
                        } else if (scrollFraction > section.endFade) {
                            opacity = 1 - ((scrollFraction - section.endFade) / (1 - section.endFade));
                        }
                        
                        const transformY = -(scrollFraction * 50);
                        content.style.opacity = Math.max(0, Math.min(1, opacity));
                        content.style.transform = `translateY(${transformY}px)`;
                    }
                }
            };

            window.addEventListener('scroll', () => {
                if (!ticking) {
                    window.requestAnimationFrame(() => {
                        updateScrub();
                        ticking = false;
                    });
                    ticking = true;
                }
            }, { passive: true });

            // Initial call
            updateScrub();
        }
    });

    // --- FADE-UP OBSERVER ---
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
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
