import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useSelector } from '../../services/store';
import { getUser, getUserIsLoading } from '../../services/slices/userSlice';
import { Preloader } from '@ui';

export const ProtectedRoute = ({ auth }: { auth?: boolean }) => {
  const user = useSelector(getUser);
  const userIsLoading = useSelector(getUserIsLoading);
  const location = useLocation();
  if (userIsLoading) return <Preloader />;
  if (!user && !auth)
    return <Navigate to='/login' state={{ from: location }} />;
  if (auth && user) {
    const from = location.state?.from || { pathname: '/' };
    return <Navigate replace to={from} />;
  }
  return <Outlet />;
};
