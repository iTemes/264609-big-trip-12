
import SortView from "../view/sort.js";
import TripListView from "../view/tripList.js";
import TripDayView from "../view/tripDay.js";
import TripDaysView from "../view/tripDays.js";
import PointPresenter from "./point.js";
import PointNewPresenter from './point-new.js';
import NoPointView from "../view/no-point.js";
import PointsItemView from "../view/point-item.js";
import {render, remove, RenderPosition, createRenderFragment} from "../utils/render.js";
import {sortUp, sortPrice} from "../utils/point.js";
import {SortType, UserAction, UpdateType, FilterType} from "../const.js";
import {formatDateISODdMmYyyyHhMm} from '../utils/date.js';
import {filter} from '../utils/filter';

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
  constructor(eventsContainer, pointsModel, filterModel) {
    this._eventsContainer = eventsContainer;
    this._pointsModel = pointsModel;
    this._filterModel = filterModel;

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

    this._pointsModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);

    this._pointNewPresenter = new PointNewPresenter(this._eventsContainer, this._handleViewAction);
  }

  init() {
    this._pointsModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);

    this._renderTrip();
  }

  destroy() {
    this._clearTrip({isResetSortType: true});

    this._pointsModel.removeObserver(this._handleModelEvent);
    this._filterModel.removeObserver(this._handleModelEvent);
  }

  createPoint(callback) {
    this._currentSortType = SortType.EVENT;
    this._filterModel.setFilter(UpdateType.MINOR, FilterType.EVERYTHING);
    const destinations = this._pointsModel.getDestinations();
    this._pointNewPresenter.init(destinations, callback);
  }

  _getPoints() {
    const points = this._pointsModel.getPoints();
    const filterType = this._filterModel.getFilter();
    const filteredPoints = filterType === FilterType.EVERYTHING
      ? points
      : filter[filterType](points);

    switch (this._currentSortType) {
      case SortType.TIME:
        return filteredPoints.sort(sortUp);
      case SortType.PRICE:
        return filteredPoints.sort(sortPrice);
      default:
        return filteredPoints;
    }
  }

  _getDestinations() {
    return this._pointsModel.getDestinations();
  }

  _handleСhangeMode() {
    this._pointNewPresenter.destroy();

    Object
      .values(this._pointPresenter)
      .forEach((presenter) => presenter.resetView());
  }


  _handlePointChange(updatedPoint) {
    // Обновление модели здесь
    this._pointPresenter[updatedPoint.id].init(updatedPoint, this._getDestinations());
  }

  _handleViewAction(actionType, updateType, update) {
    switch (actionType) {
      case UserAction.UPDATE_POINT:
        this._pointsModel.updatePoint(updateType, update);
        break;
      case UserAction.ADD_POINT:
        this._pointsModel.addPoint(updateType, update);
        break;
      case UserAction.DELETE_POINT:
        this._pointsModel.deletePoint(updateType, update);
        break;
    }
  }

  _handleModelEvent(updateType, data) {
    switch (updateType) {
      case UpdateType.PATCH:
        this._pointPresenter[data.id].init(data, this._getDestinations());
        break;
      case UpdateType.MINOR:
        this._updateTrip();
        break;
      case UpdateType.MAJOR:
        this._updateTrip({isResetSortType: true});
        break;
    }
  }

  _handleSortTypeChange(sortType) {
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
    const destinations = this._getDestinations();
    const pointsItemView = new PointsItemView();
    const pointPresenter = new PointPresenter(
        pointsItemView,
        this._handlePointChange,
        this._handleСhangeMode,
        this._handleViewAction
    );

    pointPresenter.init(point, destinations);
    this._pointPresenter[point.id] = pointPresenter;

    return pointsItemView;
  }

  _createEventDays(tripPoints) {
    const days = groupPointsByDays(tripPoints);

    return Object.entries(days)
    .map(([date, points], counter) => {
      return this._createEventDay(points, date, counter);
    });
  }

  _createEventDay(points, date, counter) {
    const dayView = new TripDayView({
      dayCount: counter !== undefined ? counter + 1 : null,
      isCountRender: counter !== undefined && this._getPoints().length > 1,
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

    render(
        this._daysView,
        createRenderFragment(this._dayViews),
        RenderPosition.BEFOREEND
    );

    render(this._eventsContainer, this._daysView, RenderPosition.BEFOREEND);
  }

  _renderTrip() {
    const points = this._getPoints();

    if (points.length > 0) {
      this._renderEvents(points);
      return;
    }

    if (this._daysView) {
      remove(this._daysView);
    }

    this._renderNoPoints();
  }

  _clearTrip({isResetSortType} = {isResetSortType: false}) {
    if (isResetSortType) {
      this._resetSortType();
    }

    this._pointNewPresenter.destroy();
    this._clearEvents();
  }

  _updateTrip({isResetSortType} = {isResetSortType: false}) {
    this._clearTrip({isResetSortType});
    this._renderTrip();
  }


  _clearEvents() {
    Object
      .values(this._pointPresenter)
      .forEach((presenter) => presenter.destroy());
    this._pointPresenter = {};

    this._dayViews.forEach((dayView) => remove(dayView));
    this._dayViews = [];
    // remove(this._sortComponent);
    // this._sortView = null;
  }

  _resetSortType() {
    this._currentSortType = DEFAULT_SORT_TYPE;
  }

}
