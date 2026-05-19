"use client";

import React, { useState, useRef } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import styles from './ReservationForm.module.css';

const ReservationForm = () => {
    const { t } = useLanguage();
    const sectionRef = useRef(null);
    const [formData, setFormData] = useState({
        fullName: '',
        phone: '',
        email: '',
        tripType: 'toAirport',
        airport: 'CDG',
        date: '',
        time: '',
        address: '',
        passengers: '1',
        luggage: '1',
        message: ''
    });

    const [status, setStatus] = useState('idle'); // idle, loading, success, error, errorLeadTime, errorPastDate, errorAlreadyBooked
    const [isChecking, setIsChecking] = useState(false);
    const [availabilityChecked, setAvailabilityChecked] = useState(false);
    const [showModal, setShowModal] = useState(false);

    const closeModal = () => {
        setShowModal(false);
        setStatus('idle');
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setAvailabilityChecked(false);
        if (status !== 'idle') setStatus('idle');
    };

    const handleCheckAvailability = async () => {
        if (!formData.fullName.trim() || !formData.phone.trim()) {
            setStatus('error');
            return;
        }

        const reservationDate = new Date(`${formData.date}T${formData.time}`);
        const now = new Date();
        const buffer = 3 * 60 * 60 * 1000;

        if (reservationDate < now) {
            setStatus('errorPastDate');
            return;
        }

        if (reservationDate < new Date(now.getTime() + buffer)) {
            setStatus('errorLeadTime');
            return;
        }

        setIsChecking(true);
        setStatus('idle');

        try {
            const res = await fetch(`/api/reserve?date=${formData.date}&time=${formData.time}`);
            const data = await res.json();

            if (data.available) {
                setTimeout(() => {
                    setIsChecking(false);
                    setAvailabilityChecked(true);
                }, 1000);
            } else {
                setIsChecking(false);
                setStatus('errorAlreadyBooked');
            }
        } catch (e) {
            setIsChecking(false);
            setStatus('error');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!availabilityChecked) return;

        setStatus('loading');

        try {
            const response = await fetch('/api/reserve', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                setShowModal(true);
                setStatus('idle'); // Status handled by modal now
                setAvailabilityChecked(false);

                setFormData({
                    fullName: '',
                    phone: '',
                    email: '',
                    tripType: 'toAirport',
                    airport: 'CDG',
                    date: '',
                    time: '',
                    address: '',
                    passengers: '1',
                    luggage: '1',
                    message: ''
                });
            } else {
                const errData = await response.json();
                setStatus(errData.error || 'error');
                setAvailabilityChecked(false);
            }
        } catch (error) {
            setStatus('error');
            setAvailabilityChecked(false);
        }
    };

    return (
        <section id="reservation" ref={sectionRef} className={styles.section} style={{ paddingTop: '120px' }}>
            {showModal && (
                <div className={styles.modalOverlay}>
                    <div className={`${styles.modalContent} animate-fade-in`}>
                        <div className={styles.successIcon}>✓</div>
                        <h3 className={styles.successTitle}>{t.form.success}</h3>
                        <p style={{ opacity: 0.7, margin: '1rem 0 2rem', textAlign: 'center' }}>
                            {t.form.reassurance}
                        </p>
                        <button onClick={closeModal} className="premium-button">
                            OK
                        </button>
                    </div>
                </div>
            )}
            <div className="container">
                <div className={styles.formCard}>
                    <div className={styles.formHeader}>
                        <h2 className={styles.title}>
                            {t.form.title.split(' ').map((word, i) => (
                                <span key={i} className={i === t.form.title.split(' ').length - 1 ? styles.gold : ''}>
                                    {word}{' '}
                                </span>
                            ))}
                        </h2>
                        <p className={styles.subtitle}>{t.form.subtitle}</p>
                    </div>

                    <form onSubmit={handleSubmit} className={styles.form}>
                        <div className={styles.row}>
                            <div className={styles.field}>
                                <label>{t.form.fullName} *</label>
                                <input
                                    type="text"
                                    name="fullName"
                                    value={formData.fullName}
                                    onChange={handleChange}
                                    required
                                    placeholder="Jean Dupont"
                                />
                            </div>
                            <div className={styles.field}>
                                <label>{t.form.phone} *</label>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    required
                                    placeholder="+33 6 12 34 56 78"
                                />
                            </div>
                        </div>

                        <div className={styles.row}>
                            <div className={styles.field}>
                                <label>{t.form.tripType}</label>
                                <select name="tripType" value={formData.tripType} onChange={handleChange}>
                                    <option value="toAirport">{t.form.toAirport}</option>
                                    <option value="fromAirport">{t.form.fromAirport}</option>
                                    <option value="roundTrip">{t.form.roundTrip}</option>
                                </select>
                            </div>
                            <div className={styles.field}>
                                <label>{t.form.airport}</label>
                                <select name="airport" value={formData.airport} onChange={handleChange}>
                                    <option value="CDG">Charles de Gaulle (CDG)</option>
                                    <option value="ORY">Orly (ORY)</option>
                                    <option value="BVA">Beauvais (BVA)</option>
                                </select>
                            </div>
                        </div>

                        <div className={styles.row}>
                            <div className={styles.field}>
                                <label>{t.form.date} *</label>
                                <input
                                    type="date"
                                    name="date"
                                    value={formData.date}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className={styles.field}>
                                <label>{t.form.time} *</label>
                                <input
                                    type="time"
                                    name="time"
                                    value={formData.time}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className={styles.field}>
                            <label>{t.form.address} *</label>
                            <input
                                type="text"
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                required
                                placeholder="Ex: 123 Rue de Rivoli, 75001 Paris"
                            />
                        </div>

                        <div className={styles.row}>
                            <div className={styles.field}>
                                <label>{t.form.passengers}</label>
                                <input
                                    type="number"
                                    name="passengers"
                                    min="1"
                                    max="8"
                                    value={formData.passengers}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className={styles.field}>
                                <label>{t.form.luggage}</label>
                                <input
                                    type="number"
                                    name="luggage"
                                    min="0"
                                    max="12"
                                    value={formData.luggage}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <div className={styles.field}>
                            <label>{t.form.message}</label>
                            <textarea
                                name="message"
                                rows="3"
                                value={formData.message}
                                onChange={handleChange}
                                placeholder={t.form.specialRequest}
                            ></textarea>
                        </div>

                        <div className={styles.footer}>
                            <div className={styles.statusSlot}>
                                {availabilityChecked && (
                                    <p className={styles.successMessage}>
                                        <span className={styles.checkIcon}>✓</span> {t.form.available}
                                    </p>
                                )}
                                {status === 'errorAlreadyBooked' && (
                                    <p className={styles.errorMessageLarge}>{t.form.errorAlreadyBooked}</p>
                                )}
                                {!availabilityChecked && status !== 'errorAlreadyBooked' && (
                                    <p className={styles.reassurance}>{t.form.reassurance}</p>
                                )}
                            </div>

                            {availabilityChecked ? (
                                <button
                                    type="submit"
                                    className="premium-button"
                                    disabled={status === 'loading'}
                                >
                                    {status === 'loading' ? '...' : t.form.submit}
                                </button>
                            ) : (
                                <button
                                    type="button"
                                    className="premium-button"
                                    onClick={handleCheckAvailability}
                                    disabled={isChecking}
                                >
                                    {isChecking ? t.form.checking : t.form.checkAvailability}
                                </button>
                            )}
                        </div>

                        {status === 'error' && (
                            <p className={styles.errorMessage}>{t.form.error}</p>
                        )}
                        {status === 'errorPastDate' && (
                            <p className={styles.errorMessage}>{t.form.errorPastDate}</p>
                        )}
                        {status === 'errorLeadTime' && (
                            <p className={styles.errorMessage}>{t.form.errorLeadTime}</p>
                        )}
                    </form>
                </div>
            </div>
        </section>
    );
};

export default ReservationForm;
