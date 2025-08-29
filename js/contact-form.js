/**
 * Contact Form Module
 * Handles form submission, validation, and user feedback
 */

class ContactForm {
  constructor() {
    this.form = document.getElementById('contact-form');
    this.formStatus = document.getElementById('form-status');
    this.submitBtn = null;
    this.btnText = null;
    this.btnLoading = null;
    
    if (this.form) {
      this.submitBtn = this.form.querySelector('.submit-btn');
      this.btnText = this.submitBtn?.querySelector('.btn-text');
      this.btnLoading = this.submitBtn?.querySelector('.btn-loading');
      this.init();
    }
  }

  init() {
    this.bindEvents();
  }

  bindEvents() {
    if (this.form) {
      this.form.addEventListener('submit', (e) => this.handleSubmit(e));
    }
  }

  async handleSubmit(e) {
    e.preventDefault();

    // Get form data
    const formData = new FormData(this.form);
    const name = formData.get('name')?.trim();
    const email = formData.get('email')?.trim();
    const subject = formData.get('subject')?.trim();
    const message = formData.get('message')?.trim();

    // Validate form
    if (!this.validateForm(name, email, subject, message)) {
      return;
    }

    // Show loading state
    this.setLoadingState(true);

    try {
      // Submit form using Formspree
      const response = await fetch('https://formspree.io/f/mvgqljgn', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: name,
          email: email,
          subject: subject,
          message: message
        })
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      // Simulate processing time for better UX
      await new Promise(resolve => setTimeout(resolve, 1500));

      this.showFormStatus(
        'Thank you! Your message has been sent successfully. I\'ll get back to you soon!', 
        'success'
      );
      this.form.reset();

    } catch (error) {
      console.error('Form submission error:', error);
      this.showFormStatus(
        'Sorry, there was an error sending your message. Please try again or contact me directly.', 
        'error'
      );
    } finally {
      this.setLoadingState(false);
    }
  }

  validateForm(name, email, subject, message) {
    // Reset previous error states
    this.clearFieldErrors();

    let isValid = true;
    const errors = [];

    // Validate name
    if (!name || name.length < 2) {
      this.setFieldError('name', 'Please enter a valid name (at least 2 characters)');
      errors.push('Name is required');
      isValid = false;
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      this.setFieldError('email', 'Please enter a valid email address');
      errors.push('Valid email is required');
      isValid = false;
    }

    // Validate subject
    if (!subject || subject.length < 3) {
      this.setFieldError('subject', 'Please enter a subject (at least 3 characters)');
      errors.push('Subject is required');
      isValid = false;
    }

    // Validate message
    if (!message || message.length < 10) {
      this.setFieldError('message', 'Please enter a message (at least 10 characters)');
      errors.push('Message is required');
      isValid = false;
    }

    if (!isValid) {
      this.showFormStatus(
        'Please correct the errors below and try again.', 
        'error'
      );
    }

    return isValid;
  }

  setFieldError(fieldName, message) {
    const field = this.form.querySelector(`[name="${fieldName}"]`);
    if (field) {
      field.classList.add('error');
      
      // Add error message
      let errorElement = field.parentNode.querySelector('.field-error');
      if (!errorElement) {
        errorElement = document.createElement('span');
        errorElement.className = 'field-error';
        field.parentNode.appendChild(errorElement);
      }
      errorElement.textContent = message;
    }
  }

  clearFieldErrors() {
    const fields = this.form.querySelectorAll('.error');
    fields.forEach(field => field.classList.remove('error'));
    
    const errorMessages = this.form.querySelectorAll('.field-error');
    errorMessages.forEach(error => error.remove());
  }

  setLoadingState(isLoading) {
    if (!this.submitBtn) return;

    if (isLoading) {
      this.submitBtn.classList.add('loading');
      this.submitBtn.disabled = true;
      if (this.btnText) this.btnText.style.display = 'none';
      if (this.btnLoading) this.btnLoading.style.display = 'inline-flex';
    } else {
      this.submitBtn.classList.remove('loading');
      this.submitBtn.disabled = false;
      if (this.btnText) this.btnText.style.display = 'inline';
      if (this.btnLoading) this.btnLoading.style.display = 'none';
    }
  }

  showFormStatus(message, type) {
    if (!this.formStatus) return;

    this.formStatus.textContent = message;
    this.formStatus.className = `form-status ${type}`;
    this.formStatus.style.display = 'block';

    // Auto-hide success messages after 5 seconds
    if (type === 'success') {
      setTimeout(() => {
        this.formStatus.style.display = 'none';
      }, 5000);
    }
  }
}

// Export for module use
export default ContactForm;

// Auto-initialize if not using modules
if (typeof module === 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    new ContactForm();
  });
}
