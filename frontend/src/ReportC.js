import React from 'react';
import { Link,  useLocation, useNavigate} from 'react-router-dom';
import './Report.css';


function Report() {
  const location = useLocation();
  const navigate = useNavigate();
  const userEmail = location.state ? location.state.email : '';

  const handleSpeakClick = () => {
    navigate('/speak', { state: { email: userEmail } });
    console.log('Report Status clicked. Email:', userEmail);
    
    
    
  };
  const handleIssueClick = () => {
    navigate('/issue', { state: { email: userEmail } });
    console.log('Report Status clicked. Email:', userEmail);
    
    
    
  };
  const handleLiveClick = () => {
    navigate('/chatroom', { state: { email: userEmail } });
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
        <p className="report-description">Here you can chat with Crystal AI</p>
        <p className="report-button" onClick={handleSpeakClick}>
          Report Now
        </p>
      </div>
      <div className="report-box">
        <h2 className="report-title">Live Chat</h2>
        <p className="report-description">Here you can chat with a live crew member</p>
        <p className="report-button" onClick={handleLiveClick}>
          Report Now
        </p>
      </div>
      <div className="report-box">
        <h2 className="report-title">Issue Window</h2>
        <p className="report-description">Here you can report your issue in classic issue window style</p>
        <p  className="report-button" onClick={handleIssueClick}>
          Report Now
        </p>
      </div>
    </div>
  );
}

export default Report;
