import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { CITIZEN_ACTIONS } from '../../redux-store/slices/citizen-slice';
import ConfirmDialog from '../UI/ConfirmDialog';

function AppliedContainer({ API }) {
    const ME = useSelector(state => state.citizen.citizen);
    const filling = useSelector(state => state.citizen.filling);
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
                    console.log(DATA.data.appliedData)
                });
        }
        //eslint-disable-next-line
    }, []);
    const [showDialog, setShowDialog] = useState(false);
    const [confirm, setConfirm] = useState(false);
    const dispatch = useDispatch();
    const [joiningSlot, setJoiningSlot] = useState({});
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
        const res = await axios.post(`${API}/citizen/try-to-join`, { slot: joiningSlot });
        if (res.data.err) {
            setJoiningSlot({});
            setShowDialog(false);
            setConfirm(false);
            alert(res.data.msg);
        } else {
            setShowDialog(false);
            setConfirm(false);
            alert(res.data.msg);
            // do something
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
                                            }}>send join request</button> : <span>Available on booked time</span>}</td>
                                            :
                                            <span>Book a slot first</span>
                                        }
                                        <td>{data.applied.verified ? "yes" : "no"}</td>
                                        <td>{data.applied.issued ? <button>Email the certificate</button> : "In progress"}</td>
                                    </tr>

                                )
                            }) : <span>No data found</span>
                    }

                </tbody>
            </table>
        </div>
    )
}

export default AppliedContainer