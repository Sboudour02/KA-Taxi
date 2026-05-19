import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import styles from './Airports.module.css';

const Airports = () => {
    const { t } = useLanguage();

    const airportItems = [
        { name: t.airports.cdg, code: "CDG" },
        { name: t.airports.orly, code: "ORY" },
        { name: t.airports.beauvais, code: "BVA" }
    ];

    return (
        <section id="airports" className={styles.section}>
            <div className="container">
                <h2 className={styles.title}>{t.airports.title}</h2>

                <div className={styles.airportList}>
                    {airportItems.map((item, index) => (
                        <div key={index} className={styles.item}>
                            <div className={styles.code}>{item.code}</div>
                            <div className={styles.name}>{item.name}</div>
                            <div className={styles.line}></div>
                        </div>
                    ))}
                </div>

                <div className={styles.specialNote}>
                    <p>Assistance vers tous les terminaux 24h/7j</p>
                </div>
            </div>
        </section>
    );
};

export default Airports;
