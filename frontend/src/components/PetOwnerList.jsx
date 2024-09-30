import React, {useEffect, useState} from 'react';
import axios from 'axios';

const PetOwnerList = ({handleEdit, petOwners, handleDelete}) =>{ 
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
                      <button className="btn btn-primary" onClick={() => handleEdit(petOwner)}>Edit</button>
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