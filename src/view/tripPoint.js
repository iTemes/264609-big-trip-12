import AbstractView from "./abstract.js";
import {formatTime, getDuration} from "../utils/point.js";

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

export default class Point extends AbstractView {
  constructor(point) {
    super();
    this._point = point;
    this._element = null;

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
