import React, { useEffect, useReducer, useState } from 'react'
import DATEPCIKER from 'react-date-picker';
import 'react-date-picker/dist/DatePicker.css';
import 'react-calendar/dist/Calendar.css';
import axios from 'axios';


const ONLY_NUMBER_VALIDATOR = new RegExp('^[0-9]+$');
const ONLY_ALPHA_VALIDATOR = /^[A-Z]+$/i;
const DISTRICTS = [
    'Ahmedabad',
    'Amreli',
    'Anand',
    'Aravalli',
    'Banaskantha',
    'Bharuch',
    'Bhavnagar',
    'Botad',
    'Chhotaudipur',
    'Dahod',
    'Dang',
    'Devbhumi Dwarka',
    'Gandhinagar',
    'Gir Somnath',
    'Jamnagar',
    'Junagadh',
    'Kheda',
    'Kutch',
    'Mahisagar',
    'Mehsana',
    'Morbi',
    'Narmada',
    'Navsari',
    'Panchmahal',
    'Patan',
    'Porbandar',
    'Rajkot',
    'Sabarkantha',
    'Surat',
    'Surendranagar',
    'Tapi',
    'Valsad',
    'Vadodara'
]

const motherReducer = (state, action) => {
    switch (action.type) {
        case "setAadhar":
            return { ...state, aadharNumber: action.aadharNumber }
        case "setAadharVal":
            if (!ONLY_NUMBER_VALIDATOR.test(state.aadharNumber) || state.aadharNumber.trim().length !== 12)
                return { ...state, aadharNumberVal: false };
            else
                return { ...state, aadharNumberVal: true };
        case "setAadharOTP":
            return {
                ...state, aadharOTP: { sent: action.sent, msg: action.msg, otp: action.otp }
            };
        case "setAadharVerification":
            return {
                ...state, aadharVerification: { verified: action.verified, msg: action.msg }
            };
        default:
            break;
    }
}




