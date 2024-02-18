import React from 'react';
import { Link} from 'react-router-dom';
import Video from '../src/images/maldivesVideo.mp4';
import './Admin.css';

function Home() {
  // const location = useLocation();
  // const navigate = useNavigate();
  // const { email } = location.state || '';

  // const handleReportStatusClick = () => {
  //   navigate('/report-status', { state: { email: email } });
  //   console.log('Report Status clicked. Email:', email);
    
  // };
  return (
    <div className="home">
      <div className="header">
        <h2 className="title">CRYSTAL AI</h2>
        <div className="button-container">
          <Link to="/users" className="nav-button">Users</Link>
          <Link to="/staffs" className="nav-button">Staffs</Link>
          <Link to="/inspect" className="nav-button">Inspect</Link>
          <Link to="/admin-status" className="nav-button" >Issue Status</Link> 
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
          <h1>Welcome Admin</h1>
        
        </div>
      </div>
      
      
    </div>
  );
}

export default Home;
