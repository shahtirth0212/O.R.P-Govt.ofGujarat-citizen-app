import React from 'react'
import { motion } from 'framer-motion';
import './confirmdialog.css';
function ConfirmDialog({ msg, getConfirm }) {
    return (
        <motion.dialog className='confirm-dialog'
            initial={{ opacity: 0.4, y: '-50px' }}
            animate={{ opacity: 1, y: '0px' }}
            transition={{ duration: 0.1, delay: 0 }}
        >
            <h3>{msg}</h3>
            <button onClick={e => getConfirm(1)}>confirm</button>
            <button onClick={e => getConfirm(0)}>cancel</button>
        </motion.dialog>
    )
}

export default ConfirmDialog