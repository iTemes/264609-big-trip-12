import {
  getRandomInteger,
  getRandomBool,
  getRandomArray,
  getRandomArrayValue,
  MoveDate,
  getRandomDate,
} from "../utils/common.js";

import {diffDate} from '../utils/date.js';
import {extend} from '../utils/common.js';

// Date.now() и Math.random() - плохие решения для генерации id
// в "продуктовом" коде, а для моков самое то.
// Для "продуктового" кода используйте что-то понадежнее,
// вроде nanoid - https://github.com/ai/nanoid
const generateId = () => Date.now() + parseInt(Math.random() * 10000, 10);

const moveDateConfig = {
  minute: 10,
  hour: 3,
  day: 7,
};

const POINT_TYPES = [
  `Taxi`,
  `Bus`,
  `Train`,
  `Ship`,
  `Transport`,
  `Drive`,
  `Flight`,
  `Check-in`,
  `Sightseeing`,
  `Restaurant`,
];

const DESTINATIONS = [
  `Amsterdam`,
  `Chamonix`,
  `Geneva`,
  `Paris`,
  `Berlin`,
  `Mosow`,
];

const DESCRIPTION =
  `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, non porta ligula feugiat eget. Fusce tristique felis at fermentum pharetra. Aliquam id orci ut lectus varius viverra. Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante. Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum. Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui. Sed sed nisi sed augue convallis suscipit in sed felis. Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus.`;

const TimePeriodInMinute = {
  MIN: 10,
  MAX: 60 * 12,
};

const PRICE = {
  MIN: 5,
  MAX: 200,
};

const OFFERCOUNT = {
  MIN: 0,
  MAX: 7,
};

const OFFERS = [
  {
    key: `luggage`,
    name: `Add luggage`,
    price: `30`,
    isActivated: getRandomBool(),
  },
  {
    key: `comfort`,
    name: `Switch to comfort class`,
    price: `100`,
    isActivated: getRandomBool(),
  },
  {
    key: `meal`,
    name: `Add meal`,
    price: `15`,
    isActivated: getRandomBool(),
  },
  {
    key: `seats`,
    name: `Choose seats`,
    price: `5`,
    isActivated: getRandomBool(),
  },
  {
    key: `train`,
    name: `Travel by train`,
    price: `40`,
    isActivated: getRandomBool(),
  },
];

const generateOffers = () => {
  const offers = getRandomArray(OFFERS, getRandomInteger(OFFERCOUNT.MIN, OFFERCOUNT.MAX));
  offers.forEach((offer) => {
    offer.isActivated = getRandomBool();
  });

  return offers;
};

const getDate = (date) => {
  return {
    start: new Date(date.setMinutes(date.getMinutes() + getRandomInteger(TimePeriodInMinute.MIN, TimePeriodInMinute.MAX))),
    end: new Date(date.setMinutes(date.getMinutes() + getRandomInteger(TimePeriodInMinute.MIN, TimePeriodInMinute.MAX))),
  };
};

const getPhotos = () => {
  return new Array(getRandomInteger(4, 7))
    .fill(``)
    .map(() => `http://picsum.photos/300/150?r=${Math.random()}`);
};

const generateDescription = () => {
  const randomMax = 5;
  const randomMin = 1;

  const sentenses = DESCRIPTION.split(`.`);

  return new Array(getRandomInteger(randomMin, randomMax))
    .fill(``)
    .map(() => sentenses[getRandomInteger(0, sentenses.length - 1)])
    .join(`.`);
};

const generatePoint = () => {
  let currentDate = new Date(2020, 9, 8);

  const dateStart = new Date(getRandomDate(moveDateConfig));
  const dateEnd = new Date(getRandomDate(extend(
      moveDateConfig,
      {
        dateStart,
        move: MoveDate.FUTURE,
      }
  )));
  return {
    id: generateId(),
    type: getRandomArrayValue(POINT_TYPES),
    destination: getRandomArrayValue(DESTINATIONS),
    start: dateStart,
    end: dateEnd,
    duration: diffDate(dateEnd, dateStart),
    description: generateDescription(),
    dueDate: getDate(currentDate),
    photos: getPhotos(),
    price: getRandomInteger(PRICE.MIN, PRICE.MAX),
    offers: generateOffers(),
    isFavorite: getRandomBool(),
  };
};

const generatePoints = (count) => new Array(count).fill().map(generatePoint);

export {generatePoints, DESTINATIONS};
