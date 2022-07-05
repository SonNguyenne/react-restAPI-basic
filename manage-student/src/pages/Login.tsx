import React, { ChangeEvent, useState } from 'react'
import { useNavigate } from "react-router-dom";
import bcrypt from 'bcryptjs'
import './Login.css'
import useLocalStorage from '../hooks/useLocalStorage';

const Login = () => {

    let navigate = useNavigate();
    const [refresh, setRefresh] = useState(false);
    const [user, setUser] = useState({
        username: '',
        password:''
    })
    const onRefresh = () => {setRefresh(!refresh)}
    const hashedPassword = bcrypt.hashSync( "123456",bcrypt.genSaltSync(10));


    const handleLogin = (e:any) =>{
        e.preventDefault();
        console.log(user.password)
        const doesPasswordMatch = bcrypt.compareSync(user.password, hashedPassword)
        console.log('hash',doesPasswordMatch)
        if(user.username=='admin'&&doesPasswordMatch){
            localStorage.setItem('isLoggedIn','true')
            navigate('/manage')
        }else{
            alert('Invalid Username or Password')
        onRefresh();
            
        }
    }


    const handleInput = (e:ChangeEvent<HTMLInputElement>) =>{
        const name = e.target.name
        const value = e.target.value
        const newUser:any= {...user,[name]:value}
        setUser(newUser)

    }
  return (
    <div>
        <form onSubmit={handleLogin} className='login-form'>
            <div>
            <label>Username: </label>
            <input 
            className='login-input'
            type="text"
            name="username"
            onChange={handleInput}
            value={user.username || ""} />
            </div>
            <div>
            <label>Password: </label>
            <input className='login-input' 
            type="password" 
            name="password" 
            onChange={handleInput} 
            value={user.password || ""}/>
            </div>
            <button 
            className='login-btn' 
            onClick={(e) =>handleLogin}
            >Login</button>
        </form>
      
    </div>
  )
}

export default Login

