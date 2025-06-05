// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Get elements
    const header = document.getElementById('header');
    const menuBtn = document.querySelector('.menu-btn');
    const closeMenuBtn = document.querySelector('.close-menu');
    const menu = document.getElementById('menu');
    const overlay = document.querySelector('.overlay');
    const navLinks = document.querySelectorAll('.nav-link');
    const tabBtns = document.querySelectorAll('.tab-btn');
    const skillBars = document.querySelectorAll('.skill-progress');
    const backToTopBtn = document.querySelector('.back-to-top');
    const contactForm = document.getElementById('contactForm');
    const profileLinks = document.querySelectorAll('.profiles-container a[target="_blank"]');
    const profileItems = document.querySelectorAll('.profile-item');
    const projectCards = document.querySelectorAll('.project-card');

    // ======================
    // Core Functions
    // ======================

    // Toggle mobile menu
    function toggleMenu() {
        menu.classList.toggle('active');
        overlay.classList.toggle('active');
        document.body.classList.toggle('no-scroll');
    }

    // Animate skill bars
    function animateSkillBars() {
        skillBars.forEach(bar => {
            const progress = bar.getAttribute('data-progress');
            bar.style.width = `${progress}%`;
        });
    }

    // ======================
    // Event Listeners
    // ======================

    // Menu functionality
    menuBtn.addEventListener('click', toggleMenu);
    closeMenuBtn.addEventListener('click', toggleMenu);
    overlay.addEventListener('click', toggleMenu);

    // Close menu when clicking nav links on mobile
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 768) {
                toggleMenu();
            }
        });
    });

    // Header scroll effect
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Back to top button
    window.addEventListener('scroll', function() {
        if (window.scrollY > 500) {
            backToTopBtn.classList.add('active');
        } else {
            backToTopBtn.classList.remove('active');
        }
    });

    backToTopBtn.addEventListener('click', function(e) {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // Tab functionality
    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            tabBtns.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            const tabId = this.getAttribute('data-tab');
            document.querySelectorAll('.tab-pane').forEach(pane => {
                pane.classList.remove('active');
            });
            document.getElementById(tabId).classList.add('active');
        });
    });

    // Profile links handling
    profileLinks.forEach(link => {
        // Fix URL if needed (especially for Unstop)
        if (!link.href.startsWith('http')) {
            link.href = `https://${link.href}`;
        }

        link.addEventListener('click', function(e) {
            // For debugging (can be removed in production)
            console.log('Profile link clicked:', this.href);
            
            // Ensure link opens even if other JS fails
            if (this.href.includes('unstop.com') && !this.href.startsWith('https://')) {
                e.preventDefault();
                window.open(`https://${this.href.split('://')[1]}`, '_blank');
            }
        });
    });

    // Profile items hover effects
    profileItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
            this.style.boxShadow = '0 10px 20px rgba(0,0,0,0.1)';
        });
        item.addEventListener('mouseleave', function() {
            this.style.transform = 'none';
            this.style.boxShadow = 'none';
        });
        
        // Keyboard accessibility
        item.setAttribute('tabindex', '0');
        item.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                item.querySelector('a').click();
            }
        });
    });

    // ======================
    // Intersection Observers
    // ======================

    // Skill bars animation trigger
    const skillsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateSkillBars();
                skillsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });

    const skillsSection = document.querySelector('.skills-content');
    if (skillsSection) {
        skillsObserver.observe(skillsSection);
    }

    // General animation observer
    const animationObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
                animationObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    // Observe all sections that need animation
    document.querySelectorAll('.about-content, .skills-content, .projects-content, .profiles-section, .contact-content')
        .forEach(section => {
            animationObserver.observe(section);
        });

    // ======================
    // Other Functionality
    // ======================

    // Smooth scroll for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            if (this.getAttribute('href') !== '#') {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    const headerOffset = 80;
                    const elementPosition = targetElement.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                    
                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // Form submission handling
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const formData = new FormData(this);
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.innerHTML;
            
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            submitBtn.disabled = true;
            
            // Simulate form submission
            setTimeout(() => {
                contactForm.reset();
                submitBtn.innerHTML = '<i class="fas fa-check"></i> Message Sent!';
                submitBtn.classList.add('success');
                
                setTimeout(() => {
                    submitBtn.innerHTML = originalBtnText;
                    submitBtn.classList.remove('success');
                    submitBtn.disabled = false;
                }, 3000);
            }, 1500);
        });
    }

    // Project cards animation
    projectCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.querySelector('.project-overlay').style.height = '100%';
        });
        
        card.addEventListener('mouseleave', function() {
            this.querySelector('.project-overlay').style.height = '0';
        });
    });

    // Accessibility improvements
    document.querySelectorAll('a, button, input, textarea, [tabindex]').forEach(element => {
        element.addEventListener('focus', function() {
            this.style.outline = '2px solid var(--primary-color)';
        });
        
        element.addEventListener('blur', function() {
            this.style.outline = 'none';
        });
    });

    // Initialize first tab as active if exists
    if (tabBtns.length > 0) {
        tabBtns[0].click();
    }
});