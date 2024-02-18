import React from 'react';
import { Link } from 'react-router-dom';
import './Inspect.css';

function Report() {
  return (
    <div className="report-container">
      <h2 className="report-heading">
        <center>Choose Which mode to inspect:-</center>
      </h2>
      <div className="report-box">
        <h2 className="report-title">Chatbot</h2>
        <p className="report-description">click here to inspect the chatbot Conversation</p>
        <Link to="/speak-view" className="report-button">
          View
        </Link>
      </div>
      <div className="report-box">
        <h2 className="report-title">Live Chat</h2>
        <p className="report-description">click here to inspect the Live Chat Conversation</p>
        <Link to="/live-view" className="report-button">
          View
        </Link>
      </div>
      <div className="report-box">
        <h2 className="report-title">Issue Window</h2>
        <p className="report-description">click here to inspect the Issue window Reports</p>
        <Link to="/window-view" className="report-button">
          View
        </Link>
      </div>
    </div>
  );
}

export default Report;
