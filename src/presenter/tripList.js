
import SortView from "../view/sort.js";
import TripListView from "../view/tripList.js";
import TripDayView from "../view/tripDay.js";
import TripDaysView from "../view/tripDays.js";
import PointPresenter from "./point.js";
import NoPointView from "../view/no-point.js";
import PointsItemView from "../view/point-item.js";
import {render, remove, RenderPosition, createRenderFragment} from "../utils/render.js";
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

const DEFAULT_SORT_TYPE = SortType.EVENT;

export default class Trip {
  constructor(eventsContainer, pointsModel) {
    this._eventsContainer = eventsContainer;
    this._pointsModel = pointsModel;
    this._currentSortType = DEFAULT_SORT_TYPE;
    this._pointPresenter = {};
    this._daysView = null;
    this._dayViews = [];

    this._sortComponent = new SortView(DEFAULT_SORT_TYPE);
    this._noPointComponent = new NoPointView();

    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleСhangeMode = this._handleСhangeMode.bind(this);
    this._handleUpdateTrip = this._handleUpdateTrip.bind(this);
  }

  init() {
    this._renderTrip();
  }

  _getPoints() {
    console.log('#', this._pointsModel.getPoints());
    switch (this._currentSortType) {
      case SortType.TIME:
        return this._pointsModel.getPoints().sort(sortUp);
      case SortType.PRICE:
        return this._pointsModel.getPoints().sort(sortPrice);
      default:
        return this._pointsModel.getPoints();
    }
  }

  _getDestinations() {
    return this._pointsModel.getDestinations();
  }

  _handleСhangeMode() {
    Object
      .values(this._pointPresenter)
      .forEach((presenter) => presenter.resetView());
  }


  _handlePointChange(updatedPoint) {
    // Обновление модели здесь
    this._pointPresenter[updatedPoint.id].init(updatedPoint, this._getDestinations());
  }

  _handleUpdateTrip() {
    this._updateTrip();
  }

  _handleViewAction(actionType, updateType, update) {
    console.log(actionType, updateType, update);
    // Здесь будем вызывать обновление модели.
    // actionType - действие пользователя, нужно чтобы понять, какой метод модели вызвать
    // updateType - тип изменений, нужно чтобы понять, что после нужно обновить
    // update - обновленные данные
  }

  _handleModelEvent(updateType, data) {
    console.log(updateType, data);
    // В зависимости от типа изменений решаем, что делать:
    // - обновить часть списка
    // - обновить список
    // - обновить всю доску (например, при переключении фильтра)
  }

  _handleSortTypeChange(sortType) {
    console.log('sortType', sortType);
    if (this._currentSortType === sortType) {
      return;
    }

    this._currentSortType = sortType;
    this._clearEvents();
    this._renderTrip();
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
        this._handleViewAction,
        this._handleСhangeMode,
        this._handleUpdateTrip
    );

    pointPresenter.init(point, this._getDestinations());
    this._pointPresenter[point.id] = pointPresenter;

    return pointsItemView;
  }

  _createEventDays(tripPoints) {
    const days = groupPointsByDays(tripPoints);

    return  Object.entries(days)
    .map(([date, points], counter) => {
      return this._createEventDay(points, date, counter);
    });
  }

  _createEventDay(points, date, counter) {
    const dayView = new TripDayView({
      dayCount: counter !== undefined ? counter + 1 : null,
      isCountRender: counter !== undefined,
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

  _renderEvents(points) {
    this._renderSort();

    this._daysView = this._daysView || new TripDaysView();
    this._dayViews = this._currentSortType === SortType.EVENT ? this._createEventDays(points) : [this._createEventDay(points)];
    console.log('sort type', this._currentSortType);
    render(
        this._daysView,
        createRenderFragment(this._dayViews),
        RenderPosition.BEFOREEND
    );

    render(this._eventsContainer, this._daysView, RenderPosition.BEFOREEND);
  }

  _renderTrip() {
    const points = this._getPoints();
    console.log('points-', points);
    if (points.length > 0) {
      this._renderEvents(points);
      return;
    }

    if (this._daysView) {
      remove(this._daysView);
    }

    this._renderNoPoints();
  }

  _updateTrip() {
    this._clearEvents();
    this._renderTrip();
  }


  _clearEvents() {
    Object
      .values(this._pointPresenter)
      .forEach((presenter) => presenter.destroy());
    this._pointPresenter = {};

    this._dayViews.forEach((dayView) => remove(dayView));
    this._dayViews = [];
  }

}
