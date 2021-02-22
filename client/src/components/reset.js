import React, { useEffect, useState } from "react";
import Layout from "./Layout";
import { my_app } from "../utils/helpers";
import jwt_decode from "jwt-decode";
import { getCookie, updateUser } from "../utils/helpers";

export default function Reset() {
  const [values, setValues] = useState({
    name: "",
    email: "",
    password: "",
    newPassword: "",
    confirmPassword: "",
  });
  const { name, email, password, newPassword, confirmPassword } = values;
  useEffect(() => {
    const auth_token = getCookie("auth_token");
    let { name, email } = jwt_decode(auth_token);
    if (auth_token) {
      console.log(name, email);
      setValues((v) => ({ ...v, name, email }));
    }
  }, []);
  const handleChange = (evt) => {
    setValues({
      ...values,
      [evt.target.name]: evt.target.value,
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (confirmPassword != newPassword) {
      console.log("password do not match");
      return;
    }
    await my_app
      .post("/user/change-credentials", {
        name,
        email,
        password,
        newPassword,
      })
      .then((res) => {
        console.log(res);
        updateUser(res, () => {
          console.log("SUCCESS! Credentials changed.. ", res.data);
          setValues({
            password: "",
            newPassword: "",
            confirmPassword: "",
          });
        });
      })
      .catch((err) => {
        if (err?.response?.data) {
          console.log("FAILURE!, we encounterd error", err.response.data);
        }
      });
    return;
  };
  return (
    <div>
      <Layout>
        <form className="form" onSubmit={handleSubmit} style={style}>
          <input
            onChange={handleChange}
            name="name"
            required
            type="text"
            placeholder="Name"
            disabled
            value={name}
          />
          <input
            onChange={handleChange}
            name="email"
            required
            type="email"
            placeholder="email"
            value={email}
            disabled
          ></input>
          <input
            onChange={handleChange}
            name="password"
            required
            type="password"
            placeholder="password"
            value={password}
          ></input>
          <input
            onChange={handleChange}
            name="newPassword"
            required
            type="password"
            placeholder="new password"
            value={newPassword}
          ></input>
          <input
            onChange={handleChange}
            name="confirmPassword"
            required
            type="password"
            placeholder="confirm Password"
            value={confirmPassword}
          ></input>
          <button type="submit">Reset</button>
        </form>
      </Layout>
    </div>
  );
}

const style = {
  position: "relative",
  height: "100%",
  width: "200px",
  padding: "100px",
};
