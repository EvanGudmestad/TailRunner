import React, {useEffect, useState} from 'react';
import axios from 'axios';
import pencil from '../../node_modules/bootstrap-icons/icons/pencil.svg';
import trash from '../../node_modules/bootstrap-icons/icons/trash.svg';


const PetOwnerList = ({handleEdit, petOwners, handleDelete}) =>{ 
  const [showModal, setShowModal] = useState(false);
  const [selectedOwner, setSelectedOwner] = useState(null);

  const handleShowModal = (owner) => {
    setSelectedOwner(owner);
    setShowModal(true);
  };

  const handleConfirmDelete = () => {
    handleDelete(selectedOwner._id);
    setShowModal(false);
  };
    return (
        <div className="container">
            <h1>Pet Owners</h1>
            <hr />
            <div className="row">
              {petOwners.map((petOwner) => (
                <div className="col-md-4" key={petOwner._id}>
                  <div className="card mb-4">
                    <div className="card-body">
                      <h5 className="card-title">{petOwner.firstName} {petOwner.lastName}</h5>
                      <h6 className="card-subtitle mb-2 text-muted">Dogs</h6>
                      <div className="d-flex flex-wrap">
                        {petOwner.dogs.map((dog) => (
                          <span className="badge bg-secondary me-1" key={dog}>{dog}</span>
                        ))}
                      </div>
                      <div className="mt-3">
                        <button className="btn btn-primary me-2" onClick={() => handleEdit(petOwner)}>
                          <img src={pencil} alt="Edit" /> Edit
                        </button>
                        <button className="btn btn-danger" onClick={() => handleShowModal(petOwner)}>
                          <img src={trash} alt="Delete" /> Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {showModal && (
        <div className="modal show d-block" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Confirm Delete</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <div className="modal-body">
                <p>Are you sure you want to delete {selectedOwner.firstName} {selectedOwner.lastName}?</p>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="button" className="btn btn-danger" onClick={handleConfirmDelete}>Delete</button>
              </div>
            </div>
          </div>
        </div>
      )}
        </div>
    )
};

export {PetOwnerList};