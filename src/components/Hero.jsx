import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import styles from './Hero.module.css';

const Hero = () => {
    const { t } = useLanguage();

    return (
        <section className={styles.hero}>
            <div className={styles.overlay}></div>
            <div className="container">
                <div className={styles.content}>
                    <h1 className={styles.title}>
                        {t.hero.title.split(' ').map((word, i) => (
                            <span key={i} className={i === t.hero.title.split(' ').length - 1 ? styles.gold : ''}>
                                {word}{' '}
                            </span>
                        ))}
                    </h1>
                    <p className={styles.subtitle}>{t.hero.subtitle}</p>
                    <div className={styles.actions}>
                        <a href="#reservation" className="premium-button">
                            {t.hero.cta}
                        </a>
                    </div>
                </div>
            </div>

            <div className={styles.bottomBar}>
                <div className="container">
                    <div className={styles.features}>
                        <span>CDG</span>
                        <span className={styles.dot}></span>
                        <span>ORLY</span>
                        <span className={styles.dot}></span>
                        <span>BEAUVAIS</span>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;
