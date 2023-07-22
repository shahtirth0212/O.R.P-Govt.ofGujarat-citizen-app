import axios from 'axios';
import React, { useContext, useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { CITIZEN_ACTIONS } from '../../redux-store/slices/citizen-slice';
import ConfirmDialog from '../UI/ConfirmDialog';
import { SocketContext } from '../../context/socketContext';
import { useCallback } from 'react';
function AppliedContainer({ API }) {
    const socket = useContext(SocketContext);
    const NAVIGATE = useNavigate();
    const token = useSelector(state => state.auth.token);
    useEffect(() => {
        if (!token) {
            NAVIGATE('/');
        }
    }, [NAVIGATE, token])
    const ME = useSelector(state => state.citizen.citizen);
    const [waiting, setWaiting] = useState(false);
    const [appliedData, setAppliedData] = useState([]);
    const dispatch = useDispatch();
    useEffect(() => {
        if (!token) {
            NAVIGATE("/login");
        } else {
            axios.post(`${API}/citizen/get-applied-data`, { citizenId: ME._id })
                .then(result => {
                    const DATA = result.data;
                    setAppliedData(DATA.data.appliedData);
                    // console.log(DATA.data.appliedData)
                });
        }
    }, [API, ME._id, NAVIGATE, token])

    // Socket functions
    // const handleOtherInProgress = useCallback(() => {
    //     setWaiting(false);
    //     window.alert("Other verification process ongoing... Please try again after 5 minutes, Your verification will be done during allocated time slot only");
    // }, [])
    // useEffect(() => {
    //     socket.on('other-verification-in-progress', handleOtherInProgress);
    //     socket.on("callUser", (data) => {
    //         NAVIGATE('/verification');
    //         dispatch(CITIZEN_ACTIONS.setCurrent({ current: data }));

    //     })
    // }, [socket]);


    // Other functions
    const [showDialog, setShowDialog] = useState(false);
    const [confirm, setConfirm] = useState(false);
    const [joiningSlot, setJoiningSlot] = useState({});
    const [holder, setHolder] = useState('');


    const get_slot = async (applied) => {
        const response = await axios.post(`${API}/citizen/get-district-certificate`, { district: applied.district, certificate: applied.certificateId })
        const DATA = response.data;
        if (DATA.err) {
            alert(`${DATA.msg}`)
        } else {
            dispatch(CITIZEN_ACTIONS.setFilling({ filling: true }));
            NAVIGATE(`book-slot/${DATA.data.district}/${DATA.data.service}/${applied._id}`);
        }
    }

    const check_today = (time, date) => {
        const [start, end] = time.split("-");
        if (new Date() > new Date(date + ` ${start}`) && new Date() < new Date(date + ` ${end}`)) {
            return true;
        } else {
            return false;
        }
    };

    const send_join_req = async () => {
        setWaiting(true)
        const res = await axios.post(`${API}/citizen/try-to-join`, { slot: joiningSlot });
        if (res.data.err) {
            setWaiting(false)
            setJoiningSlot({});
            setShowDialog(false);
            setConfirm(false);
            alert(res.data.msg);
        } else {
            setShowDialog(false);
            setConfirm(false);
            const callId = res.data.data.callId;
            setWaiting(true);
            socket.emit('citizen-ready-to-join', { citizen: socket.id, clerk: callId, slot: joiningSlot });
            NAVIGATE('/verification')
        }
    }
    useEffect(() => {
        if (confirm) {
            send_join_req();
        } else {
            setJoiningSlot({});
            setShowDialog(false);
            setConfirm(false);
        }
        // eslint-disable-next-line
    }, [confirm]);
    return (
        <div>
            {waiting && <h1>Please wait...</h1>}
            {showDialog &&
                <ConfirmDialog
                    msg="Gather the needed documents and keep your mic and camera on during whole process, Press confirm once your are ready"
                    getConfirm={setConfirm}
                />
            }
            <table className="table">
                <thead className="thead-dark">
                    <tr>
                        <th scope="col">No.</th>
                        <th scope="col">Form</th>
                        <th scope="col">Holder</th>
                        <th scope="col">Slot booked (24h)</th>
                        <th scope="col">Join for verification</th>
                        <th scope="col">Verified</th>
                        <th scope="col">Get certificate</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        appliedData.length > 0 ?
                            appliedData.map((data, i = 0) => {
                                i++;
                                return (
                                    <tr key={data.applied._id}>
                                        <th scope="row">{i}</th>
                                        <th scope="row">{data.form}</th>
                                        <td>{data.applied.holders[0].firstName} {data.applied.holders[1] && data.applied.holders[1].name}</td>
                                        <td>{data.slot === null ? <button onClick={e => get_slot(data.applied)}>Book a slot</button> : new Date(data.slot.date).toDateString() + "   " + data.hours}</td>
                                        {data.slot ?
                                            <td>{check_today(data.hours, data.slot.date) ? <button onClick={e => {
                                                setJoiningSlot(data.slot)
                                                setShowDialog(true)
                                                setHolder(data.applied.holders[0].firstName)
                                            }} disabled={waiting}>send join request</button> : <span>Available on booked time</span>}</td>
                                            :
                                            <td>Book a slot first</td>
                                        }
                                        <td>{data.applied.verified ? "yes" : "no"}</td>
                                        <td>{data.applied.issued ? <button>Email the certificate</button> : "In progress"}</td>
                                    </tr>

                                )
                            }) : <tr>
                                <td>No data found</td>
                            </tr>
                    }

                </tbody>
            </table>
        </div>
    )
}

export default AppliedContainer