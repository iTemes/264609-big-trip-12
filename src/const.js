export const PointMessage = {
  LOADING: `Loading...`,
  NO_EVENTS: `Click New Event to create your first point`,
};

export const MINUTE = 60 * 1000;
export const HOUR = 60 * MINUTE;
export const DAY = 24 * HOUR;

export const TRANSFERS = [`Taxi`, `Bus`, `Train`, `Ship`, `Transport`, `Drive`, `Flight`];
export const ACTVITIES = [`Check-in`, `Sightseeing`, `Restaurant`];

export const PointGroupType = {
  TRANSFER: `Transfer`,
  ACTVITY: `Activity`,
};

export const pointTypeEmoji = {
  'Taxi': `🚕`,
  'Bus': `🚌`,
  'Train': `🚂`,
  'Ship': `🛳`,
  'Transport': `🚊`,
  'Drive': `🚗`,
  'Flight': `✈️`,
  'Check-in': `🏨`,
  'Sightseeing': `🏛`,
  'Restaurant': `🍴`,
};

export const pointGroupToTypes = {
  [PointGroupType.TRANSFER]: TRANSFERS,
  [PointGroupType.ACTVITY]: ACTVITIES,
};

const pointGropTypeToPreposition = {
  [PointGroupType.TRANSFER]: `to`,
  [PointGroupType.ACTVITY]: `in`,
};

export const pointTypeToPreposition = {
  'taxi': pointGropTypeToPreposition[PointGroupType.TRANSFER],
  'bus': pointGropTypeToPreposition[PointGroupType.TRANSFER],
  'train': pointGropTypeToPreposition[PointGroupType.TRANSFER],
  'ship': pointGropTypeToPreposition[PointGroupType.TRANSFER],
  'transport': pointGropTypeToPreposition[PointGroupType.TRANSFER],
  'drive': pointGropTypeToPreposition[PointGroupType.TRANSFER],
  'flight': pointGropTypeToPreposition[PointGroupType.TRANSFER],
  'check-in': pointGropTypeToPreposition[PointGroupType.ACTVITY],
  'sightseeing': pointGropTypeToPreposition[PointGroupType.ACTVITY],
  'restaurant': pointGropTypeToPreposition[PointGroupType.ACTVITY],
};

export const SortType = {
  EVENT: `Event`,
  TIME: `Time`,
  PRICE: `Price`,
};

export const UserAction = {
  UPDATE_POINT: `UPDATE_POINT`,
  ADD_POINT: `ADD_POINT`,
  DELETE_POINT: `DELETE_POINT`
};

export const UpdateType = {
  PATCH: `PATCH`,
  MINOR: `MINOR`,
  MAJOR: `MAJOR`
};

export const FilterType = {
  EVERYTHING: `Everything`,
  FUTURE: `Future`,
  PAST: `Past`,
};

export const TabNames = {
  TABLE: `Table`,
  STATS: `Stats`,
};
