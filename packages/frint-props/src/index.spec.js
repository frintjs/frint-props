/* global describe, test, expect */
import lib from './index';

describe('frint-props :: index', function () {
  test('is an object', function () {
    expect(typeof lib).toBe('object');
  });

  [
    'compose', 'map', 'pipe', 'shouldUpdate',
    'withDefaults', 'withHandlers', 'withObservable',
    'withState', 'withStore',
  ].forEach((name) => {
    test(`${name} is a function`, function () {
      expect(typeof lib[name]).toBe('function');
    });
  });
});
