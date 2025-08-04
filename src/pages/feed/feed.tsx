import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import {
  getFeedAsync,
  getFeedIsLoading,
  getFeedOrders
} from '../../services/slices/feedSlice';
import {
  getIngredientsAsync,
  getIngredientsInit
} from '../../services/slices/constructorSlice';

export const Feed: FC = () => {
  const orders: TOrder[] = useSelector(getFeedOrders);
  const feedIsLoading = useSelector(getFeedIsLoading);
  const dispatch = useDispatch();
  const ingredientsInit = useSelector(getIngredientsInit);

  useEffect(() => {
    dispatch(getFeedAsync());
    if (!ingredientsInit) dispatch(getIngredientsAsync());
  }, []);

  function handleGetFeed() {
    dispatch(getFeedAsync());
  }

  return feedIsLoading ? (
    <Preloader />
  ) : (
    <FeedUI orders={orders} handleGetFeeds={handleGetFeed} />
  );
};
