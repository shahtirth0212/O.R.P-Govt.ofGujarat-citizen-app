import React, { useCallback, useContext, useEffect, useRef, useState } from 'react'
// import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom';
import { SocketContext } from '../../context/socketContext';
import { CITIZEN_ACTIONS } from '../../redux-store/slices/citizen-slice';
import Peer from 'simple-peer';
import axios from 'axios';
let clerk;
let s;
function VerificationWindow({ API }) {
    const current = useSelector(state => state.citizen.current);
    // const CLERK = current.clerk_socket;
    // const ME = current.req.citizen_socket;
    const navigate = useNavigate();
    const socket = useContext(SocketContext);
    const [callerSignal, setCallerSignal] = useState()
    const dispatch = useDispatch();
    // const [me, setMe] = useState("")
    const [receivingCall, setReceivingCall] = useState(false)
    // const [caller, setCaller] = useState("")
    const [callAccepted, setCallAccepted] = useState(false)
    // const [idToCall, setIdToCall] = useState("")
    // const [name, setName] = useState("")

    // const [callerSignal, setCallerSignal] = useState()
    // const [callEnded, setCallEnded] = useState(false)
    const NAVIGATE = useNavigate();
    const [stream, setStream] = useState()
    const myVideo = useRef()
    const userVideo = useRef()
    const connectionRef = useRef()
    useEffect(() => { s = stream }, [stream])
    const handleOtherInProgress = useCallback(() => {
        // setWaiting(false);
        dispatch(CITIZEN_ACTIONS.setCurrent({ current: {} }));
        window.alert("Other verification process ongoing... Please try again after 5 minutes, Your verification will be done during allocated time slot only");
        NAVIGATE('/dashboard');
    }, [])
    useEffect(() => {
        socket.on('other-verification-in-progress', handleOtherInProgress);
        socket.on("callUser", (data) => {
            console.log(data);
            // dispatch(CITIZEN_ACTIONS.setCurrent({ current: data }));
            clerk = data;
            setCallerSignal(data.signal)
            setReceivingCall(true)
        })

        socket.on('end-call', async () => {
            const ans = await axios.post(`${API}/citizen/set-joined`, current)
            s.getTracks().forEach(track => {
                track.stop();
            });
            connectionRef.current = null;
            myVideo.current.srcObject = null;
            navigate('/dashboard')
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    const join = () => {
        navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
            setStream(stream)
            myVideo.current.srcObject = stream
            setCallAccepted(true);
            const peer = new Peer({
                initiator: false,
                trickle: false,
                stream: stream
            });
            peer.on("signal", (data) => {
                console.log(data)
                socket.emit("answerCall", { signal: data, to: clerk.from })
            })
            peer.on("stream", (stream) => {
                console.log(stream)
                userVideo.current.srcObject = stream
            })
            peer.signal(callerSignal)
            connectionRef.current = peer
        });
    }
    // const end_call = () => {

    // }
    return (
        <div>
            {receivingCall && !callAccepted && <button onClick={join}>start</button>}
            <video muted autoPlay ref={myVideo} style={{ width: "300px" }} />
            <video autoPlay ref={userVideo} style={{ width: "300px" }} />
        </div>
    )
}

export default VerificationWindow