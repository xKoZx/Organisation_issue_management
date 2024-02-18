import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './Speak.css';
import { useSpeechSynthesis } from 'react-speech-kit';
import { useLocation } from 'react-router-dom';
import siri from './images/siri.gif'
import firebase from 'firebase/compat/app';
import 'firebase/compat/database';
import { format } from 'date-fns';

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
const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [email, setEmail] = useState('');
  const [userInput, setUserInput] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const cardRef = useRef(null);
  const { speak, speaking, cancel, voices } = useSpeechSynthesis();
  const location = useLocation();
  const userEmail = location.state ? location.state.email : '';
  const [chatId, setChatId] = useState(null);
  

  const [chatbot] = useState({
    name: 'Chatbot',
    welcomeMessage: 'Hi! How can I assist you today?',
    previousUserMessage: '',
    prvstring:'',
    previousBotMessage: '',
    getResponse: function (userMessage) {
      
      this.previousUserMessage = userMessage;
      

      let response;

      if (userMessage.toLowerCase().includes('hello') || userMessage.toLowerCase().includes('hi')) {
        response = 'Hello, I am Crystal AI! How can I help you?';
      } else if (userMessage.toLowerCase().includes('how are you')) {
        response = "I'm just a chatbot, but thanks for asking!";
      } else if (userMessage.toLowerCase().includes('thank you')) {
        response = "You're welcome!";
      }else if (userMessage.toLowerCase().includes('there is a problem in bathroom') || userMessage.toLowerCase().includes('i have a problem in bathroom')){
        response = "Is it?, Can you explain the problem";
       }
       else if (userMessage.toLowerCase().includes('water is not coming') &&  this.userResponse.toLowerCase().includes('i have a problem in bathroom')) {
        response = "maybe there is a problem in gatevalve. I'll report it to the admin and ping the status to you";
       }
       else if (userMessage.toLowerCase().includes('broken tap') &&  this.userResponse.toLowerCase().includes('i have a problem in bathroom')) {
        response = "Dont worry. I'll let the admin know and ping the status";
       }
       else if (userMessage.toLowerCase().includes('bulb is not working') &&  this.userResponse.toLowerCase().includes('i have a problem in bathroom')) {
        response = "Dont worry. I'll let the admin know and ping the status";
       }
       else if (userMessage.toLowerCase().includes('tap is broken') &&  this.userResponse.toLowerCase().includes('i have a problem in bathroom')) {
        response = "Dont worry. I'll let the admin know and ping the status";
       }
      /* else if (userMessage.toLowerCase().includes('water is not coming in tap') || userMessage.toLowerCase().includes('water is not coming')){
        response = "maybe there is a problem in gatevalve. I'll report it to the admin and ping the status to you";
       }*/
        else if (userMessage.toLowerCase().includes('water is not coming in the toilet' )&&  this.userResponse.toLowerCase().includes('i have a problem in bathroom')) {
        response = "maybe there is a problem in gatevalve. I'll report it to the admin and ping the status to you";
       } 
       else if (userMessage.toLowerCase().includes('power is not available')) {
        response = "Can you specifically describe in which area power is not available";
       }
       else if (userMessage.toLowerCase().includes('near canteen') &&  this.userResponse.toLowerCase().includes('power is not available')) {
        response = "maybe there might be some internal damage or power is not available elsewhere. I'll report it to the admin and ping the status to you";
       }
       else if (userMessage.toLowerCase().includes('near parking') &&  this.userResponse.toLowerCase().includes('power is not available')) {
        response = "maybe there might be some internal damage or power is not available elsewhere. I'll report it to the admin and ping the status to you";
       }
       else if (userMessage.toLowerCase().includes('projector is not working')) {
        response = "Can you specify the location where the projector is not working?";
       }
       else if (userMessage.toLowerCase().includes('in conference room') &&  this.userResponse.toLowerCase().includes('power is not available')) {
        response = "maybe there might be some internal damage or Cable miss allignment. I'll report it to the admin and ping the status to you";
       }
       else if (userMessage.toLowerCase().includes('in meeting room') &&  this.userResponse.toLowerCase().includes('power is not available')) {
        response = "maybe there might be some internal damage or Cable miss allignment. I'll report it to the admin and ping the status to you";
       }
       else if (userMessage.toLowerCase().includes('my system is not working') || userMessage.toLowerCase().includes('i have an issue with my system')) {
        response = "did you try restarting";
       }
       else if (userMessage.toLowerCase().includes('yes i tried restarting') &&  this.userResponse.toLowerCase().includes('my system is not working')) {
        response = "okay, can specify your location?";
       }
       else if (userMessage.toLowerCase().includes('yes i tried restarting') &&  this.userResponse.toLowerCase().includes('i have an issue with my system')) {
        response = "okay, can specify your location?";
       }
       else if (userMessage.toLowerCase().includes('in development center')  && this.userResponse.toLowerCase().includes('yes i tried restarting')) {
        response = "okay, i'll notify the admin and assign a technician to your location";
       }
       else if (userMessage.toLowerCase().includes('in testing center')  && this.userResponse.toLowerCase().includes('yes i tried restarting')) {
        response = "okay, i'll notify the admin and assign a technician to your location";
       }
       else if (userMessage.toLowerCase().includes('air conditioner is not working')) {
        response = "can you specify the location where air conditioner is not working";
       }
       else if (userMessage.toLowerCase().includes('in manager office') && this.userResponse.toLowerCase().includes('air conditioner is not working')) {
        response = "Dont worry!, i'll report this issue to the admin and rectify the issue";
       }
       else if (userMessage.toLowerCase().includes('in living area') && this.userResponse.toLowerCase().includes('air conditioner is not working')) {
        response = "Dont worry!, i'll report this issue to the admin and rectify the issue";
       }
       else if (userMessage.toLowerCase().includes('generator is not working')){
        response = "I think the fuel might be empty, i'll notify the admim about this issue.";

       }
       else if (userMessage.toLowerCase().includes('generator is not starting')){
        response = "I think the fuel might be empty, i'll notify the admim about this issue.";
        
       }
       else if (userMessage.toLowerCase().includes('i cant find my mobile') || userMessage.toLowerCase().includes('i cant find my laptop')) {
        response = "Where did you last see your device?";
       }
       else if (userMessage.toLowerCase().includes('in my working cabin') && this.userResponse.toLowerCase().includes('i cant find my mobile')) {
        response = "Dont worry!, i'll report this issue to the admin and help you find your device.";
       }
       else if (userMessage.toLowerCase().includes('in my working cabin') && this.userResponse.toLowerCase().includes('i cant find my laptop')) {
        response = "Dont worry!, i'll report this issue to the admin and help you find your device.";
       }
       else if (userMessage.toLowerCase().includes('wifi is not working') || userMessage.toLowerCase().includes('internet is not working')) {
        response = "Maybe there is a problem with the router. I'll report your problem to the admin and ping the status to you.";
       }else {
        response = "I'm sorry, I didn't understand that. Can you please rephrase?";
      }
      console.log("Previous /msg :------------------ ",this.userResponse)
      
      this.previousBotMessage = response;
      this.userResponse = userMessage;
      return response;
    },
  });
  
  const generateRandomNumber = () => {
  const randomNumber = Math.floor(1000 + Math.random() * 9000); // Generate a random number between 1000 and 9999
  return randomNumber;
  
};

