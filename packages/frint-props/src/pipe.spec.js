/* global describe, test, expect */
import { map } from 'rxjs/operators/map';

import { withDefaults } from './withDefaults';
import { withState } from './withState';
import { compose } from './compose';
import { pipe } from './pipe';
import { Tester } from './internal/Tester';

describe('frint-props :: pipe', function () {
  test('is a function', function () {
    expect(typeof pipe).toBe('function');
  });

  test('pipes with given lettable operator', function () {
    const t = new Tester(compose(
      withDefaults({ counter: 0 }),
      withState('counter', 'setCounter', 0),
      pipe(map(props => ({
        ...props,
        counter: props.counter * 10,
      }))),
    )());

    expect(t.props.counter).toEqual(0);

    t.props.setCounter(1);
    expect(t.props.counter).toEqual(10);

    t.props.setCounter(2);
    expect(t.props.counter).toEqual(20);

    t.props.setCounter(3);
    expect(t.props.counter).toEqual(30);
  });
});
