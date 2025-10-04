document.addEventListener('DOMContentLoaded', function() {
    // Navigation handling
    const navLinks = document.querySelectorAll('.nav-links a, .logo, .back-button');
    console.log('Found ' + navLinks.length + ' navigation links');

    const pages = document.querySelectorAll('.page');

    function showPage(pageId) {
        if (!pageId) {
            console.error('No pageId provided');
            return;
        }
        pages.forEach(page => {
            page.classList.remove('active');
            if (page.id === pageId) {
                page.classList.add('active');
                window.scrollTo(0, 0); // Reset scroll to top
            }
        });
    }

    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const pageId = this.getAttribute('data-page') ? this.getAttribute('data-page') + '-page' : null;
            if (pageId) {
                showPage(pageId);
            } else {
                console.error('No data-page attribute found for link:', this);
            }
        });
    });

    // Comparison slider functionality
    const sliders = document.querySelectorAll('.comparison-slider');
    console.log('Found ' + sliders.length + ' comparison sliders');

    sliders.forEach(slider => {
        slider.addEventListener('input', function() {
            const container = this.parentElement.querySelector('.comparison-slider-container');
            if (container) {
                container.style.width = this.value + '%';
            } else {
                console.error('Comparison slider container not found for slider:', this);
            }
        });
    });

    // Timeline functionality
    const timelines = document.querySelectorAll('.timeline');
    console.log('Found ' + timelines.length + ' timelines');

    timelines.forEach(timeline => {
        const markers = timeline.querySelectorAll('.timeline-marker');
        const descriptions = timeline.querySelectorAll('.timeline-description');
        console.log('Found ' + markers.length + ' markers and ' + descriptions.length + ' descriptions in timeline');

        // Close all descriptions initially
        descriptions.forEach(desc => {
            desc.classList.remove('active');
            desc.style.zIndex = '10';
        });

        markers.forEach((marker, index) => {
            marker.addEventListener('click', function() {
                const descId = this.getAttribute('data-description');
                const description = timeline.querySelector('#' + descId);

                if (!description) {
                    console.error('Description element not found for ID: ' + descId);
                    return;
                }

                // Close all other descriptions and reset z-index
                descriptions.forEach(desc => {
                    if (desc !== description) {
                        desc.classList.remove('active');
                        desc.style.zIndex = '10';
                        console.log('Closed description: ' + desc.id);
                    }
                });

                // Toggle the clicked description and set highest z-index
                const isActive = description.classList.toggle('active');
                description.style.zIndex = isActive ? '1000' : '10';
                console.log('Marker clicked: ' + descId + ', Active: ' + isActive);
            });
        });
    });
});
