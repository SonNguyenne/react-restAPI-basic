import axios from 'axios'
import React, { ChangeEvent, FormEvent,  useEffect,  useState } from 'react'
import { useParams, useLocation, Navigate , useNavigate} from 'react-router-dom';

import './Form.css'

const Form = ({onOpenForm, onCloseForm,onRefresh, record, type}:any) => {
  const location = useLocation()
  const params = useParams()
  const navigate = useNavigate();
  const [data, setData] = useState<any>({
    studentid: '', 
    studentname: '', 
    studentphone: '',
    studentclassid: ''
   })

  

  const[errors,setErrors]=useState<any>([])

  useEffect(()=> {
    if(location.state) {
      console.log('location==>', location)
      setData(location.state)
    }
  }, [location.state])


  
  
  //POST
  const addOrUpdateStudent = async (e: FormEvent<HTMLFormElement>) =>{
    try {
      
      e.preventDefault()
      console.log('data===>', data )
      console.log('type===>', type )
      let res
      if(!location.state){
        res = await axios.post(
          'http://localhost:3000/users', data, {
            headers: {
              "Content-Type": "application/json"
            }
        })
        
      }else{
          res = await axios.put(`http://localhost:3000/users/${data.studentid}`,data,
          {
              headers : {
                  "Content-Type" : "application/json"
              }
          })
      }
      if (res && res.data) {
        navigate('/manage')
      }
    } catch (e) {
      console.log('ERROR in create or update student===>', e)
    }
   
  }

  const closeForm = () =>{
    navigate('/manage')
  }

  

  const handleChangeInput = (e:ChangeEvent<HTMLInputElement>) => {
    const name = e.target.name
    const value = e.target.value
    var letter=/^[a-zA-Z ]+$/;
    var number=/^[0-9]+$/;
    const newData: any = {...data, [name]: value}
    setData(newData)
    const{studentid,studentname,studentphone,studentclassid}= newData;
    const errors=[];
      try {
        if(studentid.length>7 || !studentid.match(number)){
          errors.push('Student Id can\'t get over 7 characters or have letter in ID') 
        }
        if(!studentname.match(letter)){
          errors.push('Only letter in Student Name field') 
        }
        if(!studentphone.match(number)){
          errors.push('Only number in Student Phone field') 
        }
       } catch (error) {
        console.log('error',error)
      } 
      if(errors.length>0){
        setErrors(errors)
        document.getElementById('btn-submit')?.setAttribute("disabled",'disabled')
        return;
      }else{
        setErrors(errors)
        document.getElementById('btn-submit')?.removeAttribute("disabled")

      }
  }



  return (
    <div className='formm'>
      
      <div className='form-app'>
        
      <form className='form-school' onSubmit={addOrUpdateStudent}>
        <div className='input-field'>
          <label className='label'> Student Id:</label>
          <input
           className='input-form' 
            name='studentid'
            type='text'
            placeholder='Student Id'
            value={data.studentid || ''}
            onChange={handleChangeInput}
            required

          />
        </div>
        <div className='input-field'>
          <label className='label'> Student Name:</label>
          <input
          className='input-form' 
            name='studentname'
            type='text' 
            placeholder='Student Name'
            value={data.studentname|| ''}
            onChange={handleChangeInput}
            required
          />
            
        </div>
        <div className='input-field'>
          <label className='label'> Student Phone:</label>
          <input
          className='input-form' 
            type='text'
            placeholder='Student Phone'
            name='studentphone'
            value={data.studentphone|| ''}
            onChange={handleChangeInput}
           required

            />
        </div>
        <div className='input-field'>
          <label className='label'> Class Id:</label>
          <input
          className='input-form' 
          type='text' 
          placeholder='Class Id'
          name='studentclassid'
          value={data.studentclassid|| ''}
          onChange={handleChangeInput} 
          required
          />
        </div>
        <div className='error'>
           {errors.map((error:any)=>(
          <p key={error}>{error}</p>
        ))}
        </div>
       
        <div className='btn'>
          <button className='button-submit' id='btn-submit' >Submit</button>
          <button className='button-exit' onClick={closeForm} >Exit</button>

        </div>
      </form>

      </div>
     
    </div>
  )
}

export default Form
