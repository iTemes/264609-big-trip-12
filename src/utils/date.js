import moment from 'moment';

import {
  MINUTE,
  HOUR,
  DAY,
} from '../const.js';

const isDate = (date) => date instanceof Date;

export const convertNumberOfDate = (value) => String(value).padStart(2, `0`);

export const formatDateYyyyMmDdHhMmWithDash = (date) => isDate(date) ? moment(date).format(`DD/MM/YY HH:mm`) : ``;

export const formatDateISODdMmYyyyHhMm = (date) => isDate(date) ? moment(date).format(`YYYY-MM-DD[T]HH:mm`) : ``;

export const formatDateMmmDd = (date) => isDate(date) ? moment(date).format(`MMM DD`) : ``;

export const diffDate = (date1, date2) => ((+date1) - (+date2));

export const convertMsToDHM = (ms) => {
  const days = Math.floor(ms / DAY);
  const hours = Math.floor((ms - days * DAY) / HOUR);
  const minutes = Math.floor((ms - days * DAY - hours * HOUR) / MINUTE);

  return {days, hours, minutes};
};

export const isDateAfter = (date1, date2) => {
  date1 = moment(date1).format(`YYYY-MM-DD`);
  date2 = moment(date2).format(`YYYY-MM-DD`);

  return moment(date1).isAfter(date2);
};

export const isDateBefore = (date1, date2) => {
  date1 = moment(date1).format(`YYYY-MM-DD`);
  date2 = moment(date2).format(`YYYY-MM-DD`);
  return moment(date1).isBefore(date2);
};

export const addDaysToDate = (date, count = 1) => new Date(moment(date).add(count, `day`).format());
