import AbstractView from "./abstract.js";

const createTripDaysTemplate = () => {
  return (
    `<ul class="trip-days">
    </ul>
    `
  );
};

export default class TripList extends AbstractView {
  getTemplate() {
    return createTripDaysTemplate();
  }
}
