import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import './statusupdate.css';
import { format } from 'date-fns';
import firebase from 'firebase/compat/app';
import 'firebase/compat/database';

const firebaseConfig = {
  // Your Firebase configuration
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

function ReportStatus() {
  const location = useLocation();
  const userEmail = location.state ? location.state.email : '';
  const [reportData, setReportData] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);
  const [updateStatus, setUpdateStatus] = useState('');
  const [updateReply, setUpdateReply] = useState('');
  const [showUpdatePrompt, setShowUpdatePrompt] = useState(false);
  const [userCategory, setUserCategory] = useState('');

  useEffect(() => {
    fetchUserCategory();
    fetchReportData();
  }, []);

  const fetchUserCategory = () => {
    const database = firebase.database();
    const staffsRef = database.ref('staffs');

    staffsRef
      .orderByChild('staff_email')
      .equalTo(userEmail)
      .once('value')
      .then((snapshot) => {
        const staffsData = snapshot.val();
        if (staffsData) {
          const staff = Object.values(staffsData)[0];
          setUserCategory(staff.staff_category);
        } else {
          setUserCategory('');
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const fetchReportData = async () => {
    try {
      const response = await axios.post('http://localhost:8082/issue_view1', {
        email: userEmail,
        category: userCategory,
      });

      setReportData(response.data);
    } catch (error) {
      console.error(error);
    }
  };
  
  const handleViewClick = (report) => {
    setSelectedReport(report);
    setShowUpdatePrompt(true);
  };

  const handleUpdateStatus = async () => {
    if (!updateStatus) {
      console.log('Please select an update status.');
      return;
    }

    try {
      console.log(updateReply)
      const response = await axios.post('http://localhost:8082/statusupdate', {
        issue_ID: selectedReport.issue_ID,
        status: updateStatus,
        email: userEmail,
        staffreply: updateReply,
      });

      console.log(response.data);
      // Handle success case

      setSelectedReport(null);
      setShowUpdatePrompt(false);
      setUpdateStatus('');
      setUpdateReply('');
      fetchReportData(); // Fetch updated report data
    } catch (error) {
      console.error(error);
      // Handle error case
    }
  };

  const handleClosePrompt = () => {
    setSelectedReport(null);
    setShowUpdatePrompt(false);
    setUpdateStatus('');
    setUpdateReply('');
  };

  return (
    <div className="container-update">
      <h2 className="heading-satus">Status Update</h2>
      <div className="card5">
        <p className="datain">Show the status of the report of email: {userEmail}</p>
        <table className="report-table">
          <thead>
            <tr>
              <th>Issue ID</th>
              <th>Report Mode</th>
              <th>Category</th>
              <th>Date</th>
              <th>Time</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody className="report-data">
            {reportData.map((report) => (
              <tr key={report.issue_ID}>
                <td>{report.issue_ID}</td>
                <td>{report.report_mode}</td>
                <td>{report.category}</td>
                <td>{format(new Date(report.date), 'yyyy/MM/dd')}</td>
                <td>{report.time}</td>
                <td>{report.status}</td>
                <td>
                  <button onClick={() => handleViewClick(report)}>Update</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedReport && showUpdatePrompt && (
        <div className="update-prompt">
          <div className="update-card">
            <h2 className="update-heading">Update Issue Status</h2>
            <label htmlFor="status">Update Issue status:</label>
            <select
              id="status"
              value={updateStatus}
              onChange={(e) => setUpdateStatus(e.target.value)}
            >
              <option value="">Select</option>
              <option value="Solved">Solved</option>
              <option value="Not solved">Not Solved</option>
            </select>
            <label htmlFor="reply">Reply:</label>
            <textarea
              id="reply"
              rows="4"
              value={updateReply}
              onChange={(e) => setUpdateReply(e.target.value)}
            ></textarea>
            <div className="button-group">
              <button className="send-button" onClick={handleUpdateStatus}>
                Send
              </button>
              <button className="cancel-button" onClick={handleClosePrompt}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ReportStatus;
