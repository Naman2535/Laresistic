import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./nav.css";

const Navbar = () => {
  //getting local storage data
  const auth = localStorage.getItem("user");
  const navigate = useNavigate();
  //handling logout function just clear local storage and navigate to sign up page
  const logout = () => {
    localStorage.clear();
    navigate("/signup");
  };
  return (
    <div>
      <img
        className="logo"
        src="https://tiimg.tistatic.com/co_logo/1264650/naman-trading-co--v1.jpg"
        alt="logo"
      />
      {/* if user is logged in the shop full menu  */}
      {auth ? (
        <ul className="nav-ul">
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/shops">Shops</Link>
          </li>
          <li>
            <Link to="/bills">Bills</Link>
          </li>
          <li>
            <Link to="/payment">Payment</Link>
          </li>
          <li>
            <Link to="/details">Details</Link>
          </li>
          <li>
            <Link onClick={logout} to="/signup">
              Logout ({JSON.parse(auth).name})
            </Link>
          </li>
        </ul>
      ) : (
        <ul className="nav-ul nav-right">
          {" "}
          {/*if user is not logged in then show only login/sign up option*/}
          <li>
            <Link to="/signup">Sign Up</Link>
          </li>
          <li>
            <Link to="/login">Login</Link>
          </li>
        </ul>
      )}
    </div>
  );
};

export default Navbar;
