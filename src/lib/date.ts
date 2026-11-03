export const getLocalDate = (date = new Date()) => {
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${date.getFullYear()}-${month}-${day}`;
};

export const getLocalTime = (date = new Date()) => {
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');

  return `${hours}:${minutes}`;
};

export const getNextReservationSlot = (date = new Date()) => {
  const nextSlot = new Date(date);
  const minutes = nextSlot.getMinutes();
  nextSlot.setMinutes(minutes + (30 - (minutes % 30)), 0, 0);

  return {
    date: getLocalDate(nextSlot),
    time: getLocalTime(nextSlot),
  };
};
