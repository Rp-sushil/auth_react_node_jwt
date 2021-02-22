import React from "react";
import { my_app } from "../utils/helpers";
import Layout from "./Layout";

export default function Register({ history }) {
  const handleSubmit = async (e) => {
    e.preventDefault();
    const name = e.target.name.value;
    const email = e.target.email.value;
    const password = e.target.password.value;
    const confirmPassword = e.target.confirmPassword.value;
    if (confirmPassword != password) {
      console.log("password do not match");
      return;
    }
    await my_app
      .post("/auth/register", {
        name,
        email,
        password,
      })
      .then((res) => {
        console.log("SUCCESS! Account Registered.. ", res.data);
        history.push("/login");
      })
      .catch((err) => {
        if (err?.response?.data) {
          console.log("FAILURE!, we encounterd error", err.response.data);
          if (err.response.data.message == "Email already exists!") {
            alert(":) Already Registered! Try logging In!");
          }
        }
      });
    return;
  };
  return (
    <Layout>
      <form className="form" onSubmit={handleSubmit} style={style}>
        <input name="name" required type="text" placeholder="Name" />
        <input name="email" required type="email" placeholder="email"></input>
        <input
          name="password"
          required
          type="password"
          placeholder="password"
        ></input>
        <input
          name="confirmPassword"
          required
          type="password"
          placeholder="confirm Password"
        ></input>
        <button type="submit">Register</button>
      </form>
    </Layout>
  );
}

const style = {
  position: "relative",
  height: "100%",
  width: "200px",
  padding: "100px",
};
