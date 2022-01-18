import React from 'react';
import { Redirect } from 'react-router-dom';
// import {removeToken } from '../Cache/User';


export default function Logout(async){
    localStorage.removeItem('admin');
    localStorage.removeItem('user');
    return <Redirect to='/login'/>
}