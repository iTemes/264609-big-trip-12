
import AbstractSmartView from "../smart.js";
import {extend} from '../../utils/common.js';
import {diffDate, addDaysToDate} from '../../utils/date.js';
import {ACTVITIES} from '../../const';
import {createTripPointEditHeaderTemplate} from "./header.js";
import {createDetailTemplate} from "./detail.js";
import flatpickr from "flatpickr";
import "../../../node_modules/flatpickr/dist/flatpickr.min.css";

const BLANK_POINT = {
  type: ACTVITIES[0].toLowerCase(),
  destination: ``,
  start: new Date(),
  end: addDaysToDate(new Date()),
  duration: null,
  price: 0,
  description: ``,
  photos: [],
  offers: [],
  isFavorite: false,
};

const checkDestinationOnError = (destinations, destination) => !destinations.includes(destination);
const checkDatesOnError = (start, end) => (+start) > (+end);

const destroyPointDatePicker = (picker) => {
  if (picker) {
    picker.destroy();
    picker = null;
  }
};

const createPointEditTemplate = (point, destinations, isAddMode) => {
  return (
    `<form class="trip-events__item  event  event--edit" action="#" method="post">
      ${createTripPointEditHeaderTemplate(point, destinations, isAddMode)}
      ${createDetailTemplate(point, destinations)}
    </form>`
  );
};

export default class PointEdit extends AbstractSmartView {
  constructor({point = BLANK_POINT, destinations, isAddMode = false}) {
    super();
    this._data = PointEdit.parsePointToData(point, destinations);
    this._destinations = destinations;
    this._isAddMode = isAddMode;
    this._typeListElement = null;
    this._startDatePicker = null;
    this._endDatePicker = null;
    this.isStartDateUpdate = false;

    this._handleFormSubmit = this._handleFormSubmit.bind(this);
    this._handleDeletePoint = this._handleDeletePoint.bind(this);
    this._handleFormToEvent = this._handleFormToEvent.bind(this);
    this._handleFavoriteClick = this._handleFavoriteClick.bind(this);
    this._handlePriceChange = this._handlePriceChange.bind(this);
    this._handleTypeEventChange = this._handleTypeEventChange.bind(this);
    this._handleDestinationChange = this._handleDestinationChange.bind(this);
    this._handleOffersChange = this._handleOffersChange.bind(this);
    this._handleStartDateChange = this._handleStartDateChange.bind(this);
    this._handleEndDateChange = this._handleEndDateChange.bind(this);

    this._destroyPointDatePickers();
    this._setInnerHandlers();
  }

  static parsePointToData(point, destinations) {
    const {destination, start, end} = point;

    return extend(
        point,
        {
          isDestinationError: checkDestinationOnError(destinations, destination),
          isDatesError: checkDatesOnError(start, end),
        }
    );
  }


  static parseDataToPoint(data) {
    data = extend(data);

    delete data.isDestinationError;
    delete data.isDatesError;

    return data;
  }

  getTemplate() {
    return createPointEditTemplate(this._data, this._destinations, this._isAddMode);
  }

  reset(point) {
    this.updateData(
        PointEdit.parsePointToData(point, this._destinations)
    );
  }

  removeElement() {
    super.removeElement();
    this._destroyPointDatePickers();
  }

  _getTypeList() {
    if (!this._typeListElement) {
      this._typeListElement = this.getElement().querySelector(`.event__type-list`);
    }

    return this._typeListElement;
  }

  _setInnerHandlers() {
    if (!this._isAddMode) {
      this.getElement().querySelector(`.event__favorite-checkbox`).addEventListener(`click`, this._handleFavoriteClick);
    }
    this.getElement().querySelector(`.event__input--price`).addEventListener(`change`, this._handlePriceChange);
    this.getElement().querySelector(`.event__type-list`).addEventListener(`click`, this._handleTypeEventChange);
    this.getElement().querySelector(`.event__input--destination`).addEventListener(`change`, this._handleDestinationChange);

    this._setHandleOffersChange();
    this._setStartDateChangeHandler();
    this._setEndDateChangeHandler();
  }

  restoreHandlers() {
    this.setHandleFormSubmit(this._callback.formSubmit);
    this.setHandleFormReset(this._callback.formReset);
    if (!this._isAddMode) {
      this.setHandleFormToPoint(this._callback.formToEvent);
    }
    this._setInnerHandlers();
  }

