import moment from 'moment';

import {
  MINUTE,
  HOUR,
  DAY,
} from '../const.js';

const isDate = (date) => date instanceof Date;

export const convertNumberOfDate = (value) => String(value).padStart(2, `0`);
/**
 * @param {date} date
 * @return {date} 17/08/20 18:00
 */
export const formatDateYyyyMmDdHhMmWithDash = (date) => isDate(date) ? moment(date).format(`DD/MM/YY HH:mm`) : ``;

/**
 * @param {date} date
 * @return {date} 2020-08-17T18:00
 */
export const formatDateISODdMmYyyyHhMm = (date) => isDate(date) ? moment(date).format(`YYYY-MM-DD[T]HH:mm`) : ``;

/**
 * @param {date} date1
 * @param {date} date2
 * @return {number} milliseconds
 */
export const diffDate = (date1, date2) => ((+date1) - (+date2));

/**
 * @param {number} ms
 * @return {object} {day: number, hour: number, minutes: number}
 */
export const convertMsToDHM = (ms) => {
  const day = Math.floor(ms / DAY);
  const hour = Math.floor((ms - day * DAY) / HOUR);
  const minute = Math.floor((ms - day * DAY - hour * HOUR) / MINUTE);
  return {day, hour, minute};
};
