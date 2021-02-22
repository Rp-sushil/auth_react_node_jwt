import React, { Fragment } from "react";
import { Link, withRouter } from "react-router-dom";
import { isAuth, logout } from "../utils/helpers";
import axios from "axios";

const Layout = ({ children, match, history }) => {
  const isActive = (path) => {
    if (match.path === path) {
      return { color: "#f0f" };
    } else {
      return { color: "#000" };
    }
  };

  const nav = () => (
    <ul className="nav nav-tabs bg-primary">
      <li className="nav-item">
        <Link to="/" className="nav-link" style={isActive("/")}>
          Home
        </Link>
      </li>
      {!isAuth() && (
        <>
          <li className="nav-item">
            <Link to="/login" className="nav-link" style={isActive("/login")}>
              Login
            </Link>
          </li>
          <li className="nav-item">
            <Link
              to="/register"
              className="nav-link"
              style={isActive("/register")}
            >
              Register
            </Link>
          </li>
        </>
      )}

      {isAuth() && (
        <>
          <li className="nav-item">
            <Link
              to="/dashboard"
              className="nav-link"
              style={isActive("/dashboard")}
            >
              Dashboard
            </Link>
          </li>

          <li className="nav-item">
            <Link
              to="/change-credentials"
              className="nav-link"
              style={isActive("/change-credentials")}
            >
              change credentials
            </Link>
          </li>

          <li className="nav-item">
            <span
              className="nav-link"
              style={{ cursor: "pointer", color: "#000" }}
              onClick={() => {
                logout(() => {
                  history.push("/");
                });
              }}
            >
              logout
            </span>
          </li>
        </>
      )}
    </ul>
  );

  return (
    <Fragment>
      {nav()}
      <div className="container">{children}</div>
    </Fragment>
  );
};

export default withRouter(Layout);
