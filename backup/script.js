document.addEventListener('DOMContentLoaded', async () => {
    const sections = document.querySelectorAll('.section');
    const navLinks = document.querySelectorAll('.nav-menu a');
    let isAnimating = false;

    // Function to load content
    async function loadContent(section) {
        const contentPath = section.getAttribute('data-content');
        try {
            const response = await fetch(contentPath);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const content = await response.text();
            section.innerHTML = content;
        } catch (error) {
            console.error('Error loading content:', error);
            section.innerHTML = '<p>Error loading content. Please try again later.</p>';
        }
    }

    // Load all content initially
    for (const section of sections) {
        await loadContent(section);
    }

    // Show first section
    sections[0].classList.add('active');

    // Navigation click handler
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            if (isAnimating) return; // Prevent multiple clicks during animation
            
            const targetId = link.getAttribute('href').substring(1);
            const currentSection = document.querySelector('.section.active');
            const targetSection = document.getElementById(targetId);
            
            if (currentSection === targetSection) return; // Don't animate if clicking current section
            
            isAnimating = true;
            
            // Add turn-off animation to current section
            currentSection.classList.add('turn-off');
            currentSection.classList.remove('active');
            
            setTimeout(() => {
                currentSection.classList.remove('turn-off');
                
                // Show new section with turn-on animation
                targetSection.classList.add('active');
                targetSection.classList.add('turn-on');
                
                setTimeout(() => {
                    targetSection.classList.remove('turn-on');
                    isAnimating = false;
                }, 1000);
            }, 1000);

            // Update active nav link
            navLinks.forEach(navLink => navLink.classList.remove('active'));
            link.classList.add('active');
        });
    });

    // Handle CTA button clicks
    document.addEventListener('click', (e) => {
        if (e.target.closest('.cta-buttons a')) {
            e.preventDefault();
            if (!isAnimating) {
                const button = e.target.closest('.cta-buttons a');
                const targetId = button.getAttribute('href').substring(1);
                document.querySelector(`.nav-menu a[href="#${targetId}"]`).click();
            }
        }
    });

    // Handle form submission
    document.addEventListener('submit', (e) => {
        if (e.target.id === 'join-form') {
            e.preventDefault();
            // Add your form submission logic here
            console.log('Form submitted');
        }
    });
});
