
import AbstractView from './abstract';
import {extend} from '../utils/common.js';

export default class AbstractSmart extends AbstractView {
  constructor() {
    super();
    this._data = {};
  }

  restoreHandlers() {
    throw new Error(`Abstract method not implemented: restoreHandlers`);
  }

  updateData(update, justDataUpdating) {
    if (!update) {
      return;
    }

    this._data = extend(
        this._data,
        update
    );

    if (justDataUpdating) {
      return;
    }

    this.updateElement();
  }

  updateElement() {
    let prevElement = this.getElement();
    const parent = prevElement.parentElement;
    this.removeElement();

    const newElement = this.getElement();

    parent.replaceChild(newElement, prevElement);
    prevElement = null;

    this.restoreHandlers();
  }
}
