import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import styles from './Footer.module.css';

const Footer = () => {
    const { t } = useLanguage();
    const year = new Date().getFullYear();

    return (
        <footer className={styles.footer}>
            <div className="container">
                <div className={styles.content}>
                    <div className={styles.brand}>
                        <div className={styles.logo}>
                            <span className={styles.gold}>KA</span> TAXI
                        </div>
                        <p className={styles.desc}>{t.hero.subtitle}</p>
                    </div>

                    <div className={styles.links}>
                        <div className={styles.linkGroup}>
                            <a href="#services">{t.nav.services}</a>
                            <a href="#airports">{t.nav.airports}</a>
                            <a href="#reservation">{t.nav.reserve}</a>
                        </div>
                        <div className={styles.linkGroup}>
                            <span>{t.footer.legal}</span>
                            <span>{t.footer.privacy}</span>
                        </div>
                    </div>
                </div>

                <div className={styles.bottom}>
                    <p>&copy; {year} {t.footer.company}. {t.footer.rights}</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
