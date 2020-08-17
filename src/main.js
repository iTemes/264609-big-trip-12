import TripInfoView from "./view/tripInfo.js";
import TripTabsVew from "./view/tripTabs.js";
import TripFiltersView from "./view/tripFilters.js";
import SortView from "./view/sort.js";
import EventEditView from "./view/eventEdit.js";
import TripListView from "./view/tripList.js";
import TripDayView from "./view/tripDay.js";
import PointView from "./view/tripPoint.js";
import NoPointView from "./view/no-point.js"
import {generatePoint} from "./mock/point.js";

import {render, RenderPosition} from "./utils.js";

const POINT_COUNT = 5;

const points = new Array(POINT_COUNT).fill().map(generatePoint);

const renderPoint = (tripEventsList, point) => {
  const pointComponent = new PointView(point);
  const pointEditComponent = new EventEditView(point);

  const replacePointToForm = () => {
    tripEventsList.replaceChild(pointEditComponent.getElement(), pointComponent.getElement());
  };

  const replaceFormToPoint = () => {
    tripEventsList.replaceChild(pointComponent.getElement(), pointEditComponent.getElement());
  };

  const onEscKeyDown = (evt) => {
    if (evt.key === `Escape` || evt.key === `Esc`) {
      evt.preventDefault();
      replaceFormToPoint();
      document.removeEventListener(`keydown`, onEscKeyDown);
    }
  }

  pointComponent.getElement().querySelector(`.event__rollup-btn`).addEventListener(`click`, () => {
    replacePointToForm();
    document.addEventListener(`keydown`, onEscKeyDown);
  });

  pointEditComponent.getElement().addEventListener(`submit`, (evt) => {
    evt.preventDefault();
    replaceFormToPoint();
    document.removeEventListener(`keydown`, onEscKeyDown);
  });

  render(tripEventsList, pointComponent.getElement(), RenderPosition.BEFOREEND);
};

const tripMainContainer = document.querySelector(`.trip-main`);
const tripControls = tripMainContainer.querySelector(`.trip-controls`);

render(tripMainContainer, new TripInfoView().getElement(), RenderPosition.AFTERBEGIN);
render(tripControls, new TripTabsVew().getElement(), RenderPosition.BEFOREEND);
render(tripControls, new TripFiltersView().getElement(), RenderPosition.BEFOREEND);

const pageMain = document.querySelector(`.page-main`);
const tripEvents = pageMain.querySelector(`.trip-events`);

if (!points.length) {
  render(tripEvents, new NoPointView().getElement(), RenderPosition.BEFOREEND);
} else {
  render(tripEvents, new SortView().getElement(), RenderPosition.AFTERBEGIN);
  const tripDays = new TripListView().getElement();
  render(tripEvents, tripDays, RenderPosition.BEFOREEND);
  render(tripDays, new TripDayView().getElement(), RenderPosition.BEFOREEND);

  const tripEventsList = tripDays.querySelector(`.trip-events__list`);


  for (let i = 0; i < POINT_COUNT; i++) {
    renderPoint(tripEventsList, points[i]);
  }
}
