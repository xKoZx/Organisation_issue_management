import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Video from '../src/images/maldivesVideo.mp4';
import './Admin.css';

function Home() {
  const location = useLocation();
  const navigate = useNavigate();
  const userEmail = location.state ? location.state.email : '';

  const handleLiveChatClick = () => {
    navigate('/livechat', { state: { email: userEmail } });
    console.log('Live Chat clicked. Email:', userEmail);
  };
  const handleIssueChatClick = () => {
    navigate('/issue-view', { state: { email: userEmail } });
    console.log('Live Chat clicked. Email:', userEmail);
  };
  
  const handleupdateClick = () => {
    navigate('/statusupdate', { state: { email: userEmail } });
    console.log('Live Chat clicked. Email:', userEmail);
  };


  return (
    <div className="home">
      <div className="header">
        <h2 className="title">CRYSTAL AI</h2>
        <div className="button-container">
          <p className="nav-button" onClick={handleIssueChatClick}>View Issues</p>
          <p  className="nav-button" onClick={handleupdateClick} >Status Update</p>
          <p className="nav-button" onClick={handleLiveChatClick}>Live Chat</p>
          <Link to="/" className="nav-button">Logout</Link>
        </div>
      </div>
      <div className="hero">
        <video autoPlay loop muted id="video">
          <source src={Video} type="video/mp4" />
        </video>
        <div className="overlay"></div>
        <div className="content">
          <h1>Welcome Staff</h1>
          <p className="email-staff">email:{userEmail}</p>
          
        </div>
      </div>
    </div>
  );
}

export default Home;
