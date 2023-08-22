import React, { useEffect, useState } from 'react'
import '../../pages/css/homepage.css';
import '../css/input.css';
import '../css/disabledButton.css';
import { motion } from 'framer-motion';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';


const h4Variant = {
    hidden: {
        opacity: 0
    },
    visible: {
        opacity: 1,
        transition: { duration: 0.2, delay: .2 }
    }
}
const aadhaarVariant = {
    hidden: {
        opacity: 0, scale: 0.95
    },
    visible: {
        opacity: 1, scale: 1,
        transition: { duration: .2, delay: 0.2 }
    }
}
const ONLY_NUMBER_VALIDATOR = new RegExp('^[0-9]+$');
// const EMAIL_VALIDATOR = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const PASSWORD_VALIDATOR = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,12}$/;


function RegisterContainer({ API }) {
    const NAVIGATE = useNavigate();
    const token = useSelector(state => state.auth.token);
    if (token) {
        NAVIGATE("/dashboard");
    }
    const [sending, setSending] = useState(false);


    const [aadharNumber, setAadharNumber] = useState("");
    const [aadharNumberVal, setAadharNumberVal] = useState(null);
    const [server_aadharValid, setServer_aadharValid] = useState(null);
    const [InvalidAadharMsg, setInvalidAadharMsg] = useState("");
    const [validAadharMsg, setValidAadharMsg] = useState("");
    const [aadharOTPsent, setAadharOTPsent] = useState(false);
    const [incomingAuthData, setIncomingAuthData] = useState(null);

    const [aadharOTP, setAadharOTP] = useState("");
    const [aadharOTPVal, setAadharOTPVal] = useState(null);
    const [OTPverified, setOTPverified] = useState(null);
    const [maliciousOTPMsg, setMaliciousOTPMsg] = useState("");

    const [myAadhar, setMyAadhar] = useState(null);
    const [serverEmail, setServerEmail] = useState("");
    const [canRegister, setCanRegister] = useState(false);

    const [password, setPassword] = useState("");
    const [passwordVal, setPasswordVal] = useState(null);

    const [confirmPassword, setConfirmPassword] = useState(" ");
    const [confirmPasswordVal, setConfirmPasswordVal] = useState(null);

    const [registerErr, setRegisterErr] = useState(null);
    const [registerMsg, setRegisterMsg] = useState("");
    const [isRegistered, setIsRegistered] = useState(false);
    // Validating password
    useEffect(() => {
        if (!PASSWORD_VALIDATOR.test(password)) {
            setPasswordVal(false);
        } else { setPasswordVal(true); }
    }, [password]);
    // Validating confirm password
    useEffect(() => {
        if (password !== confirmPassword) {
            setConfirmPasswordVal(false)
            setCanRegister(false);
        } else {
            setCanRegister(true);
            setConfirmPasswordVal(true);
        }
    }, [password, confirmPassword]);
    // Validating Aadhar otp
    useEffect(() => {
        if (!ONLY_NUMBER_VALIDATOR.test(aadharOTP) || aadharOTP.trim().length !== 4) {
            setAadharOTPVal(false);
        } else {
            setAadharOTPVal(true);
            if (aadharOTP.trim().length === 4) {
                const DATA = { ...incomingAuthData, clientOtp: aadharOTP }
                axios.post(`${API}/citizen/verify-otp-for-aadhar`, DATA)
                    .then(result => {
                        const DATA = result.data;
                        if (DATA.err) {
                            setOTPverified(false);
                            setMaliciousOTPMsg(DATA.msg);
                        } else {
                            setMyAadhar(DATA.data);
                            // setClientEmail(DATA.data.email);
                            setServerEmail(DATA.data.email);
                            // setClientEmailVal(true);
                            // setClientEmailVerified(true);
                            // setSameEmail(true);
                            setAadharOTPsent(false);
                            setOTPverified(true);
                        }
                    })
            }
        }
    }, [aadharOTP, API, incomingAuthData]);
    useEffect(() => {
        if (!ONLY_NUMBER_VALIDATOR.test(aadharNumber) || aadharNumber.trim().length !== 12) {
            setAadharNumberVal(false);
        } else { setAadharNumberVal(true); }
    }, [aadharNumber])
    useEffect(() => {
        if (isRegistered) {
            document.getElementById('homepage-register-container').style.display = 'none';
            document.getElementById('homepage-register-container2').style.display = 'flex';
        }
    }, [isRegistered]);
    // Functions
    const authenticate_aadhar = () => {
        setSending(true);
        axios.post(`${API}/citizen/authenticate-aadhar`, { aadharNumber })
            .then(result => {
                const DATA = result.data;
                setSending(false);
                if (DATA.err) {
                    setServer_aadharValid(false);
                    setInvalidAadharMsg(DATA.msg);
                } else {
                    setServer_aadharValid(true);
                    setValidAadharMsg(DATA.msg);
                    setAadharOTPsent(true);
                    setIncomingAuthData(DATA.data);
                }
            });
    }
    const register_citizen = () => {
        const citizen = {
            aadharNumber,
            email: serverEmail,
            password
        };
        axios.post(`${API}/citizen/register`, citizen)
            .then(result => {
                const DATA = result.data;
                if (DATA.err) {
                    setRegisterErr(true);
                    setRegisterMsg(DATA.msg);
                } else {
                    setIsRegistered(true)
                    setRegisterErr(false);
                    setRegisterMsg(DATA.msg);
                }
            })
    }
    return (
        <>
            <div id='homepage-register-container' className='homepage-register-container'>
                < motion.h4
                    initial="hidden"
                    animate="visible"
                    variants={h4Variant}
                > REGISTER</motion.h4 >
                <div
                    className='homepage-reg-aadhar'>
                    <motion.input
                        disabled={aadharOTPsent}
                        initial="hidden"
                        animate="visible"
                        variants={aadhaarVariant}
                        className={aadharNumberVal ? 'normal-tb' : 'red-tb'}
                        onChange={(e) => setAadharNumber(e.target.value)}
                        placeholder='Aadhaar number'
                    >
                    </motion.input>
                    {aadharNumberVal === false && <span>Please enter a valid aadhar number</span>}
                    {aadharNumberVal && !server_aadharValid && <motion.button
                        className={sending ? 'green-disable ' : 'green'}
                        initial="hidden"
                        animate="visible"
                        variants={aadhaarVariant}
                        onClick={authenticate_aadhar}
                        disabled={sending}
                    >
                        {sending ? '...' : "Authenticate aadhaar"}
                    </motion.button>}
                    <div>
                        {!server_aadharValid && <span>{InvalidAadharMsg}</span>}
                        {server_aadharValid && <span>{OTPverified ? "Aadhar verified" : validAadharMsg}</span>}
                    </div>
                </div>
                {
                    aadharOTPsent &&
                    <div>
                        <input className={aadharOTPVal ? 'normal-tb' : 'red-tb'} onChange={e => setAadharOTP(e.target.value)} placeholder='OTP' pattern="^[0-9]{4}$"></input>
                        {!aadharOTPVal && <span>Please enter a valid 4 digit otp</span>}
                        {aadharOTPVal && !OTPverified && <span>{maliciousOTPMsg}</span>}
                    </div>
                }
                {
                    OTPverified &&
                    <>
                        <span>{myAadhar.firstName} {myAadhar.middleName} {myAadhar.lastName}</span>
                        <span>Any updates regarding to this portal will be sent to this mail</span>
                        <span>{serverEmail}</span>
                    </>
                }
                {(OTPverified) && <input className={passwordVal ? 'normal-tb' : 'red-tb'} onChange={e => setPassword(e.target.value)} placeholder='password' type='password'></input>}
                {passwordVal === false && (OTPverified) && <span>Password must contain 8-12 chars and at least 1 special char,1 digit and 1 uppercase</span>}
                {(OTPverified) && <input className={confirmPasswordVal ? 'normal-tb' : 'red-tb'} onChange={e => setConfirmPassword(e.target.value)} placeholder='Confirm password' type='password'></input>}
                {confirmPasswordVal === false && (OTPverified) && <span>Passwords must be same</span>}
                {canRegister === true ? <button className='red' onClick={register_citizen}>Register</button> : null}
                {registerErr !== null && <span>{registerMsg}</span>}
            </div >
            <div id='homepage-register-container2' style={{ display: 'none' }} className='homepage-register-container'>
                <h3>Registered Successfully</h3>
            </div>
        </>
    );
}

export default RegisterContainer