import React, {useEffect, useState} from 'react';
import axios from 'axios';
import PetOwnerItem from './PetOwnerItem.jsx';
import { NavLink } from 'react-router-dom';



const PetOwnerList = ({showSuccess}) =>{ 
  const [selectedOwner, setSelectedOwner] = useState(null);
  const [petOwners, setPetOwners] = useState([]);
  const [deleteCounter, setDeleteCounter] = useState(0);

  useEffect(() => {
   
    const fetchPetOwners = async () => {
      try{
        const {data} = await axios.get(`${import.meta.env.VITE_API_URL}/api/pet-owners`, { withCredentials: true });
        setPetOwners(data);
        console.log('Fetching Pet Owners...')
      }catch(error){
        console.log(error);
      }
    };
    fetchPetOwners();
  }, [deleteCounter]);

  function handleConfirmDelete(evt, petOwnerId){
    evt.preventDefault();
    try{
     const data = axios.delete(`${import.meta.env.VITE_API_URL}/api/pet-owners/${petOwnerId}`, { withCredentials: true });
     //showSuccess(`Deleted Pet Owner`);
     setDeleteCounter(deleteCounter + 1);
     //navigate('/pet-owners');
    }catch(error){
      console.log(error);
    }
  }
  
 
    return (
        <div className="container">
            <h1>Pet Owners</h1>
            <NavLink to="/pet-owners/new" className="btn btn-primary">Add Pet Owner</NavLink>
            <hr />
            <div className="row">
              {petOwners.map((petOwner) => (
                <PetOwnerItem petOwner={petOwner} key={petOwner._id} handleConfirmDelete={handleConfirmDelete}  />
              ))}
            </div>
            
        </div>
    )
};

export {PetOwnerList};