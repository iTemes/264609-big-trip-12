import TripInfoView from "./view/tripInfo.js";
import TripTabsVew from "./view/tripTabs.js";
import TripFiltersView from "./view/tripFilters.js";

import {generatePoints, DESTINATIONS} from "./mock/point.js";
import TripPresenter from "./presenter/tripList.js";
import {render, RenderPosition} from "./utils/render.js";


const POINTS_COUNT = 20;
const points = generatePoints(POINTS_COUNT);

const renderHeader = () => {
  const tripMainContainer = document.querySelector(`.trip-main`);
  const tripControls = tripMainContainer.querySelector(`.trip-controls`);

  render(tripMainContainer, new TripInfoView(), RenderPosition.AFTERBEGIN);
  render(tripControls, new TripTabsVew(), RenderPosition.BEFOREEND);
  render(tripControls, new TripFiltersView(), RenderPosition.BEFOREEND);
};

const tripEvents = document.querySelector(`.trip-events`);
const tripPresenter = new TripPresenter(tripEvents);

renderHeader();

tripPresenter.init(points, DESTINATIONS);
