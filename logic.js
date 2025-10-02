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
        
        if (currentPage === targetPage) return;
        
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
            const animatedElements = targetPage.querySelectorAll('.slide-up, .fade-in');
            animatedElements.forEach((el, index) => {
                el.style.animation = 'none';
                el.style.opacity = '0';
                setTimeout(() => {
                    el.style.animation = '';
                    el.style.opacity = '';
                }, 10);
            });
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
        
        // Mouse drag functionality
        let isDragging = false;
        
        function handleMove(e) {
            if (!isDragging) return;
            
            const rect = comparisonWrapper.getBoundingClientRect();
            let x = e.clientX || (e.touches && e.touches[0].clientX);
            let position = ((x - rect.left) / rect.width) * 100;
            
            // Clamp between 0 and 100
            position = Math.max(0, Math.min(100, position));
            
            comparisonSlider.value = position;
            updateSlider(position);
        }
        
        // Mouse events
        comparisonWrapper.addEventListener('mousedown', (e) => {
            e.stopPropagation(); // Prevent card click when interacting with slider
            isDragging = true;
            handleMove(e);
        });
        
        document.addEventListener('mousemove', handleMove);
        
        document.addEventListener('mouseup', () => {
            isDragging = false;
        });
        
        // Touch events for mobile
        comparisonWrapper.addEventListener('touchstart', (e) => {
            e.stopPropagation(); // Prevent card click when interacting with slider
            isDragging = true;
            handleMove(e);
        });
        
        document.addEventListener('touchmove', handleMove);
        
        document.addEventListener('touchend', () => {
            isDragging = false;
        });
        
        // Keyboard support
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
    
    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'slideUp 0.8s ease forwards';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe all slide-up elements
    document.querySelectorAll('.slide-up').forEach(el => {
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
