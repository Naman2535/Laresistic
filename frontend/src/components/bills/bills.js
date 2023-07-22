import React from 'react'
import { useNavigate } from 'react-router-dom'

const Bills = ()=>{
    const navigate = useNavigate();
    const addbills = ()=>{
        navigate('/bills/addbill')
    }
 return(
    <div>
        <h1>This is bill component</h1>
        <button onClick={addbills}>Add bill</button>
    </div>
 )
}

export default Bills;