import React, { useEffect, useReducer, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { CITIZEN_ACTIONS } from "../../../redux-store/slices/citizen-slice";
import axios from 'axios';
import DatePicker from 'react-date-picker';

import '../../../pages/css/dashboard.css';

const ONLY_NUMBER_VALIDATOR = new RegExp("^[0-9]+$");
// const ONLY_ALPHA_VALIDATOR = /^[A-Z]+$/i;
// const DISTRICTS = [
//     "Ahmedabad",
//     "Amreli",
//     "Anand",
//     "Aravalli",
//     "Banaskantha",
//     "Bharuch",
//     "Bhavnagar",
//     "Botad",
//     "Chhotaudipur",
//     "Dahod",
//     "Dang",
//     "Devbhumi Dwarka",
//     "Gandhinagar",
//     "Gir Somnath",
//     "Jamnagar",
//     "Junagadh",
//     "Kheda",
//     "Kutch",
//     "Mahisagar",
//     "Mehsana",
//     "Morbi",
//     "Narmada",
//     "Navsari",
//     "Panchmahal",
//     "Patan",
//     "Porbandar",
//     "Rajkot",
//     "Sabarkantha",
//     "Surat",
//     "Surendranagar",
//     "Tapi",
//     "Valsad",
//     "Vadodara",
// ];
const DEATH_TYPE = ["Natural", "Medical conditions", "Other unnatural conditions"];
const IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png"];
const name_validation = (name) => {
    console.log(name)
    if (name.trim().length < 3 || name.trim().length > 15) {
        return false;
    } else {
        console.log(name)
        return true;
    }
}
const image_validation = (file) => {
    if (!file || !IMAGE_TYPES.includes(file.type) || file.size >= 1000000) {
        return false;
    } else {
        return true;
    }
};

const aadharReducer = (state, action) => {
    switch (action.type) {
        case "setAadhar":
            return { ...state, aadharNumber: action.aadharNumber };
        case "setAadharVal":
            if (
                !ONLY_NUMBER_VALIDATOR.test(state.aadharNumber) ||
                state.aadharNumber.trim().length !== 12
            ) {
                return { ...state, aadharNumberVal: false };
            } else return { ...state, aadharNumberVal: true };
        case "setAadharOTP":
            return {
                ...state,
                aadharOTP: { sent: action.sent, msg: action.msg, otp: action.otp },
            };
        case "setAadharVerification":
            return {
                ...state,
                aadharVerification: { verified: action.verified, msg: action.msg },
            };
        default:
            break;
    }
};
const personAadharReducer = aadharReducer;
const fillerAadharReducer = aadharReducer;
function DeathForm({ API }) {
    const NAVIGATE = useNavigate();
    const token = useSelector(state => state.auth.token);
    useEffect(() => {
        if (!token) {
            NAVIGATE("/login");
        }
    }, [NAVIGATE, token]);
    const ME = useSelector(state => state.citizen.citizen);
    const dispatch = useDispatch();

    // Basic details
    // Date of Death
    const [dateOfDeath, setDateOfDeath] = useState(new Date());
    //Place of death
    const [placeOfDeath, setPlaceOfDeath] = useState("");
    const [placeOfDeathVal, setPlaceOfDeathVal] = useState(false);
    useEffect(() => {
        if (
            placeOfDeath.trim().length <= 0 ||
            placeOfDeath.trim().length > 20
        ) {
            setPlaceOfDeathVal(false);
        } else {
            setPlaceOfDeathVal(true);
        }
    }, [placeOfDeath]);
    // Reason of death
    const [reason, setReason] = useState("");
    const [reasonVal, setReasonVal] = useState(false);
    useEffect(() => {
        if (name_validation(reason)) {
            setReasonVal(true);
        } else { setReasonVal(false); }
    }, [reason])
    // Death type
    const [type, setType] = useState("");
    const [typeVal, setTypeVal] = useState(false);
    useEffect(() => {
        if (DEATH_TYPE.includes(type)) {
            setTypeVal(true);
        } else { setTypeVal(false); }
    }, [type])
    // Person's aadhar card
    const [personAadhar, personAadharDispatch] = useReducer(
        personAadharReducer,
        {
            aadharNumber: "",
            aadharNumberVal: null,
            aadharOTP: { sent: null, msg: "", otp: "" },
            aadharVerification: { verified: null, msg: "" },
        }
    );
    const [personOTP, setPersonOTP] = useState("");
    const [personOTPVal, setPersonOTPVal] = useState(false);
    const [personAadharData, setPersonAadharData] = useState(null);
    useEffect(() => {
        if (
            !ONLY_NUMBER_VALIDATOR.test(personOTP) ||
            personOTP.trim().length !== 4
        ) {
            setPersonOTPVal(false);
        } else {
            setPersonOTPVal(true);
            axios
                .post(`${API}/citizen/verify-otp-for-aadhar`, {
                    otp: personAadhar.aadharOTP.otp,
                    clientOtp: personOTP,
                    aadhar: personAadharData,
                })
                .then((result) => {
                    const DATA = result.data;
                    if (DATA.err) {
                        personAadharDispatch({
                            type: "setAadharVerification",
                            verified: false,
                            msg: DATA.msg,
                        });
                    } else {
                        personAadharDispatch({
                            type: "setAadharVerification",
                            verified: true,
                            msg: DATA.msg,
                        });
                        setPersonAadharData(DATA.data);
                    }
                });
        }
        // eslint-disable-next-line
    }, [personOTP, API]);
    // Filler's aadhar card
    const [fillerAadhar, fillerAadharDispatch] = useReducer(
        fillerAadharReducer,
        {
            aadharNumber: "",
            aadharNumberVal: null,
            aadharOTP: { sent: null, msg: "", otp: "" },
            aadharVerification: { verified: null, msg: "" },
        }
    );
    const [fillerOTP, setFillerOTP] = useState("");
    const [fillerOTPVal, setFillerOTPVal] = useState(false);
    const [fillerAadharData, setFillerAadharData] = useState(null);
    useEffect(() => {
        if (
            !ONLY_NUMBER_VALIDATOR.test(fillerOTP) ||
            fillerOTP.trim().length !== 4
        ) {
            setFillerOTPVal(false);
        } else {
            setFillerOTPVal(true);
            axios
                .post(`${API}/citizen/verify-otp-for-aadhar`, {
                    otp: fillerAadhar.aadharOTP.otp,
                    clientOtp: fillerOTP,
                    aadhar: fillerAadharData,
                })
                .then((result) => {
                    const DATA = result.data;
                    if (DATA.err) {
                        fillerAadharDispatch({
                            type: "setAadharVerification",
                            verified: false,
                            msg: DATA.msg,
                        });
                    } else {
                        fillerAadharDispatch({
                            type: "setAadharVerification",
                            verified: true,
                            msg: DATA.msg,
                        });
                        setFillerAadharData(DATA.data);
                    }
                });
        }
        // eslint-disable-next-line
    }, [fillerOTP, API]);
    const [relation, setRelation] = useState("");
    const [relationVal, setRelationVal] = useState(false);
    useEffect(() => {
        if (name_validation(relation)) {
            setRelationVal(true);
        } else { setRelationVal(false); }
    }, [relation])


    // Documents
    //Hospital death declaration 
    const [hospital, setHospital] = useState(null);
    const [hospitalVal, setHospitalVal] = useState(false);
    const [hospitalBASE, setHospitalBASE] = useState("");
    useEffect(() => {
        if (image_validation(hospital)) {
            const reader = new FileReader();
            reader.readAsDataURL(hospital);
            reader.onloadend = () => {
                setHospitalBASE(reader.result);
            };
            setHospitalVal(true);
        } else {
            setHospitalVal(false);
        }
    }, [hospital]);
    //Last place document
    const [lastPlace, setLastPlace] = useState(null);
    const [lastPlaceVal, setLastPlaceVal] = useState(false);
    const [lastPlaceBASE, setLastPlaceBASE] = useState("");
    useEffect(() => {
        if (image_validation(lastPlace)) {
            const reader = new FileReader();
            reader.readAsDataURL(lastPlace);
            reader.onloadend = () => {
                setLastPlaceBASE(reader.result);
            };
            setLastPlaceVal(true);
        } else {
            setLastPlaceVal(false);
        }
    }, [lastPlace])
    const [submitted, setSubmitted] = useState(false);
    const [submitAnswer, setSubmitAnswer] = useState({ err: false, msg: "" });
    // Functions
    const verify_filler_aadhar = () => {
        axios
            .post(`${API}/citizen/services-aadhar-verification`, {
                aadharNumber: fillerAadhar.aadharNumber,
            })
            .then((result) => {
                const DATA = result.data;
                if (DATA.err) {
                    fillerAadharDispatch({
                        type: "setAadharOTP",
                        sent: false,
                        msg: DATA.msg,
                        otp: "",
                    });
                } else {
                    fillerAadharDispatch({
                        type: "setAadharOTP",
                        sent: true,
                        msg: DATA.msg,
                        otp: DATA.data.otp,
                    });
                    setFillerAadharData(DATA.data.aadhar);
                }
            });
    };
    const verify_person_aadhar = () => {
        axios
            .post(`${API}/citizen/services-aadhar-verification`, {
                aadharNumber: personAadhar.aadharNumber,
            })
            .then((result) => {
                const DATA = result.data;
                if (DATA.err) {
                    personAadharDispatch({
                        type: "setAadharOTP",
                        sent: false,
                        msg: DATA.msg,
                        otp: "",
                    });
                } else {
                    personAadharDispatch({
                        type: "setAadharOTP",
                        sent: true,
                        msg: DATA.msg,
                        otp: DATA.data.otp,
                    });
                    setPersonAadharData(DATA.data.aadhar);
                }
            });
    };
    const submit_death_form = () => {
        const confirm = window.confirm("Are you sure to submit this form ? ");
        if (!confirm) {
            return;
        } else {
            const form = {
                dateOfDeath,
                placeOfDeath,
                district: personAadharData.district,

                personAadhar: personAadharData.aadharNumber,
                personName: `${personAadharData.firstName} ${personAadharData.middleName} ${personAadharData.lastName}`,
                deathType: type,
                deathReason: reason,

                fillerAadhar: fillerAadharData.aadharNumber,
                relation,

                hospitalDeclaration: hospitalBASE,
                crematoriumDeclaration: lastPlaceBASE,
                appliedBy: ME._id
            };
            axios.post(`${API}/citizen/submit-death-form`, form)
                .then(result => {
                    const DATA = result.data;
                    if (DATA.err) {
                        setSubmitAnswer({ err: DATA.err, msg: DATA.msg });
                    } else {
                        dispatch(CITIZEN_ACTIONS.updateAppliedFor({ appliedFor: DATA.data.appliedFor }));
                        setSubmitted(true);
                        setSubmitAnswer({ err: DATA.err, msg: DATA.msg });
                        dispatch(CITIZEN_ACTIONS.setFilling({ filling: true }));
                        NAVIGATE(`/dashboard/applied/book-slot/${personAadharData.district}/${2}/${DATA.data.appliedFor}`);
                    }
                });
        }
    }
    return (
        <div style={{ padding: "2vw", backgroundColor: "#ffffff87", borderRadius: "8px", "backdrop-filter": "blur(3px)" }} className="dashboard-death-form-container">
            <h3 style={{ fontWeight: "bolder", paddingBottom: "1vh" }}>Registration for Death Certificate</h3>
            {/* Basic Details  */}
            <div style={{ "border": "1px solid black ", padding: "1vw", borderRadius: "10px" }} className="death-form-basic-section">
                <h5 style={{ fontWeight: "bold", paddingBottom: "1vh", letterSpacing: "1px" }}>⇛ Basic details</h5>
                <div style={{ display: "flex", gap: "4vw", marginBottom: "1vh" }}>
                    <div>
                        <span>Date of Death</span>
                        <DatePicker
                            onChange={setDateOfDeath}
                            format="MM-dd-yyyy"
                            maxDate={new Date()}
                            value={dateOfDeath}
                        />
                    </div>
                    <div>
                        <span>
                            Note: Death certificate will be issued from the address mentioned
                            in deceased person's aadhar card
                        </span>
                        <input
                            className={placeOfDeathVal ? 'normal-tb' : 'red-tb'}
                            type="text"
                            onChange={(e) => setPlaceOfDeath(e.target.value)}
                            placeholder="Place Of Death"
                        ></input>
                    </div>
                    <div>

                        {!placeOfDeathVal && <span>Max 20 characters allowed</span>}
                        <input className={reasonVal ? 'normal-tb' : 'red-tb'}
                            type="text"
                            onChange={(e) => setReason(e.target.value)}
                            placeholder="Reason Of Death"
                        ></input>
                        {!reasonVal && <span>Reason must be more than 3 letters</span>}
                    </div>
                    <div>

                        <select
                            className='normal-tb'
                            defaultValue={-1}
                            onChange={(e) =>
                                setType(e.target.value)
                            }
                        >
                            <option className='normal-tb' disabled value={-1}>
                                Type of Death
                            </option>
                            {DEATH_TYPE.map((type) => (
                                <option className='normal-tb' key={type} value={type}>
                                    {type}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
                <hr></hr>
                {/* Person Details  */}
                {placeOfDeathVal && reasonVal && typeVal && (
                    <div className="death-form-person-section">
                        <h5 style={{ fontWeight: "bold", paddingBottom: "1vh", letterSpacing: "1px" }}>⇛ Deceased Person Details</h5>
                        <div>

                            <input className={personAadhar.aadharNumberVal ? 'normal-tb' : 'red-tb'}
                                disabled={personAadhar.aadharVerification.verified}
                                type="text"
                                placeholder="Person's aadhar number"
                                onChange={(e) => {
                                    personAadharDispatch({
                                        type: "setAadhar",
                                        aadharNumber: e.target.value,
                                    });
                                    personAadharDispatch({ type: "setAadharVal" });
                                }}
                            ></input>
                            {personAadhar.aadharNumberVal &&
                                !personAadhar.aadharVerification.verified && (
                                    <button style={{ width: "auto" }} className='blue' onClick={verify_person_aadhar}>Verify</button>
                                )}
                            {personAadhar.aadharVerification.verified !== null && (

                                <span>   {personAadhar.aadharVerification.msg} </span>

                            )}
                        </div>
                        <div>

                            {personAadhar.aadharOTP.sent !== null &&
                                !personAadhar.aadharVerification.verified && (
                                    <span>{personAadhar.aadharOTP.msg}</span>
                                )}
                        </div>
                        {personAadhar.aadharOTP.sent &&
                            !personAadhar.aadharVerification.verified && (
                                <div>
                                    <span>{personAadhar.aadharOTP.msg}</span>
                                    <input className={personOTPVal ? 'normal-tb' : 'red-tb'}
                                        type="text"
                                        placeholder="OTP"
                                        onChange={(e) => setPersonOTP(e.target.value)}
                                    ></input>
                                    {!personOTPVal && <span>Enter 4 digit OTP</span>}
                                </div>
                            )}
                        {
                            personAadhar.aadharVerification.verified &&
                            <>
                                <span>{personAadharData.firstName} {personAadharData.middleName} {personAadharData.lastName}</span>
                            </>
                        }
                    </div>
                )}
            </div>
            {/* Filler Details  */}
            {
                personAadhar.aadharVerification.verified &&
                placeOfDeathVal && reasonVal && typeVal &&
                <div style={{ "border": "1px solid black ", padding: "1vw", marginTop: "1vw", borderRadius: "10px" }} className="death-form-filler-section">
                    <h5 style={{ fontWeight: "bold", paddingBottom: "1vh", letterSpacing: "1px" }}>⇛ Form Filler Details</h5>
                    <div style={{ display: "flex", gap: "1vw", marginBottom: "1vh" }}>
                        <input className={fillerAadhar.aadharNumberVal ? 'normal-tb' : 'red-tb'}
                            disabled={fillerAadhar.aadharVerification.verified}
                            type="text"
                            placeholder="Form filler's aadhar number"
                            onChange={(e) => {
                                fillerAadharDispatch({
                                    type: "setAadhar",
                                    aadharNumber: e.target.value,
                                });
                                fillerAadharDispatch({ type: "setAadharVal" });
                            }}
                        ></input>
                        {fillerAadhar.aadharNumberVal &&
                            !fillerAadhar.aadharVerification.verified && (
                                <button style={{ width: "auto" }} className='blue' onClick={verify_filler_aadhar}>Verify</button>
                            )}
                        {fillerAadhar.aadharOTP.sent !== null &&
                            !fillerAadhar.aadharVerification.verified && (
                                <span>{fillerAadhar.aadharOTP.msg}</span>
                            )}
                        {fillerAadhar.aadharOTP.sent &&
                            !fillerAadhar.aadharVerification.verified && (
                                <div>
                                    <span>{fillerAadhar.aadharOTP.msg}</span>
                                    <input className={fillerOTPVal ? 'normal-tb' : 'red-tb'}
                                        type="text"
                                        placeholder="OTP"
                                        onChange={(e) => setFillerOTP(e.target.value)}
                                    ></input>
                                    {!fillerOTPVal && <span>Enter 4 digit OTP</span>}
                                </div>
                            )}
                        {fillerAadhar.aadharVerification.verified !== null && (
                            <span>{fillerAadhar.aadharVerification.msg}</span>
                        )}
                        {
                            fillerAadhar.aadharVerification.verified &&
                            <>
                                <span>{fillerAadharData.firstName}{fillerAadharData.middleName}{fillerAadharData.lastName}</span>
                            </>
                        }
                        <br></br>
                        {
                            fillerAadhar.aadharVerification.verified &&
                            (<div><input className={relationVal ? 'normal-tb' : 'red-tb'}
                                type="text"
                                placeholder="Form filler's relation with deceased person"
                                onChange={(e) => {
                                    setRelation(e.target.value)
                                }}
                            ></input></div>)

                        }
                        {!relationVal && fillerAadhar.aadharVerification.verified && <span>Relation should at least contain 3 letters</span>}

                    </div>
                </div>
            }
            {/* Other Details */}
            {
                fillerAadhar.aadharVerification.verified && relationVal &&
                <div style={{ "border": "1px solid black ", marginTop: "1vh", padding: "1vw", borderRadius: "10px" }} className="death-form-filler-section">
                    <h5 style={{ fontWeight: "bold", paddingBottom: "1vh", letterSpacing: "1px" }}>⇛ Other Details</h5>
                    <>
                        <h6 style={{ fontWeight: "bold", paddingBottom: "1vh", letterSpacing: "1px" }}>.jpeg, .jpg, .png with less than 1MB are allowed</h6>
                        <hr></hr>
                        <div style={{ display: "flex", gap: "1vw", marginBottom: "1vh" }}>
                            <span>Death declaration by hospital</span>
                            <input
                                accept="image/*"
                                type="file"
                                onChange={(e) => setHospital(e.target.files[0])}
                            ></input>
                            {hospitalVal && (
                                <img
                                    style={{ width: "10vw", height: "20vh" }}
                                    src={hospitalBASE}
                                    alt="img"
                                />
                            )}
                        </div>
                        <div>

                            <span>Crematorium declaration</span>
                            <input
                                accept="image/*"
                                type="file"
                                onChange={(e) => setLastPlace(e.target.files[0])}
                            ></input>
                            {lastPlaceVal && (
                                <img
                                    style={{ width: "10vw", height: "20vh" }}
                                    src={lastPlaceBASE}
                                    alt="img"
                                />
                            )}
                        </div>
                    </>
                    {
                        hospitalVal && lastPlaceVal &&
                        <button style={{ width: "auto" }} className='red' onClick={submit_death_form}>Submit</button>
                    }
                    {submitted &&
                        <div>
                            <span>{submitAnswer.msg}</span>
                        </div>
                    }
                </div>
            }
        </div >
    )
}

export default DeathForm