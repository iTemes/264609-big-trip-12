
import AbstractSmartView from "../smart.js";
import {extend} from '../../utils/common.js'
import {createTripPointEditHeaderTemplate} from "./header.js"
import {createDetailTemplate} from "./detail.js"

const checkDestinationOnError = (destinations, destination) => !destinations.includes(destination);

const createPointEditTemplate = (point, destinations) => {
  return (
    `<form class="trip-events__item  event  event--edit" action="#" method="post">
      ${createTripPointEditHeaderTemplate(point, destinations)}
      ${createDetailTemplate(point)}
    </form>`
  );
};

export default class PointEdit extends AbstractSmartView {
  constructor(point, destinations) {
    super();
    this._data = PointEdit.parsePointToData(point, destinations);
    this._point = point;
    this._destinations = destinations;
    this._element = null;
    this._typeListElement = null;

    this._handleFormSubmit = this._handleFormSubmit.bind(this);
    this._handleResetForm = this._handleResetForm.bind(this);
    this._handleFormToEvent = this._handleFormToEvent.bind(this);
    this._handleFavoriteClick = this._handleFavoriteClick.bind(this);
    this._handlePriceChange = this._handlePriceChange.bind(this);
    this._handleTypeEventChange = this._handleTypeEventChange.bind(this);
    this._handleDestinationChange = this._handleDestinationChange.bind(this);

    this._setInnerHandlers();
    this._setTypeInputChangeHandlers();
  }

  static parsePointToData(point, destinations) {
    const {destination} = point;

    return extend(
        point,
        {
          isDestinationError: checkDestinationOnError(destinations, destination),
        }
    );
  }


  static parseDataToPoint(data) {
    data = extend(data);

    delete data.isDestinationError;

    return data;
  }

  getTemplate() {
    return createPointEditTemplate(this._point, this._destinations);
  }

  reset(point) {
    this.updateData(
        PointEdit.parsePointToData(point, this._destinations)
    );
  }

  _getTypeList() {
    if (!this._typeListElement) {
      this._typeListElement = this.getElement().querySelector(`.event__type-list`);
    }

    return this._typeListElement;
  }

  _setInnerHandlers() {
    // this.getElement().querySelector(`.event__favorite-checkbox`).addEventListener(`click`, this._handleFavoriteClick);
    this.getElement().querySelector(`.event__input--price`).addEventListener(`change`, this._handlePriceChange);
    this.getElement().querySelector(`.event__type-list`).addEventListener(`click`, this._handleTypeEventChange);
    this.getElement().querySelector(`.event__input--destination`).addEventListener(`change`, this._handleDestinationChange);
  }

  restoreHandlers() {
    this.setFormSubmitHandler(this._callback.formSubmit);
    this.setFormResetHandler(this._callback.formReset);
    this.setFormToPointHandler(this._callback.formToEvent);

    this._setInnerHandlers();
  }

  _handleFormSubmit(evt) {
    evt.preventDefault();
    this._callback.formSubmit(PointEdit.parseDataToPoint(this._data));
  }

  _handleFormToEvent(evt) {
    evt.preventDefault();
    this._callback.formToEvent();
  }

  _handleFavoriteClick(evt) {
    evt.preventDefault();
    this._callback.favoriteClick();
  }

  _handlePriceChange(evt) {
    evt.preventDefault();
    this.updateData({
      price: evt.target.value,
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

  _handleResetForm(evt) {
    evt.preventDefault();
    this._callback.formReset();
  }

  _setTypeInputChangeHandlers() {
    this.getElement()
    .querySelectorAll(`.event__type-input`).forEach((typeElement) => {
      typeElement.addEventListener(`change`, this._handleTypeEventChange);
    });
  }


  setFormToPointHandler(callback) {
    this._callback.formToEvent = callback;
    this.getElement().querySelector(`.event__rollup-btn`).addEventListener(`click`, this._handleFormToEvent);
  }

  setFormSubmitHandler(callback) {
    this._callback.formSubmit = callback;
    this.getElement().addEventListener(`submit`, this._handleFormSubmit);
  }

  setFormResetHandler(callback) {
    this._callback.formReset = callback;
    this.getElement().addEventListener(`reset`, this._handleResetForm);
  }

  setFavoriteClickHandler(callback) {
    this._callback.favoriteClick = callback;
    this.getElement().querySelector(`.event__favorite-checkbox`).addEventListener(`click`, this._handleFavoriteClick);;
  }

}
