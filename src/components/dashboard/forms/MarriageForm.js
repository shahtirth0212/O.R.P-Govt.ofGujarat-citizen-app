import React, { useEffect, useReducer, useState } from 'react'
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';


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
const MARRIAGE_STATUS = ['Unmarried', 'Widower', 'Widow', 'Divorced'];
const IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png"];
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

const aadharReducer = (state, action) => {
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
const detailsReducer = (state, action) => {
    switch (action.type) {
        // First name
        case "setFirstName":
            return { ...state, firstName: action.firstName };
        case "setFirstNameVal":
            if (!ONLY_ALPHA_VALIDATOR.test(state.firstName) || !state.firstName.trim().length < 3) {
                return { ...state, firstNameVal: false };
            } else {
                return { ...state, firstNameVal: true };
            }
        // Middle name
        case "setMiddleName":
            return { ...state, middleName: action.middleName };
        case "setMiddleNameVal":
            if (!ONLY_ALPHA_VALIDATOR.test(state.middleName) || !state.middleName.trim().length < 3) {
                return { ...state, middleNameVal: false };
            } else {
                return { ...state, middleNameVal: true };
            }
        // Last name
        case "setLastName":
            return { ...state, lastName: action.lastName };
        case "setLastNameVal":
            if (!ONLY_ALPHA_VALIDATOR.test(state.lastName) || !state.lastName.trim().length < 3) {
                return { ...state, lastNameVal: false };
            } else {
                return { ...state, lastNameVal: true };
            }
        // Age
        case "setAge":
            return { ...state, age: action.age };
        case "setAgeVal":
            if (!ONLY_NUMBER_VALIDATOR.test(state.age) || state.age < 18 || state.age > 100) {
                return { ...state, ageVal: false };
            } else {
                return { ...state, ageeVal: true };
            }
        // address
        case "setAddress":
            return { ...state, line1: action.line1, district: action.district };
        case "setAddressVal":
            if (state.line1.trim().length < 5 || state.line1.trim().length > 50 || !DISTRICTS.includes(state.district)) {
                return { ...state, addressVal: false };
            } else {
                return { ...state, addressVal: true };
            }
        // signature
        case "setSignature":
            if (image_validation(action.signature)) {
                const reader = new FileReader();
                reader.readAsDataURL(action.signature);
                reader.onloadend = () => { return { ...state, signatureBASE: reader.result } };
            }
            else {
                return { ...state, signatureBASE: null };
            }
            break;
        case "setSignatureVal":
            if (state.signatureBASE) {
                return { ...state, signatureVal: true };
            } else {
                return { ...state, signatureVal: false };
            }
        // Birth certificates
        case "setBirth":
            if (image_validation(action.birth)) {
                const reader = new FileReader();
                reader.readAsDataURL(action.birth);
                reader.onloadend = () => { return { ...state, birthBASE: reader.result } };
            }
            else {
                return { ...state, birthBASE: null };
            }
            break;
        case "setBirthVal":
            if (state.birthBASE) {
                return { ...state, birthVal: true };
            } else {
                return { ...state, birthVal: false };
            }
        // Religion
        case "setReligion":
            return { ...state, religion: action.religion };
        case "setReligionVal":
            if (RELIGIONS.includes(state.religion)) {
                return { ...state, religionVal: true };
            } else {
                return { ...state, religionVal: false };
            }
        // Status at marriage
        case "setStatus":
            return { ...state, status: action.status };
        case "setStatusVal":
            if (MARRIAGE_STATUS.includes(state.status)) {
                return { ...state, statusVal: true };
            } else {
                return { ...state, statusVal: false };
            }
        default:
            break;
    }
}
const husbandAadharReducer = aadharReducer;
const wifeAadharReducer = aadharReducer;

const wifeDetails = detailsReducer;
const husbandDetails = detailsReducer;

const witness1 = detailsReducer;
const witness2 = detailsReducer;

function MarriageForm() {
    const NAVIGATE = useNavigate();
    const token = useSelector(state => state.auth.token);
    useEffect(() => {
        if (!token) {
            NAVIGATE("/login");
        }
    }, [NAVIGATE, token]);


    // Date of Marriage
    const [dateOfMarriage, setDateOfMarriage] = useState(new Date());
    // Place of Marriage
    const [placeOfMarriage, setPlaceOfMarriage] = useState("");
    const [placeOfMarriageVal, setPlaceOfMarriageVal] = useState(false);
    useEffect(() => {
        if (placeOfMarriage.trim().length < 0 || placeOfMarriage.trim().length > 20) {
            setPlaceOfMarriageVal(false);
        } else {
            setPlaceOfMarriageVal(true);
        }
    }, [placeOfMarriage])
    // Priest Signature
    const [priestSign, setPriestSign] = useState(null);
    const [priestSignVal, setPriestSignVal] = useState(false);
    const [priestSignBASE, setPriestSignBASE] = useState("");
    useEffect(() => {
        if (image_validation(priestSign)) {
            const reader = new FileReader();
            reader.readAsDataURL(priestSign);
            reader.onloadend = () => { setPriestSignBASE(reader.result) };
            setPriestSignVal(true);
        } else {
            setPriestSignVal(false);
        }
    }, [priestSign]);
    // Marriage photo
    const [marriagePhoto, setMarriagePhoto] = useState(null);
    const [marriagePhotoVal, setMarriagePhotoVal] = useState(false);
    const [marriagePhotoBASE, setMarriagePhotoBASE] = useState("");
    useEffect(() => {
        if (image_validation(marriagePhoto)) {
            const reader = new FileReader();
            reader.readAsDataURL(marriagePhoto);
            reader.onloadend = () => { setMarriagePhotoBASE(reader.result) };
            setMarriagePhotoVal(true);
        } else {
            setMarriagePhotoVal(false);
        }
    }, [marriagePhoto]);
    // Witness 1 identity photo
    const [witness1Photo, setWitness1Photo] = useState(null);
    const [witness1Val, setWitness1PhotoVal] = useState(false);
    const [witness1BASE, setWitness1PhotoBASE] = useState("");
    useEffect(() => {
        if (image_validation(witness1Photo)) {
            const reader = new FileReader();
            reader.readAsDataURL(witness1Photo);
            reader.onloadend = () => { setWitness1PhotoBASE(reader.result) };
            setWitness1PhotoVal(true);
        } else {
            setWitness1PhotoVal(false);
        }
    }, [witness1Photo]);
    // Witness 2 identity photo
    const [witness2Photo, setWitness2Photo] = useState(null);
    const [witness2Val, setWitness2PhotoVal] = useState(false);
    const [witness2BASE, setWitness2PhotoBASE] = useState("");
    useEffect(() => {
        if (image_validation(witness2Photo)) {
            const reader = new FileReader();
            reader.readAsDataURL(witness2Photo);
            reader.onloadend = () => { setWitness1PhotoBASE(reader.result) };
            setWitness2PhotoVal(true);
        } else {
            setWitness2PhotoVal(false);
        }
    }, [witness1Photo]);


    return (
        <div>MarriageForm</div>
    )
}

export default MarriageForm