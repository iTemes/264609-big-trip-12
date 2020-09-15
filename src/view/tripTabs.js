import AbstractView from "./abstract.js";
import {TabNames} from "../const.js";

const TABS = Object.values(TabNames);
const ACTIVE_TAB_CLASS = `trip-tabs__btn--active`;

const createTripTabsTemplate = () => {
  return (
    `<nav class="trip-controls__trip-tabs  trip-tabs">
      ${TABS
      .map((tab)=>(
        `<a
          class="trip-tabs__btn  ${tab === TabNames.TABLE ? ACTIVE_TAB_CLASS : ``}"
          href="#"
          data-tab="${tab}">${tab}</a>`
      )).join(``)}
      </nav></div>`
  );
};

export default class TripTabs extends AbstractView {
  constructor() {
    super();
    this._handleTabsClick = this._handleTabsClick.bind(this);
  }

  getTemplate() {
    return createTripTabsTemplate();
  }

  _handleTabsClick(evt) {
    evt.preventDefault();
    const prevActiveTabElement = this.getElement().querySelector(`.${ACTIVE_TAB_CLASS}`);
    const prevActiveTab = prevActiveTabElement.dataset.tab;
    prevActiveTabElement.classList.remove(ACTIVE_TAB_CLASS);

    evt.target.classList.add(ACTIVE_TAB_CLASS);
    const activeTab = evt.target.dataset.tab;

    if (activeTab !== prevActiveTab) {
      this._callback.tabsClick(activeTab);
    }
  }

  setTabsClickHandler(callback) {
    this._callback.tabsClick = callback;
    this.getElement().addEventListener(`click`, this._handleTabsClick);
  }
}
