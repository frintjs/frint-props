/* global describe, test, expect */
import { of } from 'rxjs/observable/of';

import { withDefaults } from './withDefaults';
import { withObservable } from './withObservable';
import { compose } from './compose';
import { Tester } from './internal/Tester';

describe('withObservable', function () {
  test('is a function', function () {
    expect(typeof withObservable).toBe('function');
  });

  test('has initial value', function () {
    const t = new Tester(compose(
      withObservable(
        of({ foo: 'foo value here' }),
      ),
    )());
    expect(t.props.foo).toBe('foo value here');
  });

  test('can generate observable from function', function () {
    const t = new Tester(compose(
      withObservable(
        () => of({ foo: 'foo value here' }),
      ),
    )());
    expect(t.props.foo).toBe('foo value here');
  });

  test('can apply mappers', function () {
    const t = new Tester(compose(
      withObservable(
        of({ foo: 'foo value here' }),
        props => ({ foo: props.foo.toUpperCase() }),
        props => (of({ foo: `${props.foo}!!!` })),
      ),
    )());
    expect(t.props.foo).toBe('FOO VALUE HERE!!!');
  });

  test('withObservable should not override default props #1', function () {
    const t = new Tester(compose(
      withDefaults({
        testingDefaultProp: 'test',
      }),
      withObservable(
        () => of({ foo: 'foo value here' }),
      ),
    )());

    expect(t.props.testingDefaultProp).toBe('test');
    expect(t.props.foo).toBe('foo value here');
  });

  test('withObservable should not override default props #2', function () {
    const t = new Tester(compose(
      withDefaults({
        testingDefaultProp: 'test',
      }),
      withObservable(
        () => of({ foo: 'foo value here' }),
      ),
      withObservable(
        () => of({ foo2: 'foo value here' }),
      ),
    )());

    expect(t.props.testingDefaultProp).toBe('test');
    expect(t.props.foo).toBe('foo value here');
    expect(t.props.foo2).toBe('foo value here');
  });

  test('withObservable should not override default props #3', function () {
    const t = new Tester(compose(
      withObservable(
        () => of({ foo: 'foo value here' }),
      ),
      withDefaults({
        testingDefaultProp: 'test',
      }),
    )());

    expect(t.props.testingDefaultProp).toBe('test');
    expect(t.props.foo).toBe('foo value here');
  });
});
