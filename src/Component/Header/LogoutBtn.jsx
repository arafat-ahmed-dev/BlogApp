import React from 'react';
import {useDispatch} from 'react-redux';
import authService from '../../AppWrite/config';
import {logout} from '../../store/authSlice';

const LogoutBtn = () => {
    const dispatch = useDispatch();

    const handleLogout = async () => {
        try {
            await authService.logout();
            dispatch(logout());
        } catch (error) {
            console.log(error);
        }
    }
  return (
    <button 
    className='inline-block px-6 py-2 duration-200 hover:bg-blue-100 rounded-full'>Logout</button>
  )
}

export default LogoutBtn