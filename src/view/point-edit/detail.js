import {createOffersTemplate} from './templates';

export const createDetailTemplate = (point) => {
  const {offers} = point;
  return (
    `<section class="event__details">
      ${createOffersTemplate(offers)}
    </section>`
  );
};
