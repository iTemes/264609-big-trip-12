import PointEditView from "../view/point-edit/point-edit.js";
import PointView from "../view/point/point.js";
import {render, replace, remove, RenderPosition} from "../utils/render.js";

const Mode = {
  DEFAULT: `DEFAULT`,
  EDITING: `EDITING`
};

export default class Point {
  constructor(pointListContainer, changePoint, changeMode) {
    this._pointListContainer = pointListContainer;
    this._changePoint = changePoint;
    this._changeMode = changeMode;
    this._destinations = null;
    this._pointComponent = null;
    this._pointEditComponent = null;
    this._point = null;
    this._mode = Mode.DEFAULT;

    // Обработчики
    this._handleEditClick = this._handleEditClick.bind(this);
    this._handleFormSubmit = this._handleFormSubmit.bind(this);
    this._handleEscKeyDown = this._handleEscKeyDown.bind(this);
    this._handleFormToPoint = this._handleFormToPoint.bind(this);
    this._handleResetPointEdit = this._handleResetPointEdit.bind(this);
  }

  init(point, destinations) {
    this._point = point;
    this._destinations = destinations;

    const prevPointComponent = this._pointComponent;
    const prevPointEditComponent = this._pointEditComponent;

    this._pointComponent = new PointView(point);
    this._pointEditComponent = new PointEditView(point, this._destinations);

    // Присвоение Обработчиков
    this._pointComponent.setHandleEditClick(this._handleEditClick);
    this._pointEditComponent.setHandleFormSubmit(this._handleFormSubmit);
    this._pointEditComponent.setHandleFormToPoint(this._handleFormToPoint);
    this._pointEditComponent.setHandleFormReset(this._handleResetPointEdit);


    if (prevPointComponent === null || prevPointEditComponent === null) {
      render(this._pointListContainer, this._pointComponent, RenderPosition.BEFOREEND);
      return;
    }

    if (this._mode === Mode.DEFAULT) {
      replace(this._pointComponent, prevPointComponent);
    }

    if (this._mode === Mode.EDITING) {
      replace(this._pointEditComponent, prevPointEditComponent);
    }

    remove(prevPointComponent);
    remove(prevPointEditComponent);
  }

  destroy() {
    remove(this._pointComponent);
    remove(this._pointEditComponent);
  }

  resetView() {
    if (this._mode !== Mode.DEFAULT) {
      this._replaceFormToPoint();
    }
  }

  _replacePointToForm() {
    replace(this._pointEditComponent, this._pointComponent);
    document.addEventListener(`keydown`, this._handleEscKeyDown);
    this._changeMode();
    this._mode = Mode.EDITING;
  }

  _replaceFormToPoint() {
    replace(this._pointComponent, this._pointEditComponent);
    document.removeEventListener(`keydown`, this._handleEscKeyDown);
    this._mode = Mode.DEFAULT;
  }

  _handleEscKeyDown(evt) {
    if (evt.key === `Escape` || evt.key === `Esc`) {
      evt.preventDefault();

      this._handleResetPointEdit();
    }
  }

  _handleEditClick() {
    this._replacePointToForm();
  }

  _handleFormSubmit(point) {
    this._changePoint(point);
    this._replaceFormToPoint();
  }

  _handleFormToPoint() {
    this._replaceFormToPoint();
  }

  _handleResetPointEdit() {
    this._pointEditComponent.reset(this._point);
    this._replaceFormToPoint();
  }
}
