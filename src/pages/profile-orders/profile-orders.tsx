import { ProfileOrdersUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import {
  getOrdersIsLoading,
  getUsersOrders,
  getUsersOrdersAsync
} from '../../services/slices/userSlice';
import { Preloader } from '@ui';
import { getIngredientsAsync } from '../../services/slices/constructorSlice';

export const ProfileOrders: FC = () => {
  const dispatch = useDispatch();
  const orders: TOrder[] = useSelector(getUsersOrders);
  const ordersIsLoading = useSelector(getOrdersIsLoading);

  useEffect(() => {
    Promise.all([
      dispatch(getIngredientsAsync()),
      dispatch(getUsersOrdersAsync())
    ]);
  }, []);
  if (ordersIsLoading) return <Preloader />;
  return <ProfileOrdersUI orders={orders} />;
};
