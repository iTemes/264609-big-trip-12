import InfoView from '../view/tripInfo.js';

import {
  render,
  RenderPosition,
  replace, remove,
} from '../utils/render.js';

import {
  formatDateMmmDd,
} from '../utils/date.js';

import {FilterType} from '../const.js';
import {filter} from '../utils/filter.js';

const getPeriodTitle = (date) => formatDateMmmDd(date).toLocaleUpperCase();

const calcCoast = (points) => points.reduce((sum, point) => sum + point.price, 0);

const getRoute = (points) => {
  const count = points.length;
  switch (points.length) {
    case 0:
      return ``;
    case 1:
    case 2:
    case 3:
      return points.map((point) => point.destination).join(` — `);
    default:
      return `${points[0].destination} — ... — ${points[count - 1].destination}`;
  }
};

const getPeriod = (points) => {
  const count = points.length;
  return count > 0
    ? `${
      getPeriodTitle(points[0].start)
    } — ${
      getPeriodTitle(points[points.length - 1].end)
    }`
    : ``;
};

export default class Info {
  constructor(infoContainer, tripModel, filterModel) {
    this._infoContainer = infoContainer;
    this._tripModel = tripModel;
    this._filterModel = filterModel;

    this._infoView = null;
    this._currentFilter = null;

    this._handleModelEvent = this._handleModelEvent.bind(this);

    this._tripModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);
  }

  init() {
    const points = this._tripModel.getPoints();
    const filterType = this._filterModel.getFilter();
    const filteredPoints = filterType === FilterType.EVERYTHING
      ? points
      : filter[filterType](points);

    const coast = calcCoast(filteredPoints);

    const route = getRoute(filteredPoints);

    const period = getPeriod(filteredPoints);

    const prevFilterInfoView = this._infoView;

    this._infoView = new InfoView(route, period, coast);

    if (prevFilterInfoView === null) {
      render(this._infoContainer, this._infoView, RenderPosition.AFTERBEGIN);
      return;
    }

    replace(this._infoView, prevFilterInfoView);
    remove(prevFilterInfoView);
  }

  _handleModelEvent() {
    this.init();
  }
}
