import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Collapse } from "reactstrap";
import Logout from "./Logout";
import "../styles/components/Navbar.css";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleLoginSuccess = (event) => {
      if (event.detail === true) {
        setIsLoggedIn(true);
      }
    };

    const handleLogoutSuccess = (event) => {
      if (event.detail === true) {
        setIsLoggedIn(false);
      }
    };

    window.addEventListener("loginSuccess", handleLoginSuccess);
    window.addEventListener("logoutSuccess", handleLogoutSuccess);

    return () => {
      window.removeEventListener("loginSuccess", handleLoginSuccess);
      window.removeEventListener("logoutSuccess", handleLogoutSuccess);
    };
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    setIsLoggedIn(!!token);
    setLoading(false);
  }, []);

  const toggleNavbar = () => setIsOpen(!isOpen);

  if (loading) {
    return null;
  }

  return (
    <div>
      {/* Sidebar for large screens */}
      <div className="d-none d-md-block sidebar">
        <nav className="navbar navbar-expand-lg navbar-light bg-light flex-column">
          <ul className="navbar-nav">
            {isLoggedIn ? (
              <>
                <li className="nav-item">
                  <Link to="/dashboard" className="nav-link">
                    Dashboard
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/transactions" className="nav-link">
                    Transactions
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/budgets" className="nav-link">
                    Budgets
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/profile" className="nav-link">
                    Profile
                  </Link>
                </li>
                <li className="nav-item">
                  <Logout />
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link to="/register" className="nav-link">
                    Register
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/login" className="nav-link">
                    Login
                  </Link>
                </li>
              </>
            )}
          </ul>
        </nav>
      </div>

      {/* Top Navbar for small screens */}
      <div className="d-md-none">
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
          <button
            className="navbar-toggler"
            type="button"
            onClick={toggleNavbar}
            aria-controls="navbarNav"
            aria-expanded={isOpen ? "true" : "false"}
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <Collapse isOpen={isOpen}>
            <div className="collapse navbar-collapse" id="navbarNav">
              <ul className="navbar-nav">
                {isLoggedIn ? (
                  <>
                    <li className="nav-item">
                      <Link to="/profile" className="nav-link">
                        Profile
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Logout />
                    </li>
                  </>
                ) : (
                  <>
                    <li className="nav-item">
                      <Link to="/register" className="nav-link">
                        Register
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link to="/login" className="nav-link">
                        Login
                      </Link>
                    </li>
                  </>
                )}
              </ul>
            </div>
          </Collapse>
        </nav>
      </div>
    </div>
  );
};

export default Navbar;
