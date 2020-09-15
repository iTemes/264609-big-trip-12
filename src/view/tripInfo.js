import AbstractView from "./abstract.js";

const createTripInfoTemplate = (route, period, coast) => {
  return (
    `<section class="trip-main__trip-info  trip-info">
      <div class="trip-info__main">
        <h1 class="trip-info__title">${route ? route : ``}</h1>

        <p class="trip-info__dates">${period ? period : ``}</p>
      </div>

      <p class="trip-info__cost">
        Total: &euro;&nbsp;<span class="trip-info__cost-value">${coast ? coast : 0}</span>
      </p>
    </section>`
  );
};

export default class TripInfo extends AbstractView {
  constructor(route, period, coast) {
    super();
    this._route = route;
    this._period = period;
    this._coast = coast;
  }

  getTemplate() {
    return createTripInfoTemplate(this._route, this._period, this._coast);
  }
}
