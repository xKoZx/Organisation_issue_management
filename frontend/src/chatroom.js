import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import firebase from 'firebase/compat/app';
import 'firebase/compat/database';
import axios from 'axios';
import './chatroom.css';
import { format } from 'date-fns';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyArXomLx71vZgCvHSaIorWlPcOoiDvdUK0",
  authDomain: "live-chat-8d8b6.firebaseapp.com",
  projectId: "live-chat-8d8b6",
  storageBucket: "live-chat-8d8b6.appspot.com",
  messagingSenderId: "569985273547",
  appId: "1:569985273547:web:94592c1f97dca3c286554e",
  measurementId: "G-0ZB610P3QX"
};

// Initialize Firebase
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

function Chatroom() {
  const location = useLocation();
  const [selectedCategory, setSelectedCategory] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [staffMember, setStaffMember] = useState(null);
  const [showChatPrompt, setShowChatPrompt] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [messageInput, setMessageInput] = useState('');
  const [randomNumber, setRandomNumber] = useState('');
  const [currentDate, setCurrentDate] = useState('');
  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    fetchUserEmail();
    const random = getRandomNumber();
    setRandomNumber(random);
    const interval = setInterval(() => {
      const now = new Date();
      setCurrentDate(format(now, 'yyyy/MM/dd'));
      setCurrentTime(format(now, 'HH:mm:ss'));
    }, 1000); // Specify the interval duration in milliseconds (e.g., 1000 for 1 second)
    
    return () => {
      clearInterval(interval); // Clear the interval when the component unmounts
    };
  }, []);
  
  const getRandomNumber = () => {
    const randomNumber = Math.floor(1000 + Math.random() * 9000);
    return randomNumber;
  };

  const fetchUserEmail = () => {
    const email = location.state?.email;
    setUserEmail(email);
    const usersRef = firebase.database().ref('users');
    usersRef
      .orderByChild('email')
      .equalTo(email)
      .once('value')
      .then((snapshot) => {
        const users = snapshot.val();
        if (users) {
          const user = Object.values(users)[0];
          setUserEmail(user.email);
        } else {
          setUserEmail('');
        }
      })
      .catch((error) => {
        console.error('Error fetching user email:', error);
      });
  };

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
  };

  const handleChatRequest = () => {
    fetchUserEmail();
    connectToStaffMember();

    console.log('Chat request submitted');
    console.log('Selected Category:', selectedCategory);
  };

  const connectToStaffMember = () => {
    const staffsRef = firebase.database().ref('staffs');
    staffsRef
      .orderByChild('category')
      .equalTo(selectedCategory)
      .once('value')
      .then((snapshot) => {
        const staffs = snapshot.val();
        if (staffs) {
          const staffIds = Object.keys(staffs);
          const randomStaffId =
            staffIds[Math.floor(Math.random() * staffIds.length)];
          const randomStaff = staffs[randomStaffId];
          if (randomStaff) {
            console.log('Connecting to staff:', randomStaff);
            const staffWithEmail = { ...randomStaff, uid: randomStaffId };
            setStaffMember(staffWithEmail);
            setShowChatPrompt(true);

            const staffEmail = randomStaffId;
            console.log('Staff UID:', staffEmail);

            // Retrieve staff email using UID
            const staffEmailRef = firebase.database().ref(`staffs/${randomStaffId}/email`);
            staffEmailRef
              .once('value')
              .then((snapshot) => {
                const staffEmail = snapshot.val();
                console.log('Staff Email:', staffEmail);
                const tableName = `${randomNumber}`;
                const chatRef = firebase.database().ref(tableName);
                chatRef.push({
                  UserEmail: userEmail,
                  StaffEmail: staffEmail,
                });

                // Send request to port 8082
                const payload = {
                  issue_id: randomNumber,
                  issueID:randomNumber,
                  user_email: userEmail,
                  email: userEmail,
                  staff_email: staffEmail,
                  report_mode: 'Live_Chat',
                  category:selectedCategory,
                  assigned_staff: staffEmail,
                  date: currentDate,
                  time: currentTime,
                  status:"Pending",
                  staffreply:'Not Available',
                };

                axios.post('http://localhost:8082/liverequest', payload)
                  .then((response) => {
                    console.log('Request sent successfully:', response.data);
                  })
                  .catch((error) => {
                    console.error('Error sending request:', error);
                  });
                  axios.post('http://localhost:8082/issue_status', payload)
                  .then((response) => {
                    console.log('Request sent successfully:', response.data);
                  })
                  .catch((error) => {
                    console.error('Error sending request:', error);
                  });
                
              })
              .catch((error) => {
                console.error('Error fetching staff email:', error);
              });
          }
        } else {
          console.log('Staff does not exist');
        }
      })
      .catch((error) => {
        console.error('Error fetching staff members:', error);
      });
  };

  const sendMessage = () => {
    const message = messageInput.trim();
    if (message) {
      const messageCount = chatMessages.length;
      const messageName = `userMessage${messageCount === 0 ? 1 : messageCount + 1}`;
  
      const tableName = `${randomNumber}`;
      const chatRef = firebase.database().ref(tableName);
      chatRef.push({
        sender: userEmail,
        message: message,
        messageName: messageName,
        timestamp: new Date().toString(),
      });
      setMessageInput('');
    }
  };
  
  useEffect(() => {
    if (showChatPrompt && staffMember) {
      const tableName = `${randomNumber}`;
      const chatRef = firebase.database().ref(tableName);

      const onNewMessage = (snapshot) => {
        const message = snapshot.val();
        setChatMessages((prevMessages) => [...prevMessages, message]);
      };

      chatRef.on('child_added', onNewMessage);

      return () => {
        chatRef.off('child_added', onNewMessage);
      };
    }
  }, [showChatPrompt, staffMember, randomNumber]);

  return (
    <div className="container-chat">
      <div className="card-chatroom">
        <h2 className="card-title">Chatroom</h2>
        <div className="card-content">
          <p className="user-email">User Email: {userEmail}</p>
          <div className="form-group">
            <label htmlFor="category-select" className="category-label">
              Select Category:
            </label>
            <select
              id="category-select"
              className="category-select"
              value={selectedCategory}
              onChange={handleCategoryChange}
            >
              <option value="">-- Select Category --</option>
              <option value="Hardware">Hardware</option>
              <option value="Software">Software</option>
              <option value="Plumbing">Plumbing</option>
              <option value="Electricity">Electricity</option>
              <option value="Others">Others</option>
              <option value="civil">civil</option>
            </select>
          </div>
          <button className="request-button" onClick={handleChatRequest}>
            Request for Chat
          </button>
        </div>
      </div>

      {showChatPrompt && staffMember && (
        <div className="prompt-overlay">
          <div className="prompt-card-1">
            <div className="prompt-header">
              <div className="contact-info">
                <h2 className="contact-name"><center>Interactig with:{staffMember.email}</center></h2>
              </div>
              <button className="prompt-close" onClick={() => setShowChatPrompt(false)}>
                X
              </button>
            </div>
            <div className="prompt-body">
              {chatMessages.map((message, index) => (
                <div
                  key={index}
                  className={`message ${
                    message.sender === userEmail ? 'sent' : 'received'
                  }`}
                >
                  <p className="message-text">{message.message}</p>
                  <p className="message-timestamp">
                    {message.timestamp &&
                      new Date(message.timestamp).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
            <div className="prompt-footer">
              <input
                type="text"
                placeholder="Type a message..."
                className="message-input"
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
              />
              <button className="send-button" onClick={sendMessage}>
                Send
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Chatroom;