const getRandomStaffMember = async (callback) => {
    const staffsRef = firebase.database().ref('staffs');
    const snapshot = await staffsRef
      .orderByChild('category')
      .equalTo("Chatbot")
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
          callback(staffEmail); // Call the callback function with the staff email
        });
      } else {
        callback(''); // Call the callback function with an empty string for email
      }
    } else {
      callback(''); // Call the callback function with an empty string for email
    }
  };

  

const handleUserInput = () => {
    const trimmedUserInput = userInput.trim();
    if (trimmedUserInput !== '') {
      const userMessage = { text: trimmedUserInput, sender: 'user', email: userEmail, category: selectedCategory };
      setMessages((prevMessages) => [...prevMessages, userMessage]);

      axios
        .post('http://localhost:8082/speak', { userMessage })
        .then((response) => {
          console.log('User message sent to the backend');
        })
        .catch((error) => {
          console.error('Error sending user message to the backend:', error);
        });

      const botResponse = { text: chatbot.getResponse(trimmedUserInput), sender: 'bot' };
      setMessages((prevMessages) => [...prevMessages, botResponse]);

      speakResponse(botResponse.text);

      setUserInput('');

      if (chatId) {
        const chatRef = firebase.database().ref(`chatbot/${chatId}`);
        chatRef.push({ email: userEmail, category: 'chatbot', user: trimmedUserInput, chatbot: botResponse.text })
          .then(() => {
            console.log('User message and chatbot response added to Firebase');
          })
          .catch((error) => {
            console.error('Error adding user message and chatbot response to Firebase:', error);
          });
      }
    }
  };

  

  const speakResponse = (message) => {
    if (speaking) {
      cancel();
    }
    speak({ text: message, voice: voices[2] });
  };

  useEffect(() => {
    if (cardRef.current) {
      cardRef.current.scrollTop = cardRef.current.scrollHeight;
    }
  }, [messages]);

  const [isChatVisible, setIsChatVisible] = useState(false);

  const toggleChatVisibility = () => {
    setIsChatVisible((prevVisible) => !prevVisible);
    const newChatId = generateRandomNumber();
    setChatId(newChatId);
  
    firebase
      .database()
      .ref(`chatbot/${newChatId}`)
      .push({ email: userEmail, category: 'chatbot' })
      .then(() => {
        console.log('Email and Category added to Firebase');
      })
      .catch((error) => {
        console.error('Error adding email to Firebase:', error);
      });
  
    const trimmedUserInput = userInput.trim();
    if (trimmedUserInput !== '') {
      const userMessage = { text: trimmedUserInput, sender: 'user', email: userEmail, category: selectedCategory };
      setMessages((prevMessages) => [...prevMessages, userMessage]);
    }
  
    const currentDate = format(new Date(), 'yyyy/MM/dd');
    const currentTime = new Date().toLocaleTimeString();
  
    getRandomStaffMember((staffEmail) => {
      setEmail(staffEmail); // Update the email state with the staff email
      console.log('assigned email', staffEmail);
  
      const issueStatusData = {
        issueID: newChatId,
        email: userEmail,
        report_mode: 'Chatbot',
        category: 'Chatbot',
        assigned_staff: staffEmail,
        date: currentDate,
        time: currentTime,
        status: 'Pending',
        staffreply:'Not Available',
      };
  
      axios
        .post('http://localhost:8082/issue_status', issueStatusData)
        .then((response) => {
          console.log('Issue status data sent to port 8082');
        })
        .catch((error) => {
          console.error('Error sending issue status data to port 8082:', error);
        });
    });
  };
  
  
  
  
  
  return (
    <div className="chat-container">
   {/* <div className="imgBox-siri">
       
        <img1 src={siri} alt="" />
      </div> */}
     
      <h5 className="chat-heading">
        You are now interacting with Crystal AI using email: {userEmail}
      </h5>
    
      
      <button className="chat-button1" onClick={toggleChatVisibility}>
        Chat
      </button>
      {isChatVisible && (
        <>
          <div className="card1">
            <div className="card-body1" ref={cardRef}>
              {messages.map((message, index) => (
                <div key={index} className={`message-bubble ${message.sender}`}>
                  {message.text}
                </div>
              ))}
            </div>
          </div>
          <div className="user-input-container">
            <input
              type="text"
              className="user-input"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleUserInput()}
              autoFocus
            />
            <button className="send-button" onClick={handleUserInput}>
              Send
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Chatbot;
