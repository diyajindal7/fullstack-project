// src/pages/ContactPage.jsx
import React, { useState } from 'react';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import styles from './ContactPage.module.css'; // We'll create this

const ContactPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate form submission
    console.log({ name, email, message });
    alert("Thank you for your message! We'll get back to you soon.");
    setName('');
    setEmail('');
    setMessage('');
  };

  return (
    <div className={styles.container}>
      <h1>Contact Us</h1>
      <p className={styles.subtitle}>
        Have a question, feedback, or need help? Fill out the form below or email us at <strong>support@repurpose.com</strong>.
      </p>

      <form onSubmit={handleSubmit} className={styles.form}>
        <Input
          label="Your Name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <Input
          label="Your Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <div>
          <label className={styles.label}>Message</label>
          <textarea
            className={styles.textarea}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows="6"
            required
          />
        </div>
        <Button type="submit" variant="primary">Send Message</Button>
      </form>
    </div>
  );
};

export default ContactPage;