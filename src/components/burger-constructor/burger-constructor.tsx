import { FC, useMemo } from 'react';
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import {
  closeOrder,
  getConstructorItems,
  getOrderModalData,
  getOrderRequest,
  orderAsync
} from '../../services/slices/constructorSlice/constructorSlice';
import { useDispatch, useSelector } from '../../services/store';
import { useNavigate } from 'react-router-dom';
import { getUser } from '../../services/slices/userSlice/userSlice';

export const BurgerConstructor: FC = () => {
  const dispatch = useDispatch();
  const constructorItems = useSelector(getConstructorItems);
  const user = useSelector(getUser);
  const orderRequest = useSelector(getOrderRequest);
  const navigate = useNavigate();

  const orderModalData = useSelector(getOrderModalData);

  const onOrderClick = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    if (!constructorItems.bun || orderRequest) return;
    const order = [
      constructorItems.bun._id,
      ...constructorItems.ingredients.map((x) => x._id),
      constructorItems.bun._id
    ];
    dispatch(orderAsync(order));
  };
  const closeOrderModal = () => {
    dispatch(closeOrder());
  };

  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
      constructorItems.ingredients.reduce(
        (s: number, v: TConstructorIngredient) => s + v.price,
        0
      ),
    [constructorItems]
  );

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
