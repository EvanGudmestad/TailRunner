import { useState, useEffect } from 'react'
import './App.css'
import axios from 'axios';

import {PetOwnerList} from './components/PetOwnerList.jsx';
import { PetOwnerForm } from './components/PetOwnerForm.jsx';
import LoginForm from './components/LoginForm.jsx';
import Navbar from './components/Navbar.jsx';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.js';
import RegisterUserForm from './components/RegisterUserForm.jsx';
import {Route,Routes, useNavigate} from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';

function App() {

  const [auth, setAuth] = useState(null);
  const navigate = useNavigate();

  function showSuccess(message) {
    toast(message, { type: 'success', position: 'bottom-right' });
  }

  function showError(message) {
    toast(message, { type: 'error', position: 'bottom-right' });
  }

  function onLogout() {
    setAuth(null);
    navigate('/');
    showSuccess('Logged out!');
    localStorage.removeItem('auth');
  }

  useEffect(() => {
    const auth = JSON.parse(localStorage.getItem('auth'));
    if(auth){
      setAuth(auth);
    }
  },[]);
  // const [petOwners, setPetOwners] = useState([]);
  // const [refresh, setRefresh] = useState(0); // State variable to trigger refresh
  // const [currentOwner, setCurrentOwner] = useState(null)
  
   
  // const handleDelete = async (id) => {
  //   try{
  //     await axios.delete(`http://localhost:2024/api/pet-owners/${id}`);
  //     setRefresh(refresh + 1); // Trigger refresh after deletion
  //   }catch(error){
  //     console.log(error);
  //   }
  // };

  // useEffect(() => {
  //   const fetchPetOwners = async () => {
  //     try{
  //     const {data} = await axios.get('http://localhost:2024/api/pet-owners');
  //     console.log(data);
  //     setPetOwners(data);
  //     }catch(error){
  //       console.log(error);
  //     }
  //   };
  //   fetchPetOwners();
  // }, [refresh]);

 

  // const handleEdit = (owner) => {
  //   setCurrentOwner(owner)
  // };

  // const handleSave = () => {
  //   setRefresh(refresh+1);
  //   setCurrentOwner(null)
  // };

  return (
    <>
    <div className='container'>
      <ToastContainer />
      <header>
        <Navbar auth={auth} onLogout={onLogout}/>
      </header>
      <main>
      <Routes>
        <Route path='/' element={<LoginForm showSuccess={showSuccess} showError={showError} setAuth={setAuth}  />} />
        <Route path='/login' element={<LoginForm showSuccess={showSuccess} showError={showError} setAuth={setAuth}  />} />
        <Route path='/register' element={<RegisterUserForm showSuccess={showSuccess} showError={showError} setAuth={setAuth} />} />
        <Route path='/pet-owners' element={<PetOwnerList showSuccess={showSuccess}/>} />
      </Routes>
      </main>
      <footer>
        <p>&copy; 2024 Tail Runner</p>
      </footer>
    </div>
     {/* <PetOwnerList handleEdit={handleEdit} petOwners={petOwners} handleDelete={handleDelete} />
     <PetOwnerForm currentOwner={currentOwner} handleSave={handleSave} setRefresh={() => setRefresh(refresh+1)}/> */}
    </>
  )
}

export default App
