import {FilterType} from "../const";
import {isDateAfter, isDateBefore} from './date';

export const filter = {
  [FilterType.FUTURE]: (points) => points.filter((point) => isDateAfter(point.start, new Date())),
  [FilterType.PAST]: (points) => points.filter((point) => isDateBefore(point.end, new Date())),
};
