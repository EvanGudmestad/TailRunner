import { useState } from "react"
import axios from 'axios';
import { useNavigate } from "react-router-dom";

export default function RegisterUserForm({showSuccess,showError,setAuth}) {

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const navigate = useNavigate();

  const handleSubmit = async (evt) => {
    evt.preventDefault();
    
  
    try{
        const response = await axios.post('http://localhost:2024/api/users/register',{email, password}, {withCredentials: true});
  
        showSuccess('User registered successfully');
        navigate('/'); // Redirect to home page
        localStorage.setItem('auth', JSON.stringify(response.data)); //Save auth to local storage
        setAuth(response.data);
    }catch(err){
      console.log(err);
      if(err.response.data.errors){
        err.response.data.errors.forEach(error => {
          showError(error.message);
        });
      //showError('Error registering user');
    }
  }
}


  return(
    <>
     <form onSubmit={(evt) => handleSubmit(evt)}>
  <div className="mb-3">
    <label htmlFor="exampleInputEmail1" className="form-label">Email address :</label>
    <input type="email" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" required onChange={(evt) => setEmail(evt.target.value)} />
    <div id="emailHelp" className="form-text">We&apos;ll never share your email with anyone else.</div>
  </div>
  <div className="mb-3">
    <label htmlFor="exampleInputPassword1" className="form-label">Password </label>
    <input type="password" className="form-control" id="exampleInputPassword1" required onChange={(evt) => setPassword(evt.target.value)} />
  </div>

  <button type="submit" className="btn btn-primary">Submit</button>
</form>
    </>
  )

}