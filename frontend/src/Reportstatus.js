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

  useEffect(() => {
    fetchReportData();
  }, []);

  const fetchReportData = async () => {
    try {
      const response = await axios.post('http://localhost:8082/issue_view', {
        email: userEmail,
      });
      setReportData(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleViewClick = (report) => {
    setSelectedReport(report);
  };

  const handleClosePrompt = () => {
    setSelectedReport(null);
  };

  return (
    <div className="container-report-status">
      <h2 className="heading">Report Status</h2>
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
                  <button onClick={() => handleViewClick(report)}>View</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedReport && (
        <div className="overlay">
          <div className="prompt">
            <h2>Report Details</h2>
            <p>
              <strong>Staff:</strong> {selectedReport.assigned_staff}
            </p>
            <p>
              <strong>Reply:</strong> {selectedReport.reply}
            </p>
            <button onClick={handleClosePrompt}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ReportStatus;
