import { useState, useEffect } from 'react'
import './App.css'
import axios from 'axios';

import {PetOwnerList} from './components/PetOwnerList.jsx';
import { PetOwnerForm } from './components/PetOwnerForm.jsx';
import LoginForm from './components/LoginForm.jsx';
import Navbar from './components/Navbar.jsx';
import AddEditPetOwner from './components/AddEditPetOwner.jsx';
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
   // navigate('/');
   
    //document.cookie = 'authToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=http://localhost:2024/';
    axios.post('/api/users/logout',{},{withCredentials:true}).then(response => {
      console.log(response.data);
      navigate('/');
      showSuccess('Logged out!');
    }).catch(error => {
      console.log(error);
    });
    localStorage.removeItem('auth');
  }

  useEffect(() => {
    const auth = JSON.parse(localStorage.getItem('auth'));
    if(auth){
      setAuth(auth);
    }
  },[]);
 

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
        <Route path='/pet-owners' element={<PetOwnerList showSuccess={showSuccess} auth={auth}/>} />
        <Route path='/pet-owners/new' element={<AddEditPetOwner />} />
        <Route path='/pet-owners/:petOwnerId' element={<AddEditPetOwner showError={showError} />} />
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
