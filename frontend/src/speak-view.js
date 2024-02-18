import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './speak-view.css';
import { format } from 'date-fns';
import firebase from 'firebase/compat/app';
import 'firebase/compat/database';

const firebaseConfig = {
  // Add your Firebase config here
};

// Initialize Firebase
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const database = firebase.database();

const PromptInspect = ({ issueID, onClose }) => {
  const [issueData, setIssueData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const snapshot = await database.ref(`chatbot/${issueID}`).once('value');
        const data = snapshot.val() || {};
        setIssueData(data);
      } catch (error) {
        console.error('Error retrieving data:', error);
      }
    };

    fetchData();
  }, [issueID]);

  return (
    <div className="new-prompt-inspect">
      <h3>Issue ID: {issueID}</h3>
      {issueData && (
        <div>
          {Object.entries(issueData).map(([field, value]) => (
            <div key={field} className="data-container">
              {Object.entries(value).map(([subField, subValue]) => (
                <div key={subField} className="data-field">
                  <span className="field-label">{subField}:</span> {subValue}
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
      <button onClick={onClose}>Close</button>
    </div>
  );
};

const SpeakView = () => {
  const [issueData, setIssueData] = useState([]);
  const [selectedIssueID, setSelectedIssueID] = useState(null);

  useEffect(() => {
    axios
      .get('http://localhost:8082/issue_inspect?category=chatbot')
      .then((response) => {
        setIssueData(response.data);
      })
      .catch((error) => {
        console.error('Error retrieving issue data:', error);
      });
  }, []);

  const openPromptInspect = (issueID) => {
    setSelectedIssueID(issueID);
  };

  const closePromptInspect = () => {
    setSelectedIssueID(null);
  };

  return (
    <div className="card-inspect">
      <h2>Chatbot Issue Status</h2>
      <table>
        <thead>
          <tr>
            <th>Issue ID</th>
            <th>Email</th>
            <th>Report Mode</th>
            <th>Category</th>
            <th>Assigned Staff</th>
            <th>Date</th>
            <th>Time</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {issueData.map((issue) => (
            <tr key={issue.issue_ID}>
              <td>{issue.issue_ID}</td>
              <td>{issue.email}</td>
              <td>{issue.report_mode}</td>
              <td>{issue.category}</td>
              <td>{issue.assigned_staff}</td>
              <td>{format(new Date(issue.date), 'MM/dd/yyyy')}</td>
              <td>{issue.time}</td>
              <td>{issue.status}</td>
              <td>
                <button onClick={() => openPromptInspect(issue.issue_ID)}>
                  Inspect
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {selectedIssueID && (
        <PromptInspect
          issueID={selectedIssueID}
          onClose={closePromptInspect}
        />
      )}
    </div>
  );
};

export default SpeakView;
