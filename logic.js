document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing portfolio');

    const navLinks = document.querySelectorAll('.nav-links a');
    const projectCards = document.querySelectorAll('.project-card');
    const projectBanners = document.querySelectorAll('.project-banner');
    const backButtons = document.querySelectorAll('.back-button');
    const pages = document.querySelectorAll('.page');
    const logo = document.querySelector('.logo');
    const nav = document.querySelector('.navigation');

    // Morph nav from banner - pill exactly when the car starts moving (SCROLL_CAM_START = 0.18)
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
            const targetPage = this.getAttribute('data-page');
            console.log('Nav link clicked:', targetPage);
            switchPage(targetPage);
        });
    });
    
    projectCards.forEach(card => {
        card.addEventListener('click', function(e) {
            if (!e.target.closest('.comparison-slider') && !e.target.closest('.comparison-wrapper')) {
                e.preventDefault();
                const targetPage = this.getAttribute('data-page');
                if (targetPage) {
                    console.log('Project card clicked:', targetPage);
                    switchPage(targetPage);
                }
            }
        });
    });

    projectBanners.forEach(banner => {
        banner.addEventListener('click', function() {
            const targetPage = this.getAttribute('data-page');
            if (targetPage) {
                console.log('Project banner clicked:', targetPage);
                switchPage(targetPage);
            }
        });
    });
    
    backButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const targetPage = this.getAttribute('data-page');
            console.log('Back button clicked:', targetPage);
            switchPage(targetPage);
        });
    });
    
    document.querySelectorAll('.nav-links a').forEach(a => {
        a.classList.toggle('active-link', a.getAttribute('data-page') === 'projects');
    });

    logo.addEventListener('click', function() {
        console.log('Logo clicked, switching to projects');
        switchPage('projects');
    });
    
    // Page switching function with fade animation
    function switchPage(targetPageId) {
        const currentPage = document.querySelector('.page.active');
        const targetPage = document.getElementById(targetPageId + '-page');
        
        if (!targetPage) {
            console.error('Target page not found:', targetPageId + '-page');
            return;
        }
        
        if (currentPage === targetPage) {
            console.log('Same page, no switch needed');
            return;
        }
        
        console.log('Switching from', currentPage.id, 'to', targetPage.id);
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
                const descriptions = popup.querySelectorAll('.timeline-description-content');
                descriptions.forEach(desc => desc.style.display = 'none');
                console.log('Timeline popup hidden for:', targetPageId);
            }
        }, 500);
    }
    
    const timelines = document.querySelectorAll('.timeline');
    console.log('Found', timelines.length, 'timelines');
    
    function hidePopup(timeline) {
        const popup = timeline.querySelector('#timeline-popup');
        if (popup) {
            popup.classList.remove('active');
            const descriptions = popup.querySelectorAll('.timeline-description-content');
            descriptions.forEach(desc => desc.style.display = 'none');
            console.log('Popup hidden for timeline');
        }
    }
    
    timelines.forEach(timeline => {
        const markers = timeline.querySelectorAll('.timeline-marker');
        const popup = timeline.querySelector('#timeline-popup');
        const closeButton = timeline.querySelector('.popup-close');
        
        console.log('Found', markers.length, 'markers in timeline');
        
        markers.forEach(marker => {
            marker.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const descId = marker.getAttribute('data-description');
                const description = popup.querySelector(`#${descId}`);
                
                if (!description) {
                    console.error('Description not found for ID:', descId);
                    return;
                }
                
                const allDescriptions = popup.querySelectorAll('.timeline-description-content');
                const isActive = description.style.display === 'block';
                
                allDescriptions.forEach(desc => desc.style.display = 'none');
                
                if (!isActive) {
                    description.style.display = 'block';
                    popup.classList.add('active');
                    console.log('Marker clicked:', descId, 'Popup shown');
                } else {
                    popup.classList.remove('active');
                    console.log('Marker clicked:', descId, 'Popup hidden');
                }
            });
        });
        
        if (closeButton) {
            closeButton.addEventListener('click', (e) => {
                e.stopPropagation();
                hidePopup(timeline);
                console.log('Close button clicked, popup hidden');
            });
        }
        
        // Hide popup when clicking outside timeline
        document.addEventListener('click', (e) => {
            if (!timeline.contains(e.target) && !popup.contains(e.target)) {
                hidePopup(timeline);
            }
        });
    });
    
    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = entry.target.classList.contains('timeline-item') ? 'timelineFadeIn 0.8s ease forwards' : 'slideUp 0.8s ease forwards';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    document.querySelectorAll('.slide-up, .timeline-item').forEach(el => {
        observer.observe(el);
    });
    
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});
