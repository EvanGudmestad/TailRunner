import React, {useEffect, useState} from 'react';
import axios from 'axios';
import PetOwnerItem from './PetOwnerItem.jsx';
import { NavLink } from 'react-router-dom';



const PetOwnerList = ({showSuccess, auth}) =>{ 
 // const [selectedOwner, setSelectedOwner] = useState(null);
  const [petOwners, setPetOwners] = useState([]);
  const [deleteCounter, setDeleteCounter] = useState(0);
  const [keywords, setKeywords] = useState('');
  const [classificationFilter, setClassificationFilter] = useState('');
  const [sortBy, setSortBy] = useState('lastName');

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

  
  const onSubmitSearch = async (evt) => {
    evt.preventDefault();

    try{
      const {data} = await axios.get(`${import.meta.env.VITE_API_URL}/api/pet-owners/`, {
        headers: {authorization: `Bearer ${auth?.token}`},
        params: {keywords:keywords, classification:classificationFilter, sortBy:sortBy}}
      );
      console.log(data);
      setPetOwners(data);
    }catch(error){
      console.log(error);
    }
  }
  
 
    return (
        <div className="container">
            <h1>Pet Owners</h1>
            <NavLink to="/pet-owners/new" className="btn btn-primary">Add Pet Owner</NavLink>
            <hr />
            <form>
              <div className="row mb-4">
                <div className="col">
                  <input type="text" className="form-control" placeholder="Search" onChange={(evt) => setKeywords(evt.target.value)} />
                </div>
                <div className="col">
                  <button className="btn btn-secondary" onClick={(evt) => onSubmitSearch(evt)}>Search</button>
                </div>
              </div>
              <div className='row mb-4'>
                <div className='col-4'>
                <label className='form-label'>Filter by Classification</label>
                <select className='form-select' onChange={(evt) => setClassificationFilter(evt.target.value)}>
                  <option value="">Select a Classification</option>
                  <option value="owner">Owner</option>
                  <option value="customer">Customer</option>
                </select>
                </div>
                <div className='col-4'>
                  <label className='form-label'>Sort By</label>
                  <select className='form-select' onChange={(evt) => setSortBy(evt.target.value)}>
                    <option value='lastName'>Sort By</option>
                    <option value='firstName'>First Name</option>
                    <option value='lastName'>Last Name</option>
                    <option value='classification'>Classification</option>
                  </select>
                  </div>
                  {/* <div className='col-4'>
                    <label className='form-check-label'>Show Active Accounts:</label>
                    <input type='checkbox' className='form-check-input' id='showActive' />
                  </div> */}
              </div>
            </form>
            <div className="row">
              {petOwners.map((petOwner) => (
                <PetOwnerItem petOwner={petOwner} key={petOwner._id} handleConfirmDelete={handleConfirmDelete}  />
              ))}
            </div>
            
        </div>
    )
};

export {PetOwnerList};