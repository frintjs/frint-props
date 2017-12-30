import { map as mapOperator } from 'rxjs/operators/map';

export function map(mapperFn) {
  return function (...args) {
    return mapOperator(x => mapperFn(x, ...args));
  };
}
