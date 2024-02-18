import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation} from 'react-router-dom';
import { format } from 'date-fns';
import { getStorage, ref, getDownloadURL } from 'firebase/storage';

const WindowView = () => {
  const [issueData, setIssueData] = useState([]);
  const [inspectData, setInspectData] = useState(null);
  const location = useLocation();
  const userEmail = location.state ? location.state.email : '';
  const storage = getStorage();
  const [imageURL, setImageURL] = useState(null);

  useEffect(() => {
    axios
      .post('http://localhost:8082/retrivewindowdata', {
        userEmail: userEmail,
      })
      .then((response) => {
        setIssueData(response.data);
      })
      .catch((error) => {
        console.error('Error retrieving issue data:', error);
      });
  }, [userEmail]);

  const handleInspect = async (issueID) => {
    try {
      const response = await axios.post('http://localhost:8082/retrivewindow', {
        issueID: issueID,
      });
      const imageName = response.data.imagename;
      const imageRef = ref(storage, imageName);
      const imageURL = await getDownloadURL(imageRef);
      setImageURL(imageURL);
      setInspectData(response.data);
    } catch (error) {
      console.error('Error retrieving window issue data:', error);
    }
  };

  const handleClose = () => {
    setInspectData(null);
    setImageURL(null);
  };

  return (
    <div className="card-inspect">
      <h2>Window Issue Status</h2>
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
      <p>Message: {inspectData.message}</p>
      {imageURL && (
        <div className="image-preview">
        
          <img src={imageURL} alt="Issue" />
        </div>
      )}
      <button onClick={handleClose}>Close</button>
    </div>
  </div>
)}
    </div>
  );
};

export default WindowView;
