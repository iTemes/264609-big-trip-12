import TripInfoView from "./view/tripInfo.js";
import {createTripTabs} from "./view/tripTabs.js";
import {createTripFilters} from "./view/tripFilters.js";
import {createSort} from "./view/sort.js";
import {createEventEdit} from "./view/eventEdit.js";
import {createTripDays} from "./view/tripList.js";
import {createTripDay} from "./view/tripDay.js";
import {createPoint} from "./view/tripPoint.js";
import {generatePoint} from "./mock/point.js";

import {renderTemplate, renderElement, RenderPosition} from "./utils.js";

const POINT_COUNT = 3;

const points = new Array(POINT_COUNT).fill().map(generatePoint);
const editPoint = new Array(1).fill().map(generatePoint);


const tripMainContainer = document.querySelector(`.trip-main`);
const tripControls = tripMainContainer.querySelector(`.trip-controls`);

renderElement(tripMainContainer, new TripInfoView().getElement(), RenderPosition.AFTERBEGIN);

renderTemplate(tripControls, createTripTabs(), `afterbegin`);
renderTemplate(tripControls, createTripFilters(), `beforeend`);

const pageMain = document.querySelector(`.page-main`);
const tripEvents = pageMain.querySelector(`.trip-events`);

renderTemplate(tripEvents, createSort(), `afterbegin`);
renderTemplate(tripEvents, createEventEdit(editPoint[0]), `beforeend`);
renderTemplate(tripEvents, createTripDays(), `beforeend`);

const tripDays = tripEvents.querySelector(`.trip-days`);

renderTemplate(tripDays, createTripDay(), `beforeend`);

const tripEventsList = tripDays.querySelector(`.trip-events__list`);

for (let i = 0; i < POINT_COUNT; i++) {
  renderTemplate(tripEventsList, createPoint(points[i]), `beforeend`);
}

