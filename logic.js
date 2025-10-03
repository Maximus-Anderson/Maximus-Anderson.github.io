// Page Navigation
document.addEventListener('DOMContentLoaded', function() {
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
            switchPage(targetPage);
        });
    });
    
    // Project card click handler
    projectCards.forEach(card => {
        card.addEventListener('click', function(e) {
            // Only navigate if the click is not on the slider or its handle
            if (!e.target.closest('.comparison-slider') && !e.target.closest('.comparison-wrapper')) {
                e.preventDefault();
                const targetPage = this.getAttribute('data-page');
                if (targetPage) {
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
            switchPage(targetPage);
        });
    });
    
    // Logo click - go to projects
    logo.addEventListener('click', function() {
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
            return;
        }
        
        // Fade out current page
        currentPage.style.animation = 'fadeOut 0.5s ease forwards';
        
        setTimeout(() => {
            currentPage.classList.remove('active');
            targetPage.classList.add('active');
            
            // Reset target page styles to ensure fadeIn triggers
            targetPage.style.animation = 'none';
            targetPage.style.opacity = '0';
            setTimeout(() => {
                targetPage.style.animation = 'fadeIn 0.5s ease forwards';
                targetPage.style.opacity = '1';
            }, 10);
            
            // Scroll to top
            window.scrollTo({ top: 0, behavior: 'smooth' });
            
            // Re-trigger animations for elements
            const animatedElements = targetPage.querySelectorAll('.slide-up, .fade-in, .timeline-item');
            animatedElements.forEach((el, index) => {
                el.style.animation = 'none';
                el.style.opacity = '0';
                setTimeout(() => {
                    el.style.animation = '';
                    el.style.opacity = '';
                }, 10 + index * 100);
            });
            
            // Reset timeline scroll and hide descriptions
            const timelineBar = targetPage.querySelector('.timeline-bar');
            if (timelineBar) {
                timelineBar.scrollLeft = 0;
                const descriptions = targetPage.querySelectorAll('.timeline-description');
                descriptions.forEach(desc => desc.classList.remove('active'));
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
        // Set the before image width to match wrapper width
        function setBeforeImageWidth() {
            const wrapperWidth = comparisonWrapper.offsetWidth;
            comparisonBefore.style.width = wrapperWidth + 'px';
        }
        
        // Update slider position
        function updateSlider(value) {
            const percentage = value;
            comparisonSliderContainer.style.width = percentage + '%';
            comparisonHandle.style.left = percentage + '%';
        }
        
        // Initialize slider after images load
        function initializeSlider() {
            setBeforeImageWidth();
            updateSlider(comparisonSlider.value);
        }
        
        // Wait for both images to load
        let imagesLoaded = 0;
        const checkImagesLoaded = () => {
            imagesLoaded++;
            if (imagesLoaded === 2) {
                initializeSlider();
                window.addEventListener('resize', setBeforeImageWidth);
            }
        };
        
        comparisonBefore.addEventListener('load', checkImagesLoaded);
        comparisonAfter.addEventListener('load', checkImagesLoaded);
        
        // Fallback in case images are already cached or fail to trigger load
        setTimeout(() => {
            if (imagesLoaded < 2) {
                initializeSlider();
                window.addEventListener('resize', setBeforeImageWidth);
            }
        }, 1000);
        
        // Slider input event
        comparisonSlider.addEventListener('input', function(e) {
            updateSlider(this.value);
        });
        
        // Mouse drag functionality for comparison slider
        let isDraggingComparison = false;
        
        function handleComparisonMove(e) {
            if (!isDraggingComparison) return;
            
            const rect = comparisonWrapper.getBoundingClientRect();
            let x = e.clientX || (e.touches && e.touches[0].clientX);
            let position = ((x - rect.left) / rect.width) * 100;
            
            // Clamp between 0 and 100
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
    }
    
    // Timeline Dragging and Clicking
    const timelineBars = document.querySelectorAll('.timeline-bar');
    timelineBars.forEach(bar => {
        let isDraggingTimeline = false;
        let startX, scrollLeft;
        
        bar.addEventListener('mousedown', (e) => {
            e.preventDefault();
            isDraggingTimeline = true;
            startX = e.pageX - bar.offsetLeft;
            scrollLeft = bar.scrollLeft;
            bar.style.cursor = 'grabbing';
        });
        
        bar.addEventListener('mousemove', (e) => {
            if (!isDraggingTimeline) return;
            e.preventDefault();
            const x = e.pageX - bar.offsetLeft;
            const walk = (x - startX) * 2; // Adjust scroll speed
            bar.scrollLeft = scrollLeft - walk;
        });
        
        bar.addEventListener('mouseup', () => {
            isDraggingTimeline = false;
            bar.style.cursor = 'grab';
        });
        
        bar.addEventListener('mouseleave', () => {
            isDraggingTimeline = false;
            bar.style.cursor = 'grab';
        });
        
        // Touch events for mobile
        bar.addEventListener('touchstart', (e) => {
            e.preventDefault();
            isDraggingTimeline = true;
            startX = e.touches[0].pageX - bar.offsetLeft;
            scrollLeft = bar.scrollLeft;
        });
        
        bar.addEventListener('touchmove', (e) => {
            if (!isDraggingTimeline) return;
            e.preventDefault();
            const x = e.touches[0].pageX - bar.offsetLeft;
            const walk = (x - startX) * 2;
            bar.scrollLeft = scrollLeft - walk;
        });
        
        bar.addEventListener('touchend', () => {
            isDraggingTimeline = false;
        });
        
        // Click handler for timeline markers
        const markers = bar.querySelectorAll('.timeline-marker');
        markers.forEach(marker => {
            marker.addEventListener('click', (e) => {
                e.stopPropagation();
                const descId = marker.getAttribute('data-description');
                const description = bar.querySelector(`#${descId}`);
                const allDescriptions = bar.querySelectorAll('.timeline-description');
                
                // Hide all other descriptions
                allDescriptions.forEach(desc => {
                    if (desc !== description) {
                        desc.classList.remove('active');
                    }
                });
                
                // Toggle the clicked description
                description.classList.toggle('active');
                
                // Center the marker in the timeline
                const markerRect = marker.getBoundingClientRect();
                const barRect = bar.getBoundingClientRect();
                const scrollPosition = marker.offsetLeft - bar.offsetWidth / 2 + marker.offsetWidth / 2;
                bar.scrollTo({ left: scrollPosition, behavior: 'smooth' });
            });
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
    
    // Observe all slide-up and timeline-item elements
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
