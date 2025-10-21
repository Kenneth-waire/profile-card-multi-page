// contact-script.js
(function () {
  'use strict';

  const form = document.getElementById('contactForm');
  if (!form) return;

  // Inputs
  const nameInput = document.getElementById('name');
  const emailInput = document.getElementById('email');
  const subjectInput = document.getElementById('subject');
  const messageInput = document.getElementById('message');

  // Error message elements (small tags)
  const errorName = document.getElementById('error-name');
  const errorEmail = document.getElementById('error-email');
  const errorSubject = document.getElementById('error-subject');
  const errorMessage = document.getElementById('error-message');

  // Success message element
  const successMsg = document.getElementById('successMsg');

  
  const emailRegex = /^\S+@\S+\.\S+$/;

  // Utility: show error for an input
  function showError(inputEl, errorEl, message) {
    errorEl.textContent = message;
    errorEl.setAttribute('role', 'alert');
    inputEl.setAttribute('aria-invalid', 'true');
    inputEl.setAttribute('aria-describedby', errorEl.id);
  }

  // Utility: clear error for an input
  function clearError(inputEl, errorEl) {
    errorEl.textContent = '';
    errorEl.removeAttribute('role');
    inputEl.removeAttribute('aria-invalid');
    inputEl.removeAttribute('aria-describedby');
  }

  // Run validation and return boolean
  function validate() {
    let valid = true;

    // Trim values
    const nameVal = nameInput.value.trim();
    const emailVal = emailInput.value.trim();
    const subjectVal = subjectInput.value.trim();
    const messageVal = messageInput.value.trim();

    // Reset previous errors
    clearError(nameInput, errorName);
    clearError(emailInput, errorEmail);
    clearError(subjectInput, errorSubject);
    clearError(messageInput, errorMessage);
    successMsg.textContent = '';

    // Name
    if (nameVal === '') {
      showError(nameInput, errorName, 'Full name is required.');
      valid = false;
    }

    // Email
    if (emailVal === '') {
      showError(emailInput, errorEmail, 'Email is required.');
      valid = false;
    } else if (!emailRegex.test(emailVal)) {
      showError(emailInput, errorEmail, 'Please enter a valid email address.');
      valid = false;
    }

    // Subject
    if (subjectVal === '') {
      showError(subjectInput, errorSubject, 'Subject is required.');
      valid = false;
    }

    // Message
    if (messageVal.length < 10) {
      showError(messageInput, errorMessage, 'Message must be at least 10 characters.');
      valid = false;
    }

    // If invalid, focus first invalid field
    if (!valid) {
      const firstInvalid = form.querySelector('[aria-invalid="true"]');
      if (firstInvalid) firstInvalid.focus();
    }

    return valid;
  }

  // Live/inline validation: clear error when user types (helps UX)
  function attachLiveValidation(inputEl, errorEl) {
    if (!inputEl || !errorEl) return;
    inputEl.addEventListener('input', () => {
      if (inputEl.value.trim() === '') {
        // leave message to be shown on submit; do not show premature errors
        clearError(inputEl, errorEl);
      } else {
        // re-validate field-specific rules
        if (inputEl === emailInput) {
          if (emailRegex.test(inputEl.value.trim())) {
            clearError(inputEl, errorEl);
          }
        } else if (inputEl === messageInput) {
          if (inputEl.value.trim().length >= 10) {
            clearError(inputEl, errorEl);
          }
        } else {
          clearError(inputEl, errorEl);
        }
      }
    });
  }

  // Attach live validation handlers
  attachLiveValidation(nameInput, errorName);
  attachLiveValidation(emailInput, errorEmail);
  attachLiveValidation(subjectInput, errorSubject);
  attachLiveValidation(messageInput, errorMessage);

  // Handle form submit
  form.addEventListener('submit', function (e) {
    e.preventDefault();

    if (validate()) {
      // Successful submission behavior - show confirmation text only
      successMsg.textContent = 'Thank you! Your message has been sent.';
      successMsg.setAttribute('role', 'status');

      // Optionally clear form fields
      form.reset();

      // Remove any lingering aria-describedby/aria-invalid after reset
      [nameInput, emailInput, subjectInput, messageInput].forEach((el) => {
        el.removeAttribute('aria-invalid');
        el.removeAttribute('aria-describedby');
      });

      // Focus success message for screen reader users
      successMsg.tabIndex = -1;
      successMsg.focus();
    } else {
      // On invalid, success message stays empty (ensures tests check for absence)
      successMsg.textContent = '';
    }
  });
})();
