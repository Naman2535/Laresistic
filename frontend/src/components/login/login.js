import { useEffect, useState } from "react"
import React from 'react'
import './login.css'
import {useNavigate,useLocation} from 'react-router-dom'

const Login = ()=>{
    //To store data
    const [email,setEmail] = useState("");
    const [password,setPassword] = useState("");
    const navigate = useNavigate();
    const location = useLocation();
    //If data is present in localstorage then directly login 
    useEffect(()=>{
        if(location.state){
            localStorage.clear();
        }
        const auth = localStorage.getItem('user');
        if(auth){
            navigate('/')
        }
    })
    //Handling function onClick login button 
    const handlelogin = async ()=>{
        // console.warn(email,password)
        //Fetching data
        let result = await fetch('http://localhost:5000/login',{
            method:'post',
            body: JSON.stringify({email,password}),
            headers:{
                'Content-Type':'application/json'
            }
        });
        result = await result.json();
        // console.warn(result);
        // If we get user detail perfectly the just to main page after saving data
        if(result.auth){
            localStorage.setItem('user',JSON.stringify(result.user))
            localStorage.setItem('token',JSON.stringify(result.auth))
            navigate('/')

        }else if(result.result){//if user not found
            alert("Bad credentials , Please enter correct details!!")
        }
        else{
            //if some fields are left
            alert("Some fields are missing")
        }
    }
    return(
        <div className="login">
            <h1 className="h1">Login</h1>
            <input className="inputstyle" type="email" value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="Enter Email" />
            <input className="inputstyle" type="password" value={password} onChange={(e)=>setPassword(e.target.value)} placeholder="Enter Password" />
            <button className="button" onClick={handlelogin}>Login</button>
        </div>
    )
}

export default Login;