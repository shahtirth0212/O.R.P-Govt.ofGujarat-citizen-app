import React from 'react'
import './confirmdialog.css';
function ConfirmDialog({ msg, getConfirm }) {
    return (
        <dialog className='confirm-dialog'>
            <h3>{msg}</h3>
            <button onClick={e => getConfirm(1)}>confirm</button>
            <button onClick={e => getConfirm(0)}>cancel</button>
        </dialog>
    )
}

export default ConfirmDialog