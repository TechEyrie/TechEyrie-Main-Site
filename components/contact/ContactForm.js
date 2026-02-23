"use client";
import React, { useState } from 'react';
import Dropdown from '../ui/Dropdown';

// Slide-out contact form panel
export default function ContactForm({ isOpen, onClose }) {
  const [service, setService] = useState('');
  const [country, setCountry] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission here
    console.log('Form submitted');
    // console.log({ service, country }); // For debugging
    onClose();
  };

  const serviceOptions = [
    { value: 'visa', label: 'Visa Services' },
    { value: 'residency', label: 'Residency' },
    { value: 'citizenship', label: 'Citizenship' },
    { value: 'consulting', label: 'Consulting' },
    { value: 'other', label: 'Other' }
  ];

  const countryOptions = [
    { value: 'usa', label: 'USA' },
    { value: 'uk', label: 'United Kingdom' },
    { value: 'canada', label: 'Canada' },
    { value: 'australia', label: 'Australia' },
    { value: 'germany', label: 'Germany' },
    { value: 'france', label: 'France' },
    { value: 'spain', label: 'Spain' },
    { value: 'italy', label: 'Italy' },
    { value: 'other', label: 'Other' }
  ];

  return (
    <>
      {/* Overlay */}
      <div 
        className={`contact-form-overlay ${isOpen ? 'active' : ''}`}
        onClick={onClose}
      />
      
      {/* Panel */}
      <div className={`contact-form-panel ${isOpen ? 'active' : ''}`}>
        <div className="contact-form-panel-inner">
          {/* Header */}
          <div className="contact-form-header">
            <h2 className="contact-form-title font-italiana font-light text-[28px] sm:text-[32px] md:text-[40px] leading-[1.2] tracking-[-0.03em] text-[#000]">
              Get<br />in touch
            </h2>
            <button 
              className="contact-form-close"
              onClick={onClose}
              aria-label="Close form"
            >
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18 6L6 18M6 6L18 18" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>

          {/* Form */}
          <form className="contact-form-fields" onSubmit={handleSubmit}>
            {/* Name */}
            <div className="contact-input-group">
              <input 
                type="text" 
                id="contact-name" 
                name="name" 
                placeholder=" "
                required
                className="font-merriweather text-[14px]"
              />
              <label htmlFor="contact-name" className="font-merriweather text-[13px] md:text-[15px] font-semibold tracking-[0.16em] uppercase">* Name</label>
            </div>

            {/* Phone */}
            <div className="contact-input-group">
              <input 
                type="tel" 
                id="contact-phone" 
                name="phone" 
                placeholder=" "
                required
                className="font-merriweather text-[14px]"
              />
              <label htmlFor="contact-phone" className="font-merriweather text-[13px] md:text-[15px] font-semibold tracking-[0.16em] uppercase">* Phone</label>
            </div>

            {/* Email */}
            <div className="contact-input-group">
              <input 
                type="email" 
                id="contact-email" 
                name="email" 
                placeholder=" "
                required
                className="font-merriweather text-[14px]"
              />
              <label htmlFor="contact-email" className="font-merriweather text-[13px] md:text-[15px] font-semibold tracking-[0.16em] uppercase">* Email</label>
            </div>

            {/* Service Dropdown */}
            <div className={`contact-input-group select-group ${service ? 'has-value' : ''}`}>
              <Dropdown 
                options={serviceOptions}
                value={service}
                onChange={setService}
                name="service"
                placeholder=""
                id="contact-service"
              />
              <label htmlFor="contact-service" className="font-merriweather text-[13px] md:text-[15px] font-semibold tracking-[0.16em] uppercase">* Select a service</label>
            </div>

            {/* Country Dropdown */}
            <div className={`contact-input-group select-group ${country ? 'has-value' : ''}`}>
              <Dropdown 
                options={countryOptions}
                value={country}
                onChange={setCountry}
                name="country"
                placeholder=""
                id="contact-country"
              />
              <label htmlFor="contact-country" className="font-merriweather text-[13px] md:text-[15px] font-semibold tracking-[0.16em] uppercase">* Country of interest</label>
            </div>

            {/* Privacy Checkbox */}
            <div className="contact-checkbox-group">
              <input 
                type="checkbox" 
                id="contact-privacy" 
                name="privacy"
                required
              />
              <label htmlFor="contact-privacy" className="font-merriweather text-[14px]">
                I agree with the <a href="/privacy-policy">privacy policy</a>
              </label>
            </div>

            {/* Submit Button */}
            <button type="submit" className="contact-submit-btn font-merriweather text-[14px] font-semibold">
              Apply Now
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
