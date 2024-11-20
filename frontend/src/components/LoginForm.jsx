import { useState, useEffect } from "react";
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'react-toastify/dist/ReactToastify.css';

import "./LoginForm.css";
import axios from "axios";

import { useNavigate } from "react-router-dom";

export default function LoginForm({showSuccess, showError, setAuth}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  //const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

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
  }, []); // Run only once when the component loads

  const handleSubmit = async (e) => {
    e.preventDefault();
   
    try{
      let response = await axios.post(`http://localhost:2024/api/users/login`, { email, password }, { withCredentials: true });
      console.log(import.meta.env.VITE_API_URL);
      if(response.status === 200){
        if(response.data.message == 'Invalid email or password'){
         //setMessage(response.data.message);
          showError(response.data.message);
        }else{
          //setMessage(response.data.message);
          showSuccess(response.data.message);
          setAuth(response.data);
          localStorage.setItem('auth', JSON.stringify(response.data)); //Save auth to local storage
          navigate('/pet-owners');
        }
      }
      
      //setMessage(response.data.message);
    }catch(e){
      console.log(`Catch Block: ${e.response.data}`);
    }
  };

  return (
    <>
       <div className='login-container'>
     <div className="login-box">
     <h2 className="login-title">Login</h2>
     <form className="needs-validation login-form" noValidate onSubmit={handleSubmit}>
      <div className="mb-3">
        <label htmlFor="email" className="form-label ">Email address</label>
        <div className="input-group">
          <span className="input-group-text" id="email-addon">
            <i className="bi bi-envelope-fill input-icon"></i>
          </span>
          <input type="email" className="form-control input-field" id="email" aria-describedby="email-addon" value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <div className="invalid-feedback">
            Please enter a valid email address.
          </div>
        </div>
      </div>
      <div className="mb-3">
        <label htmlFor="password" className="form-label">Password</label>
        <div className="input-group">
          <span className="input-group-text" id="password-addon">
            <i className="bi bi-lock-fill input-icon"></i>
          </span>
          <input
            type={showPassword ? 'text' : 'password'}
            className="form-control input-field"
            id="password"
            aria-describedby="password-addon"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required minLength={5} 
          />
          <span className="input-group-text" onClick={() => setShowPassword(!showPassword)}>
            <i className={`input-icon bi ${showPassword ? 'bi-eye-slash-fill' : 'bi-eye-fill'}`}></i>
          </span>
          <div className="invalid-feedback">
          Please enter a password at least 5 characters long.
          </div>
        </div>
      </div>
      <button type="submit" className="btn btn-primary">Submit</button>
     
    </form>
    </div>
    </div>
    </>
  );
}
