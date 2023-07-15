import React, { useEffect, useReducer, useState } from 'react'
import DATEPICKER from 'react-date-picker';
import 'react-date-picker/dist/DatePicker.css';
import 'react-calendar/dist/Calendar.css';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { CITIZEN_ACTIONS } from '../../../redux-store/slices/citizen-slice';

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
const RELIGIONS = ['Hindu', 'Sikh', 'Christian', 'Jain', 'Buddhism', 'Islam', 'Others'];
const LITERACIES = ["Below 7th", "7th-12th", "Undergraduate", "Graduate"];
const DELIVERY_TREATMENTS = ["Government", "Private", "Relatives", "Others"];
const DELIVERY_TYPES = ["Natural", "Vacuum", "Cesarean"];
const IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png"];
const GENDERS = ["male", "female", "others"];

const parentReducer = (state, action) => {
    switch (action.type) {
        case "setAadhar":
            return { ...state, aadharNumber: action.aadharNumber }
        case "setAadharVal":
            if (!ONLY_NUMBER_VALIDATOR.test(state.aadharNumber) || state.aadharNumber.trim().length !== 12) {
                return { ...state, aadharNumberVal: false };
            }
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
const motherReducer = parentReducer;
const fatherReducer = parentReducer;


function BirthForm({ API }) {
    const ME = useSelector(state => state.citizen.citizen);
    const token = useSelector(state => state.auth.token);
    const NAVIGATE = useNavigate();
    const dispatch = useDispatch();
    useEffect(() => {
        if (!token) {
            NAVIGATE("/login");
        }
    }, [NAVIGATE, token]);
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
    // Child gender
    const [childGender, setChildGender] = useState("");
    const [childGenderVal, setChildGenderVal] = useState(false);
    useEffect(() => {
        if (GENDERS.includes(childGender)) {
            setChildGenderVal(true);
        } else {
            setChildGenderVal(false)
        }
    }, [childGender]);
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
    const [weight, setWeight] = useState(0);
    const [weightVal, setWeightVal] = useState(false);
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
        if (DISTRICTS.includes(placeOfBirth)) {
            setPlaceOfBirthVal(true)
        } else {
            setPlaceOfBirthVal(false);
        }
    }, [placeOfBirth]);
    // 
    // Mother ---------------------------------------------------------------------------
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

    const [motherReligion, setMotherReligion] = useState("");
    const [motherReligionVal, setMotherReligionVal] = useState(false);
    useEffect(() => {
        if (RELIGIONS.includes(motherReligion)) {
            setMotherReligionVal(true);
        } else {
            setMotherReligionVal(false);
        }
    }, [motherReligion]);

    const [motherLiteracy, setMotherLiteracy] = useState("");
    const [motherLiteracyVal, setMotherLiteracyVal] = useState(false);
    useEffect(() => {
        if (LITERACIES.includes(motherLiteracy)) {
            setMotherLiteracyVal(true);
        } else {
            setMotherLiteracyVal(false);
        }
    }, [motherLiteracy]);

    const [motherAgeBirth, setMotherAgeBirth] = useState(0);
    const [motherAgeBirthVal, setMotherAgeBirthVal] = useState(false);
    useEffect(() => {
        if (motherAgeBirth <= 10 || motherAgeBirth >= 50) {
            setMotherAgeBirthVal(false);
        } else {
            setMotherAgeBirthVal(true);
        }
    }, [motherAgeBirth]);

    const [motherOccupation, setMotherOccupation] = useState("");
    const [motherOccupationVal, setMotherOccupationVal] = useState(false);
    useEffect(() => {
        if (motherOccupation.trim().length >= 3) {
            setMotherOccupationVal(true);
        } else {
            setMotherOccupationVal(false);
        }
    }, [motherOccupation]);
    // 
    // Father ---------------------------------------------------------------------------
    // 
    const [fatherAadhar, fatherDispatch] = useReducer(fatherReducer,
        {
            aadharNumber: "",
            aadharNumberVal: null,
            aadharOTP: { sent: null, msg: "", otp: "" },
            aadharVerification: { verified: null, msg: "" }
        });
    const [fatherOTP, setFatherOTP] = useState("");
    const [fatherOTPVal, setFatherOTPVal] = useState(false);
    const [fatherAadharData, setFatherAadharData] = useState(null);
    useEffect(() => {
        if (!ONLY_NUMBER_VALIDATOR.test(fatherOTP) || fatherOTP.trim().length !== 4) {
            setFatherOTPVal(false);
        } else {
            setFatherOTPVal(true);
            axios.post(`${API}/citizen/verify-otp-for-aadhar`, { otp: fatherAadhar.aadharOTP.otp, clientOtp: fatherOTP, aadhar: fatherAadharData })
                .then(result => {
                    const DATA = result.data;
                    if (DATA.err) {
                        fatherDispatch({ type: "setAadharVerification", verified: false, msg: DATA.msg });
                    } else {
                        fatherDispatch({ type: "setAadharVerification", verified: true, msg: DATA.msg });
                        setFatherAadharData(DATA.data);
                    }
                });
        }
        // eslint-disable-next-line
    }, [fatherOTP, API]);

    const [fatherReligion, setFatherReligion] = useState("");
    const [fatherReligionVal, setFatherReligionVal] = useState(false);
    useEffect(() => {
        if (RELIGIONS.includes(fatherReligion)) {
            setFatherReligionVal(true);
        } else {
            setFatherReligionVal(false);
        }
    }, [fatherReligion]);

    const [fatherLiteracy, setFatherLiteracy] = useState("");
    const [fatherLiteracyVal, setFatherLiteracyVal] = useState(false);
    useEffect(() => {
        if (LITERACIES.includes(fatherLiteracy)) {
            setFatherLiteracyVal(true);
        } else {
            setFatherLiteracyVal(false);
        }
    }, [fatherLiteracy]);

    const [fatherOccupation, setFatherOccupation] = useState("");
    const [fatherOccupationVal, setFatherOccupationVal] = useState(false);
    useEffect(() => {
        if (fatherOccupation.trim().length >= 3) {
            setFatherOccupationVal(true);
        } else {
            setFatherOccupationVal(false);
        }
    }, [fatherOccupation]);
    // 
    // Other ---------------------------------------------------------------------------
    // 
    const [postDelivery, setPostDelivery] = useState("");
    const [postDeliveryVal, setPostDeliveryVal] = useState(false);
    useEffect(() => {
        if (DELIVERY_TREATMENTS.includes(postDelivery)) {
            setPostDeliveryVal(true);
        } else {
            setPostDeliveryVal(false);
        }
    }, [postDelivery]);

    const [deliveryType, setDeliveryType] = useState("");
    const [deliveryTypeVal, setDeliveryTypeVal] = useState(false);
    useEffect(() => {
        if (DELIVERY_TYPES.includes(deliveryType)) {
            setDeliveryTypeVal(true);
        } else {
            setDeliveryTypeVal(false);
        }
    }, [deliveryType]);

    const [pregDuration, setPregDuration] = useState(0);
    const [pregDurationVal, setPregDurationVal] = useState(null);
    useEffect(() => {
        if (pregDuration <= 28 || pregDuration >= 40) {
            setPregDurationVal(false);
        } else {
            setPregDurationVal(true);
        }
    }, [pregDuration]);

    // 
    // Documents ---------------------------------------------------------------------------
    // 
    const [addressProofDOC, setAddressProofDOC] = useState(null);
    const [addressProofDOCval, setAddressProofDOCval] = useState(false);
    const [addBase64, setAddBase64] = useState("");
    useEffect(() => {
        if (image_validation(addressProofDOC)) {
            setAddressProofDOCval(true);
            const reader = new FileReader();
            reader.readAsDataURL(addressProofDOC);
            reader.onloadend = () => { setAddBase64(reader.result) };
        } else {
            setAddressProofDOCval(false);
        }
    }, [addressProofDOC]);

    const [marriageProofDOC, setMarriageProofDOC] = useState(null);
    const [marriageProofDOCval, setMarriageProofDOCval] = useState(false);
    const [marriageBase64, setMarriageBase64] = useState("");
    useEffect(() => {
        if (image_validation(marriageProofDOC)) {
            setMarriageProofDOCval(true);
            const reader = new FileReader();
            reader.readAsDataURL(marriageProofDOC);
            reader.onloadend = () => { setMarriageBase64(reader.result) };
        } else {
            setMarriageProofDOCval(false);
        }

    }, [marriageProofDOC]);

    const [birthProofDOC, setBirthProofDOC] = useState(null);
    const [birthProofDOCval, setBirthProofDOCval] = useState(false);
    const [birthBase64, setBirthBase64] = useState("");

    const [submitted, setSubmitted] = useState(false);
    const [submitAnswer, setSubmitAnswer] = useState({ err: false, msg: "" });
    useEffect(() => {
        if (image_validation(birthProofDOC)) {
            setBirthProofDOCval(true);
            const reader = new FileReader();
            reader.readAsDataURL(birthProofDOC);
            reader.onloadend = () => { setBirthBase64(reader.result) };
        } else {
            setBirthProofDOCval(false);
        }

    }, [birthProofDOC]);

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
    const verify_father_aadhar = () => {
        axios.post(`${API}/citizen/services-aadhar-verification`, { aadharNumber: fatherAadhar.aadharNumber })
            .then(result => {
                const DATA = result.data;
                if (DATA.err) {
                    fatherDispatch({ type: "setAadharOTP", sent: false, msg: DATA.msg, otp: "" });
                } else {
                    fatherDispatch({ type: "setAadharOTP", sent: true, msg: DATA.msg, otp: DATA.data.otp });
                    setFatherAadharData(DATA.data.aadhar);
                }
            });
    }
    const image_validation = (file) => {
        if (
            !file
            || !IMAGE_TYPES.includes(file.type)
            || file.size >= 1000000
        ) {
            return false;
        } else {
            return true;
        }
    }
    const submit_birth_form = () => {
        const confirm = window.confirm("Are you sure to submit the form ? This action cannot be reverted");
        if (!confirm) {
            return
        }
        let birthCertificateFormData = {};
        birthCertificateFormData.childBirthDate = childDOB;
        birthCertificateFormData.childGender = childGender;
        birthCertificateFormData.childFirstName = first;
        birthCertificateFormData.childMiddleName = middle;
        birthCertificateFormData.childLastName = last;
        birthCertificateFormData.childWeight = weight;
        birthCertificateFormData.placeOfBirth = placeOfBirth;

        birthCertificateFormData.motherAadhar = motherAadharData.aadharNumber;
        birthCertificateFormData.motherReligion = motherReligion;
        birthCertificateFormData.motherLiteracy = motherLiteracy;
        birthCertificateFormData.motherAgeAtBirth = motherAgeBirth;
        birthCertificateFormData.motherOccupation = motherOccupation;

        birthCertificateFormData.fatherAadhar = fatherAadharData.aadharNumber;
        birthCertificateFormData.fatherReligion = fatherReligion;
        birthCertificateFormData.fatherLiteracy = fatherLiteracy;
        birthCertificateFormData.fatherOccupation = fatherOccupation;

        birthCertificateFormData.postDeliveryTreatment = postDelivery;
        birthCertificateFormData.deliveryType = deliveryType;
        birthCertificateFormData.pregnancyDurationWeeks = pregDuration;

        birthCertificateFormData.permanentAddProofDOC = addBase64;
        birthCertificateFormData.marriageCertificateDOC = marriageBase64;
        birthCertificateFormData.proofOfBirthDOC = birthBase64;

        birthCertificateFormData.appliedBy = ME._id;

        axios.post(`${API}/citizen/submit-birth-form`, birthCertificateFormData)
            .then(result => {
                const DATA = result.data;
                if (DATA.err) {
                    setSubmitAnswer({ err: DATA.err, msg: DATA.msg });
                } else {
                    dispatch(CITIZEN_ACTIONS.updateAppliedFor({ appliedFor: DATA.data.appliedFor }));
                    setSubmitted(true);
                    setSubmitAnswer({ err: DATA.err, msg: DATA.msg });
                    setTimeout(() => {
                        NAVIGATE(`/dashboard/applied/book-slot/${placeOfBirth}/${0}/${DATA.data.appliedFor}`);
                    }, 2000);
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
                <DATEPICKER onChange={setChildDOB} format='MM-dd-yyyy' maxDate={new Date()} value={childDOB} />
                {!childDOBVal && <span>Please enter a valid date</span>}

                <select defaultValue={-1} onChange={e => setChildGender(e.target.value)}>
                    <option value={-1} disabled>Gender</option>
                    {GENDERS.map(gender => <option key={gender} value={gender}>{gender}</option>)}
                </select>

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
            {childDOBVal && childGenderVal && firstVal && middleVal && lastVal &&
                weightVal && placeOfBirthVal &&
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
                        <span>{motherAadharData.firstName} {motherAadharData.middleName} {motherAadharData.lastName}</span>
                    }
                    {
                        motherAadhar.aadharVerification.verified &&
                        <div>
                            <div>
                                <select defaultValue={-1} onChange={e => setMotherReligion(e.target.value)}>
                                    <option value={-1} disabled>Mother's Religion</option>
                                    {RELIGIONS.map(religion => <option key={religion} value={religion}>{religion}</option>)}
                                </select>
                            </div>
                            <div>
                                <select defaultValue={-1} onChange={e => setMotherLiteracy(e.target.value)}>
                                    <option value={-1} disabled>Mother Literacy</option>
                                    {LITERACIES.map(literacy => <option key={literacy} value={literacy}>{literacy}</option>)}
                                </select>
                            </div>
                            <div>
                                <input type='number' max={50} min={10} onChange={e => setMotherAgeBirth(e.target.value)} placeholder="Mother's age at birth of this child"></input>
                                {!motherAgeBirthVal && <span>Please enter a valid age (10y-50y)</span>}
                            </div>
                            <div>
                                <input type='text' onChange={e => setMotherOccupation(e.target.value)} placeholder="Mother's occupation"></input>
                                {!motherOccupationVal && <span>Please enter valid value - (Business, Job, etc)</span>}
                            </div>

                        </div>
                    }
                </div>
            }

            {/* Father Section */}
            {motherAadhar.aadharVerification.verified && motherReligionVal
                && motherLiteracyVal && motherAgeBirthVal && motherOccupationVal &&
                < div className='birth-form-father-section'>
                    <h5>Father details</h5>
                    <input
                        disabled={fatherAadhar.aadharVerification.verified}
                        type='text'
                        placeholder="Father's aadhar number"
                        onChange={e => {

                            fatherDispatch({ type: "setAadhar", aadharNumber: e.target.value });
                            fatherDispatch({ type: "setAadharVal" });
                        }
                        }
                    ></input>
                    {fatherAadhar.aadharNumberVal && !fatherAadhar.aadharVerification.verified && <button onClick={verify_father_aadhar}>Verify</button>}
                    {fatherAadhar.aadharOTP.sent !== null && !fatherAadhar.aadharVerification.verified && <span>{fatherAadhar.aadharOTP.msg}</span>}
                    {fatherAadhar.aadharOTP.sent && !fatherAadhar.aadharVerification.verified
                        &&
                        <div>
                            <span>{fatherAadhar.aadharOTP.msg}</span>
                            {/* ! */}
                            <input type='text' placeholder='OTP' onChange={e => setFatherOTP(e.target.value)}></input>
                            {!fatherOTPVal && <span>Enter 4 digit OTP</span>}
                        </div>
                    }
                    {fatherAadhar.aadharVerification.verified !== null
                        && <span>{fatherAadhar.aadharVerification.msg}</span>
                    }
                    {fatherAadhar.aadharVerification.verified
                        &&
                        <span>{fatherAadharData.firstName} {fatherAadharData.middleName} {fatherAadharData.lastName}</span>
                    }
                    {
                        fatherAadhar.aadharVerification.verified &&
                        <div>
                            <div>
                                <select defaultValue={-1} onChange={e => setFatherReligion(e.target.value)}>
                                    <option value={-1} disabled>Father's Religion</option>
                                    {RELIGIONS.map(religion => <option key={religion} value={religion}>{religion}</option>)}
                                </select>
                            </div>
                            <div>
                                <select defaultValue={-1} onChange={e => setFatherLiteracy(e.target.value)}>
                                    <option value={-1} disabled>Father Literacy</option>
                                    {LITERACIES.map(literacy => <option key={literacy} value={literacy}>{literacy}</option>)}
                                </select>
                            </div>
                            <div>
                                <input type='text' onChange={e => setFatherOccupation(e.target.value)} placeholder="Father's occupation"></input>
                                {!fatherOccupationVal && <span>Please enter valid value - (Business, Job, etc)</span>}
                            </div>

                        </div>
                    }
                </div>}
            {/* Other section */}
            {motherAadhar.aadharVerification.verified && motherReligionVal
                && motherLiteracyVal && motherAgeBirthVal && motherOccupationVal &&
                fatherAadhar.aadharVerification.verified && fatherReligionVal
                && fatherLiteracyVal && fatherOccupationVal &&
                <div className='birth-form-other-section'>
                    <h5>Other details</h5>
                    <div>
                        <select defaultValue={-1} onChange={e => setPostDelivery(e.target.value)}>
                            <option value={-1} disabled>Post delivery treatment</option>
                            {DELIVERY_TREATMENTS.map(treatment => <option value={treatment} key={treatment}>{treatment}</option>)}
                        </select>
                    </div>
                    <div>
                        <select defaultValue={-1} onChange={e => setDeliveryType(e.target.value)}>
                            <option value={-1} disabled>Delivery type</option>
                            {DELIVERY_TYPES.map(type => <option value={type} key={type}>{type}</option>)}
                        </select>
                    </div>
                    <div>
                        <input type='number' max={40} min={28} onChange={e => setPregDuration(e.target.value)} placeholder="Pregnancy duration (weeks)"></input>
                        {!pregDurationVal && <span>Please enter a valid duration (28-40)</span>}
                    </div>
                </div>
            }
            {
                postDeliveryVal && deliveryTypeVal && pregDurationVal &&
                <div className='birth-form-documents-section'>
                    <h5>Other details</h5>
                    <span>Note:- Only images are accepted(JPEG, JPG, PNG), less than 1MB</span>
                    <div>
                        <span>Permanent address proof</span>
                        <input type='file' onChange={e => setAddressProofDOC(e.target.files[0])} accept="image/*"></input>
                        {!addressProofDOCval && <span>Please upload a file</span>}
                        {addressProofDOCval && < img style={{ width: "10vw", height: "20vh" }} src={addBase64} alt='img' />}
                    </div>
                    <div>
                        <span>Marriage Certificate</span>
                        <input type='file' onChange={e => setMarriageProofDOC(e.target.files[0])} accept="image/*"></input>
                        {!marriageProofDOCval && <span>Please upload a file</span>}
                        {marriageProofDOCval && <img style={{ width: "10vw", height: "20vh" }} src={marriageBase64} alt='img' />}
                    </div>
                    <div>
                        <span>Birth proof</span>
                        <input type='file' onChange={e => setBirthProofDOC(e.target.files[0])} accept="image/*"></input>
                        {!birthProofDOCval && <span>Please upload a file</span>}
                        {birthProofDOCval && <img style={{ width: "10vw", height: "20vh" }} src={birthBase64} alt='img' />}
                    </div>
                </div>
            }
            {
                addressProofDOCval && marriageProofDOCval && birthProofDOCval &&
                <div>
                    <button onClick={submit_birth_form}>SUBMIT</button>
                </div>
            }
            {submitted &&
                <div>
                    <span>{submitAnswer.msg}</span>
                </div>
            }
        </div >
    )
}

export default BirthForm;