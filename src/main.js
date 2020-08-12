import {createTripInfo} from "./view/tripInfo.js";
import {createTripTabs} from "./view/tripTabs.js";
import {createTripFilters} from "./view/tripFilters.js";
import {createSort} from "./view/sort.js";
import {createEventEdit} from "./view/eventEdit.js";
import {createTripDays} from "./view/tripList.js";
import {createTripDay} from "./view/tripDay.js";
import {createPoint} from "./view/tripPoint.js";

import {generatePoint} from "./mock/point.js";

const POINT_COUNT = 3;

const points = new Array(POINT_COUNT).fill().map(generatePoint);
const editPoint = new Array(1).fill().map(generatePoint);

const renderElement = (container, template, place) => container.insertAdjacentHTML(place, template);

const tripMainContainer = document.querySelector(`.trip-main`);
const tripControls = tripMainContainer.querySelector(`.trip-controls`);

renderElement(tripMainContainer, createTripInfo(), `afterbegin`);
renderElement(tripControls, createTripTabs(), `afterbegin`);
renderElement(tripControls, createTripFilters(), `beforeend`);

const pageMain = document.querySelector(`.page-main`);
const tripEvents = pageMain.querySelector(`.trip-events`);

renderElement(tripEvents, createSort(), `afterbegin`);
renderElement(tripEvents, createEventEdit(editPoint[0]), `beforeend`);
renderElement(tripEvents, createTripDays(), `beforeend`);

const tripDays = tripEvents.querySelector(`.trip-days`);

renderElement(tripDays, createTripDay(), `beforeend`);

const tripEventsList = tripDays.querySelector(`.trip-events__list`);

for (let i = 0; i < POINT_COUNT; i++) {
  renderElement(tripEventsList, createPoint(points[i]), `beforeend`);
}

