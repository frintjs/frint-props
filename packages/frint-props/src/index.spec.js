/* global describe, test, expect */
import lib from './index';

describe('frint-props :: index', function () {
  test('is an object', function () {
    expect(typeof lib).toBe('object');
  });

  test('compose is a function', function () {
    expect(typeof lib.compose).toBe('function');
  });

  test('map is a function', function () {
    expect(typeof lib.map).toBe('function');
  });

  test('pipe is a function', function () {
    expect(typeof lib.pipe).toBe('function');
  });

  test('shouldUpdate is a function', function () {
    expect(typeof lib.shouldUpdate).toBe('function');
  });

  test('withDefaults is a function', function () {
    expect(typeof lib.withDefaults).toBe('function');
  });

  test('withHandlers is a function', function () {
    expect(typeof lib.withHandlers).toBe('function');
  });

  test('withObservable is a function', function () {
    expect(typeof lib.withObservable).toBe('function');
  });

  test('withState is a function', function () {
    expect(typeof lib.withState).toBe('function');
  });

  test('withStore is a function', function () {
    expect(typeof lib.withStore).toBe('function');
  });
});
