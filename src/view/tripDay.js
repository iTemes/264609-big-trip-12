import AbstractView from "./abstract.js";

const convertToTitle = (value) => {
  const date = new Date(value);
  const day = date.getDate();
  const month = date.toLocaleString(`en-us`, {month: `short`});

  return `${month} ${day}`;
};

const getDayInfoTemplate = ({dayCount, date}) => {
  return (
    `<div class="day__info">
      <span class="day__counter">${dayCount}</span>
      <time class="day__date" datetime=${date}>
        ${convertToTitle(date)}
      </time>
    </div>`
  );
};

const createTripDayTemplate = (day) => {
  return (
    `<li class="trip-days__item  day">
    ${day.isCountRender ? getDayInfoTemplate(day) : `<div class="day__info"></div>`}
    </li>`
  );
};

export default class TripDay extends AbstractView {
  constructor(dayData) {
    super();
    this._dayData = dayData;
  }
  getTemplate() {
    return createTripDayTemplate(this._dayData);
  }
}
