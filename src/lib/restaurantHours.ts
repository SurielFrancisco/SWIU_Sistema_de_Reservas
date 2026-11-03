import type { ManagedRestaurant, RestaurantHours, RestaurantSchedule, Weekday } from '@/features/restaurants/types';

const DEFAULT_SCHEDULE: RestaurantSchedule = {
  monday: { enabled: true, open: '12:00', close: '22:00' },
  tuesday: { enabled: true, open: '12:00', close: '22:00' },
  wednesday: { enabled: true, open: '12:00', close: '22:00' },
  thursday: { enabled: true, open: '12:00', close: '22:00' },
  friday: { enabled: true, open: '12:00', close: '23:00' },
  saturday: { enabled: true, open: '12:00', close: '23:00' },
  sunday: { enabled: false, open: '12:00', close: '22:00' },
};

const WEEKDAYS: Weekday[] = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

export function getRestaurantSchedule(restaurant?: ManagedRestaurant): RestaurantSchedule {
  return restaurant?.schedule
    ? { ...DEFAULT_SCHEDULE, ...restaurant.schedule }
    : DEFAULT_SCHEDULE;
}

function toMinutes(value: string): number {
  const [hours, minutes] = value.split(':').map(Number);
  return hours * 60 + minutes;
}

export function isWithinRestaurantHours(hours: RestaurantHours, date = new Date()): boolean {
  if (!hours.enabled) return false;

  const currentMinutes = date.getHours() * 60 + date.getMinutes();
  const openingMinutes = toMinutes(hours.open);
  const closingMinutes = toMinutes(hours.close);

  if (closingMinutes > openingMinutes) {
    return currentMinutes >= openingMinutes && currentMinutes < closingMinutes;
  }

  return currentMinutes >= openingMinutes || currentMinutes < closingMinutes;
}

export function isRestaurantOpen(restaurant: ManagedRestaurant | undefined, date = new Date()): boolean {
  if (!restaurant) return false;
  const schedule = getRestaurantSchedule(restaurant);
  return isWithinRestaurantHours(schedule[WEEKDAYS[date.getDay()]], date);
}

export function getRestaurantHoursMessage(restaurant?: ManagedRestaurant, date = new Date()): string {
  if (!restaurant) return 'No se encontró el restaurante asignado.';

  const schedule = getRestaurantSchedule(restaurant);
  const hours = schedule[WEEKDAYS[date.getDay()]];
  if (!hours.enabled) return 'El restaurante está cerrado hoy.';
  return `El acceso está disponible de ${hours.open} a ${hours.close}.`;
}
