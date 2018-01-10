import { of } from 'rxjs/observable/of';
import { merge } from 'rxjs/observable/merge';
import isObservable from 'is-observable';

export function compose(...items) {
  return function (...args) {
    const values = items.map(item => item(...args));

    const observables = values
      .filter(item => typeof item !== 'function')
      .map(item => (isObservable(item)
        ? item
        : of(item)));

    const pipes = values
      .filter(item => typeof item === 'function');

    const defaultProps = observables.reduce((acc, item) => {
      if (typeof item.defaultProps === 'undefined') {
        return acc;
      }

      return {
        ...acc,
        ...item.defaultProps,
      };
    }, {});

    const toMerge = observables.length === 0
      ? [of({})]
      : observables;

    const result$ = merge(...toMerge)
      .pipe(...pipes);

    result$.defaultProps = defaultProps;

    return result$;
  };
}
