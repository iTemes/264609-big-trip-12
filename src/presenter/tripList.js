
import SortView from "../view/sort.js";
import TripListView from "../view/tripList.js";
import TripDayView from "../view/tripDay.js";
import TripDaysView from "../view/tripDays.js";
import PointPresenter from "./point.js";
import NoPointView from "../view/no-point.js";
import PointsItemView from "../view/point-item.js"
import {render, remove, RenderPosition, createRenderFragment} from "../utils/render.js";
import {updateItem} from "../utils/common.js";
import {sortUp, sortPrice} from "../utils/point.js";
import {SortType} from "../const.js";
import {formatDateISODdMmYyyyHhMm} from '../utils/date.js';

const reducePointByDay = (days, point) => {
  const dayDate = formatDateISODdMmYyyyHhMm(point.start)
      .toString()
      .split(`T`)[0];

  if (Array.isArray(days[dayDate])) {
    days[dayDate].push(point);
  } else {
    days[dayDate] = [point];
  }

  return days;
};

const groupPointsByDays = (points) => points
  .sort((pointA, pointB) => pointA.start - pointB.start)
  .reduce(reducePointByDay, {});

export default class Trip {
  constructor(eventsContainer) {
    this._eventsContainer = eventsContainer;
    this._points = [];
    this._destinations = [];
    this._currentSortType = SortType.EVENT;
    this._pointPresenter = {};
    this._daysView = null;
    this._dayViews = [];

    this._sortComponent = new SortView();
    this._noPointComponent = new NoPointView();

    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
    this._handlePointChange = this._handlePointChange.bind(this);
    this._handleСhangeMode = this._handleСhangeMode.bind(this);
  }

  init(points, destinations) {
    // создаем копию данных
    this._points = points.slice();
    this._destinations = destinations;
    this._sourcedEventsList = this._points.slice();

    this._renderEvents();
  }

  _handlePointChange(updatedPoint) {
    this._points = updateItem(this._points, updatedPoint);
    this._sourcedEventsList = updateItem(this._sourcedEventsList, updatedPoint);
    this._pointPresenter[updatedPoint.id].init(updatedPoint, this._destinations);
  }

  _sortPoints(sortType) {
    switch (sortType) {
      case SortType.DATE_UP:
        this._points.sort(sortUp);
        break;
      case SortType.PRICE:
        this._points.sort(sortPrice);
        break;
      default:
        this._points = this._sourcedEventsList.slice();
    }

    this._currentSortType = sortType;
  }

  _handleSortTypeChange(sortType) {
    this._sortPoints(sortType);
    this._clearEvents();
    this._renderEvents();
  }

  _renderSort() {
    // Метод для рендеринга сортировки
    render(this._eventsContainer, this._sortComponent, RenderPosition.AFTERBEGIN);
    this._sortComponent.setSortTypeChangeHandler(this._handleSortTypeChange);
  }

  _createPointsItem(point) {
    const pointsItemView = new PointsItemView();
    const pointPresenter = new PointPresenter(
      pointsItemView,
      this._handlePointChange,
      this._handleСhangeMode
    );
    pointPresenter.init(point, this._destinations);
    this._pointPresenter[point.id] = pointPresenter;

    return pointsItemView;
  }

  _createEventDays() {
    const days = groupPointsByDays(this._points);

    return Object.entries(days)
    .map(([date, points], counter) => {
      return this._createEventDay(points, date, counter);
    });
  }

  _createEventDay(points, date, counter) {
    const dayView = new TripDayView({
      dayCount: counter !== undefined ? counter + 1 : null,
      isCountRender: this._points.length > 1 && counter !== undefined,
      date: date !== undefined ? date : null,
    });

    const pointsListView = new TripListView();
    const pointsItemsViews = points.map((point) => this._createPointsItem(point));

    render(
        pointsListView,
        createRenderFragment(pointsItemsViews),
        RenderPosition.BEFOREEND
    );

    render(dayView, pointsListView, RenderPosition.BEFOREEND);

    return dayView;
  }

  _renderNoPoints() {
    // Метод для рендеринга заглушки
    render(this._eventsContainer, this._noPointComponent, RenderPosition.BEFOREEND);
  }

  _renderEvents() {
    if (!this._points.length) {
      this._renderNoPoints();
    } else {
      this._renderSort();
      this._daysView = this._daysView || new TripDaysView();
      this._dayViews = this._currentSortType === SortType.EVENT
      ? this._createEventDays()
      : [this._createEventDay(this._points)];

      render(
        this._daysView,
        createRenderFragment(this._dayViews),
        RenderPosition.BEFOREEND
    );

    render(this._eventsContainer, this._daysView,  RenderPosition.BEFOREEND);
    }
  }

  _clearEvents() {
    Object
      .values(this._pointPresenter)
      .forEach((presenter) => presenter.destroy());
    this._pointPresenter = {};

    this._dayViews.forEach((dayView) => remove(dayView));
    this._dayViews = [];
  }

  _handleСhangeMode() {
    Object
      .values(this._pointPresenter)
      .forEach((presenter) => presenter.resetView());
  }
}
