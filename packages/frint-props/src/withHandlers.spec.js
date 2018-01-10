/* global describe, test, expect */
import { withState } from './withState';
import { withHandlers } from './withHandlers';
import { compose } from './compose';
import { Tester } from './internal/Tester';

describe('withHandlers', function () {
  test('is a function', function () {
    expect(typeof withHandlers).toBe('function');
  });

  test('has initial value', function () {
    const t = new Tester(compose(
      withHandlers({
        foo: () => () => 'foo',
      }),
    )());
    expect(typeof t.props.foo).toEqual('function');
  });

  test('can access other props', function () {
    const t = new Tester(compose(
      withState('counter', 'setCounter', 0),
      withHandlers({
        handleIncrement: props => () => props.setCounter(props.counter + 1),
      }),
    )());
    expect(typeof t.props.handleIncrement).toEqual('function');
    expect(typeof t.props.setCounter).toEqual('function');
    expect(t.props.counter).toEqual(0);

    t.props.handleIncrement();
    expect(t.props.counter).toEqual(1);

    t.props.handleIncrement();
    t.props.handleIncrement();
    expect(t.props.counter).toEqual(3);
  });

  test('can access arguments', function () {
    const incrementSteps = 5;

    const t = new Tester(compose(
      withState('counter', 'setCounter', 0),
      withHandlers({
        handleIncrement: (props, steps) => () => props.setCounter(props.counter + steps),
      }),
    )(incrementSteps));
    expect(typeof t.props.handleIncrement).toEqual('function');
    expect(typeof t.props.setCounter).toEqual('function');
    expect(t.props.counter).toEqual(0);

    t.props.handleIncrement();
    expect(t.props.counter).toEqual(5);

    t.props.handleIncrement();
    t.props.handleIncrement();
    expect(t.props.counter).toEqual(15);
  });
});
