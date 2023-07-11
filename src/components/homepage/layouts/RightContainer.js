import React from 'react'
import ButtonContainer from './ButtonContainer';
import { Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';

const rightContainerVariant = {
    hidden: {
        opacity: 0, x: '+100px'
    },
    visible: {
        opacity: 1,
        x: '0px',
        transition: { duration: 1, delay: .2, when: "beforeChildren", staggerChildren: 2 }
    }
}
const contentVariant = {
    hidden: {
        opacity: 0, y: '+100px'
    },
    visible: {
        opacity: 1,
        y: '0px',
        transition: { duration: 0.5, delay: 1, when: "beforeChildren", staggerChildren: 2 }
    }
}
function RightContainer() {
    return (
        <motion.div className='homepage-right-container'
            variants={rightContainerVariant}
            initial="hidden"
            animate="visible"
        >
            <ButtonContainer />
            <motion.div className='homepage-main-content-container'
                variants={contentVariant}
                initial="hidden"
                animate="visible"
            >
                <Outlet />
            </motion.div>
        </motion.div>
    )
}

export default RightContainer