import { compose as composeProps } from 'frint-props';
import { observe } from 'frint-react';

export function compose(...funcs) {
  return function (Component) {
    return observe(function (...args) {
      return composeProps(...funcs)(...args);
    })(Component);
  };
}
