import { map } from 'rxjs/operators/map';

export function withHandlers(handlers) {
  return function (...args) {
    return map((props) => {
      const result = props;

      Object
        .keys(handlers)
        .forEach((handlerName) => {
          const handlerFunc = handlers[handlerName];
          result[handlerName] = function (...handlerArgs) {
            return handlerFunc(result, ...args)(...handlerArgs);
          };
        });

      return result;
    });
  };
}
