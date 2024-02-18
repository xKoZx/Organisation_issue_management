import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { format } from 'date-fns';
import firebase from 'firebase/compat/app';
import 'firebase/compat/database';

const LiveView = () => {
  const [issueData, setIssueData] = useState([]);
  const [inspectData, setInspectData] = useState(null);

  useEffect(() => {
    const category = 'Live_Chat';
    axios
      .get(`http://localhost:8082/issue_inspect1?category=${category}`)
      .then((response) => {
        setIssueData(response.data);
      })
      .catch((error) => {
        console.error('Error retrieving issue data:', error);
      });
  }, []);

  const handleInspect = (issueID) => {
    const firebaseConfig = {
      // Add your Firebase configuration here
    };

    if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
    }

    const database = firebase.database();
    const issueRef = database.ref(`${issueID}`);

    issueRef.once('value', (snapshot) => {
      const data = snapshot.val();
      setInspectData(data);
    });
  };

  const handleClose = () => {
    setInspectData(null);
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
                <button onClick={() => handleInspect(issue.issue_ID)}>
                  Inspect
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {inspectData && (
        <div className="overlay-newcard">
          <div className="card-inspect-overlay">
            <h2>Inspect Issue: {inspectData.issue_ID}</h2>
            {Object.values(inspectData).map((value, index) => (
              <div key={index}>
                {Object.entries(value).map(([subKey, subValue]) => (
                  subKey !== 'messageName' && (
                    <div key={subKey}>
                      <p>{subKey}: {subValue}</p>
                    </div>
                  )
                ))}
              </div>
            ))}
            <button onClick={handleClose}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LiveView;
