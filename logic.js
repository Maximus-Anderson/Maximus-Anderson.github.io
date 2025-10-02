// Page Navigation
document.addEventListener('DOMContentLoaded', function() {
    const navLinks = document.querySelectorAll('.nav-links a');
    const pages = document.querySelectorAll('.page');
    const logo = document.querySelector('.logo');
    
    // Navigation click handler
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
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
            
            // Scroll to top
            window.scrollTo({ top: 0, behavior: 'smooth' });
            
            // Re-trigger animations for elements
            const animatedElements = targetPage.querySelectorAll('.slide-up, .fade-in');
            animatedElements.forEach((el, index) => {
                el.style.animation = 'none';
                setTimeout(() => {
                    el.style.animation = '';
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
    
    if (comparisonSlider && comparisonSliderContainer && comparisonHandle && comparisonBefore) {
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
        
        // Initialize
        setBeforeImageWidth();
        
        // Update on window resize
        window.addEventListener('resize', setBeforeImageWidth);
        
        // Slider input event
        comparisonSlider.addEventListener('input', function() {
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
            isDragging = true;
            handleMove(e);
        });
        
        document.addEventListener('mousemove', handleMove);
        
        document.addEventListener('mouseup', () => {
            isDragging = false;
        });
        
        // Touch events for mobile
        comparisonWrapper.addEventListener('touchstart', (e) => {
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
    
    // Add hover effect enhancement for project cards
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
            this.style.transition = 'transform 0.3s ease';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
    
    // Parallax effect for hero section (optional enhancement)
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const heroContent = document.querySelector('.hero-content');
        
        if (heroContent && scrolled < window.innerHeight) {
            heroContent.style.transform = `translateY(${scrolled * 0.5}px)`;
            heroContent.style.opacity = 1 - (scrolled / window.innerHeight);
        }
    });
});
