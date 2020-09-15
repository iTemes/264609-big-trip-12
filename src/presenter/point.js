import PointEditView from "../view/point-edit/point-edit.js";
import PointView from "../view/point/point.js";
import {render, replace, remove, RenderPosition} from "../utils/render.js";
import {UserAction, UpdateType} from "../const.js";

const Mode = {
  DEFAULT: `DEFAULT`,
  EDITING: `EDITING`
};

export default class Point {
  constructor(pointListContainer, changePoint, changeMode, changeData) {
    this._pointListContainer = pointListContainer;
    this._changePoint = changePoint;
    this._changeMode = changeMode;
    this._changeData = changeData;
    this._destinations = null;
    this._pointComponent = null;
    this._pointEditComponent = null;
    this._point = null;
    this._mode = Mode.DEFAULT;
    this._isShouldUpdateTrip = null;

    // Обработчики
    this._handleEditClick = this._handleEditClick.bind(this);
    this._handleFormSubmit = this._handleFormSubmit.bind(this);
    this._handleEscKeyDown = this._handleEscKeyDown.bind(this);
    this._handleFormToPoint = this._handleFormToPoint.bind(this);
    this._handleDeletePointEdit = this._handleDeletePointEdit.bind(this);
  }

  init(point, destinations) {
    this._point = point;
    this._destinations = destinations;

    const prevPointComponent = this._pointComponent;
    const prevPointEditComponent = this._pointEditComponent;

    this._pointComponent = new PointView(point);
    this._pointEditComponent = new PointEditView({point, destinations: this._destinations});

    // Присвоение Обработчиков
    this._pointComponent.setHandleEditClick(this._handleEditClick);
    this._pointEditComponent.setHandleFormSubmit(this._handleFormSubmit);
    this._pointEditComponent.setHandleFormToPoint(this._handleFormToPoint);
    this._pointEditComponent.setHandleFormReset(this._handleDeletePointEdit);


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

      this._handleFormToPoint();
    }
  }

  _handleEditClick() {
    this._replacePointToForm();
  }

  _handleFormSubmit(point) {
    const updateType = this._pointEditComponent.isStartDateUpdate
      ? UpdateType.MINOR
      : UpdateType.PATCH;

    this._changeData(
        UserAction.UPDATE_POINT,
        updateType,
        point
    );

    this._replaceFormToPoint();
  }

  _handleFormToPoint() {
    this._replaceFormToPoint();
  }

  _handleDeletePointEdit(point) {
    this._changeData(
        UserAction.DELETE_POINT,
        UpdateType.MAJOR,
        point
    );
    this._replaceFormToPoint();
  }
}
