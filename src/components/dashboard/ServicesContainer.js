import React, { useEffect } from 'react'
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion';
function ServicesContainer() {
    const NAVIGATE = useNavigate();
    const token = useSelector(state => state.auth.token);
    useEffect(() => {
        if (!token) {
            NAVIGATE("/login");
        }
    }, [NAVIGATE, token]);
    return (
        <motion.div className='dashboard-services-container'
            initial={{ opacity: 0, y: '-100px' }}
            animate={{ opacity: 1, y: '0px' }}
            transition={{ duration: 1, delay: 0 }}
        >
            {/* ? Birth Certificate details */}
            <div className='dashboard-sub-container' style={{ padding: "2vw" }}>
                <motion.h3
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1, delay: 0.6 }}
                    style={{ fontWeight: "bold", borderBottom: "2px solid white", paddingBottom: "2vh" }}>Birth Certificate</motion.h3>
                <motion.ul
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1, delay: 0.6 }}
                    style={{ "margin-top": "1vh", fontSize: "0.9rem" }}>
                    <h5>Basic details required</h5>
                    <li>Mother's aadhaar card</li>
                    <li>Father's aadhaar card</li>
                    <li>Decided child name</li>
                </motion.ul>
                <motion.ul
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1, delay: 0.6 }}
                    style={{ "margin-top": "1vh", fontSize: "0.9rem" }}>
                    <h5>Documents required</h5>
                    <li>Permanent address proof</li>
                    <li>Marriage certificate</li>
                    <li>Proof of Birth by hospital</li>
                </motion.ul>
                <motion.div initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1, delay: 0.6 }}>
                    <Link to='forms/birth-form'><button className='blue'>Apply</button></Link>
                </motion.div>
            </div>
            {/* ? Marriage Certificate details */}
            <div className='dashboard-sub-container' style={{ padding: "2vw" }}>
                <motion.h3
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1, delay: 0.6 }}
                    style={{ fontWeight: "bold", borderBottom: "2px solid white", paddingBottom: "2vh" }}>Marriage Certificate</motion.h3>
                <motion.ul
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1, delay: 0.6 }}
                    style={{ "margin-top": "1vh", fontSize: "0.9rem" }}>
                    <h5> Basic details required</h5>
                    <li>Husband's aadhaar card</li>
                    <li>Wife's aadhaar card</li>
                    <li>Aadhaar card of witness 1</li>
                    <li>Aadhaar card of witness 2</li>
                </motion.ul>
                <motion.ul
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1, delay: 0.6 }}
                    style={{ "margin-top": "1vh", fontSize: "0.9rem" }}>
                    <h5>Documents required</h5>
                    <li>Husband's signature</li>
                    <li>Wife's signature</li>
                    <li>Priest's signature</li>
                    <li>Husband's birth certificate</li>
                    <li>Wife's birth certificate</li>
                    <li>Marriage photos</li>
                </motion.ul>
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1, delay: 0.6 }}>

                    <Link to='forms/marriage-form'><button className='blue'>Apply</button></Link>
                </motion.div>
            </div>
            {/* ? Death Certificate details */}
            <div className='dashboard-sub-container' style={{ padding: "2vw" }}>
                <motion.h3 initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1, delay: 0.6 }} style={{ fontWeight: "bold", borderBottom: "2px solid white", paddingBottom: "2vh" }}>Death Certificate</motion.h3>
                <motion.ul initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1, delay: 0.6 }} style={{ "margin-top": "1vh", fontSize: "0.9rem" }}>
                    <h5>Basic details required</h5>
                    <li>Deceased person's aadhaar card</li>
                    <li>Form filler's aadhaar card</li>
                </motion.ul>
                <motion.ul initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1, delay: 0.6 }} style={{ "margin-top": "1vh", fontSize: "0.9rem" }}>
                    <h5>Documents required</h5>
                    <li>Death declaration by hospital</li>
                    <li>Crematorium declaration</li>
                </motion.ul>
                <motion.div initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1, delay: 0.6 }}>
                    <Link to='forms/death-form'><button className='blue'>Apply</button></Link>
                </motion.div>
            </div>
        </motion.div>
    )
}

export default ServicesContainer