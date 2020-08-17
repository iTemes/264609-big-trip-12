import {createElement, castTimeFormat, formatTime} from "../utils";

const getDuration = (start, end) => {
  const interval = new Date(end - start);
  const days = interval.getDate() - 1;
  const hours = interval.getUTCHours();
  const minutes = interval.getMinutes();

  return `${days === 0 ? `` : castTimeFormat(days) + `D `}\
  ${hours === 0 ? `` : castTimeFormat(hours) + `H `}\
  ${minutes === 0 ? `` : castTimeFormat(minutes) + `M`}`;
};

const createOffersTemplate = (offers) => offers
  .map((offer) => {
    return (
      `<li class="event__offer">
        <span class="event__offer-title">${offer.title}</span>
        &plus;
        &euro;&nbsp;<span class="event__offer-price">${offer.price}</span>
      </li>`
    );
  })
  .join(``);

const createPointTemplate = (point) => {
  const {destination, type, dueDate, price, offers} = point;
  const duration = getDuration(dueDate.start, dueDate.end);
  return (
    `<li class="trip-events__item">
      <div class="event">
        <div class="event__type">
          <img class="event__type-icon" width="42" height="42" src="img/icons/${type.toLowerCase()}.png" alt="Event type icon">
        </div>
        <h3 class="event__title">${type} to ${destination}</h3>

        <div class="event__schedule">
          <p class="event__time">
            <time class="event__start-time" datetime="${dueDate.start.toJSON()}">${formatTime(dueDate.start)}</time>
            &mdash;
            <time class="event__end-time" datetime="${dueDate.end.toJSON()}">${formatTime(dueDate.end)}</time>
          </p>
          <p class="event__duration">${duration}</p>
        </div>

        <p class="event__price">
          &euro;&nbsp;<span class="event__price-value">${price}</span>
        </p>

        <h4 class="visually-hidden">Offers:</h4>
        <ul class="event__selected-offers">
           ${createOffersTemplate(offers)}
        </ul>

        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>
      </div>
    </li>`
  );
};

export default class Point {
  constructor(point) {
    this._point = point;

    this._element = null;
  }

  getTemplate() {
    return createPointTemplate(this._point);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}