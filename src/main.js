
import TripTabsVew from "./view/tripTabs.js";
import ControlsView from "./view/controls.js";
import NewPointButtonView from "./view/new-point-button.js";

import {generatePoints, DESTINATIONS} from "./mock/point.js";
import TripPresenter from "./presenter/tripList.js";
import FilterPresenter from "./presenter/filter.js";
import InfoPresenter from "./presenter/info.js";
import PointsModel from "./model/points.js";
import FilterModel from "./model/filter.js";
import {render, RenderPosition} from "./utils/render.js";


const POINTS_COUNT = 20;
const points = generatePoints(POINTS_COUNT);

const pointsModel = new PointsModel();
pointsModel.setDestinations(DESTINATIONS);
pointsModel.setPoints(points);

const filterModel = new FilterModel();

const tripMainContainer = document.querySelector(`.trip-main`);

const controlsView = new ControlsView();
render(tripMainContainer, controlsView, RenderPosition.AFTERBEGIN);

const newPointButton = new NewPointButtonView();
render(tripMainContainer, newPointButton, RenderPosition.BEFOREEND);

const tabsView = new TripTabsVew();
render(controlsView, tabsView, RenderPosition.AFTERBEGIN);


const tripEvents = document.querySelector(`.trip-events`);

const tripPresenter = new TripPresenter(tripEvents, pointsModel, filterModel);
tripPresenter.init();

const filterPresenter = new FilterPresenter(controlsView, pointsModel, filterModel);
filterPresenter.init();

const infoPresenter = new InfoPresenter(tripMainContainer, pointsModel, filterModel);
infoPresenter.init();

const newPointButtonElement = newPointButton.getElement();
newPointButtonElement.addEventListener(`click`, (evt) => {
  evt.preventDefault();
  newPointButtonElement.disabled = true;
  tripPresenter.createPoint(() => {
    newPointButtonElement.disabled = false;
  });
});
