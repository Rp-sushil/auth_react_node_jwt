import React from "react";
import { my_app } from "../utils/helpers";
import { authenticate, isAuth } from "../utils/helpers";
import Layout from "./Layout";

export default function Login({ history }) {
  const handleSubmit = async (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;
    console.log(email, password);
    await my_app
      .post("/auth/login", {
        email,
        password,
      })
      .then((res) => {
        console.log(res);
        authenticate(res, () => {
          console.log(":) Logged IN!!", res.data);
          isAuth() ? history.push("/dashboard") : history.push("/login");
        });
      })
      .catch((err) => {
        if (err?.reponse?.data?.message)
          console.log(":(", err.reponse.data.message);
      });
    return;
  };
  return (
    <Layout>
      <form className="form" onSubmit={handleSubmit} style={style}>
        <input name="email" required type="email" placeholder="email"></input>
        <input
          name="password"
          required
          type="password"
          placeholder="password"
        ></input>
        <button type="submit">Login</button>
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
