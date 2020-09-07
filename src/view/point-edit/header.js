import {
  createTypeListTemplate,
  createDestinationTemplate,
  createTimeTemplate,
  createPriceTemplate,
  createSaveButtonTemplate,
  createCancelButtonTemplate,
  createFavoriteTemplate,
  createRollupButtonTemplate,
} from './templates.js';

export const createTripPointEditHeaderTemplate = (data, destinations) => {
  const {
    type,
    destination,
    start,
    end,
    price,
    isFavorite,
    isDestinationError,
    isDatesError,
  } = data;

  const isError = isDestinationError || isDatesError;

  return (
    `<header class="event__header">
      ${createTypeListTemplate(type)}
      ${createDestinationTemplate(type, destination, destinations)}
      ${createTimeTemplate({start, end})}
      ${createPriceTemplate(price)}
      ${createSaveButtonTemplate(isError)}
      ${createCancelButtonTemplate()}
      ${createFavoriteTemplate(isFavorite)}
      ${createRollupButtonTemplate()}
    </header>`
  );
};
