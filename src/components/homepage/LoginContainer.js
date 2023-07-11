import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { AUTH_ACTIONS } from '../../redux-store/slices/auth-slice';
import { CITIZEN_ACTIONS } from '../../redux-store/slices/citizen-slice';

const ONLY_NUMBER_VALIDATOR = new RegExp('^[0-9]+$');
const PASSWORD_VALIDATOR = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,12}$/;

function LoginContainer({ API }) {

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [aadharNumber, setAadharNumber] = useState("");
    const [aadharNumberVal, setAadharNumberVal] = useState("");

    const [password, setPassword] = useState(null);
    const [passwordVal, setPasswordVal] = useState(null);

    const [loginActionVal, setLoginActionVal] = useState(null);

    const [validMsg, setValidMsg] = useState("");
    const [invalidMsg, setInvalidMsg] = useState("");

    // Validating aadhar number
    useEffect(() => {
        if (!ONLY_NUMBER_VALIDATOR.test(aadharNumber) || aadharNumber.trim().length !== 12) {
            setAadharNumberVal(false)
        } else {
            setAadharNumberVal(true)
        }
    }, [aadharNumber]);
    // Validating password
    useEffect(() => {
        if (!PASSWORD_VALIDATOR.test(password)) {
            setPasswordVal(false)
        } else {
            setPasswordVal(true)
        }
    }, [password]);
    // changing the content
    useEffect(() => {
        if (loginActionVal) {
            document.getElementById("homepage-login-container").style.display = "none";
            document.getElementById("homepage-login-container2").style.display = "flex";
            setTimeout(() => {
                navigate('/dashboard');
            }, 3000);
        }
    }, [loginActionVal, navigate]);

    const login_citizen = () => {
        axios.post(`${API}/citizen/login`, { aadharNumber, password })
            .then(result => {
                const DATA = result.data;
                if (DATA.err) {
                    setLoginActionVal(false);
                    setInvalidMsg(DATA.msg);
                } else {
                    const citizen = {
                        aadharNumber: DATA.data.aadharNumber,
                        appliedFor: DATA.data.appliedFor,
                        drafts: DATA.data.drafts,
                        _id: DATA.data._id
                    }
                    dispatch(AUTH_ACTIONS.setToken({ token: DATA.data.token }));
                    dispatch(CITIZEN_ACTIONS.setCitizen({ citizen }))
                    setLoginActionVal(true);
                    setValidMsg(DATA.msg);
                }
            })
    }

    return (
        <>
            <div id='homepage-login-container' className='homepage-login-container'>
                <h4>LOGIN</h4>
                <input type="text" onChange={e => setAadharNumber(e.target.value)} placeholder='Aadhar number'></input>
                {aadharNumberVal === false ? <span>Please enter a valid aadhar number</span> : null}
                <input type='password' onChange={e => setPassword(e.target.value)} placeholder='Password'></input>
                {passwordVal === false ? <span>Please enter a valid pattern</span> : null}
                {aadharNumberVal && passwordVal && <button onClick={login_citizen}>Login</button>}
                {loginActionVal ? <span>{validMsg}</span> : <span>{invalidMsg}</span>}
            </div>
            <div id='homepage-login-container2' style={{ display: 'none' }} className='homepage-login-container'>
                <h3>Login Successful</h3>
            </div>
        </>
    )
}

export default LoginContainer