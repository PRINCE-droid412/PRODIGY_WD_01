document.addEventListener('DOMContentLoaded', () => {
    const navbar = document.getElementById('navbar');
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    const allNavLinks = document.querySelectorAll('#nav-links-desktop a, #mobile-menu a');
    const SCROLL_THRESHOLD = 50; // Pixels to scroll before navbar changes style

    // Navbar scroll effect
    const handleScroll = () => {
        if (window.scrollY > SCROLL_THRESHOLD) {
            navbar.classList.add('scrolled');
            if (mobileMenu.classList.contains('open')) { // If menu is open while scrolling
                mobileMenu.classList.add('scrolled-parent');
            }
        } else {
            navbar.classList.remove('scrolled');
            if (mobileMenu.classList.contains('open')) {
                mobileMenu.classList.remove('scrolled-parent');
            }
        }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check in case page is loaded scrolled

    // Mobile menu toggle
    mobileMenuToggle.addEventListener('click', () => {
        const isOpen = mobileMenu.classList.toggle('open');
        mobileMenuToggle.setAttribute('aria-expanded', isOpen.toString());
        mobileMenu.setAttribute('aria-hidden', (!isOpen).toString());
        
        if (isOpen) {
            mobileMenuToggle.innerHTML = '&times;'; // Close icon
            document.body.style.overflow = 'hidden'; // Prevent body scroll
            // Apply scrolled class to mobile menu if navbar is already scrolled
            if (navbar.classList.contains('scrolled')) {
                mobileMenu.classList.add('scrolled-parent');
            }
        } else {
            mobileMenuToggle.innerHTML = '&#9776;'; // Hamburger icon
            document.body.style.overflow = '';
            mobileMenu.classList.remove('scrolled-parent');
        }
    });

    // Smooth scroll for navigation links & close mobile menu
    allNavLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                let offset = 0;
                // Only apply navbar offset if the target is not the very top of the page (#home)
                // and navbar is not transparent (i.e. scrolled or fixed with background)
                if (targetId !== '#home' && navbar.classList.contains('scrolled')) {
                     offset = navbar.offsetHeight;
                } else if (targetId !== '#home' && !navbar.classList.contains('scrolled')) {
                    // if navbar is transparent at top, but we are scrolling down, we need to account for its height
                    // this situation is tricky as scrollIntoView doesn't easily account for future fixed header.
                    // For simplicity, we might just scroll to top of section and let fixed header cover it.
                    // Or, always use offset when navbar is present.
                    // The html's scroll-padding-top CSS property is a better solution here.
                    // Let's add it via JS for robustness, or assume it's in CSS.
                    // For now, let's try a simple offset.
                    // offset = navbar.offsetHeight; <-- This might be too aggressive for #home link when at top.
                }


                const elementPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
                const offsetPosition = elementPosition - offset;
                
                window.scrollTo({
                     top: offsetPosition,
                     behavior: 'smooth'
                });
            }

            // Close mobile menu if open
            if (mobileMenu.classList.contains('open')) {
                mobileMenu.classList.remove('open');
                mobileMenuToggle.setAttribute('aria-expanded', 'false');
                mobileMenu.setAttribute('aria-hidden', 'true');
                mobileMenuToggle.innerHTML = '&#9776;';
                document.body.style.overflow = '';
                mobileMenu.classList.remove('scrolled-parent');
            }
        });
    });
    
    // Add scroll-padding-top to HTML element to account for fixed navbar height
    const htmlElement = document.documentElement;
    if (navbar) {
        htmlElement.style.scrollPaddingTop = `${navbar.offsetHeight}px`;
    }


    // Update copyright year
    const currentYearSpan = document.getElementById('current-year');
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear().toString();
    }
});
