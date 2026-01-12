import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { setCredentials } from "../store/authSlice";

export default function GoogleSuccess() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch()

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const accessToken = query.get("accessToken");
    const userName = query.get("name");
     const userEmail = query.get("email");

     if (!accessToken) {
      navigate("/login");
      return;
    }

     dispatch(setCredentials({ accessToken ,userName, userEmail }));



  //   if (token) {
  //     localStorage.setItem("token", token);
  //     localStorage.setItem("userName",userName)
  //     navigate("/");
  //   }
   navigate("/");
   },
    [location, navigate]);

    

  return <div>Logging you in...</div>;
}
