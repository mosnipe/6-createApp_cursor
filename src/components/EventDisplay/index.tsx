import React from 'react';
import './EventDisplay.css';

interface EventDisplayProps {
  leftImageUrl?: string;
  rightImageUrl?: string;
  centerImageUrl?: string;
  textContent: string;
}

const EventDisplay: React.FC<EventDisplayProps> = ({ leftImageUrl, rightImageUrl, centerImageUrl, textContent }) => {
  return (
    <div className="event-display">
      <div className="event-display__left">
        {leftImageUrl && <img src={leftImageUrl} alt="Left Character" className="event-display__image" />}
      </div>
      <div className="event-display__center">
        {centerImageUrl && <img src={centerImageUrl} alt="Event Background" className="event-display__image" />}
      </div>
      <div className="event-display__right">
        {rightImageUrl && <img src={rightImageUrl} alt="Right Character" className="event-display__image" />}
      </div>
      <div className="event-display__text">
        <p>{textContent}</p>
      </div>
    </div>
  );
};

export default EventDisplay;