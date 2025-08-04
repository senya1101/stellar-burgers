import {
  ConstructorPage,
  Feed,
  ForgotPassword,
  Login,
  NotFound404,
  Profile,
  ProfileOrders,
  Register,
  ResetPassword
} from '@pages';
import '../../index.css';
import styles from './app.module.css';

import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { AppHeader, IngredientDetails, Modal, OrderInfo } from '@components';
import { ProtectedRoute } from '../protected-route/ProtectedRoute';

const App = () => {
  const location = useLocation();
  const background = location.state?.background;
  const navigate = useNavigate();

  function handleModalClose() {
    navigate(-1);
  }

  return (
    <div className={styles.app}>
      <AppHeader />
      <Routes location={background || location}>
        <Route path='/' element={<ConstructorPage />} />
        <Route path={'/feed'} element={<Feed />} />
        <Route path={'/login'} element={<ProtectedRoute />}>
          <Route index element={<Login />} />
        </Route>
        <Route path={'/register'} element={<ProtectedRoute />}>
          <Route index element={<Register />} />
        </Route>
        <Route path={'/reset-password'} element={<ProtectedRoute />}>
          <Route index element={<ResetPassword />} />
        </Route>
        <Route path={'/forgot-password'} element={<ProtectedRoute />}>
          <Route index element={<ForgotPassword />} />
        </Route>
        <Route path={'/profile'} element={<ProtectedRoute />}>
          <Route index element={<Profile />} />
          <Route path={'orders'} element={<ProfileOrders />} />
        </Route>
        <Route path={'/ingredients/:id'} element={<IngredientDetails />} />
        <Route path={'*'} element={<NotFound404 />} />
      </Routes>
      {background && (
        <Routes>
          <Route
            path={'/ingredients/:id'}
            element={
              <Modal
                title={''}
                onClose={handleModalClose}
                children={<IngredientDetails />}
              />
            }
          />
          <Route path={'/profile/order/:number'} element={<ProtectedRoute />}>
            <Route
              index
              element={
                <Modal
                  title={''}
                  onClose={handleModalClose}
                  children={<OrderInfo />}
                />
              }
            />
          </Route>
          <Route
            path={'/feed/:number'}
            element={
              <Modal
                title={''}
                onClose={handleModalClose}
                children={<OrderInfo />}
              />
            }
          />
        </Routes>
      )}
    </div>
  );
};

export default App;
