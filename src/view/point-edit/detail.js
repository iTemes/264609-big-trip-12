import {createOffersTemplate} from './templates';
import {createDestinationTemplate} from './destination.js';

export const createDetailTemplate = (point, destinations) => {
  const {offers, destination} = point;
  return (
    `<section class="event__details">
      ${createOffersTemplate(offers)}
      ${destination ? createDestinationTemplate(point, destinations) : ``}
    </section>`
  );
};
