import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function GoogleSuccess() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const token = query.get("token");
    const userName = query.get("name");

    if (token) {
      localStorage.setItem("token", token);
      localStorage.setItem("userName",userName)
      navigate("/home");
    }
  }, [location, navigate]);

  return <div>Logging you in...</div>;
}
