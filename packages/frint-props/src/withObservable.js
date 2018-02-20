import { of } from 'rxjs/observable/of';
import { switchMap } from 'rxjs/operators/switchMap';
import isObservable from './isObservable';

export function withObservable(source, ...mappers) {
  return function (...args) {
    const result$ = typeof source === 'function'
      ? source(...args)
      : source;

    if (mappers.length === 0) {
      return result$;
    }

    return result$.pipe(
      ...mappers.map((mapperFn) => {
        return switchMap(function (value) {
          const result = mapperFn(value);

          if (isObservable(result)) {
            return result;
          }

          return of(result);
        });
      }),
    );
  };
}
