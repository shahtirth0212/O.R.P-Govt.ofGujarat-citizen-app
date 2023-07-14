import React, { useEffect } from 'react'
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

function UpdateContainer() {
    const NAVIGATE = useNavigate();
    const token = useSelector(state => state.auth.token);
    useEffect(() => {
        if (!token) {
            NAVIGATE("/login");
        }
    }, [NAVIGATE, token]);
    return (
        <div>UpdateContainer</div>
    )
}

export default UpdateContainer