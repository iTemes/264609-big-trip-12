
import Observer from "../utils/observer.js";

export default class Points extends Observer {
  constructor() {
    super();
    this._destinations = [];
    this._points = [];
  }

  setDestinations(destinations) {
    this._destinations = destinations.slice();
  }

  getDestinations() {
    return this._destinations;
  }

  setPoints(points) {
    this._points = points.slice();
  }

  getPoints() {
    return this._points;
  }

  updatePoint(updateType, update) {
    const index = this._points.findIndex((point) => point.id === update.id);

    if (index === -1) {
      throw new Error(`Can't update unexisting point`);
    }

    this._points = [
      ...this._points.slice(0, index),
      update,
      ...this._points.slice(index + 1)
    ];

    this._notify(updateType, update);
  }

  addPoint(updateType, update) {
    this._points = [
      update,
      ...this._points
    ];

    this._notify(updateType, update);
  }

  deletePoint(updateType, update) {
    const index = this._points.findIndex((point) => point.id === update.id);

    if (index === -1) {
      throw new Error(`Can't delete unexisting point`);
    }

    this._points = [
      ...this._points.slice(0, index),
      ...this._points.slice(index + 1)
    ];

    this._notify(updateType);
  }

  static adaptToClient(point) {
    const adaptedPoint = Object.assign(
        {},
        point,
        {
          start: point.date_from,
          end: point.date_to,
          price: point.base_price,
          isFavorite: point.is_favorite,
        }
    );

    // Ненужные ключи мы удаляем
    delete adaptedPoint.date_from;
    delete adaptedPoint.date_to;
    delete adaptedPoint.base_price;
    delete adaptedPoint.is_favorite;

    return adaptedPoint;
  }

  static adaptToServer(point) {
    const adaptedPoint = Object.assign(
        {},
        task,
        {
          "date_from": point.start,
          "date_to": point.end,
          "base_price": point.price,
          "is_favorite": point.isFavorite,
        }
    );

    // Ненужные ключи мы удаляем
    delete adaptedPoint.start;
    delete adaptedPoint.end;
    delete adaptedPoint.price;
    delete adaptedPoint.isFavorite;

    return adaptedPoint;
  }
}
