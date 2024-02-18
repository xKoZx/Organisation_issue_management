import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import { format } from 'date-fns';
import firebase from 'firebase/compat/app';
import 'firebase/compat/database';
import 'firebase/compat/storage';
import './Issue_window.css';

const firebaseConfig = {
  // Your Firebase configuration
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const IssueWindow = () => {
  const [email, setEmail] = useState('');
  const [category, setCategory] = useState('Software');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [messageError, setMessageError] = useState('');
  const [currentDate, setCurrentDate] = useState('');
  const [currentTime, setCurrentTime] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [imageUrl, setImageUrl] = useState('');

  const location = useLocation();
  const userEmail = location.state ? location.state.email : '';

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      setCurrentDate(format(now, 'yyyy/MM/dd'));
      setCurrentTime(format(now, 'HH:mm:ss'));
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  const getRandomStaffMember = async (callback) => {
    const staffsRef = firebase.database().ref('staffs');
    const snapshot = await staffsRef
      .orderByChild('category')
      .equalTo(category)
      .once('value');
    const staffsData = snapshot.val();

    if (staffsData) {
      const staffIds = Object.keys(staffsData);
      const randomStaffId = staffIds[Math.floor(Math.random() * staffIds.length)];
      const randomStaff = staffsData[randomStaffId];
      if (randomStaff) {
        console.log('Connecting to staff:', randomStaff);
        const staffWithEmail = { ...randomStaff, uid: randomStaffId };
        console.log(staffWithEmail);

        const staffEmailRef = firebase.database().ref(`staffs/${randomStaffId}/email`);
        staffEmailRef.once('value').then((snapshot) => {
          const staffEmail = snapshot.val();
          console.log('Staff Email:', staffEmail);
          callback(staffEmail);
        });
      } else {
        callback('');
      }
    } else {
      callback('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (message.trim() === '') {
      setMessageError('Please enter a message');
      return;
    } else {
      setMessageError('');
    }

    const randomNumber = Math.floor(1000 + Math.random() * 9000);
    try {
      const storageRef = firebase.storage().ref();
      const imageRef = storageRef.child(selectedFile.name);
      await imageRef.put(selectedFile);
      const imageUrl = await imageRef.getDownloadURL();

      const response = await axios.post('http://localhost:8082/issue', {
        issueID: randomNumber,
        email: userEmail,
        category,
        message,
        imagePath: selectedFile.name, // Updated to use the image name
      });

      getRandomStaffMember((staffEmail) => {
        setEmail(staffEmail);
        console.log('assigned email', staffEmail);

        const statusResponse = axios.post('http://localhost:8082/issue_status', {
          issueID: randomNumber,
          email: userEmail,
          report_mode: 'Issue Window',
          category,
          assigned_staff: staffEmail,
          date: currentDate,
          time: currentTime,
          status: 'Pending',
          staffreply: 'Not Available',
        });

        console.log(response.data);
        console.log(statusResponse.data);
      });

      setSubmitted(true);
    } catch (error) {
      console.error(error);
    }

    setCategory('Software');
    setMessage('');
    setSelectedFile(null);
    setImageUrl('');
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
    setImageUrl(URL.createObjectURL(file));
  };

  return (
    <div className="issue-window">
      <div className="card2">
        <h1 className="title1">Issue Window</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label5>Email:</label5>
            <input type="text" value={userEmail} onChange={(e) => setEmail(e.target.value)} readOnly />
          </div>
          <div className="form-group">
            <label5>Category:</label5>
            <select value={category} onChange={(e) => setCategory(e.target.value)}>
              <option value="Software">Software</option>
              <option value="Hardware">Hardware</option>
              <option value="Electricity">Electricity</option>
<option value="Plumbing">Plumbing</option>
              <option value="Other">Other</option>
              <option value="civil">civil</option>
            </select>
          </div>
          <div className="form-group">
            <label5>Message:</label5>
            <textarea value={message} onChange={(e) => setMessage(e.target.value)} />
            {messageError && <p className="error-message">{messageError}</p>}
          </div>
          <div className="form-group">
            <label5>Upload Image:</label5>
            <input type="file" accept="image/*" onChange={handleFileChange} />
          </div>
          {selectedFile && (
            <div className="image-preview">
              <img src={imageUrl} alt="Selected" />
            </div>
          )}
          <button type="submit">Send</button>
          {submitted && <p className="submitted-message">Report submitted!</p>}
        </form>
      </div>
      <div className="clock">
        <div>Current Date: {currentDate}</div>
        <div>Current Time: {currentTime}</div>
      </div>
    </div>
  );
};

export default IssueWindow;
