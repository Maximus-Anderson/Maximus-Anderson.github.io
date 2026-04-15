document.addEventListener('DOMContentLoaded', function() {
    const navLinks = document.querySelectorAll('.nav-links a');
    const projectCards = document.querySelectorAll('.project-card');
    const projectBanners = document.querySelectorAll('.project-banner');
    const backButtons = document.querySelectorAll('.back-button');
    const logo = document.querySelector('.logo');
    const nav = document.querySelector('.navigation');

    // Morph nav from banner → pill exactly when the car starts moving (SCROLL_CAM_START = 0.18)
    function getCarMorphThreshold() {
        const driver = document.querySelector('.car-scroll-driver');
        if (!driver) return 80;
        const scrollable = driver.offsetHeight - window.innerHeight;
        return 0.18 * scrollable + driver.offsetTop;
    }

    let morphThreshold = getCarMorphThreshold();
    window.addEventListener('resize', () => { morphThreshold = getCarMorphThreshold(); }, { passive: true });
    window.addEventListener('scroll', () => {
        nav.classList.toggle('scrolled', window.scrollY > morphThreshold);
    }, { passive: true });

    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            switchPage(this.getAttribute('data-page'));
        });
    });

    projectCards.forEach(card => {
        card.addEventListener('click', function(e) {
            if (!e.target.closest('.comparison-slider') && !e.target.closest('.comparison-wrapper')) {
                e.preventDefault();
                const targetPage = this.getAttribute('data-page');
                if (targetPage) switchPage(targetPage);
            }
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

    document.querySelectorAll('.nav-links a').forEach(a => {
        a.classList.toggle('active-link', a.getAttribute('data-page') === 'projects');
    });

    logo.addEventListener('click', () => switchPage('projects'));

    function switchPage(targetPageId) {
        const currentPage = document.querySelector('.page.active');
        const targetPage = document.getElementById(targetPageId + '-page');

        if (!targetPage || currentPage === targetPage) return;

        currentPage.style.animation = 'fadeOut 0.5s ease forwards';

        setTimeout(() => {
            currentPage.classList.remove('active');
            targetPage.classList.add('active');

            document.querySelectorAll('.nav-links a').forEach(a => {
                a.classList.toggle('active-link', a.getAttribute('data-page') === targetPageId);
            });

            targetPage.style.animation = 'none';
            targetPage.style.opacity = '0';
            setTimeout(() => {
                targetPage.style.animation = 'fadeIn 0.5s ease forwards';
                targetPage.style.opacity = '1';
            }, 10);

            window.scrollTo({ top: 0, behavior: 'smooth' });

            const animatedElements = targetPage.querySelectorAll('.slide-up, .fade-in, .timeline-item');
            animatedElements.forEach((el, index) => {
                el.style.animation = 'none';
                el.style.opacity = '0';
                setTimeout(() => {
                    el.style.animation = '';
                    el.style.opacity = '';
                }, 10 + index * 100);
            });

            const popup = targetPage.querySelector('#timeline-popup');
            if (popup) {
                popup.classList.remove('active');
                popup.querySelectorAll('.timeline-description-content').forEach(desc => desc.style.display = 'none');
            }
        }, 500);
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

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = entry.target.classList.contains('timeline-item')
                    ? 'timelineFadeIn 0.8s ease forwards'
                    : 'slideUp 0.8s ease forwards';
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -100px 0px' });

    document.querySelectorAll('.slide-up, .timeline-item').forEach(el => observer.observe(el));

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    });
});
