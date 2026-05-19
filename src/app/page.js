"use client";

import React from 'react';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import Services from '@/components/Services';
import Airports from '@/components/Airports';
import ReservationForm from '@/components/ReservationForm';
import Footer from '@/components/Footer';
import { useLanguage } from '@/context/LanguageContext';
import styles from './page.module.css';

export default function Home() {
  const { t } = useLanguage();

  React.useEffect(() => {
    // Force scroll to top on refresh/load
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);
  }, []);

  return (
    <main>
      <Header />
      <Hero />

      <section id="how" className={`${styles.howSection} section-padding`}>
        <div className="container">
          <div className={styles.howTitle}>
            <h2>{t.how.title}</h2>
          </div>
          <div className={styles.howGrid}>
            {t.how.steps.map((step, i) => (
              <div key={i} className="animate-fade-in" style={{ animationDelay: `${i * 0.2}s` }}>
                <div className={styles.howStepNumber}>0{i + 1}</div>
                <h3 className={styles.howStepTitle}>{step.title}</h3>
                <p className={styles.howStepDesc}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Services />
      <Airports />

      <section id="why" className="section-padding">
        <div className="container">
          <div className={styles.whyTitle}>
            <h2>{t.why.title}</h2>
          </div>
          <div className={styles.whyGrid}>
            {t.why.items.map((item, i) => (
              <div key={i} className="premium-card">
                <h3 style={{ marginBottom: '1rem', color: 'var(--accent)' }}>{item.title}</h3>
                <p style={{ opacity: 0.7, lineHeight: 1.6 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <ReservationForm />
      <Footer />
    </main>
  );
}
