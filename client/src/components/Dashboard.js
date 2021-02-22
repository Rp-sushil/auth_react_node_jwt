import React, { useState, useEffect } from "react";
import { my_app } from "../utils/helpers";
import Layout from "./Layout";

export default function Dashboard() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    my_app
      .get("/user/me")
      .then((res) => {
        console.log(":) GET USER SCUCCESS", res.data);
        setUser(res.data.user);
      })
      .catch((err) => {
        console.log("we have a problem here");
        if (err?.response?.data) {
          console.log(err.response.data);
        }
      });
  }, []);

  return (
    <Layout>
      <div className="userinfo">
        {!user ? (
          <li>Loading..!</li>
        ) : (
          <>
            <h3>Hello {user.name}!</h3>
            <h4>{user.email}</h4>
          </>
        )}
      </div>
    </Layout>
  );
}
