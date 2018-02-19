import { from } from 'rxjs/observable/from';
import { of } from 'rxjs/observable/of';
import { merge } from 'rxjs/observable/merge';
import { map } from 'rxjs/operators/map';
import { switchMap } from 'rxjs/operators/switchMap';
import { scan } from 'rxjs/operators/scan';

function makeStateProps$(store, mapper) {
  // when no mapper is given, we can just stream a plain object once,
  // which will be merged with dispatchable action creators later
  if (!mapper) {
    return of({});
  }

  const state$ = from(store);

  return state$.pipe(
    map(state => mapper(state)),
  );
}

function makeDispatchProps(store, actions) {
  return Object
    .keys(actions)
    .reduce(function (acc, actionName) {
      const actionCreator = actions[actionName];
      acc[actionName] = (...args) => store.dispatch(actionCreator(...args));

      return acc;
    }, {});
}

function makeDispatchProps$(...args) {
  return of(makeDispatchProps(...args));
}

function aggregateProps() {
  return scan((props, emitted) => ({
    ...props,
    ...emitted,
  }));
}

export function withStore(mapState, mapDispatch = {}, opts = {}) {
  const options = {
    providerName: 'store',
    appName: null,
    ...opts,
  };

  return function (app) {
    // Store from self
    if (!options.name) {
      const store = app.get(options.providerName);

      return merge(
        makeStateProps$(store, mapState),
        makeDispatchProps$(store, mapDispatch),
      ).pipe(
        aggregateProps(),
      );
    }

    // Store from another Child App
    return app
      .getAppOnceAvailable$(options.appName)
      .pipe(
        map((childApp) => {
          const store = childApp.get(options.providerName);

          return {
            store,
            dispatchProps: makeDispatchProps(store, mapDispatch),
          };
        }),
        switchMap(({ store, dispatchProps }) => (
          merge(
            of(dispatchProps),
            makeStateProps$(store, mapState),
          ).pipe(
            aggregateProps(),
          )
        )),
      );
  };
}
