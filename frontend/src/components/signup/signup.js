import React,{ useEffect, useState} from "react";
import './signup.css'
import {useNavigate} from 'react-router-dom'

const Signup = ()=>{
    //used to save info
    const [name,setName] = useState("");
    const [email,setEmail] = useState("");
    const [password,setPassword] = useState("");

    //use to navigate to home pafe after sign up done
    const navigate = useNavigate();

    //function sent data to backend using fetch(inbuilt js function)
    const collectdata = async ()=>{
        console.warn(name,email,password)
        let result = await fetch('http://localhost:5000/register',{
            method:'post',
            body: JSON.stringify({name,email,password}),
            headers:{
                'Content-Type':'application/json',
                "Accept": 'application/json'
            },
        })
        result = await result.json();
        console.warn(result)
        // used to save data of loggedin user until he logout in local storage
        localStorage.setItem('user',JSON.stringify(result.result));
        localStorage.setItem('token',JSON.stringify(result.auth));
        if(result){
            navigate('/')
        }
    }
    //if user data is present in local storage the directly navigate to main
    useEffect(()=>{
        const auth = localStorage.getItem('user');
        if(auth){
            navigate('/')
        }
    })
    return(
        <div className="signup">
            <h1 className="h1">Register</h1>
            <input className="inputstyle" type="text" value={name} onChange={(e)=>setName(e.target.value)} placeholder="Enter Name" />
            <input className="inputstyle" type="email" value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="Enter Email" />
            <input className="inputstyle" type="password" value={password} onChange={(e)=>setPassword(e.target.value)} placeholder="Enter Password" />
            <button className="button" onClick={collectdata}>Sign Up</button>
        </div>
    )
}

export default Signup;