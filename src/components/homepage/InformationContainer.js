import React from 'react'
import { motion } from 'framer-motion';
const INFORMATION = [
    "This portal allows citizens of gujarat to get birth,marriage and death certificates online and paperless.",
    "Citizen has to first register himself/herself in order to take advantage of the services.",
    "Registration can be done by aadhar number only.",
    "One user can also request a service for another citizen who has not registered on the portal.",
    "After requesting for the service,Citizen has to fill the online form for dedicated service.",
    "Proceeding the process, citizen also has to upload necessary documents.",
    "Citizen can book a slot for further document verification.",
    "Documents verification will be done in online mode itself by video chat.",
    "For which, citizen has to join  the video chat with the verification officers through this portal only on booked time and date."
]


function InformationContainer() {
    // const getInfoList = INFORMATION.
    return (
        <motion.div className='homepage-information-container'
        >
            {/* <TransitionGroup component="ul"> */}
            <ul>
                {INFORMATION.map(info => {
                    return (
                        <li key={info} className='homepage-info-li'>{info}</li>
                    )
                })}
            </ul>
            {/* </TransitionGroup> */}
            <div></div>
        </motion.div>
    )
}

export default InformationContainer