import { FC, useEffect } from 'react';
import { Preloader } from '@ui';
import { IngredientDetailsUI } from '@ui';
import { useDispatch, useSelector } from '../../services/store';
import {
  getIngredients,
  getIngredientsAsync
} from '../../services/slices/constructorSlice';
import { useParams } from 'react-router-dom';

export const IngredientDetails: FC = () => {
  const { id } = useParams<{ id: string }>();
  const ingredients = useSelector(getIngredients);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getIngredientsAsync());
  }, []);
  const ingredientData = ingredients.find((x) => x._id === id);
  if (!ingredientData) {
    return <Preloader />;
  }
  return <IngredientDetailsUI ingredientData={ingredientData} />;
};
