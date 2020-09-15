import {
  createTypeListTemplate,
  createHeaderDestinationTemplate,
  createTimeTemplate,
  createPriceTemplate,
  createSaveButtonTemplate,
  createResetButtonTemplate,
  createFavoriteTemplate,
  createRollupButtonTemplate,
} from './templates.js';

export const createTripPointEditHeaderTemplate = (data, destinations, isAddMode) => {
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
      ${createHeaderDestinationTemplate(type, destination, destinations)}
      ${createTimeTemplate({start, end})}
      ${createPriceTemplate(price)}
      ${createSaveButtonTemplate(isError)}
      ${createResetButtonTemplate(isAddMode)}

      ${isAddMode ? `` : createFavoriteTemplate(isFavorite)}
      ${isAddMode ? `` : createRollupButtonTemplate()}
    </header>`
  );
};
