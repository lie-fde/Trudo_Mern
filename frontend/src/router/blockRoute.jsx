import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

export default function BlockRoute({ children }) {
  const { accessToken, loading } = useSelector((state) => state.auth);

  if (loading) return null;

  if (accessToken) return <Navigate to="/" replace />;

  return children;
}
