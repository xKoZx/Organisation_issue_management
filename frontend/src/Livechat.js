import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Livechat.css';
import { useLocation } from 'react-router-dom';
import firebase from 'firebase/compat/app';
import 'firebase/compat/database';

// Initialize your Firebase app with your Firebase project configuration
const firebaseConfig = {
  // Firebase configuration details
};

// Initialize Firebase
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
const database = firebase.database();

function LiveChat() {
  const [liveChatData, setLiveChatData] = useState([]);
  const [showCard, setShowCard] = useState(false);
  const [selectedIssueIndex, setSelectedIssueIndex] = useState(0);
  const [chatInput, setChatInput] = useState('');
  const location = useLocation();
  const email = location.state ? location.state.email : '';

  const [chatMessages, setChatMessages] = useState([]);
  const [showBubble, setShowBubble] = useState(false);
  const [alreadyInteracted, setAlreadyInteracted] = useState(false);

  useEffect(() => {
    fetchLiveChatData();
  }, []);

  const fetchLiveChatData = async () => {
    try {
      const response = await axios.get('http://localhost:8082/requestlive', {
        params: {
          email: email,
        },
      });
      console.log(response.data);
      setLiveChatData(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleViewClick = async (issueId) => {
    const selectedIssue = liveChatData.find((data) => data.Issue_ID === issueId);

    if (selectedIssue.Status !== 'Pending') {
      setAlreadyInteracted(true);
      setShowCard(true);
      setChatMessages([]);
      setChatInput('');
      setShowBubble(false);
      return;
    }

    try {
      const snapshot = await database.ref(String(issueId)).once('value');
      const chatData = snapshot.val();
      setChatMessages(Object.values(chatData));
    } catch (error) {
      console.error(error);
    }
    setShowCard(true);
  };

  const handleSendClick = async () => {
    const issueId = liveChatData[selectedIssueIndex].Issue_ID;
    const tableName = `${issueId}`;

    const newMessage = {
      sender: email,
      message: chatInput,
      timestamp: new Date().toString(),
    };

    try {
      database.ref(tableName).push(newMessage);
      setChatInput('');
      setShowBubble(true);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  useEffect(() => {
    if (showBubble) {
      const timer = setTimeout(() => {
        setShowBubble(false);
      }, 3000);

      return () => {
        clearTimeout(timer);
      };
    }
  }, [showBubble]);

  useEffect(() => {
    if (showCard) {
      const issueId = liveChatData[selectedIssueIndex].Issue_ID;
      const tableName = `${issueId}`;

      // Listen for new child_added events and update chat messages
      const chatRef = database.ref(tableName);
      chatRef.on('child_added', (snapshot) => {
        const message = snapshot.val();
        setChatMessages((prevMessages) => [...prevMessages, message]);
      });

      return () => {
        // Unsubscribe from child_added events when component is unmounted
        chatRef.off('child_added');
      };
    }
  }, [showCard, liveChatData, selectedIssueIndex]);

  return (
    <div className="container3">
      <h2 className="heading-requests">Live Chat Requests</h2>
      <div className="card-requests">
        <table className="report-table">
          <thead>
            <tr>
              <th>Issue ID</th>
              <th>User_email</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody className="report-data">
            {liveChatData.map((data, index) => (
              <tr key={index}>
                <td>{data.Issue_ID}</td>
                <td>{data.User_email}</td>
                <td>{data.Status}</td>
                <td>
                  <button onClick={() => handleViewClick(data.Issue_ID)}>View</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showCard && chatMessages.length === 0 && (
        <div className="card-overlay">
          <div className="card-newreq">
            <button className="close-button" onClick={() => setShowCard(false)}>
              Close
            </button>
            <h2 className="add-staff-heading">Already Interacted with the User</h2>
            <p>You have already interacted with this user. Cannot proceed further.</p>
          </div>
        </div>
      )}

      {showCard && !alreadyInteracted && (
        <div className="card-overlay">
          <div className="card-newreq">
            <button className="close-button" onClick={() => setShowCard(false)}>
              Close
            </button>
            <h2 className="add-staff-heading">Issue ID: {liveChatData[selectedIssueIndex].Issue_ID}</h2>

            <div className="chat-messages">
              {chatMessages.map((message, index) => {
                const isUserMessage = message.sender === email;
                const messageClass = isUserMessage ? 'chat-message-user' : 'chat-message-staff';

                return (
                  <div key={index} className={`chat-message ${messageClass}`}>
                    {message.message}
                  </div>
                );
              })}
              {showBubble && <div className="chat-bubble">Message sent!</div>}
            </div>

            <div className="chat-input">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Type your message..."
              />
              <button onClick={handleSendClick}>Send</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default LiveChat;
