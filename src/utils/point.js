export const formatTime = (date) => {
  const hours = castTimeFormat(date.getHours());
  const minutes = castTimeFormat(date.getMinutes());

  return `${hours}:${minutes}`;
};

export const castTimeFormat = (value) => {
  return value < 10 ? `0${value}` : String(value);
};

export const formatDate = (date) => {
  const years = castTimeFormat(date.getFullYear()).slice(-2);
  const months = castTimeFormat(date.getMonth() + 1);
  const days = castTimeFormat(date.getDate());

  return `${days}/${months}/${years}`;
};
