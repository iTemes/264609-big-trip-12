import AbstractView from "./abstract.js";
import {SortType} from "../const.js";

const SORT_ICON = (
  `<svg class="trip-sort__direction-icon" width="8" height="10" viewBox="0 0 8 10">
    <path
      d="M2.888 4.852V9.694H5.588V4.852L7.91 5.068L4.238 0.00999987L0.548 5.068L2.888 4.852Z"
    />
  </svg>`
);

const createSortTemplate = (defaultSortType) => {
  return (
    `<form class="trip-events__trip-sort  trip-sort" action="#" method="get">
      <span class="trip-sort__item  trip-sort__item--day">Day</span>

      ${Object.values(SortType)
        .map((sort) => {
          const key = sort.toLowerCase();
          return (
            `<div class="trip-sort__item  trip-sort__item--${key}">
              <input
                id="sort-${key}"
                class="trip-sort__input  visually-hidden"
                type="radio" name="trip-sort"
                value="sort-${key}"
                ${sort === defaultSortType ? `checked` : ``}
                data-sort-type="${sort}"
              >
              <label class="trip-sort__btn" for="sort-${key}">
                ${sort}
                ${sort === defaultSortType ? `` : SORT_ICON}
              </label>
            </div>`
          );
        })
        .join(``)}

      <span class="trip-sort__item  trip-sort__item--offers">Offers</span>
    </form>`
  );
};

export default class Sort extends AbstractView {
  constructor(sortType = SortType.EVENT) {
    super();
    this._sortType = sortType;
    this._sortTypeChangeHandler = this._sortTypeChangeHandler.bind(this);
  }

  getTemplate() {
    return createSortTemplate(this._sortType);
  }

  _sortTypeChangeHandler(evt) {
    evt.preventDefault();
    this._callback.sortTypeChange(evt.target.dataset.sortType);
  }

  setSortTypeChangeHandler(callback) {
    this._callback.sortTypeChange = callback;
    this.getElement().addEventListener(`change`, this._sortTypeChangeHandler);
  }
}
