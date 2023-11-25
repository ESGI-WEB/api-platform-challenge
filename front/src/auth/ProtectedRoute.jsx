import {
  Navigate, useLocation,
} from 'react-router-dom';
import useAuth, {Roles} from "./useAuth.js";

export default function ProtectedRoute ({
  requiredRoles = [Roles.USER],
  children
}) {
  const {token, data} = useAuth();
  const location = useLocation();
  const hasRoleRequired = data && data.roles.some((role) => requiredRoles.includes(role));

  if (!token || !hasRoleRequired) {
    return <Navigate to="/login" state={{from: location}} />;
  }

  return children;
}
