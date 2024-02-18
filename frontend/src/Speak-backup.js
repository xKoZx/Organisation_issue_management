import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './Speak.css';
import { useSpeechSynthesis } from 'react-speech-kit';
import { useLocation } from 'react-router-dom';
import siri from './images/siri.gif'


const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState('');
  const cardRef = useRef(null);
  const { speak, speaking, cancel, voices } = useSpeechSynthesis();
  const location = useLocation();
  const userEmail = location.state ? location.state.email : '';

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

  const handleUserInput = () => {
    const trimmedUserInput = userInput.trim();
    if (trimmedUserInput !== '') {
      const userMessage = { text: trimmedUserInput, sender: 'user', email: userEmail };
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

  return (
    
    <div className="chat-container">
    <div class="imgBox">
      <img
        src={siri}
        alt="" 
      />
    </div>
  <h5 className="chat-heading">You Are now Interacting with Crystal AI using email: {userEmail}</h5>
  <label htmlFor="issueCategory">Issue Category:</label>
      <select
        id="issueCategory"
        className="issue-category"
        value={userInput}
        onChange={(e) => setUserInput(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handleUserInput()}
        autoFocus
      >
        <option value="">Select an issue category</option>
        <option value="Hardware">Hardware</option>
        <option value="Software">Software</option>
        <option value="Plumbing">Plumbing</option>
        <option value="Electricity">Electricity</option>
        <option value="Work Station">Work Station</option>
      </select>
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
</div>
);
};

export default Chatbot;
