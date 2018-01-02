/* global describe, test, expect */
import { withState } from './withState';
import { compose } from './compose';
import { Tester } from './internal/Tester';

describe('withState', function () {
  test('is a function', function () {
    expect(typeof withState).toBe('function');
  });

  test('has initial value', function () {
    const t = new Tester(compose(
      withState('counter', 'setCounter', 5),
    )());
    expect(t.props.counter).toBe(5);
  });

  test('can update value', function () {
    const t = new Tester(compose(
      withState('counter', 'setCounter', 0),
    )());

    expect(t.props.counter).toBe(0);
    t.props.setCounter(t.props.counter + 1);
    t.props.setCounter(t.props.counter + 1);
    t.props.setCounter(t.props.counter + 1);
    expect(t.props.counter).toBe(3);
  });
});
