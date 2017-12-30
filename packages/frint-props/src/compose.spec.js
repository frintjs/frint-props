/* global describe, test, expect */
import { take } from 'rxjs/operators/take';

import { withDefaults } from './withDefaults';
import { compose } from './compose';
import { map } from './map';

describe('frint-props :: compose', function () {
  test('is a function', function () {
    expect(typeof compose).toBe('function');
  });

  test('composes from multiple functions', function () {
    expect.assertions(1);

    const result$ = compose(
      withDefaults({ foo: 'foo' }),
      map(props => ({
        foo: props.foo.toUpperCase(),
      })),
      map(props => ({
        foo: `${props.foo}!!!`,
      }))
    )();

    result$.pipe(
      take(1)
    ).subscribe(function (result) {
      expect(result.foo).toEqual('FOO!!!');
    });
  });
});
