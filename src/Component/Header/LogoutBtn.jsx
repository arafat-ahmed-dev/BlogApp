import React from 'react';
import {useDispatch} from 'react-redux';
import authService from '../../AppWrite/Auth';
import {logout} from '../../store/authSlice';

function LogoutBtn() {
  const dispatch = useDispatch()
  const logoutHandler = () => {
      authService.logout().then(() => {
          dispatch(logout())
      })
  }
return (
  <button
  className='block w-full text-left px-6 py-2 text-black duration-200 hover:bg-blue-100 rounded-full md:inline-block md:w-auto md:px-4 md:py-2 md:hover:bg-gray-700 md:text-white'
  onClick={logoutHandler}
  >Logout</button>
)
}

export default LogoutBtn