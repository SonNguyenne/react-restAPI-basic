import React from 'react';
import {Routes, Route, Link} from 'react-router-dom'
import './App.css';
import Home from './pages/Home';
import Login from './pages/Login';

import StudentList from './pages/StudentList';

function App() {
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
            <Link to='/login'>Login</Link>
          </li>
        </ul>
      </nav>
      
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/manage' element={<StudentList/>}/>
      </Routes>
    </div>
  );
}

export default App;
