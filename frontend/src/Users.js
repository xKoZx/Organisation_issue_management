import React, { useState } from 'react';
import axios from 'axios';
import './Users.css';

const Users = () => {
  const [users, setUsers] = useState([]);

  const fetchUsers = () => {
    axios
      .get('http://localhost:8082/users')
      .then((response) => {
        setUsers(response.data);
      })
      .catch((error) => {
        console.error('Error fetching users:', error);
      });
  };

  return (
    <div className="container-user">
      <div className="card">
        <h1 className="heading">Users</h1>
        <div className="card-content">
          <div className="scrollable-container">
            {users.map((user) => (
              <div className="user-row" key={user.id}>
                <div className="user-column">
                  <p className="user-info">ID: {user.id}</p>
                </div>
                <div className="user-column">
                  <p className="user-info">Name: {user.name}</p>
                </div>
                <div className="user-column">
                  <p className="user-info">Email: {user.email}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <button className="fetch-button" onClick={fetchUsers}>
        View
      </button>
    </div>
  );
};

export default Users;
