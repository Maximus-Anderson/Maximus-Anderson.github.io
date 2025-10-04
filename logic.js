// Page Navigation
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing portfolio');

    const navLinks = document.querySelectorAll('.nav-links a');
    const projectCards = document.querySelectorAll('.project-card');
    const backButtons = document.querySelectorAll('.back-button');
    const pages = document.querySelectorAll('.page');
    const logo = document.querySelector('.logo');
    
    // Navigation click handler for top nav
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetPage = this.getAttribute('data-page');
            console.log('Nav link clicked:', targetPage);
            switchPage(targetPage);
        });
    });
    
    // Project card click handler
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
    
    // Back button click handler
    backButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const targetPage = this.getAttribute('data-page');
            console.log('Back button clicked:', targetPage);
            switchPage(targetPage);
        });
    });
    
    // Logo click - go to projects
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
            
            // Hide timeline popup
            const popup = targetPage.querySelector('#timeline-popup');
            if (popup) {
                popup.classList.remove('active');
                const descriptions = popup.querySelectorAll('.timeline-description-content');
                descriptions.forEach(desc => desc.style.display = 'none');
                console.log('Timeline popup hidden for:', targetPageId);
            }
        }, 500);
    }
    
    // Before/After Comparison Slider
    const comparisonSlider = document.querySelector('.comparison-slider');
    const comparisonSliderContainer = document.querySelector('.comparison-slider-container');
    const comparisonHandle = document.querySelector('.comparison-handle');
    const comparisonWrapper = document.querySelector('.comparison-wrapper');
    const comparisonBefore = document.querySelector('.comparison-before');
    const comparisonAfter = document.querySelector('.comparison-after');
    
    if (comparisonSlider && comparisonSliderContainer && comparisonHandle && comparisonWrapper && comparisonBefore && comparisonAfter) {
        console.log('Initializing comparison slider');
        function setBeforeImageWidth() {
            const wrapperWidth = comparisonWrapper.offsetWidth;
            comparisonBefore.style.width = wrapperWidth + 'px';
        }
        
        function updateSlider(value) {
            const percentage = value;
            comparisonSliderContainer.style.width = percentage + '%';
            comparisonHandle.style.left = percentage + '%';
        }
        
        function initializeSlider() {
            setBeforeImageWidth();
            updateSlider(comparisonSlider.value);
        }
        
        let imagesLoaded = 0;
        const checkImagesLoaded = () => {
            imagesLoaded++;
            if (imagesLoaded === 2) {
                console.log('Comparison images loaded, initializing slider');
                initializeSlider();
                window.addEventListener('resize', setBeforeImageWidth);
            }
        };
        
        comparisonBefore.addEventListener('load', checkImagesLoaded);
        comparisonAfter.addEventListener('load', checkImagesLoaded);
        
        setTimeout(() => {
            if (imagesLoaded < 2) {
                console.log('Fallback: initializing slider after timeout');
                initializeSlider();
                window.addEventListener('resize', setBeforeImageWidth);
            }
        }, 1000);
        
        comparisonSlider.addEventListener('input', function(e) {
            updateSlider(this.value);
        });
        
        let isDraggingComparison = false;
        
        function handleComparisonMove(e) {
            if (!isDraggingComparison) return;
            
            const rect = comparisonWrapper.getBoundingClientRect();
            let x = e.clientX || (e.touches && e.touches[0].clientX);
            let position = ((x - rect.left) / rect.width) * 100;
            position = Math.max(0, Math.min(100, position));
            
            comparisonSlider.value = position;
            updateSlider(position);
        }
        
        comparisonWrapper.addEventListener('mousedown', (e) => {
            e.stopPropagation();
            isDraggingComparison = true;
            handleComparisonMove(e);
        });
        
        document.addEventListener('mousemove', handleComparisonMove);
        
        document.addEventListener('mouseup', () => {
            isDraggingComparison = false;
        });
        
        comparisonWrapper.addEventListener('touchstart', (e) => {
            e.stopPropagation();
            isDraggingComparison = true;
            handleComparisonMove(e);
        });
        
        document.addEventListener('touchmove', handleComparisonMove);
        
        document.addEventListener('touchend', () => {
            isDraggingComparison = false;
        });
        
        comparisonSlider.addEventListener('keydown', function(e) {
            if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
                e.preventDefault();
                const step = e.key === 'ArrowLeft' ? -1 : 1;
                const newValue = Math.max(0, Math.min(100, parseFloat(this.value) + step));
                this.value = newValue;
                updateSlider(newValue);
            }
        });
    } else {
        console.warn('Comparison slider elements not found');
    }
    
    // Timeline Clicking
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
        
        // Close button handler
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
