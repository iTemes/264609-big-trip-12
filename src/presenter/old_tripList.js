
import SortView from "../view/sort.js";
import EventEditView from "../view/eventEdit.js";
import TripListView from "../view/tripList.js";
import TripDayView from "../view/tripDay.js";
import TripDaysView from "../view/tripDays.js";
import PointView from "../view/tripPoint.js";
import NoPointView from "../view/no-point.js";
import {render, replace, RenderPosition} from "../utils/render.js";
import {sortUp, sortDown} from "../utils/point.js";
import {SortType} from "../const.js";

export default class Trip {
  constructor(eventsContainer) {
    this._eventsContainer = eventsContainer;
    this._currentSortType = SortType.EVENT;

    this._sortComponent = new SortView();
    this._tripListComponent = new TripListView();
    this._noPointComponent = new NoPointView();
    this._tripDaysComponent = new TripDaysView();
    this._tripDayComponent = new TripDayView();

    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
  }

  init(eventsList) {
    this._eventsList = eventsList.slice();
    // сохраняем исходный массив:
    this._sourcedEventsList = eventsList.slice();

    this._renderEvents();
  }

  _sortPoints(sortType) {
    switch (sortType) {
      case SortType.DATE_UP:
        this._eventsList.sort(sortUp);
        break;
      case SortType.DATE_DOWN:
        this._eventsList.sort(sortDown);
        break;
      default:
        this._eventsList = this._sourcedEventsList.slice();
    }

    this._currentSortType = sortType;
  }

  _handleSortTypeChange(sortType) {
    // - Сортируем задачи
    if (this._currentSortType === sortType) {
      return;
    }

    this._sortPoints(sortType);
    this._clearTripList();
    this._renderTripList();
  }

  _renderSort() {
    // Метод для рендеринга сортировки
    render(this._eventsContainer, this._sortComponent, RenderPosition.AFTERBEGIN);
    this._sortComponent.setSortTypeChangeHandler(this._handleSortTypeChange);
  }

  _renderPoint(point) {
    // Метод, куда уйдёт логика созданию и рендерингу компонетов точек,
    // текущая функция renderPoint в main.js
    const pointComponent = new PointView(point);
    const pointEditComponent = new EventEditView(point);

    const replacePointToForm = () => {
      replace(pointEditComponent, pointComponent);
    };

    const replaceFormToPoint = () => {
      replace(pointComponent, pointEditComponent);
    };

    const onEscKeyDown = (evt) => {
      if (evt.key === `Escape` || evt.key === `Esc`) {
        evt.preventDefault();
        replaceFormToPoint();
        document.removeEventListener(`keydown`, onEscKeyDown);
      }
    };

    pointComponent.setEditClickHandler(() => {
      replacePointToForm();
      document.addEventListener(`keydown`, onEscKeyDown);
    });

    pointEditComponent.setFormSubmitHandler(() => {
      replaceFormToPoint();
      document.removeEventListener(`keydown`, onEscKeyDown);
    });

    render(this._tripListComponent, pointComponent, RenderPosition.BEFOREEND);
  }

  _renderPoints(from, to) {
    this._eventsList
      .slice(from, to)
      .forEach((point) => this._renderPoint(point));
  }

  _renderNoPoints() {
    // Метод для рендеринга заглушки
    render(this._eventsContainer, this._noPointComponent, RenderPosition.BEFOREEND);
  }

  _clearTripList() {
    this._tripListComponent.getElement().innerHTML = ``;
  }

  _renderTripList() {
    const tripEvents = document.querySelector(`.trip-events`);

    render(tripEvents, this._tripDaysComponent, RenderPosition.BEFOREEND);
    render(this._tripDaysComponent, this._tripDayComponent, RenderPosition.BEFOREEND);
    render(this._tripDayComponent, this._tripListComponent, RenderPosition.BEFOREEND);

    this._renderPoints(0, this._eventsList.length);
  }

  _renderEvents() {
    // Метод для инициализации (начала работы) модуля,
    // бОльшая часть текущей функции renderEvents в main.js
    if (!this._eventsList.length) {
      this._renderNoPoints();
    } else {
      this._renderSort();
      this._renderTripList();
    }
  }
}