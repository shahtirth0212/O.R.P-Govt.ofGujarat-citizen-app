import React from 'react'
import { Outlet } from 'react-router-dom'

function RightContainer() {
    return (
        <>
            <div className='dashboard-right-container' style={{ margin: "0.5vh 1vw 0 1vw " }}>
                <Outlet />
            </div>
        </>
    )
}

export default RightContainer