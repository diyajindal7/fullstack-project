// src/pages/PrivacyPolicyPage.jsx
import React from 'react';
import styles from './AboutPage.module.css'; // We can reuse the AboutPage styles

const PrivacyPolicyPage = () => {
  return (
    <div className={styles.container}>
      <h1>Privacy Policy</h1>
      <p><em>Last Updated: November 1, 2025</em></p>

      <section>
        <h2>1. Introduction</h2>
        <p>
          Welcome to the Repurpose App ("we," "us," or "our"). We are committed to protecting your personal information. This Privacy Policy explains how we collect, use, and safeguard your data when you use our services.
        </p>
      </section>
      
      <section>
        <h2>2. Information We Collect</h2>
        <p>We collect information that you provide directly to us, including:</p>
        <ul>
          <li><strong>Account Information:</strong> Your name, email address, password, and user type (Individual, NGO, Admin) when you register.</li>
          <li><strong>Donation Information:</strong> Item titles, descriptions, categories, and photos you upload.</li>
          <li><strong>Request Information:</strong> Records of items you request.</li>
        </ul>
      </section>

      <section>
        <h2>3. How We Use Your Information</h2>
        <p>We use your information to operate our platform, including:</p>
        <ul>
          <li>To create and manage your account.</li>
          <li>To display item listings to eligible NGOs.</li>
          <li>To facilitate the donation and request process.</li>
          <li>To allow an Admin to manage and monitor the system.</li>
        </ul>
      </section>

      <section>
        <h2>4. Data Sharing</h2>
        <p>
          We do not sell your personal data. We only share information in the following limited circumstances:
        </p>
        <ul>
          <li><strong>Between Users and NGOs:</strong> To facilitate a donation, we may share necessary contact information (like name or email) between the confirmed Donator and NGO after a request is approved.</li>
          <li><strong>For Legal Reasons:</strong> We may share information if required by law.</li>
        </ul>
      </section>

      <section>
        <h2>5. Data Security</h2>
        <p>
          We use reasonable measures to help protect your information from loss, theft, misuse, and unauthorized access.
        </p>
      </section>

      <section>
        <h2>6. Contact Us</h2>
        <p>
          If you have any questions about this Privacy Policy, please contact us at <strong>privacy@repurpose.com</strong>.
        </p>
      </section>
    </div>
  );
};

export default PrivacyPolicyPage;