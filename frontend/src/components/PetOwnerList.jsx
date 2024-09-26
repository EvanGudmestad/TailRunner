import React, {useEffect, useState} from 'react';
import axios from 'axios';

const PetOwnerList = ({onEdit}) =>{
    const [petOwners, setPetOwners] = useState([]);

    useEffect(() => {
      const fetchPetOwners = async () => {
        try{
        const {data} = await axios.get('http://localhost:2024/api/pet-owners');
        console.log(data);
        setPetOwners(data);
        }catch(error){
          console.log(error);
        }
      };
      fetchPetOwners();
    }, [petOwners]);

    const handleDelete = async (id) => {
      try{
        await axios.delete(`http://localhost:2024/api/pet-owners/${id}`);
        setPetOwners(petOwners.filter((petOwner) => petOwner._id !== id));
      }catch(error){
        console.log(error);
      }
    };

    return (
        <div className="container">
            <h1>Pet Owners</h1>
            <table className="table">
              <thead>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Dogs</th>
                <th>Actions</th>
              </thead>
              <tbody>
                {petOwners.map((petOwner) => (
                  <tr key={petOwner._id}>
                    <td>{petOwner.firstName}</td>
                   <td>{petOwner.lastName}</td>
                    <td>
                      <ul>
                        {petOwner.dogs.map((dog) => (
                          <li key={dog}>{dog}</li>
                        ))}
                      </ul>
                    </td> 
                    <td>
                      <button className="btn btn-primary" onClick={() => onEdit(petOwner)}>Edit</button>
                      <button className="btn btn-danger" onClick={() => handleDelete(petOwner._id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
             </table>
        </div>
    )
};

export {PetOwnerList};