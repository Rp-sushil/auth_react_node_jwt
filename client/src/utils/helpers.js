import cookie from "js-cookie";
import axios from "axios";

export const my_app = axios.create({
  baseURL: process.env.REACT_APP_SERVER_URL,
});

const auth_app = axios.create({
  baseURL: process.env.REACT_APP_SERVER_URL,
});
export { auth_app };

auth_app.interceptors.request.use((config) => {
  const refresh_token = getCookie("refresh_token");
  config.headers["refresh-token"] = refresh_token;
  return config;
});

auth_app.interceptors.response.use(null, (err) => {
  if (err?.response?.status === 401) {
    clearCookiesLocalStorage();
    window.location.href("/");
    // logout(() => {
    //   console.log(err.response);
    //   window.location.href("/");
    // });
  }
  return Promise.reject(err);
});

// refresh token on expire
export const refreshTokens = async () => {
  console.log("you called this function");
  await auth_app
    .get("/auth/refresh")
    .then((response) => {
      console.log("REFRESHING TOKENS..", response);
      setCookie("auth_token", response.data.auth_token);
    })
    .catch((err) => {
      console.log(err.response);
    });
};

// set in cookie
export const setCookie = (key, value) => {
  if (window !== "undefined") {
    cookie.set(key, value, {
      expires: 1,
    });
  }
};
// remove from cookie
export const removeCookie = (key) => {
  if (window !== "undefined") {
    cookie.remove(key, {
      expires: 1,
    });
  }
};
// get from cookie such as stored token
// will be useful when we need to make request to server with token
export const getCookie = (key) => {
  if (window !== "undefined") {
    return cookie.get(key);
  }
};
// set in localstorage
export const setLocalStorage = (key, value) => {
  if (window !== "undefined") {
    localStorage.setItem(key, JSON.stringify(value));
  }
};
// remove from localstorage
export const removeLocalStorage = (key) => {
  if (window !== "undefined") {
    localStorage.removeItem(key);
  }
};
// authenticate user by passing data to cookie and localstorage during signin
// next is the callback function. You can pass any function to be executed
export const authenticate = (response, next) => {
  console.log("AUTHENTICATE HELPER ON SIGNIN RESPONSE", response);
  setCookie("auth_token", response.data.auth_token);
  setCookie("refresh_token", response.data.refresh_token);
  setLocalStorage("user", response.data.user);
  next();
};
// access user info from localstorage
export const isAuth = () => {
  if (window !== "undefined") {
    const cookieChecked = getCookie("auth_token");

    if (cookieChecked) {
      if (localStorage.getItem("user")) {
        return JSON.parse(localStorage.getItem("user"));
      }

      return false;
    }

    return false;
  }
};

// next is the callback function. You can pass any function to be executed
export const logout = async (next) => {
  await auth_app.delete("/auth/logout").then((res) => {
    console.log(res);
  });
  clearCookiesLocalStorage();
  next();
};

export const clearCookiesLocalStorage = () => {
  removeCookie("auth_token");
  removeCookie("refresh_token");
  removeLocalStorage("user");
};

export const updateUser = (response, next) => {
  console.log("UPDATE USER IN LOCALSTORAGE HELPERS", response);
  if (typeof window !== "undefined") {
    let auth = JSON.parse(localStorage.getItem("user"));
    auth = response.data.user;
    localStorage.setItem("user", JSON.stringify(auth));
  }
  next();
};
