/* global describe, test, expect */
import { of } from 'rxjs/observable/of';
import isObservable from './isObservable';

describe('frint-props :: isObservable', function () {
  test('is a function', function () {
    expect(typeof isObservable).toBe('function');
  });

  test('it should return false for non Observables values', function () {
    expect(isObservable(1)).toBeFalsy();
    expect(isObservable([1])).toBeFalsy();
    expect(isObservable({ foo: 'foo value here' })).toBeFalsy();
  });

  test('it should return true for Observables values', function () {
    const observableValue = of({ foo: 'foo value here' });
    expect(isObservable(observableValue)).toBeTruthy();
  });
});
