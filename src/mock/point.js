import {getRandomInteger, shuffle} from "../utils/common.js";

// Date.now() и Math.random() - плохие решения для генерации id
// в "продуктовом" коде, а для моков самое то.
// Для "продуктового" кода используйте что-то понадежнее,
// вроде nanoid - https://github.com/ai/nanoid
const generateId = () => Date.now() + parseInt(Math.random() * 10000, 10);

const types = [
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

const dests = [
  `Amsterdam`,
  `Chamonix`,
  `Geneva`,
  `Paris`,
  `Berlin`,
  `Mosow`,
];

const TimePeriodInMinute = {
  MIN: 10,
  MAX: 60 * 12,
};

const Price = {
  MIN: 5,
  MAX: 200,
};

const OfferCount = {
  MIN: 0,
  MAX: 2,
};

const description =
  `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, non porta ligula feugiat eget. Fusce tristique felis at fermentum pharetra. Aliquam id orci ut lectus varius viverra. Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante. Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum. Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui. Sed sed nisi sed augue convallis suscipit in sed felis. Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus.`;

const offersStructure = {
  luggage: {
    name: `luggage`,
    title: `Add luggage`,
    price: 10,
    checked: Boolean(getRandomInteger(0, 1)),
  },
  comfort: {
    name: `comfort`,
    title: `Switch to comfort class`,
    price: 150,
    checked: Boolean(getRandomInteger(0, 1)),
  },
  meal: {
    name: `meal`,
    title: `Add meal`,
    price: 2,
    checked: Boolean(getRandomInteger(0, 1)),
  },
  seats: {
    name: `seats`,
    title: `Choose seats`,
    price: 9,
    checked: Boolean(getRandomInteger(0, 1)),
  },
  train: {
    name: `train`,
    title: `Travel by train`,
    price: 40,
    checked: Boolean(getRandomInteger(0, 1)),
  },
};

const getOfferNames = () => {
  const names = [];
  for (let key in offersStructure) {
    if (key !== undefined) {
      names.push(offersStructure[key].name);
    }
  }
  return names;
};

const getOffer = (names) => {
  return names.map((it) => offersStructure[it]);
};

const offerNames = getOfferNames();

const typeToOffer = new Map();

types.forEach((type) => {
  const count = getRandomInteger(OfferCount.MIN, OfferCount.MAX);
  typeToOffer.set(type, getOffer(shuffle(offerNames.slice()).slice(count === 0 ? offerNames.length : -1 * count)));
});

const generateDescription = () => {
  const randomMax = 5;
  const randomMin = 1;

  const sentenses = description.split(`.`);

  return new Array(getRandomInteger(randomMin, randomMax))
    .fill(``)
    .map(() => sentenses[getRandomInteger(0, sentenses.length - 1)])
    .join(`.`);
};

const getPointType = () => {
  const randomIndex = getRandomInteger(0, types.length - 1);

  return types[randomIndex];
};

const getDestination = () => {
  const randomIndex = getRandomInteger(0, dests.length - 1);
  return dests[randomIndex];
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

const generatePoint = () => {
  let currentDate = new Date(2020, 9, 8);
  const type = getPointType();
  return {
    id: generateId(),
    description: generateDescription(),
    type,
    destination: getDestination(),
    destinationList: dests,
    dueDate: getDate(currentDate),
    photos: getPhotos(),
    price: getRandomInteger(Price.MIN, Price.MAX),
    offers: typeToOffer.get(type),
    offersList: offersStructure
  };
};

export {generatePoint, offersStructure, offerNames};
