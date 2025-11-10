import React from 'react';
import styles from './AboutPage.module.css';

const AboutPage = () => {
  return (
    <div className={styles.aboutWrapper}>
      <div className={styles.container}>
        <h1 className={styles.title}>About RePurpose ♻</h1>
        <p className={styles.subtitle}>
          Turning clutter into compassion — one donation at a time.
        </p>

        {/* Our Story */}
        <section className={styles.section}>
          <h2>🌱 Our Story</h2>
          <p>
            RePurpose began as a small community project with a big dream — to redefine how
            people think about giving and sustainability. What started with a few volunteers
            collecting unused items from homes has now evolved into a digital movement empowering
            thousands of users to donate responsibly and connect directly with verified NGOs.
            We believe that every act of kindness, no matter how small, creates ripples of change
            across the world.
          </p>
        </section>

        {/* Mission Section */}
        <section className={styles.section}>
          <h2>🌿 Our Mission</h2>
          <p>
            At <strong>RePurpose</strong>, our mission is to bridge the gap between those who
            have and those in need. We aim to reduce waste by connecting individuals with NGOs
            that can reuse items to support communities in need. Together, we make sustainability
            a lifestyle — not just a choice.
          </p>
        </section>

        {/* How It Works Section */}
        <section className={styles.section}>
          <h2>✨ How It Works</h2>
          <div className={styles.grid}>
            <div className={styles.card}>
              <h3>For Donators 🙌</h3>
              <ol>
                <li>Sign up as an Individual.</li>
                <li>Upload your item with a title, description, and photo.</li>
                <li>Wait for an NGO to request your donation.</li>
                <li>Track and complete the donation effortlessly.</li>
              </ol>
            </div>
            <div className={styles.card}>
              <h3>For NGOs ❤</h3>
              <ol>
                <li>Register as a verified NGO partner.</li>
                <li>Browse available donations by location and category.</li>
                <li>Request needed items from donors.</li>
                <li>Stay updated through our transparent tracking system.</li>
              </ol>
            </div>
          </div>
        </section>

        {/* Our Vision */}
        <section className={styles.section}>
          <h2>🍃 Our Vision</h2>
          <p>
            We dream of a world where every unused item finds a new purpose — where kindness and
            sustainability coexist, and where technology empowers communities to give back
            meaningfully. Our platform envisions a future where donation becomes a natural part
            of daily life and waste becomes a thing of the past.
          </p>
        </section>

        {/* Our Impact */}
        <section className={styles.section}>
          <h2>🌍 Our Impact</h2>
          <p>
            Since our inception, RePurpose has helped connect thousands of donors and NGOs
            across cities. Together, we’ve:
          </p>
          <ul className={styles.impactList}>
            <li>♻ Reused over <strong>25,000+</strong> items that would have gone to waste.</li>
            <li>🤝 Partnered with <strong>150+</strong> NGOs supporting local communities.</li>
            <li>💡 Reduced over <strong>80 tons</strong> of potential landfill waste.</li>
            <li>🌟 Empowered individuals to make sustainable living a habit.</li>
          </ul>
        </section>

        {/* Call to Action */}
        <section className={styles.section}>
          <h2>💫 Join Us in Making Change</h2>
          <p>
            RePurpose is more than a platform — it’s a community built on empathy, trust, and
            impact. Whether you’re donating, volunteering, or spreading the word, every small
            action counts. Together, we can transform waste into opportunity and compassion
            into change.
          </p>
        </section>

        <footer className={styles.footer}>
          © 2025 RePurpose | Building a sustainable tomorrow 🌎
        </footer>
      </div>
    </div>
  );
};

export default AboutPage;