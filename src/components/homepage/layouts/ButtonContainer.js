import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion';
import '../../css/blueButton.css';
import '../../css/redButton.css';
import '../../css/greenButton.css';
import '../../css/disabledButton.css';
import '../../css/linkButton.css';


const homeVariant = {
    hidden: {
        opacity: 0, x: '-100px'
    },
    visible: {
        opacity: 1,
        x: '0px',
        transition: { duration: 0.5, delay: 1 }
    }
}
const registerVariant = {
    hidden: {
        opacity: 0, x: '-100px'
    },
    visible: {
        opacity: 1,
        x: '0px',
        transition: { duration: 0.5, delay: 1.5 }
    }
}
const loginVariant = {
    hidden: {
        opacity: 0, x: '-100px'
    },
    visible: {
        opacity: 1,
        x: '0px',
        transition: { duration: 0.5, delay: 2 }
    }
}
const AuthorityVariant = {
    hidden: {
        opacity: 0, x: '-100px'
    },
    visible: {
        opacity: 1,
        x: '0px',
        transition: { duration: 0.5, delay: 2.5 }
    }
}


function ButtonContainer() {
    const [infoActive, changeInfoActive] = useState(false);
    const [registerActive, changeRegisterActive] = useState(true);
    const [loginActive, changeLoginActive] = useState(true);
    const changeHandler = (button) => {
        if (button === 1) {
            changeInfoActive(false)
            changeRegisterActive(true)
            changeLoginActive(true)
        } else if (button === 2) {
            changeInfoActive(true)
            changeRegisterActive(false)
            changeLoginActive(true)
        } else {
            changeInfoActive(true)
            changeRegisterActive(true)
            changeLoginActive(false)
        }
    }
    return (
        <div className='homepage-right-container-button-container'>
            <Link to='/'>
                <motion.button
                    disabled={!infoActive} onClick={() => changeHandler(1)} className={infoActive ? 'greenButton' : 'disabledBtn'}
                    variants={homeVariant}
                    initial="hidden"
                    animate="visible"
                >Home
                </motion.button>
            </Link>
            <Link to='register'>
                <motion.button
                    disabled={!registerActive} onClick={() => changeHandler(2)} className={registerActive ? 'redButton' : 'disabledBtn'}
                    variants={registerVariant}
                    initial="hidden"
                    animate="visible"
                >Register
                </motion.button>
            </Link>
            <Link to='login'>
                <motion.button
                    variants={loginVariant}
                    initial="hidden"
                    animate="visible"
                    disabled={!loginActive} onClick={() => changeHandler(3)} className={loginActive ? 'blueButton' : 'disabledBtn'}
                >Login
                </motion.button>
            </Link>
            <Link to='/'>
                <motion.button
                    variants={AuthorityVariant}
                    initial="hidden"
                    animate="visible"
                    className='linkButton'>Authority Login

                </motion.button>
            </Link>
        </div>
    )
}

export default ButtonContainer