import React, { useState } from 'react';
import './Contact.css';

interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

const Contact: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      // Prepare form data for Web3Forms
      const formDataToSend = new FormData();
      formDataToSend.append('access_key', import.meta.env.VITE_WEB3FORMS_ACCESS_KEY); // Web3Forms access key from env
      formDataToSend.append('name', formData.name);
      formDataToSend.append('email', formData.email);
      formDataToSend.append('subject', `QuestNest Contact: ${formData.subject}`);
      formDataToSend.append('message', formData.message);
      formDataToSend.append('from_name', 'QuestNest Website');
      
      // Additional Web3Forms options
      formDataToSend.append('redirect', 'false'); // Don't redirect after submission
      
      // Submit to Web3Forms
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: formDataToSend
      });

      const result = await response.json();

      if (result.success) {
        console.log('Contact form submitted successfully:', formData);
        setSubmitStatus('success');
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        throw new Error(result.message || 'Form submission failed');
      }
    } catch (error) {
      console.error('Form submission error:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="contact">
      <div className="contact-container">
        <div className="contact-header">
          <h1 className="contact-title">Contact the Guild</h1>
          <p className="contact-subtitle">
            Seek counsel from the keepers of QuestNest. Whether you need guidance on your mystical journey 
            or have questions about our enchanted treasures, we are here to assist.
          </p>
        </div>

        <div className="contact-content">
          <div className="contact-info">
            <h2>Reach Out Through the Mystical Channels</h2>
            <div className="contact-methods">
              <div className="contact-method">
                <div className="method-icon">📧</div>
                <div>
                  <h3>Ancient Scrolls (Email)</h3>
                  <p>quest@questnest.com</p>
                </div>
              </div>
              
              <div className="contact-method">
                <div className="method-icon">🔮</div>
                <div>
                  <h3>Crystal Communication</h3>
                  <p>+1 (555) QUEST-01</p>
                </div>
              </div>
              
              <div className="contact-method">
                <div className="method-icon">🏰</div>
                <div>
                  <h3>Guild Headquarters</h3>
                  <p>123 Mystical Lane<br />Enchanted City, EC 12345</p>
                </div>
              </div>
            </div>
          </div>

          <div className="contact-form-container">
            <form className="contact-form" onSubmit={handleSubmit}>
              <h2>Send a Message</h2>
              
              <div className="form-group">
                <label htmlFor="name">Your Name *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Enter your adventurer name"
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email Address *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="your.email@example.com"
                />
              </div>

              <div className="form-group">
                <label htmlFor="subject">Subject</label>
                <select
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                >
                  <option value="">Choose your quest type</option>
                  <option value="product-inquiry">Product Inquiry</option>
                  <option value="order-support">Order Support</option>
                  <option value="general-question">General Question</option>
                  <option value="partnership">Partnership</option>
                  <option value="feedback">Feedback</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="message">Your Message *</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={6}
                  placeholder="Share your tale or inquiry..."
                />
              </div>

              <button 
                type="submit" 
                className={`submit-button ${isSubmitting ? 'submitting' : ''}`}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <span className="spinner"></span>
                    Casting Spell...
                  </>
                ) : (
                  'Send Message'
                )}
              </button>

              {submitStatus === 'success' && (
                <div className="status-message success">
                  ✨ Your message has been sent through the mystical channels! We'll respond within 24 hours.
                </div>
              )}

              {submitStatus === 'error' && (
                <div className="status-message error">
                  🔥 The spell failed to cast. Please try again or contact us directly.
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
