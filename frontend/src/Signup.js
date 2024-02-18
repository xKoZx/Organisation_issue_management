import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom';
import Validation from './SignupValidation';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import firebase from 'firebase/compat/app';
import 'firebase/compat/database';

// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyArXomLx71vZgCvHSaIorWlPcOoiDvdUK0",
  authDomain: "live-chat-8d8b6.firebaseapp.com",
  projectId: "live-chat-8d8b6",
  storageBucket: "live-chat-8d8b6.appspot.com",
  messagingSenderId: "569985273547",
  appId: "1:569985273547:web:94592c1f97dca3c286554e",
  measurementId: "G-0ZB610P3QX"
};
firebase.initializeApp(firebaseConfig);
const database = firebase.database();

function Signup() {
  const [values, setValues] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');

  const handleInput = (event) => {
    setValues((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setErrors(Validation(values));

    if (
      errors.name === '' &&
      errors.email === '' &&
      errors.password === '' &&
      errors.confirmPassword === ''
    ) {
      if (values.password.length < 8) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          password: 'Minimum 8 characters required',
        }));
        return;
      }

      axios
        .post('http://localhost:8082/signup', values)
        .then(() => {
          database.ref('users').push({
            name: values.name,
            email: values.email,
            password: values.password,
          })
            .then(() => {
              setSuccessMessage('Success! Proceed to login.');
            })
            .catch((error) => {
              console.log(error);
            });
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  return (
    <div>
      <div className='heading'></div>
      <div className='d-flex vh-100 justify-content-center align-items-center '>
        <div className='p-3 bg-white rounded-3 '>
          {successMessage && (
            <div className='text-success'>{successMessage}</div>
          )}
          <form action='' onSubmit={handleSubmit}>
            <div className='mb-3'>
              <h2>
                <center>
                  <strong>Sign Up</strong>
                </center>
              </h2>
              <label htmlFor='name'>Name</label>
              <input
                type='text'
                placeholder='Enter Name'
                name='name'
                onChange={handleInput}
                className='form-control'
              />
              {errors.name && (
                <span className='text-danger'>{errors.name}</span>
              )}
            </div>
            <div className='mb-3'>
              <label htmlFor='email'>Email</label>
              <input
                type='email'
                placeholder='Enter Email'
                name='email'
                onChange={handleInput}
                className='form-control'
              />
              {errors.email && (
                <span className='text-danger'>{errors.email}</span>
              )}
            </div>
            <div className='mb-3'>
              <label htmlFor='password'>Password</label>
              <input
                type='password'
                placeholder='Enter Password'
                name='password'
                onChange={handleInput}
                className='form-control'
              />
              {errors.password && (
                <span className='text-danger'>{errors.password}</span>
              )}
            </div>
            <div className='mb-3'>
              <label htmlFor='confirmPassword'>Confirm Password</label>
              <input
                type='password'
                placeholder='Confirm Password'
                name='confirmPassword'
                onChange={handleInput}
                className='form-control'
              />
              {errors.confirmPassword && (
                <span className='text-danger'>{errors.confirmPassword}</span>
              )}
            </div>
            <button type='submit' className='btn1 btn-success w-100'>
              <strong>Sign up</strong>
            </button>
            <p></p>
            <p>Already have an account?</p>
            <Link
              to='/'
              className='btn btn-default border w-100 text-decoration-none'
            >
              <strong>Log In</strong>
            </Link>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Signup;
