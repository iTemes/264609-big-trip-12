import PointEditView from "../view/point-edit/point-edit.js";
import PointView from "../view/point/point.js";
import {render, replace, remove, RenderPosition} from "../utils/render.js";
import {extend} from '../utils/common.js';

const Mode = {
  DEFAULT: `DEFAULT`,
  EDITING: `EDITING`
};

export default class Point {
  constructor(pointListContainer, changeData, changeMode) {
    this._pointListContainer = pointListContainer;
    this._changeData = changeData;
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
    this._handleFavoriteClick = this._handleFavoriteClick.bind(this);
  }

  init(point, destinations) {
    this._point = point;
    this._destinations = destinations;

    const prevPointComponent = this._pointComponent;
    const prevPointEditComponent = this._pointEditComponent;

    this._pointComponent = new PointView(point);
    this._pointEditComponent = new PointEditView(point, this._destinations);

    // Присвоение Обработчиков
    this._pointComponent.setEditClickHandler(this._handleEditClick);
    this._pointEditComponent.setFormSubmitHandler(this._handleFormSubmit);
    this._pointEditComponent.setFormToPointHandler(this._handleFormToPoint);
    this._pointEditComponent.setFormResetHandler(this._handleResetPointEdit);
    this._pointEditComponent.setFavoriteClickHandler(this._handleFavoriteClick);


    if (prevPointComponent === null || prevPointEditComponent === null) {
      render(this._pointListContainer, this._pointComponent, RenderPosition.BEFOREEND);
      return;
    }

    // Проверка на наличие в DOM необходима,
    // чтобы не пытаться заменить то, что не было отрисовано
    if (this._pointListContainer.getElement().contains(prevPointComponent.getElement())) {
      replace(this._pointComponent, prevPointComponent);
    }

    if (this._pointListContainer.getElement().contains(prevPointEditComponent.getElement())) {
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
    this._changeData(point);
    this._replaceFormToPoint();
  }

  _handleFavoriteClick() {
    this._changeData(
        extend(
            this._point,
            {
              isFavorite: !this._point.isFavorite
            }
        )
    );
  }


  _handleFormToPoint() {
    this._replaceFormToPoint();
  }

  _handleResetPointEdit() {
    this._pointEditComponent.reset(this._point);
    this._replaceFormToPoint();
  }
}
