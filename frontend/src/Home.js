import React from 'react';
import { Link, useLocation, useNavigate} from 'react-router-dom';
import Video from '../src/images/maldivesVideo.mp4';
import './Home.css';

function Home() {
  const location = useLocation();
  const navigate = useNavigate();
  const { email } = location.state || '';

  const handleReportNowClick = () => {
    navigate('/report', { state: { email: email } });
    console.log('Report Status clicked. Email:', email);
    
  };

  const handleReportStatusClick = () => {
    navigate('/report-status', { state: { email: email } });
    console.log('Report Status clicked. Email:', email);
    
  };
  return (
    <div className="home">
      <div className="header">
        <h2 className="title-home">CRYSTAL AI</h2>
        <div className="button-container">
          <Link to="/about" className="nav-button">About Us</Link>
          <button1 className="nav-button" onClick={handleReportNowClick}>Report Now</button1> 
          <button1 className="nav-button" onClick={handleReportStatusClick}>Report Status</button1> 
          <Link to="/" className="nav-button">Logout</Link>
          {/* <button className="nav-button" onClick={handleReportStatusClick}>Report Status</button> */}
        </div>
      </div>
      <div className="hero">
        <video autoPlay loop muted id="video">
          <source src={Video} type="video/mp4" />
        </video>
        <div className="overlay"></div>
        <div className="content">
          <phead>You might have heard that AI can handle anything</phead>
          <p className="subtitle">Now you can report your issues using CRYSTAL AI</p>
        </div>
      </div>
      
      
    </div>
  );
}

export default Home;
