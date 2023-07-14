import React, { useEffect } from 'react'
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom'

function ServicesContainer() {
    const NAVIGATE = useNavigate();
    const token = useSelector(state => state.auth.token);
    useEffect(() => {
        if (!token) {
            NAVIGATE("/login");
        }
    }, [NAVIGATE, token]);
    return (
        <div className='dashboard-services-container'>
            {/* ? Birth Certificate details */}
            <div className='dashboard-sub-container'>
                <h3>Birth Certificate</h3>
                <ul>
                    <h5>Basic details required</h5>
                    <li>Mother's aadhaar card</li>
                    <li>Father's aadhaar card</li>
                    <li>Decided child name</li>
                </ul>
                <ul>
                    <h5>Documents required</h5>
                    <li>Permanent address proof</li>
                    <li>Marriage certificate</li>
                    <li>Proof of Birth by hospital</li>
                </ul>
                <Link to='forms/birth-form'><button>Apply</button></Link>
            </div>
            {/* ? Marriage Certificate details */}
            <div className='dashboard-sub-container'>
                <h3>Marriage Certificate</h3>
                <ul>
                    <h5>Basic details required</h5>
                    <li>Husband's aadhaar card</li>
                    <li>Wife's aadhaar card</li>
                    <li>Aadhaar card of witness 1</li>
                    <li>Aadhaar card of witness 2</li>
                </ul>
                <ul>
                    <h5>Documents required</h5>
                    <li>Husband's signature</li>
                    <li>Wife's signature</li>
                    <li>Priest's signature</li>
                    <li>Husband's birth certificate</li>
                    <li>Wife's birth certificate</li>
                    <li>Marriage photos</li>
                </ul>
                <Link to='forms/marriage-form'><button>Apply</button></Link>
            </div>
            {/* ? Death Certificate details */}
            <div className='dashboard-sub-container'>
                <h3>Death Certificate</h3>
                <ul>
                    <h5>Basic details required</h5>
                    <li>Deceased person's aadhaar card</li>
                    <li>Form filler's aadhaar card</li>
                </ul>
                <ul>
                    <h5>Documents required</h5>
                    <li>Death declaration by hospital</li>
                </ul>
                <Link to='forms/death-form'><button>Apply</button></Link>
            </div>
        </div>
    )
}

export default ServicesContainer