import React from 'react';
import { useRef, useState, useEffect } from 'react';
import useAuth from './hooks/UseAuth';
import { Link } from 'react-router-dom';
import api from './api/axios';


const Login = () => {
  const userRef = useRef();
  const errRef = useRef();
  const { setAuth } = useAuth();

  const [user, setUser] = useState('');
  const [pwd, setPwd] = useState('');
  const [errMsg, setErrMsg] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    userRef.current.focus();
  }, []);

  useEffect(() => {
    setErrMsg('')
  }, [user, pwd]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try { 
      const response = await api.get('/users', { params: { user, pwd } });
      if (response.data.length > 0) {
        const loggedInUser = response.data[0];
        const { accessToken } = loggedInUser;
        setAuth({ user, pwd, accessToken });
        setUser('');
        setPwd('');
        setSuccess(true);
      } else {
        setErrMsg('Invalid username or password');
      }
    } catch (err){
      setErrMsg('Login Failed');
      errRef.current.focus();
    }
  }

  return (
    <>
      {
        success ? (
          <section>
            <h1> Login Successful!</h1>
            {/* <p><Link to="/login">Sign In</Link></p> */}
          </section >
        ) : (
          <section>
            <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"}
              area-live="assertive" >{errMsg}</p>
            <h1>Sign In</h1>
            <form onSubmit={handleSubmit}>
              <label htmlFor='username'>Username:</label>
              <input
                type='text'
                id='username'
                ref={userRef}
                autoComplete='off'
                onChange={(e) => setUser(e.target.value)}
                value={user}
                required
              />
              <label htmlFor='password'>Password</label>
              <input
                type='password'
                id='password'
                onChange={(e) => setPwd(e.target.value)}
                value={pwd}
                required
              />
              <button>Sign In</button>
            </form>
            <p>Need an account? <br />
              <span className='line'>
                <Link to="/">Sign up</Link>
              </span>
            </p>
          </section> )
      }
    </>
    
  )
}

export default Login
