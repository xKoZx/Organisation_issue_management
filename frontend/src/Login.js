import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link, useNavigate } from 'react-router-dom';
import Validation from './LoginValidation';
import './Login.css';
import axios from 'axios';
import Video from '../src/images/logon.mp4';

function Login() {
  const [values, setValues] = useState({
    email: '',
    password: '',
  });
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});

  const handleInput = (event) => {
    setValues((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setErrors(Validation(values));
  
    if (Object.keys(errors).length === 0) {
      axios
        .post('http://localhost:8082/login', values)
        .then((res) => {
          if (res.data.status === 'Success') {
            // check role and navigate accordingly
            if (res.data.role === 'admin') {
              navigate('/admin', { state: { email: values.email } });
            } else if (res.data.role === 'staff') {
              navigate('/stpage', { state: { email: values.email } });
            } else {
              navigate('/home', { state: { email: values.email } });
            }
          } else {
            setErrors((prevErrors) => ({
              ...prevErrors,
              loginError: 'Account not found'
            }));
          }
        })
        .catch((err) => {
          if (err.response && err.response.status === 404) {
            setErrors((prevErrors) => ({
              ...prevErrors,
              loginError: 'Account not found',
            }));
          } else {
            console.log(err);
          }
        });
    }
  };
  

  return (
    <div>
      <div className='heading'>
        <div className='d-flex vh-100 justify-content-center align-items-center '>
          <div className='p-3 bg-white rounded'>
            <form action='' onSubmit={handleSubmit}>
              <div className='mb-3'>
                <h2>
                  <center>
                    <strong>Log In</strong>
                  </center>
                </h2>
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
              {errors.loginError && (
                <div className='text-danger-error'>{errors.loginError}</div>
              )}
              <button type='submit' className='btn1 btn-success w-100'>
                <strong>Log in</strong>
              </button>
             
              <p></p>
              <p>
                <center>New User?</center>
              </p>
              <Link
                to='/signup'
                className='btn btn-default border w-100 text-decoration-none'
              >
                <strong>Create Account</strong>
              </Link>
            </form>
            <video autoPlay loop muted id='video'>
              <source src={Video} type='video/mp4' />
            </video>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
