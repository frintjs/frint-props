/* global describe, test, expect */
import { of } from 'rxjs/observable/of';

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
});
