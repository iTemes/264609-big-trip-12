import {
  MINUTE,
  HOUR,
  DAY,
} from '../const.js';

export const MoveDate = {
  PAST: `past`,
  FUTURE: `future`,
  RANDOM: `random`,
};

// Функция из интернета по генерации случайного числа из диапазона
// Источник - https://github.com/you-dont-need/You-Dont-Need-Lodash-Underscore#_random
export const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

export const getRandomBool = () => Math.random() > 0.5;

export const getRandomArray = (arr, length = arr.length) => arr
    .slice()
    .sort(() => Math.random() - 0.5)
    .slice(0, length);

export const getRandomArrayValue = (arr) => arr[Math.floor(Math.random() * arr.length)];

export const extend = (a, ...b) => Object.assign({}, a, ...b);

export const toFirstUpperCase = (word) => word[0].toUpperCase() + word.slice(1);

export const getRandomDate = ({date = new Date(), minute = 59, hour = 24, day = 365, move = MoveDate.RANDOM}) => {
  let sign = null;
  switch (move) {
    case MoveDate.PAST:
      sign = -1;
      break;
    case MoveDate.FUTURE:
      sign = 1;
      break;
    case MoveDate.RANDOM:
      sign = getRandomBool ? 1 : -1;
      break;

    default: throw new Error(`Bad move date value`);
  }

  return (
    +date
    + sign * (
      getRandomInteger(0 * MINUTE, minute * MINUTE)
      + getRandomInteger(0, hour * HOUR)
      + getRandomInteger(0, day * DAY)
    )
  );
};
