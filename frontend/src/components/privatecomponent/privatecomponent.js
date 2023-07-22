import React from 'react'
import {Navigate,Outlet} from 'react-router-dom'

//This component checks weather user data is in local storage or not
//if not then user can't access other pages which is inside in outlet(private component) in App.js
// user always redirect to signup page

const Privatecomponent = ()=>{
    const auth = localStorage.getItem('user');
    return auth?<Outlet />: <Navigate to = '/signup'/>
}

export default Privatecomponent;
