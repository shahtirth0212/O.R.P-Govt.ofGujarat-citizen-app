import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

function AppliedContainer({ API }) {
    const ME = useSelector(state => state.citizen.citizen);
    const NAVIGATE = useNavigate();
    const token = useSelector(state => state.auth.token);

    const [appliedData, setAppliedData] = useState([]);

    useEffect(() => {
        if (!token) {
            NAVIGATE("/login");
        } else {
            axios.post(`${API}/citizen/get-applied-data`, { citizenId: ME._id })
                .then(result => {
                    const DATA = result.data;
                    setAppliedData(DATA.data.appliedData);
                });
        }
        //eslint-disable-next-line
    }, []);
    return (
        <div>
            {appliedData.map(data => {
                return (
                    <div key={data.applied._id}>
                        <h2>{data.applied.holders[0].firstName}</h2>
                        <h3>verified: {data.applied.verified ? "yes" : "no"}</h3>
                        <h3>{data.slot === null ? "Book a slot" : data.slot.date.toDateString()}</h3>
                    </div>
                )
            })}
        </div>
    )
}

export default AppliedContainer