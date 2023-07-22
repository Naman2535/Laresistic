import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './shops.css'
import Autocomplete from 'react-autocomplete';

const toast =(e)=>{
    return(
        <span className='span'>{e}</span>
    )
}

const Addshop =()=>{
    
    const [name,setName] = useState("");
    const [address,setAddress] = useState("");
    const [mobile,setMobile] = useState("");
    const [route,setRoute] = useState("");
    const routelist = [{no:"1"},{no:"2"},{no:"3"},{no:"4"},{no:"5"},{no:"6"},{no:"7"},{no:"8"},{no:"9"},{no:"10"},{no:"Ohters"}]
    const [error,setError] = useState(false);

    const navigate = useNavigate();

    const addshop = async()=>{
        if(!name || !address || !mobile || !route){
            setError(true); ////////////////////////////////// toast
            return false;
        }
        // console.warn(name,address,mobile)
        let result = await fetch('http://localhost:5000/addshop',{
            method:'post',
            body:JSON.stringify({name,address,mobile,route,pendingamt:0}),
            headers:{
                'Content-Type':'application/json',
                authorization: `bearer ${JSON.parse(localStorage.getItem('token'))}`
            }
        });
        result = await result.json()
        // console.warn(result) ///////////////////////////// toast
        if(result.name){
            navigate('/shops')
        }
    }
    return(
        <div className='Add-shop'>
            <h1 className='h1'>Add shop</h1>
            <input className='inputstyle' type="text" placeholder='Enter name' value={name} onChange={(e)=>{setName(e.target.value.toUpperCase())}} />
            {error && !name && toast("Please enter valid name")}

            <input className='inputstyle' type="text" placeholder='Enter address' value={address} onChange={(e)=>{setAddress(e.target.value.toUpperCase())}} />
            {error && !address && toast('Please enter valid address')}
            <input className='inputstyle' type="text" placeholder='Enter mobile number' value={mobile} onChange={(e)=>{setMobile(e.target.value)}}/>
            {error && !mobile && toast('Please enter valid mobile number')}
            <div className="autocomplete-wrapper">
            <Autocomplete
                    value={route}
                    items={routelist}
                    getItemValue={item => item.no}
                    shouldItemRender={(item, value) => item.no.toLowerCase().indexOf(value.toLowerCase()) > -1}
                    renderMenu={item => (
                        <div className="dropdown scrollingroute">
                            {item}
                        </div>
                    )}
                    renderItem={(item, isHighlighted) =>
                        <div className={`item ${isHighlighted ? 'selected-item' : ''}`}>
                            {item.no}
                        </div>
                    }
                    onChange={(e) => setRoute(e.target.value)}
                    onSelect={val => setRoute(val)}
                    inputProps={{ placeholder: "Enter Route No." }}
                />
                </div>
                {error && !route && toast('Please enter valid mobile number')}
            <button className='button' onClick={addshop}>Add shop</button>
        </div>
    )
}

export default Addshop;