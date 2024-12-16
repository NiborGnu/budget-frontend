import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Collapse } from "reactstrap";
import Logout from "./Logout";
import "../styles/components/Navbar.css";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const checkLoginState = () => {
      const token = localStorage.getItem("access_token");
      setIsLoggedIn(!!token);
      setLoading(false);
    };

    // Check login state initially
    checkLoginState();

    // Listen for login/logout events
    const handleLoginEvent = () => checkLoginState();

    window.addEventListener("loginSuccess", handleLoginEvent);
    window.addEventListener("logoutSuccess", handleLoginEvent);

    return () => {
      window.removeEventListener("loginSuccess", handleLoginEvent);
      window.removeEventListener("logoutSuccess", handleLoginEvent);
    };
  }, []);

  const toggleNavbar = () => setIsOpen(!isOpen);
  const closeNavbar = () => setIsOpen(false);
  const handleClickOutside = (e) => {
    if (
      !e.target.closest(".navbar-collapse") &&
      !e.target.closest(".navbar-toggler")
    ) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);
  const isActive = (path) => location.pathname === path;

  if (loading) {
    return null;
  }

  return (
    <div>
      {/* Sidebar for large screens */}
      <div className="d-none d-md-block sidebar">
        <nav className="navbar navbar-expand-lg navbar-light flex-column">
          <ul className="navbar-nav">
            {isLoggedIn ? (
              <>
                <li className="nav-item">
                  <Link
                    to="/"
                    className={`nav-link ${isActive("/") ? "active" : ""}`}
                  >
                    Dashboard
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    to="/transactions"
                    className={`nav-link ${
                      isActive("/transactions") ? "active" : ""
                    }`}
                  >
                    Transactions
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    to="/budgets"
                    className={`nav-link ${
                      isActive("/budgets") ? "active" : ""
                    }`}
                  >
                    Budgets
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    to="/profile"
                    className={`nav-link ${
                      isActive("/profile") ? "active" : ""
                    }`}
                  >
                    Profile
                  </Link>
                </li>
                <li className="nav-item ml-auto">
                  <Logout />
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link
                    to="/register"
                    className={`nav-link ${
                      isActive("/register") ? "active" : ""
                    }`}
                  >
                    Register
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    to="/login"
                    className={`nav-link ${isActive("/login") ? "active" : ""}`}
                  >
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
        <nav className="navbar navbar-expand-lg navbar-light">
          <button
            className="navbar-toggler"
            type="button"
            onClick={toggleNavbar}
            aria-controls="navbarNav"
            aria-expanded={isOpen ? "true" : "false"}
            aria-label="Toggle navigation"
            style={{ marginLeft: "10px" }}
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <Collapse isOpen={isOpen} className="navbar-collapse">
            <ul className="navbar-nav">
              {isLoggedIn ? (
                <>
                  <li className="nav-item">
                    <Link
                      to="/"
                      className={`nav-link ${isActive("/") ? "active" : ""}`}
                      onClick={closeNavbar}
                    >
                      Dashboard
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link
                      to="/transactions"
                      className={`nav-link ${
                        isActive("/transactions") ? "active" : ""
                      }`}
                      onClick={closeNavbar}
                    >
                      Transactions
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link
                      to="/budgets"
                      className={`nav-link ${
                        isActive("/budgets") ? "active" : ""
                      }`}
                      onClick={closeNavbar}
                    >
                      Budgets
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link
                      to="/profile"
                      className={`nav-link ${
                        isActive("/profile") ? "active" : ""
                      }`}
                      onClick={closeNavbar}
                    >
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
                    <Link
                      to="/register"
                      className={`nav-link ${
                        isActive("/register") ? "active" : ""
                      }`}
                      onClick={closeNavbar}
                    >
                      Register
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link
                      to="/login"
                      className={`nav-link ${
                        isActive("/login") ? "active" : ""
                      }`}
                      onClick={closeNavbar}
                    >
                      Login
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </Collapse>
        </nav>
      </div>
    </div>
  );
};

export default Navbar;
