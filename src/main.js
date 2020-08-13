import TripInfoView from "./view/tripInfo.js";
import TripTabsVew from "./view/tripTabs.js";
import TripFiltersView from "./view/tripFilters.js";
import SortView from "./view/sort.js";
import EventEditView from "./view/eventEdit.js";
import TripListView from "./view/tripList.js";
import TripDayView from "./view/tripDay.js";
import PointView from "./view/tripPoint.js";
import {generatePoint} from "./mock/point.js";

import {renderElement, RenderPosition} from "./utils.js";

const POINT_COUNT = 3;

const points = new Array(POINT_COUNT).fill().map(generatePoint);


const tripMainContainer = document.querySelector(`.trip-main`);
const tripControls = tripMainContainer.querySelector(`.trip-controls`);

renderElement(tripMainContainer, new TripInfoView().getElement(), RenderPosition.AFTERBEGIN);
renderElement(tripControls, new TripTabsVew().getElement(), RenderPosition.BEFOREEND);
renderElement(tripControls, new TripFiltersView().getElement(),  RenderPosition.BEFOREEND);

const pageMain = document.querySelector(`.page-main`);
const tripEvents = pageMain.querySelector(`.trip-events`);
renderElement(tripEvents, new SortView().getElement(), RenderPosition.AFTERBEGIN);
renderElement(tripEvents, new EventEditView(points[0]).getElement(), RenderPosition.BEFOREEND);

const tripDays =  new TripListView();
renderElement(tripEvents, tripDays.getElement(), RenderPosition.BEFOREEND);
renderElement(tripDays.getElement(), new TripDayView().getElement(), RenderPosition.BEFOREEND);

const tripEventsList = tripDays.getElement().querySelector(`.trip-events__list`);

for (let i = 0; i < POINT_COUNT; i++) {
  renderElement(tripEventsList, new PointView(points[i]).getElement(),  RenderPosition.BEFOREEND);
}

