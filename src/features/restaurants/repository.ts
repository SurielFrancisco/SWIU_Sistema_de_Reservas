import {
  RESERVATION_PAYMENT_OPTIONS,
  RESTAURANT_LAYOUTS,
  RESTAURANTS_LIST,
} from './data/mockRestaurants';
import type { Restaurant } from './types';

export const getRestaurantById = (id: string | undefined): Restaurant | undefined =>
  RESTAURANTS_LIST.find((restaurant) => restaurant.id === id);

export const getRestaurantLayout = (id: string | undefined) =>
  id ? RESTAURANT_LAYOUTS[id] : undefined;

export const getPaymentOption = (restaurantId: string | undefined) =>
  restaurantId ? RESERVATION_PAYMENT_OPTIONS[restaurantId] : undefined;

export { RESTAURANTS_LIST };
