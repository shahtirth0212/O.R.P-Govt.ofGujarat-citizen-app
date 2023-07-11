import React from 'react';
import '../pages/css/dashboard.css';
import { motion } from 'framer-motion';


import LeftNavBar from '../components/dashboard/layout/LeftNavBar';
import RightContainer from '../components/dashboard/layout/RightContainer';

function Dashboard() {
    return (
        <>
            <motion.div className='dashboard-header'
                initial={{ opacity: 0, y: '-100px' }}
                animate={{ opacity: 1, y: '0px' }}
                transition={{ duration: 1, delay: .2 }}
            >
                <h3>ONLINE REQUISITION PORTAL - GUJARAT</h3>
            </motion.div>
            <motion.div className='dashboard-container'>
                <LeftNavBar />
                <RightContainer />
            </motion.div>
        </>
    )
}

export default Dashboard