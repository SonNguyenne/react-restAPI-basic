
import axios from 'axios';
import React, { FormEvent, useEffect, useState , ChangeEvent} from 'react'
import './ShowList.css'
import Form from '../components/Form'
import useLocalStorage from '../hooks/useLocalStorage';
import Modal from 'react-modal'
import { Navigate, useNavigate } from 'react-router-dom';


const StudentList = () => {
    const [dataList,setDataList] = useState([])
    const navigate = useNavigate();
    
    //show and hide form
    const [isOpened, setIsOpened] = useState(false);
    const [refresh, setRefresh] = useState(false);
    //show and hide form
    const [id,setId] = useState(null);
    const [modal, setModal] = useState(false);
    const [selected, setSelected] = useState({});
    const [type, setType] = useState('')

    const[page,setPage]= useState(0)

    const onRefresh = () => {setRefresh(!refresh)}

    const fetchUsers = async () => {
        const pages = page * 5
        const response = await axios.get(
            `http://localhost:3000/students?filter[limit]=5&filter[skip]=${pages}`, 
          { 
            headers: {
            "Content-Type": "application/json",
            },
            params:{page: page
        }
      })
        setDataList(response.data);
        console.log('res',response)
      }

      

    const PrePage = () => {
        const pg = page === 0 ? 0 : page-1
        setPage(pg)
        console.log('pre',page)

    }

    const NextPage = () =>{
        console.log('length',dataList.length)
        if(dataList.length < 5){
            document.getElementById('next')?.setAttribute("disabled",'disabled')
        }else{
            setPage(page+1)
        }
        console.log('next',page)

    }


    useEffect(() => {
        fetchUsers()
    }, [refresh])

    useEffect(() => {
        fetchUsers()
        console.log('page',page)
    }, [page])
    
    //GET
    useEffect(() => {
        fetchUsers();
    },[])

    
    const deleteStudent = async(id:any,e:any) =>{
        e.preventDefault()
        await axios.delete(`http://localhost:3000/students/${id}`,
        {
            headers : {
                "Content-Type" : "application/json"
            }
        }
        )
        setModal(false);
        setId(null)
        onRefresh()
    }


    function onUpdate(item:any,e:any) {
        setSelected(item)
        setIsOpened(true)
        navigate('/addorupdate',{state: item})
        setType('update')   

    } 

    const openForm = () =>{
      setIsOpened(true);
      setSelected({})
      navigate('/addorupdate')
      setType('create')
    }

    const closeForm = () =>{
        setIsOpened(false);
      }

      function onDelete(id:any,e:any) {
        setId(id)
        setModal(true);
      }
      function onDeleteClose() {
        setModal(false);
      }

      function PageChange(){

      }
    
   return(
    <div className='show-list'>
   <button className='btn-add' onClick={openForm} >Add Student</button>

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
                created
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
                   </td><td>
                       {item.created_at}
                   </td>                        
                   <th>     
                    <button className='btn-delete' onClick={(e)=> onDelete(item.studentid, e)}>Delete</button>
                    <button className='btn-update' onClick={(e) => onUpdate(item, e)}>Update</button>
                    
                    </th>
               </tr>
           </tbody>
       )
      )}
       
   </table>
   <div className='page'>
    <input className='page-context' type="text" name='count' value={page +1} onChange={PageChange} disabled/>
    <a onClick={PrePage} className="previous" id='previous'>&#8249;</a>
   <a onClick={NextPage}  className="next" id='next'>&#8250;</a>
    </div>
    
    

   
   
    <Modal
        isOpen={modal}
        contentLabel="My dialog"
        className="mymodal"
        overlayClassName="myoverlay"
        ariaHideApp={false}
        closeTimeoutMS={500}
      >
        <div className="modal-content">Confirm Delete</div>

        <div>
        <button className='btn-delete' onClick={(e) => deleteStudent(id,e)}>Delete</button>
        <button className='btn-closeModal' onClick={onDeleteClose}>Close modal</button>
        </div>
      </Modal>
   </div>
   )
  
}

export default StudentList