  _destroyPointDatePickers() {
    destroyPointDatePicker(this._startDatePicker);
    destroyPointDatePicker(this._endDatePicker);
  }

  _handleFormSubmit(evt) {
    evt.preventDefault();

    this._callback.formSubmit(PointEdit.parseDataToPoint(this._data));
  }

  _handleDeletePoint(evt) {
    evt.preventDefault();
    this._callback.formReset();
  }

  _handleFormToEvent(evt) {
    evt.preventDefault();

    this._callback.formToEvent();
  }

  _handleFavoriteClick(evt) {
    evt.preventDefault();
    this.updateData({
      isFavorite: !this._data.isFavorite,
    });
  }

  _handlePriceChange(evt) {
    evt.preventDefault();
    this.updateData({
      price: Number(evt.target.value),
    }, true);
  }

  _handleTypeEventChange(evt) {
    evt.preventDefault();
    const typeId = evt.target.htmlFor;
    const type = this._getTypeList().querySelector(`#${typeId}`).value.toLowerCase();
    this.updateData({
      type,
    });
  }

  _handleDestinationChange(evt) {
    evt.preventDefault();
    const destination = evt.target.value;
    this.updateData({
      destination,
      isDestinationError: checkDestinationOnError(this._destinations, destination),
    });
  }

  _handleOffersChange(evt) {
    evt.preventDefault();
    const offerKey = evt.target.value;
    const isActivated = evt.target.checked;
    const offers = this._data.offers.map((offer) => {
      if (offerKey === offer.key) {
        return extend(offer, {isActivated});
      }

      return offer;
    });

    this.updateData({
      offers,
    }, true);
  }

  _setHandleOffersChange() {
    const offerElements = this.getElement().querySelectorAll(`.event__offer-checkbox`);
    offerElements.forEach((offerElement) => {
      offerElement.addEventListener(`change`, this._handleOffersChange);
    });
  }

  _setStartDateChangeHandler(callback) {

    this._callback.startDateChange = callback;
    if (this._startDatePicker) {
      this._startDatePicker.destroy();
      this._startDatePicker = null;
    }

    this._startDatePicker = flatpickr(
        this.getElement().querySelector(`#event-start-time-1`),
        {
          enableTime: true,
          /* eslint-disable-next-line */
          time_24hr: true,
          dateFormat: `d/m/y H:i`,
          defaultDate: this._data.start,
          onChange: this._handleStartDateChange,
        }
    );
  }

  _handleStartDateChange([start]) {
    const end = this._data.end;
    const isDatesError = checkDatesOnError(start, end);
    this.updateData({
      start,
      duration: diffDate(end, start),
      isDatesError,
    });
  }

  _setEndDateChangeHandler(callback) {

    this._callback.endDateChange = callback;
    if (this._endDatePicker) {
      this._endDatePicker.destroy();
      this._endDatePicker = null;
    }

    this._endDatePicker = flatpickr(
        this.getElement().querySelector(`#event-end-time-1`),
        {
          enableTime: true,
          /* eslint-disable-next-line */
          time_24hr: true,
          dateFormat: `d/m/y H:i`,
          defaultDate: this._data.end,
          minDate: this._data.start,
          onChange: this._handleEndDateChange,
        }
    );
  }

  _handleEndDateChange([end]) {
    const start = this._data.start;
    const isDatesError = checkDatesOnError(start, end);
    this.updateData({
      end,
      duration: diffDate(end, start),
      isDatesError,
    });
  }

  _setTypeInputChangeHandlers() {
    this.getElement()
    .querySelectorAll(`.event__type-input`).forEach((typeElement) => {
      typeElement.addEventListener(`change`, this._handleTypeEventChange);
    });
  }


  setHandleFormToPoint(callback) {
    this._callback.formToEvent = callback;
    this.getElement().querySelector(`.event__rollup-btn`).addEventListener(`click`, this._handleFormToEvent);
  }

  setHandleFormSubmit(callback) {
    this._callback.formSubmit = callback;
    this.getElement().addEventListener(`submit`, this._handleFormSubmit);
  }

  setHandleFormReset(callback) {
    this._callback.formReset = callback;
    this.getElement().querySelector(`.event__reset-btn`).addEventListener(`click`, this._handleDeletePoint);
  }
}
