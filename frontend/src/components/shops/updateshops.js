import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './shops.css'
import { useParams } from 'react-router-dom'
import Autocomplete from 'react-autocomplete';

const toast =(e)=>{
    return(
        <span className='span'>{e}</span>
    )
}

const Updateshop =()=>{
    
    const [name,setName] = useState("");
    const [address,setAddress] = useState("");
    const [mobile,setMobile] = useState("");
    const [route,setRoute] = useState("");
    const [error,setError] = useState(false);
    const routelist = [{no:"1"},{no:"2"},{no:"3"},{no:"4"},{no:"5"},{no:"6"},{no:"7"},{no:"8"},{no:"9"},{no:"10"},{no:"Ohters"}]
    const params = useParams();
    useEffect(()=>{
        getshopdetail();
    },[])

    const getshopdetail = async ()=>{
        let result = await fetch(`http://localhost:5000/shop/${params.id}`,{
            headers:{
                authorization: `bearer ${JSON.parse(localStorage.getItem('token'))}`
              }
        });
        result = await result.json();
        // console.warn(result)
        if(result.result){
            alert("some error please retry")
        }
        else{
            setName(result.name);
            setAddress(result.address);
            setMobile(result.mobile)
            setRoute(result.route);
        }
    }


    const navigate = useNavigate();

    const updateshop = async()=>{
        if(!name || !address || !mobile){
            setError(true);
            return false;
        }
        // console.warn(name,address,mobile)
        let result = await fetch(`http://localhost:5000/shop/${params.id}`,{
            method:'put',
            body:JSON.stringify({name,address,mobile,route}),
            headers:{
                'Content-Type':'application/json',
                authorization: `bearer ${JSON.parse(localStorage.getItem('token'))}`
            }
        });
        result = await result.json()
        // console.warn(result)
        if(result.acknowledged){
            navigate('/shops')
        }else{
            alert('Some error occured!! please try after some time'); //////////////////toast
            setTimeout(() => {
                navigate('/shops')
            }, 5000);
        }
    }
    return(
        <div className='Add-shop'>
            <h1 className='h1'>Update Details</h1>
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
            <button className='button' onClick={updateshop}>Update Details</button>
        </div>
    )
}

export default Updateshop;