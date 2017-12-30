/* global describe, test, expect */
import { take } from 'rxjs/operators/take';
import { withDefaults } from './withDefaults';

describe('frint-props :: withDefaults', function () {
  test('is a function', function () {
    expect(typeof withDefaults).toBe('function');
  });

  test('accepts plain object', function () {
    expect.assertions(1);

    const result$ = withDefaults({
      foo: 'foo value',
    })();

    result$.pipe(
      take(1)
    ).subscribe(function (result) {
      expect(result).toEqual({
        foo: 'foo value',
      });
    });
  });

  test('accepts function for generating result', function () {
    expect.assertions(1);

    const result$ = withDefaults(function (foo, bar) {
      return {
        foo,
        bar,
        baz: 'baz',
      };
    })('foo', 'bar');

    result$.pipe(
      take(1)
    ).subscribe(function (result) {
      expect(result).toEqual({
        foo: 'foo',
        bar: 'bar',
        baz: 'baz',
      });
    });
  });
});
