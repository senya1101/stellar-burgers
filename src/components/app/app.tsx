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
import { ProtectedRoute } from '../protected-route';
import { TitleWrapper } from '../ui/title-wrapper';

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
        <Route
          path={'/feed/:number'}
          element={
            <TitleWrapper
              title={`#${location.pathname.split('/').pop()}`}
              children={<OrderInfo />}
            />
          }
        />
        <Route path={'/login'} element={<ProtectedRoute auth />}>
          <Route index element={<Login />} />
        </Route>
        <Route path={'/register'} element={<ProtectedRoute auth />}>
          <Route index element={<Register />} />
        </Route>
        <Route path={'/reset-password'} element={<ProtectedRoute auth />}>
          <Route index element={<ResetPassword />} />
        </Route>
        <Route path={'/forgot-password'} element={<ProtectedRoute auth />}>
          <Route index element={<ForgotPassword />} />
        </Route>
        <Route path={'/profile'} element={<ProtectedRoute />}>
          <Route index element={<Profile />} />
          <Route path={'orders'} element={<ProfileOrders />} />
          <Route
            path={'orders/:number'}
            element={
              <TitleWrapper
                title={`#${location.pathname.split('/').pop()}`}
                children={<OrderInfo />}
              />
            }
          />
        </Route>
        <Route
          path={'/ingredients/:id'}
          element={
            <TitleWrapper
              title={'Детали ингредиента'}
              children={<IngredientDetails />}
            />
          }
        />
        <Route path={'*'} element={<NotFound404 />} />
      </Routes>
      {background && (
        <Routes>
          <Route
            path={'/ingredients/:id'}
            element={
              <Modal
                title={'Детали ингредиента'}
                onClose={handleModalClose}
                children={<IngredientDetails />}
              />
            }
          />
          <Route path={'/profile/orders/:number'} element={<ProtectedRoute />}>
            <Route
              index
              element={
                <Modal
                  title={`#${location.pathname.split('/').pop()}`}
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
                title={`#${location.pathname.split('/').pop()}`}
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
