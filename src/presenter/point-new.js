
import AbstractView from '../view/abstract.js';
import PointEditView from '../view/point-edit/point-edit.js';

import {remove, render, RenderPosition} from '../utils/render.js';
import {UserAction, UpdateType} from '../const.js';
import {extend} from '../utils/common.js';

const generateId = () => Date.now() + parseInt(Math.random() * 10000, 10);


export default class PointNew {
  constructor(tripContainer, changeData) {
    this._tripContainer = tripContainer;
    this._changeData = changeData;

    this._pointEditView = null;
    this._destinations = null;
    this._destroyCallback = null;

    this._formSubmitHandler = this._formSubmitHandler.bind(this);
    this._formRresetHandler = this._formRresetHandler.bind(this);
    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
  }

  init(destinations, callback) {
    if (this._pointEditView !== null) {
      return;
    }

    this._renderPointEdit(destinations, callback);
  }

  destroy() {
    if (this._pointEditView === null) {
      return;
    }

    remove(this._pointEditView);
    this._pointEditView = null;
    this._destroyCallback();
    document.removeEventListener(`keydown`, this._escKeyDownHandler);
  }

  _renderPointEdit(destinations, callback) {
    this._destroyCallback = callback;
    this._destinations = destinations;

    this._pointEditView = new PointEditView({destinations: this._destinations, isAddMode: true});
    this._pointEditView.setHandleFormSubmit(this._formSubmitHandler);
    this._pointEditView.setHandleFormReset(this._formRresetHandler);

    if (this._tripContainer instanceof AbstractView) {
      this._tripContainer = this._tripContainer.getElement();
    }

    const sortTripElement = this._tripContainer.querySelector(`.trip-sort`);

    if (sortTripElement) {
      render(sortTripElement, this._pointEditView, RenderPosition.BEFOREEND);
    } else {
      render(this._tripContainer, this._pointEditView, RenderPosition.AFTERBEGIN);
    }

    document.addEventListener(`keydown`, this._escKeyDownHandler);
  }

  _formSubmitHandler(point) {
    this._changeData(
        UserAction.ADD_POINT,
        UpdateType.MAJOR,
        extend({id: generateId()}, point)
    );
    this.destroy();
  }

  _formRresetHandler() {
    this.destroy();
  }

  _escKeyDownHandler(evt) {
    if (evt.key === `Escape` || evt.key === `Esc`) {
      evt.preventDefault();

      this.destroy();
    }
  }
}
