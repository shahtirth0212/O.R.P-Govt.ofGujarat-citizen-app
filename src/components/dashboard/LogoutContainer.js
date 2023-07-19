import React, { useEffect } from 'react'
import 'react-time-picker/dist/TimePicker.css';
import 'react-clock/dist/Clock.css';
import TimePicker from 'react-time-picker';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
function LogoutContainer() {
    const NAVIGATE = useNavigate();
    const token = useSelector(state => state.auth.token);
    useEffect(() => {
        if (!token) {
            NAVIGATE("/login");
        }
    }, [NAVIGATE, token]);
    const [value, onChange] = React.useState('00:00');
    return (
        <div>
            <TimePicker disableClock={true} onChange={onChange} value={value} />
            <h1 style={{ color: "black" }}>{value}</h1>
        </div>
    )
}

export default LogoutContainer