import axios from "axios";
import React, { useEffect, useReducer, useState } from "react";
import DatePicker from "react-date-picker";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { CITIZEN_ACTIONS } from "../../../redux-store/slices/citizen-slice";

const ONLY_NUMBER_VALIDATOR = new RegExp("^[0-9]+$");
const ONLY_ALPHA_VALIDATOR = /^[A-Z]+$/i;
const DISTRICTS = [
    "Ahmedabad",
    "Amreli",
    "Anand",
    "Aravalli",
    "Banaskantha",
    "Bharuch",
    "Bhavnagar",
    "Botad",
    "Chhotaudipur",
    "Dahod",
    "Dang",
    "Devbhumi Dwarka",
    "Gandhinagar",
    "Gir Somnath",
    "Jamnagar",
    "Junagadh",
    "Kheda",
    "Kutch",
    "Mahisagar",
    "Mehsana",
    "Morbi",
    "Narmada",
    "Navsari",
    "Panchmahal",
    "Patan",
    "Porbandar",
    "Rajkot",
    "Sabarkantha",
    "Surat",
    "Surendranagar",
    "Tapi",
    "Valsad",
    "Vadodara",
];
const RELIGIONS = [
    "Hindu",
    "Sikh",
    "Christian",
    "Jain",
    "Buddhism",
    "Islam",
    "Others",
];
const MARRIAGE_STATUS = ["Unmarried", "Widow", "Divorced"];
const IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png"];
const image_validation = (file) => {
    if (!file || !IMAGE_TYPES.includes(file.type) || file.size >= 1000000) {
        return false;
    } else {
        return true;
    }
};
const name_validation = (name) => {
    if (!ONLY_ALPHA_VALIDATOR.test(name.trim()) || name.trim().length < 3 || name.trim().length > 15) {
        return false;
    } else {
        return true;
    }
}
const age_validation = (age) => {
    if (
        !ONLY_NUMBER_VALIDATOR.test(age) ||
        age < 18 ||
        age > 100
    ) {
        return false;
    } else {
        return true;
    }
}
const address_validation = (line1, district) => {
    if (line1.trim().length < 5 ||
        line1.trim().length > 50 ||
        !DISTRICTS.includes(district)
    ) { return false; }
    else { return true; }
}

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
const detailsReducer = (state, action) => {
    switch (action.type) {
        // First name
        case "setFirstName":
            return { ...state, firstName: action.firstName };
        case "setFirstNameVal":
            if (
                !ONLY_ALPHA_VALIDATOR.test(state.firstName) ||
                !state.firstName.trim().length < 3
            ) {
                return { ...state, firstNameVal: false };
            } else {
                return { ...state, firstNameVal: true };
            }
        // Middle name
        case "setMiddleName":
            return { ...state, middleName: action.middleName };
        case "setMiddleNameVal":
            if (
                !ONLY_ALPHA_VALIDATOR.test(state.middleName) ||
                !state.middleName.trim().length < 3
            ) {
                return { ...state, middleNameVal: false };
            } else {
                return { ...state, middleNameVal: true };
            }
        // Last name
        case "setLastName":
            return { ...state, lastName: action.lastName };
        case "setLastNameVal":
            if (
                !ONLY_ALPHA_VALIDATOR.test(state.lastName) ||
                !state.lastName.trim().length < 3
            ) {
                return { ...state, lastNameVal: false };
            } else {
                return { ...state, lastNameVal: true };
            }
        // Age
        case "setAge":
            return { ...state, age: action.age };
        case "setAgeVal":
            if (
                !ONLY_NUMBER_VALIDATOR.test(state.age) ||
                state.age < 18 ||
                state.age > 100
            ) {
                return { ...state, ageVal: false };
            } else {
                return { ...state, ageVal: true };
            }
        // address
        case "setAddress":
            return { ...state, line1: action.line1, district: action.district };
        case "setAddressVal":
            if (
                state.line1.trim().length < 5 ||
                state.line1.trim().length > 50 ||
                !DISTRICTS.includes(state.district)
            ) {
                return { ...state, addressVal: false };
            } else {
                return { ...state, addressVal: true };
            }
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
};
const husbandAadharReducer = aadharReducer;
const wifeAadharReducer = aadharReducer;

function MarriageForm({ API }) {
    const NAVIGATE = useNavigate();
    const token = useSelector((state) => state.auth.token);
    useEffect(() => {
        if (!token) {
            NAVIGATE("/login");
        }
    }, [NAVIGATE, token]);

    const ME = useSelector(state => state.citizen.citizen);
    const dispatch = useDispatch();
    // Date of Marriage
    const [dateOfMarriage, setDateOfMarriage] = useState(new Date());
    // Place of Marriage
    const [placeOfMarriage, setPlaceOfMarriage] = useState("");
    const [placeOfMarriageVal, setPlaceOfMarriageVal] = useState(false);
    useEffect(() => {
        if (
            placeOfMarriage.trim().length <= 0 ||
            placeOfMarriage.trim().length > 20
        ) {
            setPlaceOfMarriageVal(false);
        } else {
            setPlaceOfMarriageVal(true);
        }
    }, [placeOfMarriage]);
    //Husband Signature
    const [husbandSign, setHusbandSign] = useState(null);
    const [husbandSignVal, setHusbandSignval] = useState(false);
    const [HusbandSignBASE, setHusbandSignBASE] = useState("");
    useEffect(() => {
        if (image_validation(husbandSign)) {
            const reader = new FileReader();
            reader.readAsDataURL(husbandSign);
            reader.onloadend = () => {
                setHusbandSignBASE(reader.result);
            };
            setHusbandSignval(true);
        } else {
            setHusbandSignval(false);
        }
    }, [husbandSign]);
    //Husband Birth Certificate
    const [husbandBirth, setHusbandBirth] = useState(null);
    const [husbandBirthVal, setHusbandBirthVal] = useState(false);
    const [husbandBirthBASE, setHusbandBirthBASE] = useState("");
    useEffect(() => {
        if (image_validation(husbandBirth)) {
            const reader = new FileReader();
            reader.readAsDataURL(husbandBirth);
            reader.onloadend = () => {
                setHusbandBirthBASE(reader.result);
            };
            setHusbandBirthVal(true);
        } else {
            setHusbandBirthVal(false);
        }
    }, [husbandBirth]);
    //Wife Signature
    const [wifeSign, setWifeSign] = useState(null);
    const [wifeSignVal, setWifeSignval] = useState(false);
    const [wifeSignBASE, setWifeSignBASE] = useState("");
    useEffect(() => {
        if (image_validation(wifeSign)) {
            const reader = new FileReader();
            reader.readAsDataURL(wifeSign);
            reader.onloadend = () => {
                setWifeSignBASE(reader.result);
            };
            setWifeSignval(true);
        } else {
            setWifeSignval(false);
        }
    }, [wifeSign]);
    //Wife Birth Certificate
    const [wifeBirth, setWifeBirth] = useState(null);
    const [wifeBirthVal, setWifeBirthVal] = useState(false);
    const [wifeBirthBASE, setWifeBirthBASE] = useState("");
    useEffect(() => {
        if (image_validation(wifeBirth)) {
            const reader = new FileReader();
            reader.readAsDataURL(wifeBirth);
            reader.onloadend = () => {
                setWifeBirthBASE(reader.result);
            };
            setWifeBirthVal(true);
        } else {
            setWifeBirthVal(false);
        }
    }, [wifeBirth]);

    //Witness1 Signature
    const [witness1FirstName, setWitness1FirstName] = useState("");
    const [witness1FirstNameVal, setWitness1FirstNameVal] = useState(false);
    useEffect(() => {
        if (name_validation(witness1FirstName)) {
            setWitness1FirstNameVal(true);
        } else {
            setWitness1FirstNameVal(false);
        }
    }, [witness1FirstName])

    const [witness1MiddleName, setWitness1MiddleName] = useState("");
    const [witness1MiddleNameVal, setWitness1MiddleNameVal] = useState(false);
    useEffect(() => {
        if (name_validation(witness1MiddleName)) {
            setWitness1MiddleNameVal(true);
        } else {
            setWitness1MiddleNameVal(false);
        }
    }, [witness1MiddleName])

    const [witness1LastName, setWitness1LastName] = useState("");
    const [witness1LastNameVal, setWitness1LastNameVal] = useState(false);
    useEffect(() => {
        if (name_validation(witness1LastName)) {
            setWitness1LastNameVal(true);
        } else {
            setWitness1LastNameVal(false);
        }
    }, [witness1LastName])

    const [witness1Age, setWitness1Age] = useState(0);
    const [witness1AgeVal, setWitness1AgeVal] = useState(false);
    useEffect(() => {
        if (age_validation(witness1Age)) {
            setWitness1AgeVal(true);
        } else {
            setWitness1AgeVal(false);
        }
    }, [witness1Age])
    const [witness1Address, setWitness1Address] = useState({ line1: "", district: "", val: false });
    useEffect(() => {
        if (address_validation(witness1Address.line1, witness1Address.district)) {
            setWitness1Address(prev => ({ ...prev, val: true }));
        } else {
            setWitness1Address(prev => ({ ...prev, val: false }));
        }
    }, [witness1Address.line1, witness1Address.district])
    const [witness1Sign, setWitness1Sign] = useState(null);
    const [witness1SignVal, setWitness1Signval] = useState(false);
    const [witness1SignBASE, setWitness1SignBASE] = useState("");
    useEffect(() => {
        if (image_validation(witness1Sign)) {
            const reader = new FileReader();
            reader.readAsDataURL(witness1Sign);
            reader.onloadend = () => {
                setWitness1SignBASE(reader.result);
            };
            setWitness1Signval(true);
        } else {
            setWitness1Signval(false);
        }
    }, [witness1Sign]);
    //Witness1 ID Proof
    const [witness1_IDProof, setWitness1_IDProof] = useState(null);
    const [witness1_IDProofVal, setWitness1_IDProofVal] = useState(false);
    const [witness1_IDProofBASE, setWitness1_IDProofBASE] = useState("");
    useEffect(() => {
        if (image_validation(witness1_IDProof)) {
            const reader = new FileReader();
            reader.readAsDataURL(witness1_IDProof);
            reader.onloadend = () => {
                setWitness1_IDProofBASE(reader.result);
            };
            setWitness1_IDProofVal(true);
        } else {
            setWitness1_IDProofVal(false);
        }
    }, [witness1_IDProof]);

    //Witness2 Signature
    const [witness2FirstName, setWitness2FirstName] = useState("");
    const [witness2FirstNameVal, setWitness2FirstNameVal] = useState(false);
    useEffect(() => {
        if (name_validation(witness2FirstName)) {
            setWitness2FirstNameVal(true);
        } else {
            setWitness2FirstNameVal(false);
        }
    }, [witness2FirstName])


    const [witness2MiddleName, setWitness2MiddleName] = useState("");
    const [witness2MiddleNameVal, setWitness2MiddleNameVal] = useState(false);
    useEffect(() => {
        if (name_validation(witness2MiddleName)) {
            setWitness2MiddleNameVal(true);
        } else {
            setWitness2MiddleNameVal(false);
        }
    }, [witness2MiddleName])


    const [witness2LastName, setWitness2LastName] = useState("");
    const [witness2LastNameVal, setWitness2LastNameVal] = useState(false);
    useEffect(() => {
        if (name_validation(witness2LastName)) {
            setWitness2LastNameVal(true);
        } else {
            setWitness2LastNameVal(false);
        }
    }, [witness2LastName])


    const [witness2Age, setWitness2Age] = useState(0);
    const [witness2AgeVal, setWitness2AgeVal] = useState(false);
    useEffect(() => {
        if (age_validation(witness2Age)) {
            setWitness2AgeVal(true);
        } else {
            setWitness2AgeVal(false);
        }
    }, [witness2Age])

    const [witness2Address, setWitness2Address] = useState({ line1: "", district: "", val: false });
    useEffect(() => {
        if (address_validation(witness2Address.line1, witness2Address.district)) {
            setWitness2Address(prev => ({ ...prev, val: true }));
        } else {
            setWitness2Address(prev => ({ ...prev, val: false }));
        }
    }, [witness2Address.line1, witness2Address.district])

    const [witness2Sign, setWitness2Sign] = useState(null);
    const [witness2SignVal, setWitness2Signval] = useState(false);
    const [witness2SignBASE, setWitness2SignBASE] = useState("");
    useEffect(() => {
        if (image_validation(witness2Sign)) {
            const reader = new FileReader();
            reader.readAsDataURL(witness2Sign);
            reader.onloadend = () => {
                setWitness2SignBASE(reader.result);
            };
            setWitness2Signval(true);
        } else {
            setWitness2Signval(false);
        }
    }, [witness2Sign]);
    //Witness2 ID Proof
    const [witness2_IDProof, setWitness2_IDProof] = useState(null);
    const [witness2_IDProofVal, setWitness2_IDProofVal] = useState(false);
    const [witness2_IDProofBASE, setWitness2_IDProofBASE] = useState("");
    useEffect(() => {
        if (image_validation(witness2_IDProof)) {
            const reader = new FileReader();
            reader.readAsDataURL(witness2_IDProof);
            reader.onloadend = () => {
                setWitness2_IDProofBASE(reader.result);
            };
            setWitness2_IDProofVal(true);
        } else {
            setWitness2_IDProofVal(false);
        }
    }, [witness2_IDProof]);

    // Husband's detials
    const [husbandAadhar, husbandAadharDispatch] = useReducer(
        husbandAadharReducer,
        {
            aadharNumber: "",
            aadharNumberVal: null,
            aadharOTP: { sent: null, msg: "", otp: "" },
            aadharVerification: { verified: null, msg: "" },
        }
    );
    const [husbandOTP, setHusbandOTP] = useState("");
    const [husbandOTPVal, setHusbandOTPVal] = useState(false);
    const [husbandAadharData, setHusbandAadharData] = useState(null);
    useEffect(() => {
        if (husbandAadharData) {
            husbandDetailsDispatch({
                type: "setFirstName",
                firstName: husbandAadharData.firstName,
            });
            husbandDetailsDispatch({ type: "setFirstNameVal", firstNameVal: true });
            husbandDetailsDispatch({
                type: "setMiddleName",
                middleName: husbandAadharData.middleName,
            });
            husbandDetailsDispatch({ type: "setMiddleNameVal", middleNameVal: true });
            husbandDetailsDispatch({
                type: "setLastName",
                lastName: husbandAadharData.lastName,
            });
            husbandDetailsDispatch({ type: "setLastNameVal", lastNameVal: true });
            husbandDetailsDispatch({
                type: "setAge",
                age:
                    new Date().getFullYear() -
                    new Date(husbandAadharData.DOB).getFullYear(),
            });
            husbandDetailsDispatch({ type: "setAgeVal", ageVal: true });
            husbandDetailsDispatch({
                type: "setAddress",
                line1: husbandAadharData.addressLine,
                district: husbandAadharData.district,
            });
            husbandDetailsDispatch({ type: "setAddressVal", addressVal: true });
        }
    }, [husbandAadharData]);
    useEffect(() => {
        if (
            !ONLY_NUMBER_VALIDATOR.test(husbandOTP) ||
            husbandOTP.trim().length !== 4
        ) {
            setHusbandOTPVal(false);
        } else {
            setHusbandOTPVal(true);
            axios
                .post(`${API}/citizen/verify-otp-for-aadhar`, {
                    otp: husbandAadhar.aadharOTP.otp,
                    clientOtp: husbandOTP,
                    aadhar: husbandAadharData,
                })
                .then((result) => {
                    const DATA = result.data;
                    if (DATA.err) {
                        husbandAadharDispatch({
                            type: "setAadharVerification",
                            verified: false,
                            msg: DATA.msg,
                        });
                    } else {
                        husbandAadharDispatch({
                            type: "setAadharVerification",
                            verified: true,
                            msg: DATA.msg,
                        });
                        setHusbandAadharData(DATA.data);
                    }
                });
        }
        // eslint-disable-next-line
    }, [husbandOTP, API]);
    const [husbandDetails, husbandDetailsDispatch] = useReducer(detailsReducer, {
        firstName: "",
        middleName: "",
        lastName: "",
        age: 0,
        religion: "",
        religionVal: false,
        line1: "",
        district: "",
        status: "",
        statusVal: false,
        signature: null,
        signatureBASE: null,
        signatureVal: false,
        birth: null,
        birthBASE: null,
        birthVal: false,
    });
    // Wife's Details
    const [wifeDetails, wifeDetailsDispatch] = useReducer(detailsReducer, {
        firstName: "",
        middleName: "",
        lastName: "",
        age: 0,
        religion: "",
        religionVal: false,
        line1: "",
        district: "",
        status: "",
        statusVal: false,
        signature: null,
        signatureBASE: null,
        signatureVal: false,
        birth: null,
        birthBASE: null,
        birthVal: false,
    });
    const [wifeAadhar, wifeAadharDispatch] = useReducer(wifeAadharReducer, {
        aadharNumber: "",
        aadharNumberVal: null,
        aadharOTP: { sent: null, msg: "", otp: "" },
        aadharVerification: { verified: null, msg: "" },
    });
    const [wifeOTP, setWifeOTP] = useState("");
    const [wifeOTPVal, setWifeOTPVal] = useState(false);
    const [wifeAadharData, setWifeAadharData] = useState(null);
    useEffect(() => {
        if (wifeAadharData) {
            wifeDetailsDispatch({
                type: "setFirstName",
                firstName: wifeAadharData.firstName,
            });
            wifeDetailsDispatch({
                type: "setMiddleName",
                middleName: wifeAadharData.middleName,
            });
            wifeDetailsDispatch({
                type: "setLastName",
                lastName: wifeAadharData.lastName,
            });
            wifeDetailsDispatch({
                type: "setAge",
                age:
                    new Date(wifeAadharData.DOB).getFullYear() - new Date().getFullYear(),
            });
            wifeDetailsDispatch({
                type: "setAddress",
                line1: wifeAadharData.addressLine,
                district: wifeAadharData.district,
            });
        }
    }, [wifeAadharData]);
    useEffect(() => {
        if (
            !ONLY_NUMBER_VALIDATOR.test(husbandOTP) ||
            husbandOTP.trim().length !== 4
        ) {
            setWifeOTPVal(false);
        } else {
            setWifeOTPVal(true);
            axios
                .post(`${API}/citizen/verify-otp-for-aadhar`, {
                    otp: wifeAadhar.aadharOTP.otp,
                    clientOtp: wifeOTP,
                    aadhar: wifeAadharData,
                })
                .then((result) => {
                    const DATA = result.data;
                    if (DATA.err) {
                        wifeAadharDispatch({
                            type: "setAadharVerification",
                            verified: false,
                            msg: DATA.msg,
                        });
                    } else {
                        wifeAadharDispatch({
                            type: "setAadharVerification",
                            verified: true,
                            msg: DATA.msg,
                        });
                        setWifeAadharData(DATA.data);
                    }
                });
        }
        // eslint-disable-next-line
    }, [wifeOTP, API]);

    // Priest Signature
    const [priestSign, setPriestSign] = useState(null);
    const [priestSignVal, setPriestSignVal] = useState(false);
    const [priestSignBASE, setPriestSignBASE] = useState("");
    useEffect(() => {
        if (image_validation(priestSign)) {
            const reader = new FileReader();
            reader.readAsDataURL(priestSign);
            reader.onloadend = () => {
                setPriestSignBASE(reader.result);
            };
            setPriestSignVal(true);
        } else {
            setPriestSignVal(false);
        }
    }, [priestSign]);
    // Marriage photo
    const [marriagePhoto1, setMarriagePhoto1] = useState(null);
    const [marriagePhoto1Val, setMarriagePhoto1Val] = useState(false);
    const [marriagePhoto1BASE, setMarriagePhoto1BASE] = useState("");
    useEffect(() => {
        if (image_validation(marriagePhoto1)) {
            const reader = new FileReader();
            reader.readAsDataURL(marriagePhoto1);
            reader.onloadend = () => {
                setMarriagePhoto1BASE(reader.result);
            };
            setMarriagePhoto1Val(true);
        } else {
            setMarriagePhoto1Val(false);
        }
    }, [marriagePhoto1]);
    const [marriagePhoto2, setMarriagePhoto2] = useState(null);
    const [marriagePhoto2Val, setMarriagePhoto2Val] = useState(false);
    const [marriagePhoto2BASE, setMarriagePhoto2BASE] = useState("");
    useEffect(() => {
        if (image_validation(marriagePhoto2)) {
            const reader = new FileReader();
            reader.readAsDataURL(marriagePhoto2);
            reader.onloadend = () => {
                setMarriagePhoto2BASE(reader.result);
            };
            setMarriagePhoto2Val(true);
        } else {
            setMarriagePhoto2Val(false);
        }
    }, [marriagePhoto2]);
    const [submitted, setSubmitted] = useState(false);
    const [submitAnswer, setSubmitAnswer] = useState({ err: false, msg: "" });

    // Functions
    const verify_husband_aadhar = () => {
        axios
            .post(`${API}/citizen/services-aadhar-verification`, {
                aadharNumber: husbandAadhar.aadharNumber,
            })
            .then((result) => {
                const DATA = result.data;
                if (DATA.err) {
                    husbandAadharDispatch({
                        type: "setAadharOTP",
                        sent: false,
                        msg: DATA.msg,
                        otp: "",
                    });
                } else {
                    husbandAadharDispatch({
                        type: "setAadharOTP",
                        sent: true,
                        msg: DATA.msg,
                        otp: DATA.data.otp,
                    });
                    setHusbandAadharData(DATA.data.aadhar);
                }
            });
    };
    const verify_wife_aadhar = () => {
        axios
            .post(`${API}/citizen/services-aadhar-verification`, {
                aadharNumber: wifeAadhar.aadharNumber,
            })
            .then((result) => {
                const DATA = result.data;
                if (DATA.err) {
                    wifeAadharDispatch({
                        type: "setAadharOTP",
                        sent: false,
                        msg: DATA.msg,
                        otp: "",
                    });
                } else {
                    wifeAadharDispatch({
                        type: "setAadharOTP",
                        sent: true,
                        msg: DATA.msg,
                        otp: DATA.data.otp,
                    });
                    setWifeAadharData(DATA.data.aadhar);
                }
            });
    };
    const submit_marriage_form = () => {
        const confirm = window.confirm("Are you sure to submit this form ? ");
        if (!confirm) {

        } else {
            const form = {
                dateOfMarriage,
                placeOfMarriage,
                district: husbandAadharData.district,

                husbandAadhar: husbandAadhar.aadharNumber,
                husbandName: `${husbandAadharData.firstName} ${husbandAadharData.middleName} ${husbandAadharData.lastName}`,
                husbandReligion: husbandDetails.religion,
                husbandStatus: husbandDetails.status,
                husbandBirth: husbandBirthBASE,
                husbandSign: HusbandSignBASE,

                wifeAadhar: wifeAadhar.aadharNumber,
                wifeName: `${wifeAadharData.firstName} ${wifeAadharData.middleName} ${wifeAadharData.lastName}`,
                wifeReligion: wifeDetails.religion,
                wifeStatus: wifeDetails.status,
                wifeBirth: wifeBirthBASE,
                wifeSign: wifeSignBASE,

                witness1FullName: `${witness1FirstName} ${witness1MiddleName} ${witness1LastName}`,
                witness1Address: `${witness1Address.line1} ${witness1Address.district}`,
                witness1ID: witness1_IDProofBASE,
                witness1Sign: witness1SignBASE,

                witness2FullName: ` ${witness2FirstName} ${witness2MiddleName} ${witness2LastName}`,
                witness2Address: `${witness2Address.line1} ${witness2Address.district}`,
                witness2ID: witness2_IDProofBASE,
                witness2Sign: witness2SignBASE,

                priestSign: priestSignBASE,
                marriagePhoto1: marriagePhoto1BASE,
                marriagePhoto2: marriagePhoto2BASE,

                appliedBy: ME._id
            }
            axios.post(`${API}/citizen/submit-marriage-form`, form)
                .then(result => {
                    const DATA = result.data;
                    if (DATA.err) {
                        setSubmitAnswer({ err: DATA.err, msg: DATA.msg });
                    } else {
                        dispatch(CITIZEN_ACTIONS.updateAppliedFor({ appliedFor: DATA.data.appliedFor }));
                        setSubmitted(true);
                        setSubmitAnswer({ err: DATA.err, msg: DATA.msg });
                        setTimeout(() => {
                            dispatch(CITIZEN_ACTIONS.setFilling({ filling: true }));
                            NAVIGATE(`/dashboard/applied/book-slot/${husbandAadharData.district}/${1}/${DATA.data.appliedFor}`);
                        }, 2000);
                    }
                });
        }
    }
    return (
        <div className="dashboard-marriage-form-container">
            <h3>Registration for Marriage Certificate</h3>
            {/* Basic Details  */}
            <div className="marriage-form-basic-section">
                <h5>Basic details</h5>
                <span>Date of Marriage</span>
                <DatePicker
                    onChange={setDateOfMarriage}
                    format="MM-dd-yyyy"
                    maxDate={new Date()}
                    value={dateOfMarriage}
                />
                <span>
                    Note: Marriage certificate will be issued from the address mentioned
                    in husband's aadhar card
                </span>
                <input
                    type="text"
                    onChange={(e) => setPlaceOfMarriage(e.target.value)}
                    placeholder="Place Of Marriage"
                ></input>
                {!placeOfMarriageVal && <span>Max 20 characters allowed</span>}
            </div>
            {/* Husband Details  */}
            {placeOfMarriageVal && (
                <div className="marriage-form-husband-section">
                    <h5>Husband details</h5>
                    <input
                        disabled={husbandAadhar.aadharVerification.verified}
                        type="text"
                        placeholder="Husband's aadhar number"
                        onChange={(e) => {
                            husbandAadharDispatch({
                                type: "setAadhar",
                                aadharNumber: e.target.value,
                            });
                            husbandAadharDispatch({ type: "setAadharVal" });
                        }}
                    ></input>
                    {husbandAadhar.aadharNumberVal &&
                        !husbandAadhar.aadharVerification.verified && (
                            <button onClick={verify_husband_aadhar}>Verify</button>
                        )}
                    {husbandAadhar.aadharOTP.sent !== null &&
                        !husbandAadhar.aadharVerification.verified && (
                            <span>{husbandAadhar.aadharOTP.msg}</span>
                        )}
                    {husbandAadhar.aadharOTP.sent &&
                        !husbandAadhar.aadharVerification.verified && (
                            <div>
                                <span>{husbandAadhar.aadharOTP.msg}</span>
                                <input
                                    type="text"
                                    placeholder="OTP"
                                    onChange={(e) => setHusbandOTP(e.target.value)}
                                ></input>
                                {!husbandOTPVal && <span>Enter 4 digit OTP</span>}
                            </div>
                        )}
                    {husbandAadhar.aadharVerification.verified !== null && (
                        <span>{husbandAadhar.aadharVerification.msg}</span>
                    )}
                    {husbandAadhar.aadharVerification.verified && (
                        <>
                            <div>
                                <span>
                                    {husbandAadharData.firstName} {husbandAadharData.middleName}{" "}
                                    {husbandAadharData.lastName}
                                </span>
                                <span>
                                    {husbandDetails.age} {husbandDetails.line1}{" "}
                                    {husbandDetails.district}
                                </span>
                            </div>

                            <div>
                                <select
                                    defaultValue={-1}
                                    onChange={(e) => {
                                        husbandDetailsDispatch({
                                            type: "setReligion",
                                            religion: e.target.value,
                                        });
                                        husbandDetailsDispatch({ type: "setReligionVal" });
                                    }}
                                >
                                    <option disabled value={-1}>
                                        Husband Religion
                                    </option>
                                    {RELIGIONS.map((r) => (
                                        <option value={r} key={r}>
                                            {r}
                                        </option>
                                    ))}
                                </select>
                                <select
                                    defaultValue={-1}
                                    onChange={(e) => {
                                        husbandDetailsDispatch({
                                            type: "setStatus",
                                            status: e.target.value,
                                        });
                                        husbandDetailsDispatch({ type: "setStatusVal" });
                                    }}
                                >
                                    <option disabled value={-1}>
                                        Husband status at the time of marriage
                                    </option>
                                    {MARRIAGE_STATUS.map((status) => (
                                        <option value={status} key={status}>
                                            {status}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </>
                    )}
                    {husbandAadhar.aadharVerification.verified &&
                        husbandDetails.religionVal &&
                        husbandDetails.statusVal && (
                            <>
                                <h6>.jpeg, .jpg, .png with less than 1MB are allowed</h6>
                                <span>Upload signature image</span>
                                <input
                                    accept="image/*"
                                    type="file"
                                    onChange={(e) => setHusbandSign(e.target.files[0])}
                                ></input>
                                {husbandSignVal && (
                                    <img
                                        style={{ width: "10vw", height: "20vh" }}
                                        src={HusbandSignBASE}
                                        alt="img"
                                    />
                                )}
                                <span>Upload birth certificate</span>
                                <input
                                    accept="image/*"
                                    type="file"
                                    onChange={(e) => setHusbandBirth(e.target.files[0])}
                                ></input>
                                {husbandBirthVal && (
                                    <img
                                        style={{ width: "10vw", height: "20vh" }}
                                        src={husbandBirthBASE}
                                        alt="img"
                                    />
                                )}
                            </>
                        )}
                </div>
            )}
            {/* Wife Details  */}
            {husbandAadhar.aadharVerification.verified &&
                husbandDetails.statusVal &&
                husbandDetails.religionVal &&
                husbandBirthVal &&
                husbandSignVal && (
                    <div className="marriage-form-wife-section">
                        <h5>Wife details</h5>
                        <input
                            disabled={wifeAadhar.aadharVerification.verified}
                            type="text"
                            placeholder="Wife's aadhar number"
                            onChange={(e) => {
                                wifeAadharDispatch({
                                    type: "setAadhar",
                                    aadharNumber: e.target.value,
                                });
                                wifeAadharDispatch({ type: "setAadharVal" });
                            }}
                        ></input>
                        {wifeAadhar.aadharNumberVal &&
                            !wifeAadhar.aadharVerification.verified && (
                                <button onClick={verify_wife_aadhar}>Verify</button>
                            )}
                        {wifeAadhar.aadharOTP.sent !== null &&
                            !wifeAadhar.aadharVerification.verified && (
                                <span>{wifeAadhar.aadharOTP.msg}</span>
                            )}
                        {wifeAadhar.aadharOTP.sent &&
                            !wifeAadhar.aadharVerification.verified && (
                                <div>
                                    <span>{wifeAadhar.aadharOTP.msg}</span>
                                    <input
                                        type="text"
                                        placeholder="OTP"
                                        onChange={(e) => setWifeOTP(e.target.value)}
                                    ></input>
                                    {!wifeOTPVal && <span>Enter 4 digit OTP</span>}
                                </div>
                            )}
                        {wifeAadhar.aadharVerification.verified !== null && (
                            <span>{wifeAadhar.aadharVerification.msg}</span>
                        )}
                        {wifeAadhar.aadharVerification.verified && (
                            <>
                                <div>
                                    <span>
                                        {wifeAadharData.firstName} {wifeAadharData.middleName}{" "}
                                        {wifeAadharData.lastName}
                                    </span>
                                    <span>
                                        {wifeDetails.age} {wifeDetails.line1} {wifeDetails.district}
                                    </span>
                                </div>

                                <div>
                                    <select
                                        defaultValue={-1}
                                        onChange={(e) => {
                                            wifeDetailsDispatch({
                                                type: "setReligion",
                                                religion: e.target.value,
                                            });
                                            wifeDetailsDispatch({ type: "setReligionVal" });
                                        }}
                                    >
                                        <option disabled value={-1}>
                                            Wife Religion
                                        </option>
                                        {RELIGIONS.map((r) => (
                                            <option value={r} key={r}>
                                                {r}
                                            </option>
                                        ))}
                                    </select>
                                    <select
                                        defaultValue={-1}
                                        onChange={(e) => {
                                            wifeDetailsDispatch({
                                                type: "setStatus",
                                                status: e.target.value,
                                            });
                                            wifeDetailsDispatch({ type: "setStatusVal" });
                                        }}
                                    >
                                        <option disabled value={-1}>
                                            Wife status at the time of marriage
                                        </option>
                                        {MARRIAGE_STATUS.map((status) => (
                                            <option value={status} key={status}>
                                                {status}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </>
                        )}
                        {wifeAadhar.aadharVerification.verified &&
                            wifeDetails.religionVal &&
                            wifeDetails.statusVal && (
                                <>
                                    <h6>.jpeg, .jpg, .png with less than 1MB are allowed</h6>
                                    <span>Upload signature image</span>
                                    <input
                                        accept="image/*"
                                        type="file"
                                        onChange={(e) => setWifeSign(e.target.files[0])}
                                    ></input>
                                    {wifeSignVal && (
                                        <img
                                            style={{ width: "10vw", height: "20vh" }}
                                            src={wifeSignBASE}
                                            alt="img"
                                        />
                                    )}
                                    <span>Upload birth certificate</span>
                                    <input
                                        accept="image/*"
                                        type="file"
                                        onChange={(e) => setWifeBirth(e.target.files[0])}
                                    ></input>
                                    {wifeBirthVal && (
                                        <img
                                            style={{ width: "10vw", height: "20vh" }}
                                            src={wifeBirthBASE}
                                            alt="img"
                                        />
                                    )}
                                </>
                            )}
                    </div>
                )}
            {/* Witness 1 Details  */}
            {husbandAadhar.aadharVerification.verified &&
                husbandDetails.statusVal &&
                husbandDetails.religionVal &&
                wifeAadhar.aadharVerification.verified &&
                wifeDetails.statusVal &&
                wifeDetails.religionVal &&
                wifeBirthVal &&
                wifeSignVal && (
                    <div>
                        <h5>Witness 1 details</h5>
                        <div>
                            <input
                                type="text"
                                placeholder="First name"
                                onChange={(e) => {
                                    setWitness1FirstName(e.target.value);
                                }}
                            ></input>
                            {!witness1FirstNameVal && (
                                <span>Please use at least 3 letters</span>
                            )}
                            <input
                                type="text"
                                placeholder="Middle name"
                                onChange={(e) => {
                                    setWitness1MiddleName(e.target.value);
                                }}
                            ></input>
                            {!witness1MiddleNameVal && (
                                <span>Please use at least 3 letters</span>
                            )}
                            <input
                                type="text"
                                placeholder="Last name"
                                onChange={(e) => {
                                    setWitness1LastName(e.target.value);
                                }}
                            ></input>
                            {!witness1LastNameVal && (
                                <span>Please use at least 3 letters</span>
                            )}
                        </div>
                        {witness1FirstNameVal &&
                            witness1MiddleNameVal &&
                            witness1LastNameVal && (
                                <div>
                                    <input
                                        type="Number"
                                        max={100}
                                        min={18}
                                        placeholder="Age"
                                        onChange={(e) => {
                                            setWitness1Age(e.target.value);
                                        }}
                                    ></input>
                                    {!witness1AgeVal && (
                                        <span>Witness1 at least 18 years old.</span>
                                    )}
                                    <input
                                        type="text"
                                        placeholder="Address line"
                                        onChange={(e) => {
                                            setWitness1Address(prev => ({ ...prev, line1: e.target.value }))
                                        }}
                                    ></input>
                                    <select
                                        defaultValue={-1}
                                        onChange={(e) =>
                                            setWitness1Address(prev => ({ ...prev, district: e.target.value }))
                                        }
                                    >
                                        <option disabled value={-1}>
                                            District
                                        </option>
                                        {DISTRICTS.map((district) => (
                                            <option key={district} value={district}>
                                                {district}
                                            </option>
                                        ))}
                                    </select>
                                    {!witness1Address.val && (
                                        <span>
                                            Please use at least 5 letters and select valid district{" "}
                                        </span>
                                    )}
                                </div>
                            )}
                        {witness1FirstNameVal &&
                            witness1MiddleNameVal &&
                            witness1LastNameVal &&
                            witness1Address.val &&
                            witness1AgeVal && (
                                <>
                                    <h6>.jpeg, .jpg, .png with less than 1MB are allowed</h6>
                                    <span>Upload signature image</span>
                                    <input
                                        accept="image/*"
                                        type="file"
                                        onChange={(e) => setWitness1Sign(e.target.files[0])}
                                    ></input>
                                    {witness1SignVal && (
                                        <img
                                            style={{ width: "10vw", height: "20vh" }}
                                            src={witness1SignBASE}
                                            alt="img"
                                        />
                                    )}
                                    <span>Upload ID proof</span>
                                    <input
                                        accept="image/*"
                                        type="file"
                                        onChange={(e) => setWitness1_IDProof(e.target.files[0])}
                                    ></input>
                                    {witness1_IDProofVal && (
                                        <img
                                            style={{ width: "10vw", height: "20vh" }}
                                            src={witness1_IDProofBASE}
                                            alt="img"
                                        />
                                    )}
                                </>
                            )}
                    </div>
                )}
            {/* Witness 2 Details  */}
            {witness1Address.val &&
                witness1AgeVal &&
                witness1FirstNameVal &&
                witness1MiddleNameVal &&
                witness1LastNameVal &&
                witness1SignVal &&
                witness1_IDProofVal && (
                    <div>
                        <h5>Witness 2 details</h5>
                        <div>
                            <input
                                type="text"
                                placeholder="First name"
                                onChange={(e) => {
                                    setWitness2FirstName(e.target.value);
                                }}
                            ></input>
                            {!witness2FirstNameVal && (
                                <span>Please use at least 3 letters</span>
                            )}
                            <input
                                type="text"
                                placeholder="Middle name"
                                onChange={(e) => {
                                    setWitness2MiddleName(e.target.value);
                                }}
                            ></input>
                            {!witness2MiddleNameVal && (
                                <span>Please use at least 3 letters</span>
                            )}
                            <input
                                type="text"
                                placeholder="Last name"
                                onChange={(e) => {
                                    setWitness2LastName(e.target.value);
                                }}
                            ></input>
                            {!witness2LastNameVal && (
                                <span>Please use at least 3 letters</span>
                            )}
                        </div>
                        {witness2FirstNameVal &&
                            witness2MiddleNameVal &&
                            witness2LastNameVal && (
                                <div>
                                    <input
                                        type="Number"
                                        max={100}
                                        min={18}
                                        placeholder="Age"
                                        onChange={(e) => {
                                            setWitness2Age(e.target.value);
                                        }}
                                    ></input>
                                    {!witness2AgeVal && (
                                        <span>Witness1 at least 18 years old.</span>
                                    )}
                                    <input
                                        type="text"
                                        placeholder="Address line"
                                        onChange={(e) => {
                                            setWitness2Address(prev => ({ ...prev, line1: e.target.value }))
                                        }}
                                    ></input>
                                    <select
                                        defaultValue={-1}
                                        onChange={(e) =>
                                            setWitness2Address(prev => ({ ...prev, district: e.target.value }))
                                        }
                                    >
                                        <option disabled value={-1}>
                                            District
                                        </option>
                                        {DISTRICTS.map((district) => (
                                            <option key={district} value={district}>
                                                {district}
                                            </option>
                                        ))}
                                    </select>
                                    {!witness2Address.val && (
                                        <span>
                                            Please use at least 5 letters and select valid district{" "}
                                        </span>
                                    )}
                                </div>
                            )}
                        {witness2FirstNameVal &&
                            witness2MiddleNameVal &&
                            witness2LastNameVal &&
                            witness2Address.val &&
                            witness2AgeVal && (
                                <>
                                    <h6>.jpeg, .jpg, .png with less than 1MB are allowed</h6>
                                    <span>Upload signature image</span>
                                    <input
                                        accept="image/*"
                                        type="file"
                                        onChange={(e) => setWitness2Sign(e.target.files[0])}
                                    ></input>
                                    {witness2SignVal && (
                                        <img
                                            style={{ width: "10vw", height: "20vh" }}
                                            src={witness2SignBASE}
                                            alt="img"
                                        />
                                    )}
                                    <span>Upload ID proof</span>
                                    <input
                                        accept="image/*"
                                        type="file"
                                        onChange={(e) => setWitness2_IDProof(e.target.files[0])}
                                    ></input>
                                    {witness2_IDProofVal && (
                                        <img
                                            style={{ width: "10vw", height: "20vh" }}
                                            src={witness2_IDProofBASE}
                                            alt="img"
                                        />
                                    )}
                                </>
                            )}
                    </div>
                )}
            {witness2AgeVal &&
                witness2FirstNameVal &&
                witness2MiddleNameVal &&
                witness2LastNameVal &&
                witness2Address.val &&
                witness2SignVal &&
                witness2_IDProofVal && (
                    <div>
                        <h5>Other documents and priest signature</h5>
                        <h6>.jpeg, .jpg, .png with less than 1MB are allowed</h6>
                        <div>
                            <span>Priest signature</span>
                            <input
                                accept="image/*"
                                type="file"
                                onChange={(e) => setPriestSign(e.target.files[0])}
                            ></input>
                            {priestSignVal && (
                                <img
                                    style={{ width: "10vw", height: "20vh" }}
                                    src={priestSignBASE}
                                    alt="img"
                                />
                            )}
                        </div>
                        <div>
                            <span>Marriage photo 1 </span>
                            <input
                                accept="image/*"
                                type="file"
                                onChange={(e) => setMarriagePhoto1(e.target.files[0])}
                            ></input>
                            {marriagePhoto1Val && (
                                <img
                                    style={{ width: "10vw", height: "20vh" }}
                                    src={marriagePhoto1BASE}
                                    alt="img"
                                />
                            )}
                        </div>
                        <div>
                            <span>Marriage photo 2 </span>
                            <input
                                accept="image/*"
                                type="file"
                                onChange={(e) => setMarriagePhoto2(e.target.files[0])}
                            ></input>
                            {marriagePhoto2Val && (
                                <img
                                    style={{ width: "10vw", height: "20vh" }}
                                    src={marriagePhoto2BASE}
                                    alt="img"
                                />
                            )}
                        </div>
                    </div>
                )}
            {
                priestSignVal && marriagePhoto1Val && marriagePhoto2Val &&
                <div>
                    <button onClick={submit_marriage_form}>Submit</button>
                </div>
            }
            {submitted &&
                <div>
                    <span>{submitAnswer.msg}</span>
                </div>
            }
        </div>
    );
}

export default MarriageForm;
