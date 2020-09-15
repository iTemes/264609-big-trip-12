import FiltersView from '../view/tripFilters.js';

import {
  render,
  RenderPosition,
  replace, remove,
} from '../utils/render.js';
import {filter} from '../utils/filter';
import {UpdateType, FilterType} from '../const';

export default class Filter {
  constructor(filterContainer, tripModel, filterModel) {
    this._filterContainer = filterContainer;
    this._tripModel = tripModel;
    this._filterModel = filterModel;
    this._currentFilter = null;

    this._filterView = null;

    this._modelEventHandler = this._modelEventHandler.bind(this);
    this._filterTypeChangeHandler = this._filterTypeChangeHandler.bind(this);

    this._tripModel.addObserver(this._modelEventHandler);
    this._filterModel.addObserver(this._modelEventHandler);
  }

  init() {
    this._currentFilter = this._filterModel.getFilter();
    const prevFilterView = this._filterView;

    const points = this._tripModel.getPoints();
    const filtersStatus = {
      [FilterType.EVERYTHING]: points.length > 0,
      [FilterType.FUTURE]: filter[FilterType.FUTURE](points).length > 0,
      [FilterType.PAST]: filter[FilterType.PAST](points).length > 0,
    };

    this._filterView = new FiltersView(this._currentFilter, filtersStatus);
    this._filterView.setFilterTypeChangeHandler(this._filterTypeChangeHandler);

    if (prevFilterView === null) {
      render(this._filterContainer, this._filterView, RenderPosition.BEFOREEND);
      return;
    }

    replace(this._filterView, prevFilterView);
    remove(prevFilterView);
  }

  _modelEventHandler() {
    this.init();
  }

  _filterTypeChangeHandler(filterType) {
    if (this._currentFilter === filterType) {
      return;
    }

    this._filterModel.setFilter(UpdateType.MAJOR, filterType);
  }
}
