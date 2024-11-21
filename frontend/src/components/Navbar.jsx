import { NavLink } from "react-router-dom";

const Navbar = ({auth, onLogout}) => {

  const onClickLogout = (evt) => {
    evt.preventDefault();
    onLogout();
  }
  return(
  <>
 <nav className="navbar navbar-expand-lg bg-body-tertiary">
  <div className="container-fluid">
    <a className="navbar-brand" href="#">Navbar</a>
    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
      <span className="navbar-toggler-icon"></span>
    </button>
    <div className="collapse navbar-collapse" id="navbarNav">
      <ul className="navbar-nav w-100">
       
        {auth ? 
        <>
         <li className="nav-item">
          <NavLink className="nav-link active" aria-current="page" to="/">Home</NavLink>
        </li>
         <li className="nav-item">
          <NavLink className="nav-link" to="/pet-owners">Registered Pet Owners</NavLink>
        </li>
        <li className="nav-item ms-lg-auto">
          <NavLink className="nav-link" to="/me">Welcome {auth.email}</NavLink>
        </li>
        <li className="nav-item">
          <button className="nav-link" onClick={(evt) => onClickLogout(evt)}>Logout</button>
        </li>
        </> :
        <>
          <li className="nav-item">
            <NavLink to="/login" className='nav-link'>Login</NavLink>
          </li>
          <li className="nav-item">
          <NavLink to="/register" className='nav-link'>Register</NavLink>
        </li>
        </>
          }
          
      </ul>
    </div>
  </div>
</nav>
  </>
  );
};

export default Navbar;