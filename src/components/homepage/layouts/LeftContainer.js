import React from 'react'
import { motion } from 'framer-motion';
function LeftContainer() {

    return (
        <motion.div className='homepage-left-container'
            initial={{ opacity: 0, x: '-100px' }}
            animate={{ opacity: 1, x: '0px' }}
            transition={{ duration: 1, delay: .2 }}
        >

        </motion.div >
    )
}

export default LeftContainer