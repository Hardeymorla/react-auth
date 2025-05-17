import React from 'react';
import { useState, useEffect, useRef } from 'react'
import { faCheck, faTimes, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link, useNavigate } from 'react-router-dom';
import api from './api/axios';
import { v4 as uuidv4 } from 'uuid';


const USER_REGEX = /^[A-z][A-z0-9-_]{3,23}$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;


const Register = () => {
    const userRef = useRef();
    const errRef = useRef();
    const navigate = useNavigate();
    const accessToken = uuidv4();

    const [user, setUser] = useState('');
    const [validName, setValidName] = useState(false);
    const [userFocus, setUserFocus] = useState(false);

    const [pwd, setPwd] = useState('');
    const [validPwd, setValidPwd] = useState(false);
    const [pwdFocus, setPwdFocus] = useState(false);

    const [matchPwd, setMatchPwd] = useState('');
    const [validMatch, setValidMatch] = useState(false);
    const [matchFocus, setMatchFocus] = useState(false);

    const [errMsg, setErrMsg] = useState('');
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        userRef.current.focus();
    }, [])

    useEffect(() => {
        setValidName(USER_REGEX.test(user));
        console.log("User", validName);
    }, [user])
    
    useEffect(() => {
        setValidPwd(PWD_REGEX.test(pwd));
        console.log("Password", validPwd)
        console.log("password", pwd);
        console.log("valid", PWD_REGEX.test(pwd));

        setValidMatch(pwd === matchPwd);
        console.log("Confirm Password", validMatch)
    }, [pwd, matchPwd])

    useEffect(() => {
        setErrMsg('');
    }, [user, pwd, matchPwd])

    const handleSubmit = (async (e) => {
        e.preventDefault();
        const v1 = USER_REGEX.test(user);
        const v2 = PWD_REGEX.test(pwd);
        if (!v1 || !v2) {
            setErrMsg("Invalid Entry")
            return
        }
        // const accessToken = Math.random().toString(36).substring(2);

        try {
            const existingUser = await api.get('/users', { params: { user } });
            if (existingUser.data.length > 0) {
                setErrMsg('Username Taken');
                console.log(`${user}: already existed`);
                return;
            }

            const response = await api.post('/users', { user, pwd, accessToken });
            console.log(response.data);
            setSuccess(true);
        } catch (err) {
            if (!err?.response) {
                setErrMsg('No Server Response')
            }
            else if (err.response?.status === 409) {
                setErrMsg('Username Taken')
            }
            else {
                setErrMsg('Registration Failed')
            }
        }
        
    })

  return (
    <>
        {
            success ? (
                <section>
                      <h1> Success!</h1>
                      <p><Link to="/login">Sign In</Link></p>
                </section >
            ) : (
                <section>
                <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"}
                    area-live="assertive" >{errMsg}</p>
                <h1>Register</h1>
    
                <form onSubmit={handleSubmit}>
                <label htmlFor='username'>Username:
                    <span className={validName ? "valid" : "hide"} >
                        <FontAwesomeIcon icon={faCheck} />
                    </span>
                    <span className={validName || !user ? "hide" : "invalid"} >
                        <FontAwesomeIcon icon={faTimes} />
                    </span>
                </label>
                <input
                    type='text'
                    id='username'
                    ref={userRef}
                    autoComplete='off'
                    onChange={(e) => setUser(e.target.value)}
                    value={user}
                    required
                    aria-invalid={validName ? "false" : "true"}
                    aria-describedby="uidnote"
                    onFocus={() => setUserFocus(true)}
                    onBlur={() => setUserFocus(false)}
                />
                <p id='uidnote' className={userFocus && user && !validName ?
                        "instructions" : "offscreen"}>
                        <FontAwesomeIcon icon={faInfoCircle} />
                        4 to 24 characters. <br />
                        Must begin with a letter. <br />
                        Letters, numbers, underscores, hyphens are allowed.
                </p>
                <label htmlFor='password'>Password:
                    <FontAwesomeIcon icon={faCheck} 
                        className={validPwd ? "valid" : "hide"}
                    />
                    <FontAwesomeIcon icon={faTimes} 
                        className={validPwd || !pwd ? "hide" : "invalid"}
                    />
                </label>
                <input 
                    type='password'
                    id='password'
                    onChange={(e) => setPwd(e.target.value)}
                    value={pwd}
                    required
                    aria-invalid={validPwd ? "false" : "true"}
                    aria-describedby="pewdnote"
                    onFocus={() => setPwdFocus(true)}
                    onBlur={() => setPwdFocus(false)}
                />
                <p id='pewdnote' className={pwdFocus && !validPwd ? 
                    "instructions" : "offscreen"} >
                    <FontAwesomeIcon icon={faInfoCircle} />
                    8 to 24 characters. <br />
                    Must include uppercase and lowercase Letters,
                    a number and a special character. <br />
                    Allowed special characters: 
                    <span aria-label="exclamation mark">!</span>
                    <span aria-label="at symbol">@</span>
                    <span aria-label="hashtag">#</span>
                    <span aria-label="dollar sign">$</span>
                    <span aria-label="percent">%</span>
                </p>
                <label htmlFor='confirm-pwd'>Confirm Password:
                    <FontAwesomeIcon icon={faCheck} 
                        className={validMatch && matchPwd ? "valid" : "hide"}
                    />
                    <FontAwesomeIcon icon={faTimes} 
                        className={validMatch || !matchPwd ? "hide" : "invalid"}
                    />
                </label>
                <input 
                    type='password'
                    id='confirm-pwd'
                    onChange={(e) => setMatchPwd(e.target.value)}
                    value={matchPwd}
                    required
                    aria-invalid={validMatch ? "false" : "true"}
                    aria-describedby="confirmnote"
                    onFocus={() => setMatchFocus(true)}
                    onBlur={() => setMatchFocus(false)}
                />
                <p id='confirmnote' className={matchFocus && !validMatch ? 
                    "instructions" : "offscreen"}>
                    <FontAwesomeIcon icon={faInfoCircle} />
                    Must match the first password input field.
                </p>
                <button disabled={!validName || !validPwd || !validMatch ?
                    true : false
                }>
                    Sign up
                </button>
            </form>
            <p>
                Already Registered? <br />
                <span className='line'> </span>
                <Link to="login" >Sign in</Link>
            </p>
        </section>
            )}
    </>
  )
}

export default Register
