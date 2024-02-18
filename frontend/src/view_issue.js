import React from 'react';
import { Link,  useLocation, useNavigate} from 'react-router-dom';
import './Report.css';


function Report() {
  const location = useLocation();
  const navigate = useNavigate();
  const userEmail = location.state ? location.state.email : '';

  const handleSpeakClick = () => {
    navigate('/staff-chatbotview', { state: { email: userEmail } });
    console.log('Report Status clicked. Email:', userEmail);
    
    
    
  };
  const handleIssueClick = () => {
    navigate('/staff-windowview', { state: { email: userEmail } });
    console.log('Report Status clicked. Email:', userEmail);
    
    
    
  };

  return (
    <div className="report-container">
      <h2 className="report-heading">
        <center>Choose mode of reporting:-</center>
         email: {userEmail}
      </h2>
      <div className="report-box">
        <h2 className="report-title">Chatbot</h2>
        <p className="report-description">Click to view </p>
        <p className="report-button" onClick={handleSpeakClick}>
          view
        </p>
      </div>
      
      
      <div className="report-box">
        <h2 className="report-title">Issue Window</h2>
        <p className="report-description">Here you can report your issue in classic issue window style</p>
        <p  className="report-button" onClick={handleIssueClick}>
          View
        </p>
      </div>
    </div>
  );
}

export default Report;
