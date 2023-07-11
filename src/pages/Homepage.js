import React from 'react';
import { motion } from 'framer-motion';
import '../pages/css/homepage.css';
// import bgVideo from '../components/homepage/static/homepage-bg-video.mp4';

import LeftContainer from '../components/homepage/layouts/LeftContainer'
import RightContainer from '../components/homepage/layouts/RightContainer'

function HomePage() {
    return (
        <>
            {/* <video className='homepage-bg-video' autoPlay muted loop>
                <source src={bgVideo}></source>
            </video> */}
            <motion.div className='homepage-header'
                initial={{ opacity: 0, y: '-100px' }}
                animate={{ opacity: 1, y: '0px' }}
                transition={{ duration: 1, delay: .2 }}
            >
                <h3>ONLINE REQUISITION PORTAL - GUJARAT</h3>
            </motion.div>
            <div className='homepage-grid-wrapper'>
                <LeftContainer />
                <RightContainer />
            </div>
            <motion.div className='homepage-footer-image'
                initial={{ opacity: 0, y: '+100px' }}
                animate={{ opacity: 1, y: '0px' }}
                transition={{ duration: 1, delay: .2 }}
            ></motion.div>
        </>
    )
}

export default HomePage;