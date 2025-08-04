import { ProfileOrdersUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC } from 'react';
import { useSelector } from '../../services/store';
import { getUsersOrders } from '../../services/slices/userSlice';

export const ProfileOrders: FC = () => {
  const orders: TOrder[] = useSelector(getUsersOrders);

  return <ProfileOrdersUI orders={orders} />;
};
