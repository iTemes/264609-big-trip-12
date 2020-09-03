import AbstractView from './abstract';

const createPointsItemTemplate = () => {
  return (
    `<li class="trip-events__item">
    </li>`
  );
};

export default class PointsItem extends AbstractView {
  getTemplate() {
    return createPointsItemTemplate();
  }
}
