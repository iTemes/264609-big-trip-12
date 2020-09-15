import AbstractView from "./abstract.js";
import {FilterType} from '../const.js';

const FILTERS = Object.values(FilterType);


const createTripFiltersTemplate = (activeFilter, filtersStatus) => {
  return (
    `<form class="trip-filters" action="#" method="get">
      <h2 class="visually-hidden">Filter events</h2>
      ${FILTERS
        .map((filter) => {
          const key = filter.toLowerCase();
          return (
            `<div class="trip-filters__filter">
              <input
                id="filter-${key}"
                class="trip-filters__filter-input  visually-hidden"
                type="radio"
                name="trip-filter"
                value="${filter}"
                ${filter === activeFilter ? `checked` : ``}
                ${filtersStatus[filter] ? `` : `disabled`}
              >
              <label class="trip-filters__filter-label" for="filter-${key}">
                ${filter}
              </label>
            </div>`
          );
        })
        .join(``)}
      <button class="visually-hidden" type="submit">
        Accept filter
      </button>
    </form>`
  );
};

export default class TripFilters extends AbstractView {
  constructor(activeFilter, filtersStatus) {
    super();
    this._activeFilter = activeFilter;
    this._filtersStatus = filtersStatus;
    this._handleFilterTypeChange = this._handleFilterTypeChange.bind(this);
  }

  getTemplate() {
    return createTripFiltersTemplate(this._activeFilter, this._filtersStatus);
  }

  _handleFilterTypeChange(evt) {
    evt.preventDefault();
    this._callback.filterTypeChange(evt.target.value);
  }

  setFilterTypeChangeHandler(callback) {
    this._callback.filterTypeChange = callback;
    this.getElement().addEventListener(`change`, this._handleFilterTypeChange);
  }
}

