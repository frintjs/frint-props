import { distinctUntilChanged } from 'rxjs/operators/distinctUntilChanged';

export function shouldUpdate(checkFn) {
  return function (...args) {
    return distinctUntilChanged((a, b) => {
      return !checkFn(a, b, ...args);
    });
  };
}
