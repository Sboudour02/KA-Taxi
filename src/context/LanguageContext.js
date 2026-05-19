"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations } from '../lib/translations';

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
    const [lang, setLang] = useState('fr');

    useEffect(() => {
        const savedLang = localStorage.getItem('ka-taxi-lang');
        if (savedLang && (savedLang === 'fr' || savedLang === 'en')) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setLang(savedLang);
        }
    }, []);

    const switchLanguage = (newLang) => {
        setLang(newLang);
        localStorage.setItem('ka-taxi-lang', newLang);
    };

    const t = translations[lang];

    return (
        <LanguageContext.Provider value={{ lang, switchLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
}
