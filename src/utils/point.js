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
  const weight = getWeightForNullDate(pointA.dueDate.start, pointB.dueDate.start);
  console.log('###', pointA.dueDate.start)
  console.log('###', pointB.dueDate.start)
  if (weight !== null) {
    return weight;
  }

  return pointA.dueDate.start.getTime() - pointB.dueDate.start.getTime();
};

export const sortDown = (pointA, pointB) => {
  const weight = getWeightForNullDate(pointA.dueDate.start, pointB.dueDate.start);

  if (weight !== null) {
    return weight;
  }

  return pointB.dueDate.start.getTime() - pointA.dueDate.start.getTime();
};
