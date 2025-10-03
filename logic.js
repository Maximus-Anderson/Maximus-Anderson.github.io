document.addEventListener('DOMContentLoaded', function() {
    // Navigation handling
    const navLinks = document.querySelectorAll('.nav-links a, .logo, .back-button');
    const pages = document.querySelectorAll('.page');

    function showPage(pageId) {
        pages.forEach(page => {
            page.classList.remove('active');
            if (page.id === pageId) {
                page.classList.add('active');
            }
        });
    }

    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const pageId = this.getAttribute('data-page') + '-page';
            showPage(pageId);
        });
    });

    // Comparison slider functionality
    const sliders = document.querySelectorAll('.comparison-slider');
    sliders.forEach(slider => {
        slider.addEventListener('input', function() {
            const container = this.parentElement.querySelector('.comparison-slider-container');
            container.style.width = this.value + '%';
        });
    });

    // Timeline functionality
    const timelines = document.querySelectorAll('.timeline');
    console.log('Found ' + timelines.length + ' timelines');

    timelines.forEach(timeline => {
        const markers = timeline.querySelectorAll('.timeline-marker');

        markers.forEach(marker => {
            marker.addEventListener('click', function() {
                const descId = this.getAttribute('data-description');
                const description = timeline.querySelector('#' + descId);

                if (!description) {
                    console.error('Description element not found for ID: ' + descId);
                    return;
                }

                // Close all other descriptions in this timeline
                timeline.querySelectorAll('.timeline-description').forEach(desc => {
                    if (desc !== description) {
                        desc.classList.remove('active');
                        console.log('Closed description: ' + desc.id);
                    }
                });

                // Toggle the clicked description
                const isActive = description.classList.toggle('active');
                console.log('Marker clicked: ' + descId + ', Active: ' + isActive);
            });
        });
    });
});
