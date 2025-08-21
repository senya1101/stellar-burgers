import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import {
  getFeedAsync,
  getFeedIsLoading,
  getFeedOrders
} from '../../services/slices/feedSlice/feedSlice';
import {
  getIngredientsAsync,
  getIngredientsIsLoading
} from '../../services/slices/constructorSlice/constructorSlice';

export const Feed: FC = () => {
  const orders: TOrder[] = useSelector(getFeedOrders);
  const feedIsLoading = useSelector(getFeedIsLoading);
  const ingredientsIsLoading = useSelector(getIngredientsIsLoading);
  const dispatch = useDispatch();

  useEffect(() => {
    Promise.all([dispatch(getIngredientsAsync()), dispatch(getFeedAsync())]);
  }, []);

  function handleGetFeed() {
    Promise.all([dispatch(getIngredientsAsync()), dispatch(getFeedAsync())]);
  }

  return feedIsLoading || ingredientsIsLoading ? (
    <Preloader />
  ) : (
    <FeedUI orders={orders} handleGetFeeds={handleGetFeed} />
  );
};
