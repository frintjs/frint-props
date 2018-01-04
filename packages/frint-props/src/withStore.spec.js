/* global describe, test, expect */
import { createApp } from 'frint';
import { createStore } from 'frint-store';

import { withStore } from './withStore';
import { compose } from './compose';
import { Tester } from './internal/Tester';

const INCREMENT_COUNTER = "INCREMENT_COUNTER";
const DECREMENT_COUNTER = "DECREMENT_COUNTER";

function incrementCounter() {
  return { type: INCREMENT_COUNTER };
}

function decrementCounter() {
  return { type: DECREMENT_COUNTER };
}

function createTestApp() {
  const INITIAL_STATE = {
    counter: 0,
  };

  function reducer(state = INITIAL_STATE, action) {
    switch (action.type) {
      case INCREMENT_COUNTER:
        return Object.assign({}, {
          counter: state.counter + 1,
        });

      case DECREMENT_COUNTER:
        return Object.assign({}, {
          counter: state.counter - 1,
        });

      default:
        return state;
    }
  }

  return createApp({
    name: 'TestApp',
    providers: [
      {
        name: 'store',
        useFactory() {
          const Store = createStore({
            initialState: INITIAL_STATE,
            reducer,
            enableLogger: false,
          });

          return new Store();
        },
      },
    ],
  });
}

function createAndInstantiateTestApp(...args) {
  const App = createTestApp(...args);

  return new App();
}

describe('withStore', function () {
  test('is a function', function () {
    expect(typeof withStore).toBe('function');
  });

  test('has initial value', function () {
    const app = createAndInstantiateTestApp();

    const t = new Tester(compose(
      withStore(
        state => ({ counter: state.counter }),
      ),
    )(app));
    expect(t.props.counter).toBe(0);
  });

  test('can map value', function () {
    const app = createAndInstantiateTestApp();

    const t = new Tester(compose(
      withStore(
        state => ({ counter: state.counter + 10 }),
      ),
    )(app));
    expect(t.props.counter).toBe(10);
  });

  test('can dispatch actions, and update value', function () {
    const app = createAndInstantiateTestApp();

    const t = new Tester(compose(
      withStore(
        state => ({
          counter: state.counter,
          multipliedCounter: state.counter * 10,
        }),
        {
          increment: incrementCounter,
          decrement: decrementCounter,
        },
      ),
    )(app));
    expect(t.props.counter).toBe(0);
    expect(t.props.multipliedCounter).toBe(0);

    t.props.increment();
    expect(t.props.counter).toBe(1);
    expect(t.props.multipliedCounter).toBe(10);

    t.props.increment();
    t.props.increment();
    expect(t.props.counter).toBe(3);
    expect(t.props.multipliedCounter).toBe(30);

    t.props.decrement();
    expect(t.props.counter).toBe(2);
    expect(t.props.multipliedCounter).toBe(20);
  });
});
