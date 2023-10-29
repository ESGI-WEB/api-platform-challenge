import {
  Navigate,
} from 'react-router-dom';
import useAuth, {Roles} from "./useAuth.js";

export default function ProtectedRoute ({
  requiredRole = Roles.USER,
  children
}) {
  const {token, data} = useAuth();
  const hasRoleRequired = data && data.roles.includes(requiredRole);

  if (!token || !hasRoleRequired) {
    return <Navigate to="/" replace />;
  }

  return children;
}
