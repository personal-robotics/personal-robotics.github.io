document.addEventListener('DOMContentLoaded', async () => {
    const sections = document.querySelectorAll('.section');
    const navLinks = document.querySelectorAll('.nav-menu a');
    let isAnimating = false;

    // Function to load content
    async function loadContent(section) {
        const contentPath = section.getAttribute('data-content');
        if (!contentPath) {
            console.warn('Section is missing data-content attribute:', section.id);
            return;
        }
        try {
            const response = await fetch(contentPath);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status} for ${contentPath}`);
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

    // Show first section and activate first nav link
    if (sections.length > 0) {
        sections[0].classList.add('active');
        const firstSectionId = sections[0].id;
        const firstNavLink = document.querySelector(`.nav-menu a[href="#${firstSectionId}"]`);
        if (firstNavLink) {
            firstNavLink.classList.add('active');
        }
    }

    // Navigation click handler
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            if (isAnimating) return;
            
            const targetId = link.getAttribute('href').substring(1);
            const currentSection = document.querySelector('.section.active');
            const targetSection = document.getElementById(targetId);
            
            if (!targetSection) {
                console.error(`Target section #${targetId} not found.`);
                return;
            }
            if (currentSection === targetSection) return;
            
            isAnimating = true;
            
            if (currentSection) {
                currentSection.classList.add('turn-off');
                currentSection.classList.remove('active');
            }
            
            setTimeout(() => {
                if (currentSection) {
                    currentSection.classList.remove('turn-off');
                }
                
                targetSection.classList.add('active');
                targetSection.classList.add('turn-on');
                
                setTimeout(() => {
                    targetSection.classList.remove('turn-on');
                    isAnimating = false;
                }, 1000); // Duration of turn-on animation
            }, currentSection ? 1000 : 0); // Duration of turn-off animation, or 0 if no current section

            navLinks.forEach(navLink => navLink.classList.remove('active'));
            link.classList.add('active');
        });
    });

    // Global click listener for CTAs and Modals
    document.addEventListener('click', function(event) {
        // Handle CTA button clicks
        const ctaButton = event.target.closest('.cta-buttons a');
        if (ctaButton) {
            event.preventDefault();
            if (!isAnimating) {
                const targetId = ctaButton.getAttribute('href').substring(1);
                const navLinkToClick = document.querySelector(`.nav-menu a[href="#${targetId}"]`);
                if (navLinkToClick) {
                    navLinkToClick.click();
                }
            }
            return; // CTA handled, no further modal logic needed for this click
        }

        // Handle modal open links
        const modalTriggerLink = event.target.closest('a');
        let modalIdToOpen = null;
        if (modalTriggerLink) {
            if (modalTriggerLink.id === 'openPrivacyModalLink') modalIdToOpen = 'privacyModal';
            else if (modalTriggerLink.id === 'openTermsModalLink') modalIdToOpen = 'termsModal';
            else if (modalTriggerLink.id === 'openContactModalLink') modalIdToOpen = 'contactModal';
            else if (modalTriggerLink.id === 'openImprintModalLink') modalIdToOpen = 'imprintModal';
        }

        if (modalIdToOpen) {
            event.preventDefault();
            const modalElement = document.getElementById(modalIdToOpen);
            if (modalElement) {
                // console.log('Opening modal:', modalIdToOpen);
                modalElement.style.display = 'block';
            } else {
                console.error('Modal element not found for opening:', modalIdToOpen);
            }
            return; // Modal open handled
        }

        // Handle modal close buttons
        const closeButton = event.target.closest('.close-button');
        if (closeButton) {
            const modalIdToClose = closeButton.getAttribute('data-modal-id');
            if (modalIdToClose) {
                const modalToClose = document.getElementById(modalIdToClose);
                if (modalToClose) {
                    // console.log('Closing modal via button:', modalIdToClose);
                    modalToClose.style.display = 'none';
                } else {
                    console.error('Could not close modal. Modal element not found for ID:', modalIdToClose);
                }
            }
            return; // Modal close button handled
        }

        // Handle click outside modal content (on the .modal overlay itself)
        if (event.target.classList.contains('modal')) {
            // console.log('Closing modal via overlay click:', event.target.id);
            event.target.style.display = 'none';
        }
    });


    // Handle form submission (if a form with this ID exists)
    document.addEventListener('submit', (e) => {
        if (e.target.id === 'join-form') {
            e.preventDefault();
            console.log('Form submitted');
            // Add your form submission logic here
        }
    });

    console.log('Personal Robotics script initialized.');
});