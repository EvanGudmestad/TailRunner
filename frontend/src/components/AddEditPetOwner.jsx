import { useEffect, useState } from "react";
import axios from "axios";
import { NavLink, useNavigate, useParams } from "react-router-dom";

export default function AddEditPetOwner({showError}) {


  const [petOwner, setPetOwner] = useState({firstName: '', lastName: '', dogs: ['','','']}); 

  const navigate = useNavigate();
  const { petOwnerId } = useParams();
  useEffect(() => {
    (() => {
      "use strict";
      
      // Fetch all the forms we want to apply custom Bootstrap validation styles to
      const forms = document.querySelectorAll(".needs-validation");

      // Loop over them and prevent submission
      Array.from(forms).forEach((form) => {
        form.addEventListener(
          "submit",
          (event) => {
            if (!form.checkValidity()) {
              event.preventDefault();
              event.stopPropagation();
            }

            form.classList.add("was-validated");
          },
          false
        );
      });
    })();
    console.log('Fetching Pet Owner.......');
    
    const fetchPetOwner = async () => {
      
      if(petOwnerId){
        const axiosResult = await axios.get(`${import.meta.env.VITE_API_URL}/api/pet-owners/${petOwnerId}`);
        setPetOwner(axiosResult.data);
        //setPetOwner(data);
    };};
    fetchPetOwner();
  }, []); // Only run the first time this component is rendered


  const addEditDog = async (evt) => {
    evt.preventDefault();
    try{
      if(petOwner._id){
        try{
         // console.log(`Pet Owner ID: ${JSON.stringify(petOwner)}`);
          const axiosResult = await axios.patch(`${import.meta.env.VITE_API_URL}/api/pet-owners/${petOwner._id}`, petOwner, {withCredentials:true});
          console.log(`Axios Result ${axiosResult.data}`);

        navigate('/pet-owners');
        }catch(error){
          //console.log(`The Error is ${error}`);
          if(error.response.status === 403){
            showError(`You do not have permission to edit this record`);
          }
        }
      }else{
        const axiosResult = await axios.post('http://localhost:2024/api/pet-owners', petOwner,{withCredentials:true});
        if(axiosResult.data.message){
          navigate('/pet-owners');
        }
      }
    }catch(error){
      console.log(error);
    }
  };

  return(
    <>
      <h1>Add/Edit Form</h1>
      <form className="needs-validation" noValidate onSubmit={addEditDog}>
        <div className="row mb-3">
          <div className="col-md-4">
            <label htmlFor="txtFirstName" className="form-label">First name</label>
            <input type="text" className="form-control" id="txtFirstName" required value={petOwner.firstName} onChange={(evt) => setPetOwner({...petOwner,firstName:evt.target.value}) } />
            <div className="valid-feedback">
              Looks good!
            </div>
            <div className="invalid-feedback">
              Please Enter Your First Name
            </div>
          </div>
          <div className="col-md-4">
            <label htmlFor="txtLastName" className="form-label">Last name</label>
            <input type="text" className="form-control" id="txtLastName" required value={petOwner.lastName} onChange={(evt) => setPetOwner({...petOwner,lastName:evt.target.value}) } />
            <div className="valid-feedback">
              Looks good!
            </div>
            <div className="invalid-feedback">
              Please Enter Your Last Name
            </div>
          </div>
        </div>
        <div className="row mb-3">
        <div className="col-md-4">
            <label htmlFor="txtDog1" className="form-label">Dog 1</label>
            <input type="text" className="form-control" id="txtDog1" required value={petOwner.dogs[0]} onChange={(evt) => setPetOwner({...petOwner, dogs:[evt.target.value,...petOwner.dogs.slice(1)]})}  />
            <div className="valid-feedback">
              Looks good!
            </div>
            <div className="invalid-feedback">
              Please Enter Your Dog&apos;s Name
            </div>
        </div>
        <div className="col-md-4">
            <label htmlFor="txtDog2" className="form-label">Dog 2</label>
            <input type="text" className="form-control" id="txtDog2" value={petOwner.dogs[1]} onChange={(evt) => setPetOwner({...petOwner,dogs:[petOwner.dogs[0],evt.target.value,...petOwner.dogs.slice(2)]})} />
         </div>
         <div className="col-md-4">
            <label htmlFor="txtDog3" className="form-label">Dog 3</label>
            <input type="text" className="form-control" id="txtDog3" value={petOwner.dogs[2]} onChange={(evt) => setPetOwner({...petOwner,dogs:[petOwner.dogs[0], petOwner.dogs[1],evt.target.value,...petOwner.dogs.slice(3)]})} />
         </div>
        </div>
        <button type="submit" className="btn btn-primary">Submit form</button>
        <NavLink to="/pet-owners" className="btn btn-secondary ms-2">Cancel</NavLink>
      </form>
    </>
  )
};