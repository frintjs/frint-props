import { of } from 'rxjs/observable/of';

export function withDefaults(defaults) {
  return function (app, props$) {
    const defaultsObj = typeof defaults === 'function'
      ? defaults(app, props$)
      : defaults;

    const result$ = of(defaultsObj);
    result$.defaultProps = defaultsObj;

    return result$;
  };
}
