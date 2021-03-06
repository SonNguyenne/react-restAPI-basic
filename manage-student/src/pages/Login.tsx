import React, { ChangeEvent, useState } from 'react'
import { useNavigate } from "react-router-dom";
import './Login.css'
import useLocalStorage from '../hooks/useLocalStorage';
import bcrypt from 'bcryptjs'

const Login = () => {

    let navigate = useNavigate();
    const [user, setUser] = useState({
        username: '',
        password:''
    })
    const [store,setStore] = useLocalStorage('isLoggedIn','')


    const handleLogin = (e:any) =>{
        e.preventDefault();
        const hashedPassword = bcrypt.hashSync( "123456",bcrypt.genSaltSync());
        const doesPasswordMatch = bcrypt.compareSync(user.password, hashedPassword)
        console.log('hash',doesPasswordMatch)
        if(user.username==='admin'&& doesPasswordMatch){
            setStore('true')
            navigate('/manage')
            alert('Login successful')

            window.location.reload();
        }else{
            alert('Invalid Username or Password')
            window.location.reload();
            
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
            {/* <label>Username: </label> */}
            <input 
            className='login-input'
            type="text"
            name="username"
            placeholder='Username'
            onChange={handleInput}
            value={user.username || ""} />
            </div>
            <div>
            {/* <label>Password: </label> */}
            <input className='login-input' 
            type="password" 
            name="password" 
            placeholder='Password'

            onChange={handleInput} 
            value={user.password || ""}/>
            </div>
            <button 
            className='login-btn'
            >Login</button>
        </form>
      
    </div>
  )
}

export default Login

