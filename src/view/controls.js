import AbstractView from './abstract';

const createControlsTemplate = () => {
  return (
    `<div class="trip-main__trip-controls  trip-controls">
      <h2 id="trip-header-swich-view" class="visually-hidden">Switch trip view</h2>
      <h2 id="trip-filter-events" class="visually-hidden">Filter events</h2>
    </div>`
  );
};

export default class Controls extends AbstractView {
  getTemplate() {
    return createControlsTemplate();
  }

  getFilterEventsHeaderElement() {
    return this.getElement().querySelector(`#trip-filter-events`);
  }
}
