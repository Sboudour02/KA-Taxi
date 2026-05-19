import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import styles from './Header.module.css';

const Header = () => {
    const { lang, switchLanguage, t } = useLanguage();
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    return (
        <header className={`${styles.header} ${isScrolled ? styles.scrolled : ''}`}>
            <div className="container">
                <div className={styles.navContainer}>
                    <a href="#" className={styles.logo} onClick={(e) => {
                        e.preventDefault();
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                        setIsMenuOpen(false);
                    }}>
                        <span className={styles.gold}>KA</span> TAXI
                    </a>

                    <nav className={`${styles.nav} ${isMenuOpen ? styles.navOpen : ''}`}>
                        <a href="#services" onClick={() => setIsMenuOpen(false)}>{t.nav.services}</a>
                        <a href="#airports" onClick={() => setIsMenuOpen(false)}>{t.nav.airports}</a>
                        <a href="#how" onClick={() => setIsMenuOpen(false)}>{t.how.title}</a>
                        <a href="#reservation" onClick={() => setIsMenuOpen(false)} className={styles.mobileCta}>
                            {t.nav.reserve}
                        </a>

                        <div className={styles.langToggle}>
                            <button
                                onClick={() => switchLanguage('fr')}
                                className={lang === 'fr' ? styles.activeLang : ''}
                            >
                                FR
                            </button>
                            <span className={styles.separator}>|</span>
                            <button
                                onClick={() => switchLanguage('en')}
                                className={lang === 'en' ? styles.activeLang : ''}
                            >
                                EN
                            </button>
                        </div>
                    </nav>

                    <a href="#reservation" className="premium-button">
                        {t.nav.reserve}
                    </a>

                    <button className={styles.burger} onClick={toggleMenu} aria-label="Toggle menu">
                        <span className={`${styles.bar} ${isMenuOpen ? styles.barOpen : ''}`}></span>
                        <span className={`${styles.bar} ${isMenuOpen ? styles.barOpen : ''}`}></span>
                        <span className={`${styles.bar} ${isMenuOpen ? styles.barOpen : ''}`}></span>
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Header;
