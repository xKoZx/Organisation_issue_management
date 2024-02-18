import React, { useState, useEffect } from 'react';
import axios from 'axios';
import firebase from 'firebase/compat/app';
import 'firebase/compat/database';
import './Staffs.css';

// Firebase configuration
const firebaseConfig = {
  // Your Firebase configuration here
};

// Initialize Firebase
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const Staffs = () => {
  const [staffs, setStaffs] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [newStaff, setNewStaff] = useState({
    staff_id: '',
    staffName: '',
    email: '',
    category: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showDeleteForm, setShowDeleteForm] = useState(false);
  const [deleteStaffInfo, setDeleteStaffInfo] = useState({
    email: '',
    password: '',
  });

  useEffect(() => {
    fetchStaffs();
  }, []);

  const fetchStaffs = () => {
    axios
      .get('http://localhost:8082/staffs')
      .then((response) => {
        setStaffs(response.data);
      })
      .catch((error) => {
        console.error('Error fetching staffs:', error);
      });
  };

  const addStaff = () => {
    if (newStaff.category === '') {
      setErrorMessage('Please select a category');
      return;
    }

    // Check if any field is empty
    const fields = ['staffName', 'staff_id', 'email', 'password'];
    const isEmptyField = fields.some((field) => !newStaff[field]);

    if (isEmptyField) {
      setErrorMessage('Please fill in all fields');
      return;
    }

    // Check password length
    if (newStaff.password.length < 8) {
      setErrorMessage('Password should be at least 8 characters');
      return;
    }

    // Check existing email
    const existingStaff = staffs.find((staff) => staff.email === newStaff.email);
    if (existingStaff) {
      setErrorMessage('Email already exists');
      return;
    }

    const generatedStaffId = generateStaffId();
    const staffData = { ...newStaff, staff_id: generatedStaffId };

    axios
      .post('http://localhost:8082/staffs', staffData)
      .then((response) => {
        fetchStaffs();
        setShowForm(false);
        setNewStaff({
          staff_id: '',
          staffName: '',
          email: '',
          category: '',
          password: '',
        });
      })
      .catch((error) => {
        console.error('Error adding staff:', error);
      });

    firebase
      .database()
      .ref('staffs')
      .push(staffData)
      .then(() => {
        fetchStaffs();
        setShowForm(false);
        setNewStaff({
          staff_id: '',
          staffName: '',
          email: '',
          category: '',
          password: '',
        });
      })
      .catch((error) => {
        console.error('Error adding staff:', error);
      });
  };

  const generateStaffId = () => {
    const randomId = Math.floor(100 + Math.random() * 900);
    const generatedStaffId = randomId.toString();
    setNewStaff((prevStaff) => ({ ...prevStaff, staff_id: generatedStaffId }));
    return generatedStaffId;
  };

  const generateEmail = () => {
    const staffName = newStaff.staffName.trim().toLowerCase();
    const email = `resolve.team.${staffName}@gmail.com`;
    setNewStaff((prevStaff) => ({ ...prevStaff, email }));
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const deleteStaff = () => {
    axios
      .post('http://localhost:8082/deletestaff', deleteStaffInfo)
      .then((response) => {
        console.log(response.data.message); // Staff deleted
        setDeleteStaffInfo({ email: '', password: '' });
        setShowDeleteForm(false);
        fetchStaffs();
      })
      .catch((error) => {
        if (error.response && error.response.data && error.response.data.error) {
          console.error('Error deleting staff:', error.response.data.error); // Account not found
        } else {
          console.error('Error deleting staff:', error);
        }
      });

    firebase
      .database()
      .ref('staffs')
      .orderByChild('email')
      .equalTo(deleteStaffInfo.email)
      .once('value', (snapshot) => {
        snapshot.forEach((childSnapshot) => {
          childSnapshot.ref.remove();
        });
      })
      .then(() => {
        fetchStaffs();
        setShowDeleteForm(false);
        setDeleteStaffInfo({ email: '', password: '' });
      })
      .catch((error) => {
        console.error('Error deleting staff from Firebase:', error);
      });
  };

  return (
    <div className="container-staffs">
      <div className="card-staff">
        <h1 className="heading-staffs">Staffs</h1>
        {staffs.map((staff) => (
          <div className="staff-row" key={staff.staff_id}>
            <div className="staff-column">
              <p className="staff-info">ID: {staff.staff_id}</p>
            </div>
            <div className="staff-column">
              <p className="staff-info">Name: {staff.staff_name}</p>
            </div>
            <div className="staff-column">
              <p className="staff-info">Email: {staff.staff_email}</p>
            </div>
            <div className="staff-column">
              <p className="staff-info">Category: {staff.staff_category}</p>
            </div>
          </div>
        ))}
        <div className="add-staff-overlay" style={{ display: showForm ? 'flex' : 'none' }}>
          <div className="add-staff-card1">
            <h2 className="add-staff-heading">Add Staff</h2>
            {errorMessage && <p className="error-message">{errorMessage}</p>}
            <label>
              Name:
              <input
                type="text"
                value={newStaff.staffName}
                onChange={(e) => setNewStaff({ ...newStaff, staffName: e.target.value })}
              />
            </label>
            <label>
              Staff ID:
              <input
                type="text"
                value={newStaff.staff_id}
                onChange={(e) => setNewStaff({ ...newStaff, staff_id: e.target.value })}
              />
              <button className="generate-button" onClick={generateStaffId}>
                Generate ID
              </button>
            </label>
            <label>
              Email:
              <input
                type="text"
                value={newStaff.email}
                onChange={(e) => setNewStaff({ ...newStaff, email: e.target.value })}
              />
            </label>
            <button className="generate-button" onClick={generateEmail}>
              Generate Email
            </button>
            <label>
              Category:
              <select
                value={newStaff.category}
                onChange={(e) => setNewStaff({ ...newStaff, category: e.target.value })}
              >
                <option>---Select From Below List---</option>
                <option value="Software">Software</option>
                <option value="Hardware">Hardware</option>
                <option value="Electricity">Electricity</option>
                <option value="Plumbing">Plumbing</option>
                <option value="Other">Other</option>
                <option value="Chatbot">Chatbot</option>
                <option value="Civil">Civil</option>
              </select>
            </label>
            <label>
              Password:
              <div className="password-field">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={newStaff.password}
                  onChange={(e) => setNewStaff({ ...newStaff, password: e.target.value })}
                />
                <button
                  className={`password-toggle ${showPassword ? 'visible' : ''}`}
                  onClick={togglePasswordVisibility}
                >
                  View
                  <i className="fas fa-eye"></i>
                </button>
              </div>
            </label>
            <div className="add-staff-buttons">
              <button className="add-staff-button" onClick={addStaff}>
                Add
              </button>
              <button className="cancel-button" onClick={() => setShowForm(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>

        <div className="delete-staff-overlay" style={{ display: showDeleteForm ? 'flex' : 'none' }}>
          <div className="delete-staff-card">
            <h2 className="delete-staff-heading">Delete Staff</h2>
            <label>
              Email:
              <input
                type="text"
                value={deleteStaffInfo.email}
                onChange={(e) => setDeleteStaffInfo({ ...deleteStaffInfo, email: e.target.value })}
              />
            </label>
            <label>
              Password:
              <input
                type="password"
                value={deleteStaffInfo.password}
                onChange={(e) => setDeleteStaffInfo({ ...deleteStaffInfo, password: e.target.value })}
              />
            </label>
            <div className="delete-staff-buttons">
              <button className="delete-staff-button" onClick={deleteStaff}>
                Delete
              </button>
              <button className="cancel-button" onClick={() => setShowDeleteForm(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
      <button className="fetch-button1" onClick={fetchStaffs}>
        View
      </button>
      <button className="fetch-button2" onClick={() => setShowForm(true)}>
        Add Staff
      </button>
      <button className="fetch-button2" onClick={() => setShowDeleteForm(true)}>
        Delete Staff
      </button>
    </div>
  );
};

export default Staffs;