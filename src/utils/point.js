export const getDuration = (start, end) => {
  const interval = new Date(end - start);
  const days = interval.getDate() - 1;
  const hours = interval.getUTCHours();
  const minutes = interval.getMinutes();

  return `${days === 0 ? `` : castTimeFormat(days) + `D `}\
  ${hours === 0 ? `` : castTimeFormat(hours) + `H `}\
  ${minutes === 0 ? `` : castTimeFormat(minutes) + `M`}`;
};

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

const getWeightForNullDate = (dateA, dateB) => {
  if (dateA === null && dateB === null) {
    return 0;
  }

  if (dateA === null) {
    return 1;
  }

  if (dateB === null) {
    return -1;
  }

  return null;
};

export const sortUp = (pointA, pointB) => {
  const weight = getWeightForNullDate(pointA.start, pointB.start);

  if (weight !== null) {
    return weight;
  }
  return pointB.duration - pointA.duration;
};

export const sortPrice = (pointA, pointB) => {
  return pointB.price - pointA.price;
};

