import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

export function withState(valueName, setterName, initialState) {
  return function () {
    const state$ = new BehaviorSubject(initialState);
    function setterFn(newValue) {
      state$.next(newValue);
    }

    const defaultProps = {
      [valueName]: initialState,
      [setterName]: setterFn,
    };

    const result$ = new Observable(function (observer) {
      observer.next(defaultProps);

      const subscription = state$.subscribe(function (x) {
        observer.next({
          [valueName]: x,
          [setterName]: setterFn,
        });
      });

      return function () {
        subscription.unsubscribe();
      };
    });

    result$.defaultProps = defaultProps;

    return result$;
  };
}
