import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useParams } from 'react-router-dom'
import ConfirmDialog from '../../UI/ConfirmDialog';
import { CITIZEN_ACTIONS } from '../../../redux-store/slices/citizen-slice';

function BookSlot({ API }) {
    const NAVIGATE = useNavigate();
    const token = useSelector(state => state.auth.token);
    const ME = useSelector(state => state.citizen.filling);
    const PARAMS = useParams();
    const [availableSlots, setAvailableSlots] = useState([]);
    useEffect(() => {
        if (!token || !ME) {
            console.log("----------- Book slot Container")
            console.log(ME)
            NAVIGATE("/login");
        } else {
            axios.get(`${API}/citizen/get-free-slots/${PARAMS.service}/${PARAMS.district}`)
                .then(result => {
                    const DATA = result.data;
                    setAvailableSlots(DATA.data.slots);

                })
        }
        // eslint - disable - next - line
    }, [API, PARAMS, NAVIGATE, token, ME]);
    const dispatch = useDispatch();
    const [showDialog, setShowDialog] = useState(false);
    const [confirm, setConfirm] = useState(false);
    const [selectedSlot, setSelectedSlot] = useState({});
    const [slotDate, setSlotDate] = useState("");

    const [slotMsg, setSlotMsg] = useState("");
    // const [slotRes, setSlotRes] = useState(false);
    const book_slot = (date, hours, slot) => {
        setSelectedSlot(slot);
        setSlotDate(`Book slot on ${date} at ${hours}`);
        setShowDialog(true);
    }
    useEffect(() => {
        if (confirm) {
            confirm_book_slot();
            setShowDialog(false);
            setConfirm(false);
        } else {
            setSelectedSlot({});
            setShowDialog(false);
            setConfirm(false);
        }
        // eslint-disable-next-line
    }, [confirm]);
    const confirm_book_slot = async () => {
        const response = await
            axios.post(`${API}/citizen/book-slot`,
                { service: PARAMS.service, district: PARAMS.district, slot: selectedSlot, appliedId: PARAMS.appliedId }
            );
        console.log(response)
        const DATA = response.data;
        if (DATA.data.err) {
            setSlotMsg(DATA.data.msg);
        } else {
            setSlotMsg(DATA.data.msg);
            setTimeout(() => {
                dispatch(CITIZEN_ACTIONS.setFilling({ filling: false }));
                NAVIGATE("/dashboard");
            }, 5000);
        }
    }
    return (
        <>
            {showDialog && <ConfirmDialog msg={slotDate} getConfirm={setConfirm} />}
            <div>
                {availableSlots.map(slot => {
                    slot.date = new Date(slot.date);
                    return (
                        <button key={slot.date} onClick={e => book_slot(slot.date.toDateString(), slot.hours, slot)} >
                            {slot.date.toDateString()}  {slot.hours}
                        </button>
                    )
                })}
                <Link to='/dashboard'><button onClick={() => { dispatch(CITIZEN_ACTIONS.setFilling({ filling: false })); }}>Book later</button></Link>
            </div>
            {
                <span>{slotMsg}</span>
            }
        </>
    )

}

export default BookSlot