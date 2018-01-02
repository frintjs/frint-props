/* global describe, test, expect */
import { withDefaults } from './withDefaults';
import { withState } from './withState';
import { shouldUpdate } from './shouldUpdate';
import { compose } from './compose';
import { Tester } from './internal/Tester';

describe('frint-props :: shouldUpdate', function () {
  test('is a function', function () {
    expect(typeof shouldUpdate).toBe('function');
  });

  test('can control further streaming of props', function () {
    const t = new Tester(compose(
      withDefaults({ counter: 0 }),
      withState('counter', 'setCounter', 0),
      shouldUpdate((prevProps, nextProps) => {
        // allow only event numbers
        return nextProps.counter % 2 === 0;
      }),
    )());

    expect(t.props.counter).toBe(0);

    t.props.setCounter(1);
    expect(t.props.counter).toEqual(0); // should NOT update

    t.props.setCounter(2);
    expect(t.props.counter).toEqual(2); // should update

    t.props.setCounter(3);
    expect(t.props.counter).toEqual(2); // should NOT update

    t.props.setCounter(4);
    expect(t.props.counter).toEqual(4); // should update
  });
});
