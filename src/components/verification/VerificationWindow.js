import React, { useCallback, useContext, useEffect, useRef, useState } from 'react'
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom';
import { SocketContext } from '../../context/socketContext';
import { CITIZEN_ACTIONS } from '../../redux-store/slices/citizen-slice';
import Peer from 'simple-peer';
let clerk;
function VerificationWindow({ API }) {
    const current = useSelector(state => state.citizen.current);
    // const CLERK = current.clerk_socket;
    // const ME = current.req.citizen_socket;
    // const navigate = useNavigate();
    const socket = useContext(SocketContext);
    const [callerSignal, setCallerSignal] = useState()
    const dispatch = useDispatch();
    // const [me, setMe] = useState("")
    const [receivingCall, setReceivingCall] = useState(false)
    // const [caller, setCaller] = useState("")
    // const [callAccepted, setCallAccepted] = useState(false)
    // const [idToCall, setIdToCall] = useState("")
    // const [name, setName] = useState("")

    // const [callerSignal, setCallerSignal] = useState()
    // const [callEnded, setCallEnded] = useState(false)
    const [stream, setStream] = useState()
    const myVideo = useRef()
    const userVideo = useRef()
    const connectionRef = useRef()

    const handleOtherInProgress = useCallback(() => {
        // setWaiting(false);
        window.alert("Other verification process ongoing... Please try again after 5 minutes, Your verification will be done during allocated time slot only");
    }, [])
    useEffect(() => {
        socket.on('other-verification-in-progress', handleOtherInProgress);
        socket.on("callUser", (data) => {
            // NAVIGATE('/verification');
            console.log(data);
            // dispatch(CITIZEN_ACTIONS.setCurrent({ current: data }));
            clerk = data;
            setCallerSignal(data.signal)
            setReceivingCall(true)
        })

        navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
            setStream(stream)
            myVideo.current.srcObject = stream
        });
        console.log(current)

    }, [])
    const join = () => {
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
    }
    return (
        <div>
            {receivingCall && <button onClick={join}>start</button>}
            <video muted autoPlay ref={myVideo} style={{ width: "300px" }} />
            <video autoPlay ref={userVideo} style={{ width: "300px" }} />
        </div>
    )
}

export default VerificationWindow