import AbstractView from "../abstract.js";
import {getPointTypeWithPreposition} from '../../utils/type-preposition';
import {
  formatDateISODdMmYyyyHhMm,
  convertNumberOfDate,
  convertMsToDHM,
} from '../../utils/date.js';

const OFFERS_COUNT = 3;

const convertDurationValue = (duration) => {
  const {day, hour, minute} = duration;
  if (day > 0) {
    return `${convertNumberOfDate(day)}D ${convertNumberOfDate(hour)}H ${convertNumberOfDate(minute)}M`;
  }

  return `${hour > 0 ? `${convertNumberOfDate(hour)}H` : ``} ${convertNumberOfDate(minute)}M`;
};

const createOfferTemplate = (offer) => {
  const {name, price} = offer;
  return (
    `<li class="event__offer">
      <span class="event__offer-title">${name}</span>
      &plus;
      &euro;&nbsp;<span class="event__offer-price">${price}</span>
    </li>`
  );
};

const createPointTemplate = (point) => {
  const {
    type,
    start,
    end,
    duration,
    price,
    offers,
    destination,
  } = point;

  const durationValue = convertDurationValue(convertMsToDHM(duration));
  const formatedStartDate = formatDateISODdMmYyyyHhMm(start);
  const formatedEndDate = formatDateISODdMmYyyyHhMm(end);

  return (
    `<div class="event">
      <div class="event__type">
        <img class="event__type-icon" width="42" height="42" src="img/icons/${type.toLowerCase()}.png" alt="Event type icon">
      </div>
      <h3 class="event__title">${getPointTypeWithPreposition(type)} ${destination}</h3>

      <div class="event__schedule">
        <p class="event__time">
          <time class="event__start-time" datetime="${formatedStartDate}">${formatedStartDate.split(`T`)[1]}</time>
          &mdash;
          <time class="event__end-time" datetime="${formatedEndDate}">${formatedEndDate.split(`T`)[1]}</time>
        </p>
        <p class="event__duration">${durationValue}</p>
      </div>

      <p class="event__price">
        &euro;&nbsp;<span class="event__price-value">${price}</span>
      </p>

      <h4 class="visually-hidden">Offers:</h4>
      <ul class="event__selected-offers">
      ${offers
        .filter((offer) => offer.isActivated === true)
        .slice(0, OFFERS_COUNT)
        .map(createOfferTemplate).join(``)}
      </ul>

      <button class="event__rollup-btn" type="button">
        <span class="visually-hidden">Open event</span>
      </button>
    </div>`
  );
};

export default class Point extends AbstractView {
  constructor(point) {
    super();
    this._point = point;

    this._editClickHandler = this._editClickHandler.bind(this);
  }

  getTemplate() {
    return createPointTemplate(this._point);
  }

  _editClickHandler() {
    this._callback.editClick();
  }

  setEditClickHandler(callback) {
    this._callback.editClick = callback;
    this.getElement().querySelector(`.event__rollup-btn`).addEventListener(`click`, this._editClickHandler);
  }
}
