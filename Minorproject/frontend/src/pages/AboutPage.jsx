// src/pages/AboutPage.jsx
import React from 'react';
import styles from './AboutPage.module.css'; // We'll create this CSS file

const AboutPage = () => {
  return (
    <div className={styles.container}>
      <h1>About the Repurpose App</h1>
      
      <section>
        <h2>Our Mission</h2>
        <p>
          Welcome to the Repurpose App! Our mission is to build a bridge between those who have surplus items and the non-profit organizations that can put them to good use. We believe in reducing waste and empowering communities by giving usable goods a second life.
        </p>
      </section>

      <section>
        <h2>How It Works</h2>
        <div className={styles.howItWorksGrid}>
          <div>
            <h3>For Donators (Users)</h3>
            <ol>
              <li>Register as an 'individual' user.</li>
              <li>Post your item with a title, description, and photo.</li>
              <li>Wait for an approved NGO to request your item.</li>
              <li>Track the status of your donation on your dashboard.</li>
            </ol>
          </div>
          <div>
            <h3>For Requesters (NGOs)</h3>
            <ol>
              <li>Register as an 'NGO'.</li>
              <li>Browse the list of available items.</li>
              <li>Request an item you need for your cause.</li>
              <li>Track your request status on your dashboard.</li>
            </ol>
          </div>
        </div>
      </section>

      <section>
        <h2>Our Vision</h2>
        <p>
          We envision a world where nothing useful goes to waste. By connecting donators directly with NGOs, we aim to create a simple, transparent, and effective platform for charitable giving that benefits both our community and our planet.
        </p>
      </section>
    </div>
  );
};

export default AboutPage;