function BirthForm({ API }) {
    // Child date of birth
    const [childDOB, setChildDOB] = useState(new Date());
    const [childDOBVal, setChildDOBVal] = useState(false);
    useEffect(() => {
        if (childDOB > new Date()) {
            setChildDOBVal(false)
        } else {
            setChildDOBVal(true);
        }
    }, [childDOB]);
    // Child first name
    const [first, setFirst] = useState("");
    const [firstVal, setFirstVal] = useState(false);
    useEffect(() => {
        if (!ONLY_ALPHA_VALIDATOR.test(first) || first.trim().length <= 2) {
            setFirstVal(false)
        } else {
            setFirstVal(true);
        }
    }, [first]);
    // Child Middle name
    const [middle, setMiddle] = useState("");
    const [middleVal, setMiddleVal] = useState(false);
    useEffect(() => {
        if (!ONLY_ALPHA_VALIDATOR.test(middle) || middle.trim().length <= 3) {
            setMiddleVal(false)
        } else {
            setMiddleVal(true);
        }
    }, [middle]);
    // Child last name
    const [last, setLast] = useState("");
    const [lastVal, setLastVal] = useState(false);
    useEffect(() => {
        if (!ONLY_ALPHA_VALIDATOR.test(last) || last.trim().length <= 3) {
            setLastVal(false)
        } else {
            setLastVal(true);
        }
    }, [last]);
    // Child weight
    const [weight, setWeight] = useState(null);
    const [weightVal, setWeightVal] = useState(0.0);
    useEffect(() => {
        if (weight <= 1.5 || weight >= 7.0) {
            setWeightVal(false)
        } else {
            setWeightVal(true);
        }
    }, [weight]);
    //Place of Birth
    const [placeOfBirth, setPlaceOfBirth] = useState("");
    const [placeOfBirthVal, setPlaceOfBirthVal] = useState(false);
    useEffect(() => {
        if (placeOfBirth in DISTRICTS) {
            setPlaceOfBirthVal(true)
        } else {
            setPlaceOfBirthVal(false);
        }
    }, [placeOfBirth]);
    // 
    // Mother
    // 
    const [motherAadhar, motherDispatch] = useReducer(motherReducer,
        {
            aadharNumber: "",
            aadharNumberVal: null,
            aadharOTP: { sent: null, msg: "", otp: "" },
            aadharVerification: { verified: null, msg: "" }
        });
    const [motherOTP, setMotherOTP] = useState("");
    const [motherOTPVal, setMotherOTPVal] = useState(false);
    const [motherAadharData, setMotherAadharData] = useState(null);
    useEffect(() => {
        if (!ONLY_NUMBER_VALIDATOR.test(motherOTP) || motherOTP.trim().length !== 4) {
            setMotherOTPVal(false);
        } else {
            setMotherOTPVal(true);
            axios.post(`${API}/citizen/verify-otp-for-aadhar`, { otp: motherAadhar.aadharOTP.otp, clientOtp: motherOTP, aadhar: motherAadharData })
                .then(result => {
                    const DATA = result.data;
                    if (DATA.err) {
                        motherDispatch({ type: "setAadharVerification", verified: false, msg: DATA.msg });
                    } else {
                        motherDispatch({ type: "setAadharVerification", verified: true, msg: DATA.msg });
                        setMotherAadharData(DATA.data);
                    }
                });
        }
        // eslint-disable-next-line
    }, [motherOTP, API]);

    // Functions
    const verify_mother_aadhar = () => {
        axios.post(`${API}/citizen/services-aadhar-verification`, { aadharNumber: motherAadhar.aadharNumber })
            .then(result => {
                const DATA = result.data;
                if (DATA.err) {
                    motherDispatch({ type: "setAadharOTP", sent: false, msg: DATA.msg, otp: "" });
                } else {
                    motherDispatch({ type: "setAadharOTP", sent: true, msg: DATA.msg, otp: DATA.data.otp });
                    setMotherAadharData(DATA.data.aadhar);
                }
            });
    }
    return (
        <div className='dashboard-birth-form-container'>
            <h3>Registration for Birth Certificate</h3>
            {/* Child Section */}
            <div className='birth-form-child-section'>
                <h5>Child details</h5>
                <span>Date of Birth</span>
                <DATEPCIKER onChange={setChildDOB} format='MM-dd-yyyy' maxDate={new Date()} value={childDOB} />
                {!childDOBVal && <span>Please enter a valid date</span>}

                <input type='text' onChange={e => setFirst(e.target.value)} placeholder='Frist Name'></input>
                {!firstVal && <span>First name must be at least 3 characters long</span>}

                <input type='text' onChange={e => setMiddle(e.target.value)} placeholder='Middle Name'></input>
                {!middleVal && <span>First name must be at least 3 characters long</span>}

                <input type='text' onChange={e => setLast(e.target.value)} placeholder='Last Name'></input>
                {!lastVal && <span>First name must be at least 3 characters long</span>}

                <input type='number' max={7.0} min={1.5} onChange={e => setWeight(e.target.value)} placeholder='Weight of child (kg)'></input>
                {!weightVal && <span>Weight must be between 1.5-7.0kg</span>}

                <select defaultValue={-1} onChange={e => setPlaceOfBirth(e.target.value)}>
                    <option disabled value={-1}>Place of Birth</option>
                    {DISTRICTS.map(district => <option key={district} value={district}>{district}</option>)}
                </select>
                {!placeOfBirthVal && <span>Please select a district</span>}
            </div>
            {/* Mother Section */}
            <div className='birth-form-mother-section'>
                <h5>Mother details</h5>
                <input
                    disabled={motherAadhar.aadharVerification.verified}
                    type='text'
                    placeholder="Mother's aadhar number"
                    onChange={e => {

                        motherDispatch({ type: "setAadhar", aadharNumber: e.target.value });
                        motherDispatch({ type: "setAadharVal" });
                    }
                    }
                ></input>
                {motherAadhar.aadharNumberVal && !motherAadhar.aadharVerification.verified && <button onClick={verify_mother_aadhar}>Verify</button>}
                {motherAadhar.aadharOTP.sent !== null && !motherAadhar.aadharVerification.verified && <span>{motherAadhar.aadharOTP.msg}</span>}
                {motherAadhar.aadharOTP.sent && !motherAadhar.aadharVerification.verified
                    &&
                    <div>
                        <span>{motherAadhar.aadharOTP.msg}</span>
                        <input type='text' placeholder='OTP' onChange={e => setMotherOTP(e.target.value)}></input>
                        {!motherOTPVal && <span>Enter 4 digit OTP</span>}
                    </div>
                }
                {motherAadhar.aadharVerification.verified !== null
                    && <span>{motherAadhar.aadharVerification.msg}</span>
                }
                {motherAadhar.aadharVerification.verified
                    &&
                    <div>
                        <span>{motherAadharData.firstName} {motherAadharData.middleName} {motherAadharData.lastName}</span>
                    </div>
                }
            </div>
        </div>
    )
}

export default BirthForm