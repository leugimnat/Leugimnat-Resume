/**
 * Navigation Module
 * Handles mobile menu, navbar scroll effects, and smooth scrolling
 */

class Navigation {
  constructor() {
    this.mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    this.navMenu = document.querySelector('.nav-menu');
    this.navLinks = document.querySelectorAll('.nav-link');
    this.navbar = document.querySelector('.navbar');
    
    this.init();
  }

  init() {
    this.bindEvents();
    this.updateActiveLink();
  }

  bindEvents() {
    // Mobile menu toggle
    if (this.mobileMenuToggle) {
      this.mobileMenuToggle.addEventListener('click', () => this.toggleMobileMenu());
    }

    // Close mobile menu when clicking on nav links
    this.navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        this.handleNavLinkClick(e, link);
        this.closeMobileMenu();
      });
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => this.handleOutsideClick(e));

    // Navbar scroll effect
    window.addEventListener('scroll', () => {
      this.handleScroll();
      this.updateActiveLink();
    });
  }

  toggleMobileMenu() {
    this.mobileMenuToggle.classList.toggle('active');
    this.navMenu.classList.toggle('active');
    
    // Update aria-expanded attribute
    const isExpanded = this.navMenu.classList.contains('active');
    this.mobileMenuToggle.setAttribute('aria-expanded', isExpanded);
  }

  closeMobileMenu() {
    this.mobileMenuToggle.classList.remove('active');
    this.navMenu.classList.remove('active');
    this.mobileMenuToggle.setAttribute('aria-expanded', 'false');
  }

  handleNavLinkClick(e, link) {
    const href = link.getAttribute('href');
    
    // Handle smooth scrolling for anchor links
    if (href && href.startsWith('#')) {
      e.preventDefault();
      this.smoothScrollTo(href);
    }
  }

  smoothScrollTo(targetId) {
    const targetElement = document.getElementById(targetId.substring(1));
    
    if (targetElement) {
      const offsetTop = targetElement.offsetTop - 80; // Account for fixed navbar
      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth'
      });

      // Update active link
      this.setActiveLink(targetId);
    }
  }

  setActiveLink(targetId) {
    this.navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === targetId) {
        link.classList.add('active');
      }
    });
  }

  handleOutsideClick(e) {
    if (this.navMenu && this.mobileMenuToggle &&
        !this.navMenu.contains(e.target) && 
        !this.mobileMenuToggle.contains(e.target)) {
      this.closeMobileMenu();
    }
  }

  handleScroll() {
    // Navbar scroll effect
    if (this.navbar) {
      if (window.scrollY > 100) {
        this.navbar.classList.add('scrolled');
      } else {
        this.navbar.classList.remove('scrolled');
      }
    }
  }

  updateActiveLink() {
    const sections = document.querySelectorAll('section[id]');
    const scrollPos = window.scrollY + 100;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');

      if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
        this.navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }
}

// Export for module use
export default Navigation;

// Auto-initialize if not using modules
if (typeof module === 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    new Navigation();
  });
}
