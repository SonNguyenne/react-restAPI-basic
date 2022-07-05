import React, { useEffect, useState } from 'react';
import {Routes, Route, Link,useNavigate} from 'react-router-dom'
import './App.css';
import Home from './pages/Home';
import Login from './pages/Login';

import StudentList from './pages/StudentList';





function App() {
  const [items, setItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const items = JSON.parse(localStorage.getItem('isLoggedIn')||'{}');
    if (items) {
     setItems(items);
     console.log('items',items)
     console.log('items',typeof items)

    }
  }, []);

  const handleLogout = ()=>{
    localStorage.removeItem('isLoggedIn');
    navigate('/login')
    window.location.reload();
  }
  if(typeof items ==='object'){
    return(
      <div>
         <nav>
        <ul>
          <li>
            <Link to='/'>Home</Link>
          </li>
          <li>
            <Link to='/login'>Login</Link>
          </li>
        </ul>
      </nav>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/login' element={<Login/>}/>
      </Routes>
      </div>
    )
  }
  else{
    return (
      <div className="App">
        <nav>
          <ul>
            <li>
              <Link to='/'>Home</Link>
            </li>
            <li>
              <Link to='/manage'>Manage Student</Link>
            </li>
            <li>
              <a onClick={handleLogout}>Logout</a>
            </li>
          </ul>
        </nav>
        
        <Routes>
          <Route path='/' element={<Home/>}/>
          <Route path='/manage' element={<StudentList/>}/>
        </Routes>
      </div>
    );
  }
 
}

export default App;
