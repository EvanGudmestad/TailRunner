import {useState,useEffect} from 'react';
import axios from 'axios';
import boombox from '../../node_modules/bootstrap-icons/icons/boombox.svg';

const PetOwnerForm = ({currentOwner, handleSave, setRefresh}) => {

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [dog1, setDog1] = useState('');
  const [dog2, setDog2] = useState('');
  const [dog3, setDog3] = useState('');

  useEffect(() => {
    if(currentOwner){
      setFirstName(currentOwner.firstName || "");
      setLastName(currentOwner.lastName || "");
      setDog1(currentOwner.dogs[0] || '');
      setDog2(currentOwner.dogs[1] || '');
      setDog3(currentOwner.dogs[2] || '');
    }else{
      setFirstName('');
      setLastName('');
      setDog1('');
      setDog2('');
      setDog3('');
    }
  }, [currentOwner]);
 
  const handleSubmit = async (e) => {
    e.preventDefault();
    const dogs = [];
    if(dog1){
      dogs.push(dog1);
    }
    if(dog2){
      dogs.push(dog2);
    }
    if(dog3){
      dogs.push(dog3);
    }
    if(currentOwner){
      //update
     await axios.patch(`http://localhost:2024/api/pet-owners/${currentOwner._id}`, {firstName, lastName, dogs});
    
     handleSave();
      
    }else{
      //create
      try{
       await axios.post('http://localhost:2024/api/pet-owners', {firstName, lastName, dogs});
        handleSave();
         // Clear the form after successful creation
         setFirstName('');
         setLastName('');
         setDog1('');
         setDog2('');
         setDog3('');
          handleSave();
      }catch(error){
        console.log(error);
      }
  }

  }
  
  return(
 <div className='container'>
      <h1>{currentOwner? "Update " : "Add "}Pet Owners</h1>
      <form onSubmit={handleSubmit}>
        <div className='mb-3'>
          <label htmlFor='firstName' className='form-label'>First Name</label>
          <input type='text' className='form-control' id='firstName' onChange={(e) => setFirstName(e.target.value)} value={firstName} />
        </div>
        <div className='mb-3'>
          <label htmlFor='lastName' className='form-label'>Last Name</label>
          <input type='text' className='form-control' id='lastName' onChange={(e) => setLastName(e.target.value)} value={lastName} />
        </div>
        <div className='mb-3'>
          <label htmlFor='dog1' className='form-label'>Dog 1</label>
          <input type='text' className='form-control' id='dog1' onChange={(e) => setDog1(e.target.value)} value={dog1} />
        </div>
        <div className='mb-3'>
          <label htmlFor='dog2' className='form-label'>Dog 2</label>
          <input type='text' className='form-control' id='dog2' onChange={(e) => setDog2(e.target.value)} value={dog2} />
        </div>
        <div className='mb-3'>
          <label htmlFor='dog3' className='form-label'>Dog 3</label>
          <input type='text' className='form-control' id='dog3' onChange={(e) => setDog3(e.target.value)} value={dog3} />
        </div>
        <button type='submit' className='btn btn-primary'>{currentOwner ? 'Update' : 'Add'}</button>
      </form>
  </div>
  );
};

export {PetOwnerForm};