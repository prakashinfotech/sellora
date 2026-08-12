import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../store';

export default function PrivateRoute() {
  const { token } = useSelector((state: RootState) => state.auth);
  return token ? <Outlet /> : <Navigate to="/login" replace />;
}
