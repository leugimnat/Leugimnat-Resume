/**
 * Animations Module
 * Handles typing animations, scroll animations, and other visual effects
 */

class Animations {
  constructor() {
    this.typingElement = document.querySelector('.typing-text span');
    this.observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };
    
    this.init();
  }

  init() {
    this.initTypingAnimation();
    this.initScrollAnimations();
    this.initCounterAnimations();
  }

  initTypingAnimation() {
    if (!this.typingElement) return;

    const words = [
      'Software Developer',
      'Web Developer', 
      'Full Stack Developer',
      'Frontend Developer',
      'Backend Developer'
    ];

    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typeSpeed = 100;

    const type = () => {
      const currentWord = words[wordIndex];
      
      if (isDeleting) {
        this.typingElement.textContent = currentWord.substring(0, charIndex - 1);
        charIndex--;
        typeSpeed = 50;
      } else {
        this.typingElement.textContent = currentWord.substring(0, charIndex + 1);
        charIndex++;
        typeSpeed = 100;
      }

      if (!isDeleting && charIndex === currentWord.length) {
        typeSpeed = 2000; // Pause at end
        isDeleting = true;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        wordIndex = (wordIndex + 1) % words.length;
        typeSpeed = 500; // Pause before next word
      }

      setTimeout(type, typeSpeed);
    };

    // Start typing animation
    setTimeout(type, 1000);
  }

  initScrollAnimations() {
    // Create intersection observer for scroll animations
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animated');
        }
      });
    }, this.observerOptions);

    // Observe elements with animation classes
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    animatedElements.forEach(el => observer.observe(el));

    // Add fade-in animation to cards
    const cards = document.querySelectorAll('.card, .project-card, .experience-item, .education-item');
    cards.forEach((card, index) => {
      card.style.animationDelay = `${index * 0.1}s`;
      card.classList.add('animate-on-scroll');
      observer.observe(card);
    });
  }

  initCounterAnimations() {
    const counters = document.querySelectorAll('.stat-number');
    
    const animateCounter = (counter) => {
      const target = parseInt(counter.textContent.replace(/\D/g, ''));
      const increment = target / 100;
      let current = 0;
      
      const updateCounter = () => {
        if (current < target) {
          current += increment;
          counter.textContent = Math.ceil(current) + (counter.textContent.includes('+') ? '+' : '');
          requestAnimationFrame(updateCounter);
        } else {
          counter.textContent = target + (counter.textContent.includes('+') ? '+' : '');
        }
      };
      
      updateCounter();
    };

    // Observe counters for animation
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    }, this.observerOptions);

    counters.forEach(counter => counterObserver.observe(counter));
  }

  // Utility method to add stagger animation to elements
  static staggerAnimation(elements, delay = 100) {
    elements.forEach((element, index) => {
      element.style.animationDelay = `${index * delay}ms`;
    });
  }

  // Utility method to create a smooth reveal animation
  static createRevealAnimation(element, direction = 'up') {
    const directions = {
      up: 'translateY(30px)',
      down: 'translateY(-30px)',
      left: 'translateX(30px)',
      right: 'translateX(-30px)'
    };

    element.style.opacity = '0';
    element.style.transform = directions[direction];
    element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';

    // Trigger animation
    setTimeout(() => {
      element.style.opacity = '1';
      element.style.transform = 'translate(0)';
    }, 100);
  }

  // Method to animate elements on page load
  static animateOnLoad() {
    const heroElements = document.querySelectorAll('.intro-section > *');
    this.staggerAnimation(heroElements, 200);

    const navLinks = document.querySelectorAll('.nav-link');
    this.staggerAnimation(navLinks, 50);
  }
}

// Utility functions for common animations
export const AnimationUtils = {
  fadeIn: (element, duration = 300) => {
    element.style.opacity = '0';
    element.style.transition = `opacity ${duration}ms ease`;
    
    setTimeout(() => {
      element.style.opacity = '1';
    }, 10);
  },

  slideIn: (element, direction = 'left', duration = 300) => {
    const directions = {
      left: 'translateX(-100%)',
      right: 'translateX(100%)',
      up: 'translateY(-100%)',
      down: 'translateY(100%)'
    };

    element.style.transform = directions[direction];
    element.style.transition = `transform ${duration}ms ease`;
    
    setTimeout(() => {
      element.style.transform = 'translate(0)';
    }, 10);
  },

  pulse: (element, scale = 1.05, duration = 300) => {
    element.style.transition = `transform ${duration}ms ease`;
    element.style.transform = `scale(${scale})`;
    
    setTimeout(() => {
      element.style.transform = 'scale(1)';
    }, duration);
  }
};

// Export for module use
export default Animations;

// Auto-initialize if not using modules
if (typeof module === 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    new Animations();
    Animations.animateOnLoad();
  });
}
