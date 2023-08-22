import React from 'react'
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';


function LeftNavBar() {
    return (
        <>
            <motion.div className='dashboard-leftnavbar-container'>
                <Link style={{ margin: "0.5vh 0.5vw 0.5vh 0.5vw" }} to="/dashboard"><button className='blue'>Services</button></Link>
                <Link style={{ margin: "0.5vh 0.5vw 0.5vh 0.5vw" }} to="applied"><button className='blue'>Applied</button></Link>
                {/* <Link style={{ margin: "0.5vh 0.5vw 0.5vh 0.5vw" }} to="update-profile"><button className='blue'>Update Profile</button></Link> */}
                <Link style={{ margin: "0.5vh 0.5vw 0.5vh 0.5vw" }} to="logout"><button className='red'>Logout</button></Link>
            </motion.div>
        </>
    )
}

export default LeftNavBar