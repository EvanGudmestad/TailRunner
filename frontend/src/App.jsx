import { useState } from 'react'
import './App.css'
import {PetOwnerList} from './components/PetOwnerList.jsx';
import { PetOwnerForm } from './components/PetOwnerForm.jsx';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.js';

function App() {
  const [currentOwner, setCurrentOwner] = useState(null)

  const handleEdit = (owner) => {
    setCurrentOwner(owner)
  };

  const handleSave = (owner) => {
    setCurrentOwner(null)
  };

  return (
    <>

     <PetOwnerList onEdit={handleEdit} />
     <PetOwnerForm currentOwner={currentOwner} onSave={handleSave} />
    </>
  )
}

export default App
