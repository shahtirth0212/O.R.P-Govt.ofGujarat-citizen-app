import React from 'react'
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';


function LeftNavBar() {
    return (
        <>
            <motion.div className='dashboard-leftnavbar-container'>
                <Link to="/dashboard"><button className='dashboard-nav-button'>Services</button></Link>
                <Link to="applied"><button className='dashboard-nav-button'>Applied</button></Link>
                <Link to="update-profile"><button className='dashboard-nav-button'>Update Profile</button></Link>
                <Link to="logout"><button className='dashboard-nav-button'>Logout</button></Link>
            </motion.div>
        </>
    )
}

export default LeftNavBar