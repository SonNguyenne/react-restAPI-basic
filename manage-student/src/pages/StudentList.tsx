
import axios from 'axios';
import React, { FormEvent, useEffect, useState , ChangeEvent} from 'react'
import './ShowList.css'
import Form from '../components/Form'
import useLocalStorage from '../hooks/useLocalStorage';


const StudentList = () => {
    const [dataList,setDataList] = useState([])
    
    //show and hide form
    const [isOpened, setIsOpened] = useState(false);
    const [refresh, setRefresh] = useState(false);
    const [selected, setSelected] = useState({});
    const [type, setType] = useState('')

    const onRefresh = () => {setRefresh(!refresh)}

    const fetchUsers = async () => {
        const response = await axios.get(
          'http://localhost:3000/users', 
          { 
            headers: {
            "Content-Type": "application/json"
        }
      })
        setDataList(response.data);
      }

    useEffect(() => {
        fetchUsers()
    }, [refresh])
    
    //GET
    useEffect(() => {
        fetchUsers();
    },[])
    
    const deleteStudent = async(id:any,e:any) =>{
        e.preventDefault()
        await axios.delete(`http://localhost:3000/users/${id}`,
        {
            headers : {
                "Content-Type" : "application/json"
            }
        }
        )
        onRefresh()
    }


    function onUpdate(item:any,e:any) {
        setSelected(item)
        setIsOpened(true)
        setType('update')   

    }

    const openForm = () =>{
      setIsOpened(true);
      setSelected({})
      setType('create')
        
    }

    const closeForm = () =>{
        setIsOpened(false);
      }
    
   return(
    <div className='show-list'>
    <div className='header'> <b>Manage Student</b></div>
   <table className='show-table'>
    <thead>
        <tr>
            <th>
                Student Id
            </th>
            <th>    
                Student Name
            </th>
            <th>
                Student Phone
            </th>
            <th>
                Student ClassId
            </th>
            <th>
                Action
            </th>
        </tr>
    </thead>
       {dataList.map((item: any) => (
           <tbody key={item.studentid}>
               <tr id={item.studentid}>
                   <td>
                       {item.studentid}
                   </td>
                   <td>
                       {item.studentname}
                   </td>
                   <td>
                       {item.studentphone}
                   </td>
                   <td>
                       {item.studentclassid}
                   </td>
                   <th>     
                    <button className='btn-delete' onClick={(e) => deleteStudent(item.studentid, e)}>Delete</button>
                    <button className='btn-update' onClick={(e) => onUpdate(item, e)}>Update</button>
                    
                    </th>
               </tr>
           </tbody>
       ))}
   </table>
   <div></div>
   <button className='btn-add' onClick={openForm} >Add Student</button>
   {isOpened && (
        <Form record={selected} onOpenForm={openForm} onCloseForm={closeForm} onRefresh={onRefresh} type={type} />
   )}
   
   </div>
   )
  
}

export default StudentList
