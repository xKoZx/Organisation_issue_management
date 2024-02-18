import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import './ReportStatus.css';
import { format } from 'date-fns';

function ReportStatus() {
  const location = useLocation();
  const userEmail = location.state ? location.state.email : '';
  const [reportData, setReportData] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    fetchReportData();
  }, []);

  const fetchReportData = async () => {
    try {
      const response = await axios.post('http://localhost:8082/issue_view_admin', {
        email: userEmail,
      });
      console.log(response.data);
      setReportData(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleViewClick = async (report) => {
    try {
      if (report.report_mode === 'Issue Window') { // Check if the report mode is 'Issue Window'
        const response = await axios.post('http://localhost:8082/viewdetails', {
          issue_ID: report.issue_ID,
          mode: report.report_mode,
        });

        setSelectedReport(response.data);
        console.log(selectedReport.category);
      } else {
        setErrorMessage('Cannot view chats of ChatBot and Live-Chat. Only admin can view them.');
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleClosePrompt = () => {
    setSelectedReport(null);
  };

  const handleOkButtonClick = () => {
    setErrorMessage('');
  };
  return (
    <div className="container">
      <h2 className="heading">Report Status</h2>
      <div className="card5">
        
        <table className="report-table">
          <thead>
            <tr>
              <th>Issue ID</th>
              <th>Report Mode</th>
              <th>Email</th>
              <th>Category</th>
              <th>Assigned Staff</th>
              <th>Date</th>
              <th>Time</th>
              <th>Status</th>
              
            </tr>
          </thead>
          <tbody className="report-data">
            {reportData.map((report) => (
              <tr key={report.issue_ID}>
                <td>{report.issue_ID}</td>
                <td>{report.email}</td>
                <td>{report.report_mode}</td>
                <td>{report.category}</td>
                <td>{report.assigned_staff}</td>
                <td>{format(new Date(report.date), 'yyyy/MM/dd')}</td>
                <td>{report.time}</td>
                <td>{report.status}</td>
                
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedReport && (
        <div className="add-staff-overlay">
          <div className="add-staff-card">
            <h2 className="add-staff-heading">View Report Details</h2>
            <label>Category:</label>
            <p>{selectedReport.category}</p>
            <label>Message:</label>
            <p>{selectedReport.message}</p>
            <button className="cancel-button" onClick={handleClosePrompt}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {errorMessage && (
        <div className="error-card">
          <p className="error-message">{errorMessage}</p>
          <button className="ok-button" onClick={handleOkButtonClick}>
            OK
          </button>
        </div>
      )}
    </div>
  );
}

export default ReportStatus;
