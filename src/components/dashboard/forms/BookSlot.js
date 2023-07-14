import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { Link, useNavigate, useParams } from 'react-router-dom'

function BookSlot({ API }) {
    const NAVIGATE = useNavigate();
    const token = useSelector(state => state.auth.token);
    useEffect(() => {
        if (!token) {
            NAVIGATE("/login");
        }
    }, [NAVIGATE, token]);
    const PARAMS = useParams();
    const [availableSlots, setAvailableSlots] = useState([]);
    useEffect(() => {
        axios.get(`${API}/citizen/get-free-slots/${PARAMS.service}/${PARAMS.district}`)
            .then(result => {
                const DATA = result.data;
                setAvailableSlots(DATA.data.slots);
            })
        // eslint-disable-next-line
    }, [])
    return (
        <div>
            {availableSlots.map(slot => {
                slot.date = new Date(slot.date);
                return (
                    <button key={slot.date}>
                        {slot.date.toDateString()}  {slot.hours}
                    </button>
                )
            })}
            <Link to='/dashboard'><button>Book later</button></Link>
        </div>
    )
}

export default BookSlot