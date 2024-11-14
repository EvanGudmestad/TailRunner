import { useState, useEffect } from "react";
import 'bootstrap-icons/font/bootstrap-icons.css';

import "./LoginForm.css";
import axios from "axios";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
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
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    axios
      .post("http://localhost:2024/api/users/login", { email, password })
      .then((res) => {
        setMessage(res.data.message);
      })
      .catch((err) => {
        console.log(err.response.data);
      });
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
      <h2>{message}</h2>
    </form>
    </div>
    </div>
    </>
  );
}
