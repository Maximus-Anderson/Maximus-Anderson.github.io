document.addEventListener('DOMContentLoaded', function() {
    const navLinks = document.querySelectorAll('.nav-links a');
    const projectBanners = document.querySelectorAll('.project-banner');
    const backButtons = document.querySelectorAll('.back-button');
    const logo = document.querySelector('.logo');
    const nav = document.querySelector('.navigation');

    function getCarMorphThreshold() {
        const driver = document.querySelector('.car-scroll-driver');
        if (!driver) return 80;
        const fromViewer = parseFloat(driver.dataset.morphY);
        if (Number.isFinite(fromViewer)) return fromViewer;
        const scrollable = driver.offsetHeight - window.innerHeight;
        return 0.12 * scrollable + driver.offsetTop;
    }

    window.addEventListener('scroll', () => {
        nav.classList.toggle('scrolled', window.scrollY > getCarMorphThreshold());
    }, { passive: true });

    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            switchPage(this.getAttribute('data-page'));
        });
    });

    projectBanners.forEach(banner => {
        banner.addEventListener('click', function() {
            const targetPage = this.getAttribute('data-page');
            if (targetPage) switchPage(targetPage);
        });
    });

    backButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            switchPage(this.getAttribute('data-page'));
        });
    });

    document.querySelectorAll('.inline-page-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetPage = this.getAttribute('data-page');
            if (targetPage) switchPage(targetPage);
        });
    });

    navLinks.forEach(a => {
        a.classList.toggle('active-link', a.getAttribute('data-page') === 'projects');
    });

    logo.addEventListener('click', () => switchPage('projects'));

    const scrollPositions = new Map();
    const visitedPages = new Set();
    const initiallyActive = document.querySelector('.page.active');
    if (initiallyActive) visitedPages.add(initiallyActive.id.replace(/-page$/, ''));

    let switching = false;

    function switchPage(targetPageId) {
        if (switching) return;
        const currentPage = document.querySelector('.page.active');
        const targetPage = document.getElementById(targetPageId + '-page');

        if (!targetPage || currentPage === targetPage) return;

        const currentPageId = currentPage.id.replace(/-page$/, '');
        scrollPositions.set(currentPageId, window.scrollY);

        switching = true;
        currentPage.style.animation = 'fadeOut 0.12s ease forwards';

        setTimeout(() => {
            switching = false;
            currentPage.classList.remove('active');
            targetPage.classList.add('active');

            navLinks.forEach(a => {
                a.classList.toggle('active-link', a.getAttribute('data-page') === targetPageId);
            });

            targetPage.style.animation = 'none';
            targetPage.style.opacity = '0';
            setTimeout(() => {
                targetPage.style.animation = 'fadeIn 0.2s ease forwards';
                targetPage.style.opacity = '1';
            }, 10);

            const savedScroll = scrollPositions.get(targetPageId);
            window.scrollTo({ top: savedScroll ?? 0, behavior: 'instant' });

            if (!visitedPages.has(targetPageId)) {
                visitedPages.add(targetPageId);
                const animatedElements = targetPage.querySelectorAll('.slide-up, .fade-in, .timeline-item');
                animatedElements.forEach((el) => {
                    el.style.animation = 'none';
                    el.style.opacity = '0';
                    setTimeout(() => {
                        el.style.animation = '';
                        el.style.opacity = '';
                    }, 10);
                });
            }

            const popup = targetPage.querySelector('#timeline-popup');
            if (popup) {
                popup.classList.remove('active');
                popup.querySelectorAll('.timeline-description-content').forEach(desc => desc.style.display = 'none');
            }
        }, 120);
    }

    const timelines = document.querySelectorAll('.timeline');

    function hidePopup(timeline) {
        const popup = timeline.querySelector('#timeline-popup');
        if (popup) {
            popup.classList.remove('active');
            popup.querySelectorAll('.timeline-description-content').forEach(desc => desc.style.display = 'none');
        }
    }

    timelines.forEach(timeline => {
        const markers = timeline.querySelectorAll('.timeline-marker');
        const popup = timeline.querySelector('#timeline-popup');
        const closeButton = timeline.querySelector('.popup-close');

        markers.forEach(marker => {
            marker.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const descId = marker.getAttribute('data-description');
                const description = popup.querySelector(`#${descId}`);
                if (!description) return;

                const allDescriptions = popup.querySelectorAll('.timeline-description-content');
                const isActive = description.style.display === 'block';

                allDescriptions.forEach(desc => desc.style.display = 'none');

                if (!isActive) {
                    description.style.display = 'block';
                    popup.classList.add('active');
                } else {
                    popup.classList.remove('active');
                }
            });
        });

        if (closeButton) {
            closeButton.addEventListener('click', (e) => {
                e.stopPropagation();
                hidePopup(timeline);
            });
        }

        document.addEventListener('click', (e) => {
            if (!timeline.contains(e.target) && !popup.contains(e.target)) {
                hidePopup(timeline);
            }
        });
    });

    document.addEventListener('pointermove', (e) => {
        const el = e.target.closest ? e.target.closest('.light-button, .project-banner') : null;
        if (!el) return;
        const r = el.getBoundingClientRect();
        el.style.setProperty('--bx', (e.clientX - r.left) + 'px');
        el.style.setProperty('--by', (e.clientY - r.top) + 'px');
    }, { passive: true });

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = entry.target.classList.contains('timeline-item')
                    ? 'timelineFadeIn 0.8s ease forwards'
                    : 'slideUp 0.4s ease forwards';
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -100px 0px' });

    document.querySelectorAll('.slide-up, .timeline-item').forEach(el => observer.observe(el));

    const videoObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const video = entry.target;
            if (entry.isIntersecting) {
                video.muted = true;
                video.play().catch(() => {});
            } else {
                video.pause();
            }
        });
    }, { threshold: 0.2 });

    document.querySelectorAll('video[preload="none"]').forEach(v => videoObserver.observe(v));
});
