import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import styles from './Services.module.css';

const Services = () => {
    const { t } = useLanguage();

    return (
        <section id="services" className="section-padding">
            <div className="container">
                <div className={styles.header}>
                    <h2 className={styles.title}>{t.services.title}</h2>
                    <p className={styles.desc}>{t.services.desc}</p>
                </div>

                <div className={styles.grid}>
                    {t.services.items.map((item, index) => (
                        <div key={index} className="premium-card">
                            <div className={styles.iconWrapper}>
                                {/* Minimalist SVG Icon placeholder */}
                                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                    {index === 0 && <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>}
                                    {index === 0 && <circle cx="9" cy="7" r="4"></circle>}
                                    {index === 0 && <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>}
                                    {index === 0 && <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>}
                                    {index === 1 && <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>}
                                    {index === 1 && <circle cx="12" cy="7" r="4"></circle>}
                                    {index === 2 && <path d="M16 16v1a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h2m4 0h4a2 2 0 0 1 2 2v1"></path>}
                                    {index === 2 && <path d="M12 5V3m0 18v-2M5 12H3m18 0h-2M7 7l-2-2m14 14-2-2m0-14 2 2M5 19l2-2"></path>}
                                </svg>
                            </div>
                            <h3 className={styles.itemTitle}>{item.title}</h3>
                            <p className={styles.itemDesc}>{item.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Services;
