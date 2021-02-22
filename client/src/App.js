import React from "react";
import Routes from "./routes/Routes";
import { my_app, getCookie, logout, refreshTokens } from "./utils/helpers";
import jwt_decode from "jwt-decode";

my_app.defaults.baseURL = process.env.REACT_APP_SERVER_URL;

my_app.interceptors.request.use(async (config) => {
  if (!getCookie("auth_token")) {
    return config;
  }
  const { exp } = jwt_decode(getCookie("auth_token"));
  const expDate = new Date(parseInt(exp) * 1000);
  const currDate = new Date();
  console.log(currDate, expDate);

  if (currDate > expDate) {
    console.log("calling refresh token");
    await refreshTokens();
  }

  const authToken = getCookie("auth_token");
  const refreshToken = getCookie("refresh_token");
  config.headers["auth-token"] = authToken;
  config.headers["refresh-token"] = refreshToken;
  return config;
});

// null for success, and second parameter callback for failure
my_app.interceptors.response.use(null, (error) => {
  console.log(error.response);
  return Promise.reject(error);
});

function App() {
  return <Routes />;
}

export default App;
