import React from 'react'
import { motion } from 'framer-motion';
import './confirmdialog.css';
function ConfirmDialog({ msg, getConfirm }) {
    return (
        <motion.dialog
            style={{ gap: "1vh", display: "flex", flexWrap: "wrap", flexDirection: "column" }}
            className='confirm-dialog'
            initial={{ opacity: 0.4, y: '-50px' }}
            animate={{ opacity: 1, y: '0px' }}
            transition={{ duration: 0.1, delay: 0 }}
        >
            <div>
                <h3>{msg}</h3><br></br>
            </div>
            <div>
                <button style={{ width: "auto", marginLeft: "1vw" }} className='green' onClick={e => getConfirm(1)}>confirm</button>
                <button style={{ width: "auto", marginLeft: "1vw" }} className='red' onClick={e => getConfirm(0)}>cancel</button>
            </div>
        </motion.dialog>
    )
}

export default ConfirmDialog