import React, { useEffect, useState } from "react";
import api from "../api/api";

export default function Me() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchMe = async () => {
      try {
        const res = await api.get("/auth/users/me");
        setUser(res.data);
        console.log("ME DATA:", res.data);
      } catch (err) {
        console.log("ME ERROR:", err);
      }
    };

    fetchMe();
  }, []);

  return (
    <div>
      <h1>Me Page</h1>
      {user && <p>Hello, {user.userName}</p>}
    </div>
  );
}
