import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Clock } from 'lucide-react';
import './OpeningHours.css';

const OpeningHours = () => {
  const { t, language } = useLanguage();
  
  const days = [
    { key: 'day.monday', hours: '08h00 - 17h00' },
    { key: 'day.tuesday', hours: '08h00 - 17h00' },
    { key: 'day.wednesday', hours: '08h00 - 17h00' },
    { key: 'day.thursday', hours: '08h00 - 17h00' },
    { key: 'day.friday', hours: '08h00 - 17h00' },
    { key: 'day.saturday', hours: '08h00 - 17h00' },
    { key: 'day.sunday', hours: t('closed'), isClosed: true },
  ];

  const todayIndex = (new Date().getDay() + 6) % 7; // Convert 0 (Sun) to 6, 1 (Mon) to 0

  return (
    <div className="opening-hours-card">
      <div className="card-header">
        <Clock size={20} className="header-icon" />
        <h3>{t('opening.hours')}</h3>
      </div>
      <div className="hours-grid">
        {days.map((day, index) => (
          <div key={day.key} className={`hour-item ${index === todayIndex ? 'today' : ''} ${day.isClosed ? 'closed' : ''}`}>
            <span className="day-name">{t(day.key)}</span>
            <div className="day-status">
              <span className="hours-text">{day.hours}</span>
              {index === todayIndex && <span className="today-badge">{t('today')}</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OpeningHours;
