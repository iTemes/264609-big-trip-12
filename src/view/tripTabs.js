import AbstractView from "./abstract.js";
import {TabNames} from "../const.js";

const TABS = Object.values(TabNames);

const createTripTabsTemplate = (ativeTab) => {
  return (
    `<nav class="trip-controls__trip-tabs  trip-tabs">
      ${TABS
      .map((tab)=>(
        `<a
          class="trip-tabs__btn  ${tab === ativeTab ? `trip-tabs__btn--active` : ``}"
          href="#">${tab}</a>`
      )).join(``)}
      </nav></div>`
  );
};

export default class TripTabs extends AbstractView {
  constructor(ativeTab) {
    super();
    this._ativeTab = ativeTab;
  }

  getTemplate() {
    return createTripTabsTemplate(this._ativeTab);
  }
}
