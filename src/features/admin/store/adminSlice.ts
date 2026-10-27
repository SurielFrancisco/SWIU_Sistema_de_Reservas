import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { FloorLayout, ManagedRestaurant, RestaurantArea, TableInfo } from '@/features/restaurants/types';

export interface AdminState {
  restaurants: ManagedRestaurant[];
}

const initialState: AdminState = { restaurants: [] };

const getRestaurant = (state: AdminState, restaurantId: string) =>
  state.restaurants.find((restaurant) => restaurant.id === restaurantId);

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    createRestaurant: (state, action: PayloadAction<ManagedRestaurant>) => {
      state.restaurants.push(action.payload);
    },
    updateRestaurant: (state, action: PayloadAction<Pick<ManagedRestaurant, 'id' | 'name' | 'type' | 'location' | 'image'>>) => {
      const restaurant = getRestaurant(state, action.payload.id);
      if (restaurant) Object.assign(restaurant, action.payload);
    },
    setRestaurantStatus: (state, action: PayloadAction<{ restaurantId: string; status: ManagedRestaurant['status'] }>) => {
      const restaurant = getRestaurant(state, action.payload.restaurantId);
      if (restaurant) restaurant.status = action.payload.status;
    },
    addFloor: (state, action: PayloadAction<{ restaurantId: string; floor: FloorLayout }>) => {
      const restaurant = getRestaurant(state, action.payload.restaurantId);
      if (restaurant) restaurant.layout.floors.push(action.payload.floor);
    },
    removeFloor: (state, action: PayloadAction<{ restaurantId: string; floorId: string }>) => {
      const restaurant = getRestaurant(state, action.payload.restaurantId);
      if (restaurant && restaurant.layout.floors.length > 1) {
        restaurant.layout.floors = restaurant.layout.floors.filter((floor) => floor.id !== action.payload.floorId);
      }
    },
    addArea: (state, action: PayloadAction<{ restaurantId: string; floorId: string; area: RestaurantArea }>) => {
      const floor = getRestaurant(state, action.payload.restaurantId)?.layout.floors.find((item) => item.id === action.payload.floorId);
      if (floor) (floor.areas ||= []).push(action.payload.area);
    },
    updateArea: (state, action: PayloadAction<{ restaurantId: string; floorId: string; areaId: string; changes: Partial<Pick<RestaurantArea, 'name' | 'position' | 'size' | 'color'>> }>) => {
      const floor = getRestaurant(state, action.payload.restaurantId)?.layout.floors.find((item) => item.id === action.payload.floorId);
      const area = floor?.areas?.find((item) => item.id === action.payload.areaId);
      if (area) Object.assign(area, action.payload.changes);
    },
    removeArea: (state, action: PayloadAction<{ restaurantId: string; floorId: string; areaId: string }>) => {
      const floor = getRestaurant(state, action.payload.restaurantId)?.layout.floors.find((item) => item.id === action.payload.floorId);
      if (floor?.areas) floor.areas = floor.areas.filter((area) => area.id !== action.payload.areaId);
    },
    addTable: (state, action: PayloadAction<{ restaurantId: string; floorId: string; table: TableInfo }>) => {
      const floor = getRestaurant(state, action.payload.restaurantId)?.layout.floors.find((item) => item.id === action.payload.floorId);
      if (floor) floor.tables.push(action.payload.table);
    },
    removeTable: (state, action: PayloadAction<{ restaurantId: string; floorId: string; tableId: string }>) => {
      const floor = getRestaurant(state, action.payload.restaurantId)?.layout.floors.find((item) => item.id === action.payload.floorId);
      if (floor) floor.tables = floor.tables.filter((table) => table.id !== action.payload.tableId);
    },
    moveTable: (state, action: PayloadAction<{ restaurantId: string; floorId: string; tableId: string; position: TableInfo['position'] }>) => {
      const floor = getRestaurant(state, action.payload.restaurantId)?.layout.floors.find((item) => item.id === action.payload.floorId);
      const table = floor?.tables.find((item) => item.id === action.payload.tableId);
      if (table) table.position = action.payload.position;
    },
    setTableStatus: (state, action: PayloadAction<{ restaurantId: string; floorId: string; tableId: string; status: TableInfo['status'] }>) => {
      const floor = getRestaurant(state, action.payload.restaurantId)?.layout.floors.find((item) => item.id === action.payload.floorId);
      const table = floor?.tables.find((item) => item.id === action.payload.tableId);
      if (table) table.status = action.payload.status;
    },
    hydrateAdmin: (_state, action: PayloadAction<AdminState>) => action.payload,
  },
});

export const { createRestaurant, updateRestaurant, setRestaurantStatus, addFloor, removeFloor, addArea, updateArea, removeArea, addTable, removeTable, moveTable, setTableStatus, hydrateAdmin } = adminSlice.actions;
export default adminSlice.reducer;
