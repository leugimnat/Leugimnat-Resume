/**
 * Main Application Entry Point
 * Initializes all modules and handles global functionality
 */

// Import modules (when using ES6 modules)
// import Navigation from './navigation.js';
// import ContactForm from './contact-form.js';
// import Animations from './animations.js';
// import { Utils } from './utils.js';

/**
 * Main Application Class
 */
class App {
  constructor() {
    this.modules = {};
    this.isInitialized = false;
    
    this.init();
  }

  /**
   * Initialize the application
   */
  init() {
    if (this.isInitialized) return;

    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.start());
    } else {
      this.start();
    }
  }

  /**
   * Start the application
   */
  start() {
    try {
      // Initialize utility functions
      this.initUtils();
      
      // Initialize core modules
      this.initModules();
      
      // Set up global event listeners
      this.bindGlobalEvents();
      
      // Mark as initialized
      this.isInitialized = true;
      
      // Dispatch app ready event
      this.dispatchEvent('app:ready');
      
      console.log('✅ Resume website initialized successfully');
      
    } catch (error) {
      console.error('❌ Failed to initialize application:', error);
    }
  }

  /**
   * Initialize utility functions
   */
  initUtils() {
    // Update year in footer
    const yearElement = document.getElementById('year');
    if (yearElement) {
      yearElement.textContent = new Date().getFullYear();
    }
  }

  /**
   * Initialize all modules
   */
  initModules() {
    // Initialize Navigation (fallback for non-module environments)
    if (typeof Navigation !== 'undefined') {
      this.modules.navigation = new Navigation();
    } else {
      this.initNavigationFallback();
    }

    // Initialize Contact Form
    if (typeof ContactForm !== 'undefined') {
      this.modules.contactForm = new ContactForm();
    } else {
      this.initContactFormFallback();
    }

    // Initialize Animations
    if (typeof Animations !== 'undefined') {
      this.modules.animations = new Animations();
    } else {
      this.initAnimationsFallback();
    }
  }

  /**
   * Fallback navigation initialization for non-module environments
   */
  initNavigationFallback() {
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const navbar = document.querySelector('.navbar');

    if (!mobileMenuToggle || !navMenu) return;

    // Mobile menu toggle
    mobileMenuToggle.addEventListener('click', () => {
      mobileMenuToggle.classList.toggle('active');
      navMenu.classList.toggle('active');
      
      const isExpanded = navMenu.classList.contains('active');
      mobileMenuToggle.setAttribute('aria-expanded', isExpanded);
    });

    // Close mobile menu when clicking on nav links
    navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        // Handle smooth scrolling for anchor links
        const href = link.getAttribute('href');
        if (href && href.startsWith('#')) {
          e.preventDefault();
          this.smoothScrollTo(href);
        }
        
        // Close mobile menu
        mobileMenuToggle.classList.remove('active');
        navMenu.classList.remove('active');
        mobileMenuToggle.setAttribute('aria-expanded', 'false');
      });
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!navMenu.contains(e.target) && !mobileMenuToggle.contains(e.target)) {
        mobileMenuToggle.classList.remove('active');
        navMenu.classList.remove('active');
        mobileMenuToggle.setAttribute('aria-expanded', 'false');
      }
    });

    // Navbar scroll effect and active link updates
    window.addEventListener('scroll', this.throttle(() => {
      // Navbar scroll effect
      if (navbar) {
        if (window.scrollY > 100) {
          navbar.classList.add('scrolled');
        } else {
          navbar.classList.remove('scrolled');
        }
      }

      // Update active links
      this.updateActiveLinks();
    }, 100));
  }

  /**
   * Fallback contact form initialization
   */
  initContactFormFallback() {
    const contactForm = document.getElementById('contact-form');
    if (!contactForm) return;

    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const formData = new FormData(contactForm);
      const submitBtn = contactForm.querySelector('.submit-btn');
      
      // Simple form submission (you can enhance this)
      try {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending...';
        
        // Simulate form submission
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        alert('Thank you! Your message has been sent successfully.');
        contactForm.reset();
        
      } catch (error) {
        alert('Sorry, there was an error sending your message.');
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Send Message';
      }
    });
  }

  /**
   * Fallback animations initialization
   */
  initAnimationsFallback() {
    // Simple typing animation
    const typingElement = document.querySelector('.typing-text span');
    if (typingElement) {
      const words = ['Software Developer', 'Web Developer', 'Full Stack Developer'];
      let wordIndex = 0;
      
      setInterval(() => {
        typingElement.textContent = words[wordIndex];
        wordIndex = (wordIndex + 1) % words.length;
      }, 3000);
    }
  }

  /**
   * Bind global event listeners
   */
  bindGlobalEvents() {
    // Handle page visibility changes
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.dispatchEvent('app:hidden');
      } else {
        this.dispatchEvent('app:visible');
      }
    });

    // Handle window resize
    window.addEventListener('resize', this.debounce(() => {
      this.dispatchEvent('app:resize', {
        width: window.innerWidth,
        height: window.innerHeight
      });
    }, 250));

    // Handle errors
    window.addEventListener('error', (e) => {
      console.error('Global error:', e.error);
    });
  }

  /**
   * Utility methods
   */
  smoothScrollTo(targetId) {
    const targetElement = document.getElementById(targetId.substring(1));
    if (targetElement) {
      const offsetTop = targetElement.offsetTop - 80;
      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth'
      });
    }
  }

  updateActiveLinks() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    const scrollPos = window.scrollY + 100;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');

      if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  throttle(func, limit) {
    let inThrottle;
    return function(...args) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }

  debounce(func, wait) {
    let timeout;
    return function(...args) {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), wait);
    };
  }

  dispatchEvent(eventName, detail = {}) {
    const event = new CustomEvent(eventName, { detail });
    document.dispatchEvent(event);
  }
}

// Initialize the application
const app = new App();

// Export for module environments
if (typeof module !== 'undefined' && module.exports) {
  module.exports = App;
}

// Make available globally
window.ResumeApp = app;
