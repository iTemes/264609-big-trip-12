import {toFirstUpperCase} from './common.js';

import {pointTypeToPreposition} from '../const.js';

export const getPointTypeWithPreposition = (currentType) => {
  const type = currentType.toLowerCase();
  const printType = toFirstUpperCase(type);
  const preposition = pointTypeToPreposition[type];
  return preposition ? `${printType} ${preposition}` : ``;
};
