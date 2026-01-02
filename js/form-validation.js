// Form Validation Functions
class FormValidator {
    constructor() {
        this.initializeForms();
    }

    initializeForms() {
        this.setupAdmissionForm();
        this.setupContactForm();
        this.setupEnquiryForms();
    }

    setupAdmissionForm() {
        const form = document.getElementById('admissionForm');
        if (!form) return;

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            if (this.validateAdmissionForm()) {
                this.submitAdmissionForm(form);
            }
        });

        // Real-time validation
        this.addRealTimeValidation(form);
    }

    setupContactForm() {
        const form = document.getElementById('contactForm');
        if (!form) return;

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            if (this.validateContactForm()) {
                this.submitContactForm(form);
            }
        });

        // Real-time validation
        this.addRealTimeValidation(form);
    }

    setupEnquiryForms() {
        // Setup any enquiry forms on the page
        document.querySelectorAll('.enquiry-form').forEach(form => {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                if (this.validateEnquiryForm(form)) {
                    this.submitEnquiryForm(form);
                }
            });
        });
    }

    validateAdmissionForm() {
        const form = document.getElementById('admissionForm');
        if (!form) return false;

        let isValid = true;
        const fields = form.querySelectorAll('input[required], select[required], textarea[required]');

        fields.forEach(field => {
            if (!this.validateField(field)) {
                isValid = false;
            }
        });

        // Special validations
        const phone = form.querySelector('#phone');
        if (phone && !this.validatePhone(phone.value)) {
            this.showError(phone, 'Please enter a valid 10-digit phone number');
            isValid = false;
        }

        const email = form.querySelector('#email');
        if (email && !this.validateEmail(email.value)) {
            this.showError(email, 'Please enter a valid email address');
            isValid = false;
        }

        const dob = form.querySelector('#dob');
        if (dob && !this.validateDOB(dob.value)) {
            this.showError(dob, 'You must be at least 16 years old');
            isValid = false;
        }

        const percentage = form.querySelector('#percentage');
        if (percentage && !this.validatePercentage(percentage.value)) {
            this.showError(percentage, 'Please enter a valid percentage (0-100) or CGPA (0-10)');
            isValid = false;
        }

        return isValid;
    }

    validateContactForm() {
        const form = document.getElementById('contactForm');
        if (!form) return false;

        let isValid = true;
        const fields = form.querySelectorAll('input[required], select[required], textarea[required]');

        fields.forEach(field => {
            if (!this.validateField(field)) {
                isValid = false;
            }
        });

        const phone = form.querySelector('#contactPhone');
        if (phone && !this.validatePhone(phone.value)) {
            this.showError(phone, 'Please enter a valid 10-digit phone number');
            isValid = false;
        }

        const email = form.querySelector('#contactEmail');
        if (email && !this.validateEmail(email.value)) {
            this.showError(email, 'Please enter a valid email address');
            isValid = false;
        }

        return isValid;
    }

    validateEnquiryForm(form) {
        let isValid = true;
        const fields = form.querySelectorAll('input[required], select[required], textarea[required]');

        fields.forEach(field => {
            if (!this.validateField(field)) {
                isValid = false;
            }
        });

        const phone = form.querySelector('input[type="tel"]');
        if (phone && !this.validatePhone(phone.value)) {
            this.showError(phone, 'Please enter a valid 10-digit phone number');
            isValid = false;
        }

        const email = form.querySelector('input[type="email"]');
        if (email && !this.validateEmail(email.value)) {
            this.showError(email, 'Please enter a valid email address');
            isValid = false;
        }

        return isValid;
    }

    validateField(field) {
        const value = field.value.trim();
        
        if (!value) {
            this.showError(field, 'This field is required');
            return false;
        }

        this.clearError(field);
        return true;
    }

    validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    validatePhone(phone) {
        const phoneRegex = /^[0-9]{10}$/;
        return phoneRegex.test(phone.replace(/\D/g, ''));
    }

    validateDOB(dob) {
        const birthDate = new Date(dob);
        const today = new Date();
        const age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            return age - 1 >= 16;
        }
        return age >= 16;
    }

    validatePercentage(value) {
        const num = parseFloat(value);
        
        // Check if it's percentage (0-100) or CGPA (0-10)
        if (num >= 0 && num <= 100) return true; // Percentage
        if (num >= 0 && num <= 10) return true; // CGPA
        
        return false;
    }

    showError(field, message) {
        this.clearError(field);
        
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        errorDiv.style.color = '#ef4444';
        errorDiv.style.fontSize = '0.875rem';
        errorDiv.style.marginTop = '0.25rem';
        
        field.parentNode.appendChild(errorDiv);
        field.classList.add('error');
    }

    clearError(field) {
        const existingError = field.parentNode.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }
        field.classList.remove('error');
    }

    addRealTimeValidation(form) {
        const fields = form.querySelectorAll('input, select, textarea');
        
        fields.forEach(field => {
            field.addEventListener('blur', () => {
                this.validateFieldOnBlur(field);
            });
            
            field.addEventListener('input', () => {
                this.clearError(field);
            });
        });
    }

    validateFieldOnBlur(field) {
        if (field.hasAttribute('required') && !field.value.trim()) {
            this.showError(field, 'This field is required');
            return false;
        }

        switch (field.type) {
            case 'email':
                if (field.value && !this.validateEmail(field.value)) {
                    this.showError(field, 'Please enter a valid email address');
                    return false;
                }
                break;
            case 'tel':
                if (field.value && !this.validatePhone(field.value)) {
                    this.showError(field, 'Please enter a valid 10-digit phone number');
                    return false;
                }
                break;
        }

        this.clearError(field);
        return true;
    }

    async submitAdmissionForm(form) {
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        
        // Show loading state
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';
        
        try {
            const formData = new FormData(form);
            const data = Object.fromEntries(formData);
            
            // Add timestamp
            data.submittedAt = new Date().toISOString();
            
            // In production, replace with actual API endpoint
            // const response = await fetch('/api/apply', {
            //     method: 'POST',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify(data)
            // });
            
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            // Show success message
            this.showSuccessMessage('Application submitted successfully! Our team will contact you within 24 hours.');
            
            // Reset form
            form.reset();
            
            // Redirect or show confirmation
            window.location.href = 'thank-you.html';
            
        } catch (error) {
            console.error('Submission error:', error);
            this.showErrorNotification('Submission failed. Please try again or contact us directly.');
        } finally {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalText;
        }
    }

    async submitContactForm(form) {
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        
        // Show loading state
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        
        try {
            const formData = new FormData(form);
            const data = Object.fromEntries(formData);
            
            // Add timestamp
            data.submittedAt = new Date().toISOString();
            
            // In production, replace with actual API endpoint
            // const response = await fetch('/api/enquiry', {
            //     method: 'POST',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify(data)
            // });
            
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            // Show success message
            this.showSuccessMessage('Message sent successfully! We\'ll get back to you soon.');
            
            // Reset form
            form.reset();
            
        } catch (error) {
            console.error('Submission error:', error);
            this.showErrorNotification('Message sending failed. Please try again or contact us directly.');
        } finally {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalText;
        }
    }

    async submitEnquiryForm(form) {
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        
        // Show loading state
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        
        try {
            const formData = new FormData(form);
            const data = Object.fromEntries(formData);
            
            // In production, replace with actual API endpoint
            // const response = await fetch('/api/enquiry', {
            //     method: 'POST',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify(data)
            // });
            
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            // Show success message
            this.showSuccessMessage('Enquiry submitted successfully!');
            
            // Reset form
            form.reset();
            
        } catch (error) {
            console.error('Submission error:', error);
            this.showErrorNotification('Submission failed. Please try again.');
        } finally {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalText;
        }
    }

    showSuccessMessage(message) {
        this.showNotification(message, 'success');
    }

    showErrorNotification(message) {
        this.showNotification(message, 'error');
    }

    showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `form-notification form-notification-${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
            <span>${message}</span>
            <button class="notification-close">&times;</button>
        `;
        
        document.body.appendChild(notification);
        
        // Add styles if not already present
        if (!document.getElementById('notification-styles')) {
            const style = document.createElement('style');
            style.id = 'notification-styles';
            style.textContent = `
                .form-notification {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    padding: 15px 20px;
                    border-radius: 8px;
                    color: white;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    z-index: 9999;
                    animation: slideIn 0.3s ease;
                    max-width: 400px;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                }
                
                .form-notification-success {
                    background: #10b981;
                }
                
                .form-notification-error {
                    background: #ef4444;
                }
                
                .notification-close {
                    background: none;
                    border: none;
                    color: white;
                    font-size: 20px;
                    cursor: pointer;
                    margin-left: auto;
                }
                
                @keyframes slideIn {
                    from {
                        transform: translateX(100%);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(0);
                        opacity: 1;
                    }
                }
            `;
            document.head.appendChild(style);
        }
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 5000);
        
        // Close button
        notification.querySelector('.notification-close').addEventListener('click', () => {
            notification.remove();
        });
    }
}

// Initialize form validator when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.formValidator = new FormValidator();
});