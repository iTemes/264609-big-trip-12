import AbstractView from './abstract';

const createNewPointButtonTemplate = () => {
  return (
    `<button
      class="trip-main__event-add-btn  btn  btn--big  btn--yellow"
      type="button">
      New event
    </button>`
  );
};

export default class NewPointButton extends AbstractView {
  getTemplate() {
    return createNewPointButtonTemplate();
  }
}
