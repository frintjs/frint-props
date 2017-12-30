import { of } from 'rxjs/observable/of';

export function withDefaults(defaults) {
  return function (...args) {
    const defaultsObj = typeof defaults === 'function'
      ? defaults(...args)
      : defaults;

    const result$ = of(defaultsObj);
    result$.defaultProps = defaultsObj;

    return result$;
  };
}
